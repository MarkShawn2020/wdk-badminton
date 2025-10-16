/**
 * Pipeline Step Handler
 *
 * Handles starting, polling, and completing individual pipeline steps
 */

import { createServiceClient } from '@/lib/supabase/server'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'
import { getReplicateClient } from '@/lib/video-api/replicate'
import { Database } from '@/types/database'
import {
  getNextPipelineStep,
  getPreviousStepOutput,
  getFinalOutputUrl,
  isPipelineCompleted,
} from '@/lib/video/pipeline-orchestrator'
import { transferVideoToStorage } from '@/lib/storage/video-transfer'

type ProcessingPipeline = Database['public']['Tables']['processing_pipeline']['Row']

/**
 * Start the next pending step in the pipeline
 */
export async function startNextPipelineStep(videoId: string): Promise<boolean> {
  const supabase = createServiceClient()

  // Get next pending step
  const nextStep = await getNextPipelineStep(videoId)

  if (!nextStep) {
    console.log(`ℹ️ No more pending steps for video ${videoId}`)
    return false
  }

  console.log(`🚀 Starting pipeline step ${nextStep.step_order} for video ${videoId}:`, {
    stepType: nextStep.step_type,
    provider: nextStep.provider,
  })

  // Get input video URL from previous step (or original video for first step)
  let inputVideoUrl = nextStep.input_video_url

  if (nextStep.step_order > 1) {
    const previousOutput = await getPreviousStepOutput(videoId, nextStep.step_order)
    if (!previousOutput) {
      throw new Error(`Previous step output not found for video ${videoId}`)
    }
    inputVideoUrl = previousOutput

    // Update the current step's input URL
    await supabase
      .from('processing_pipeline')
      .update({ input_video_url: inputVideoUrl } as never)
      .eq('id', nextStep.id)
  }

  // Start processing based on provider
  try {
    if (nextStep.provider === 'wavespeed') {
      const waveSpeed = getWaveSpeedClient()
      const prediction = await waveSpeed.createPrediction(inputVideoUrl)

      await supabase
        .from('processing_pipeline')
        .update({
          status: 'processing',
          started_at: new Date().toISOString(),
          external_job_id: prediction.id,
        } as never)
        .eq('id', nextStep.id)

      console.log(`✅ Started WaveSpeed job for step ${nextStep.step_order}:`, prediction.id)
    } else if (nextStep.provider === 'replicate') {
      // Parse config from database
      const stepConfig = nextStep.config as
        | { targetResolution?: '720p' | '1080p' | '4k'; targetFps?: number }
        | null
        | undefined

      const config = {
        target_resolution: stepConfig?.targetResolution || '1080p',
        target_fps: stepConfig?.targetFps || 60,
      }

      const replicate = getReplicateClient()
      const prediction = await replicate.createPrediction({
        video: inputVideoUrl,
        ...config,
      })

      await supabase
        .from('processing_pipeline')
        .update({
          status: 'processing',
          started_at: new Date().toISOString(),
          external_job_id: prediction.id,
        } as never)
        .eq('id', nextStep.id)

      console.log(`✅ Started Replicate job for step ${nextStep.step_order}:`, prediction.id)
    }

    // Update video's current step
    await supabase
      .from('videos')
      .update({ current_pipeline_step: nextStep.step_order } as never)
      .eq('id', videoId)

    return true
  } catch (error) {
    console.error(`❌ Failed to start step ${nextStep.step_order}:`, error)

    // Mark step as failed
    await supabase
      .from('processing_pipeline')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
      } as never)
      .eq('id', nextStep.id)

    throw error
  }
}

/**
 * Finalize pipeline when all steps are completed
 */
export async function finalizePipeline(videoId: string): Promise<void> {
  const supabase = createServiceClient()

  // Get final storage path from last completed step
  const finalStoragePath = await getFinalOutputUrl(videoId)

  if (!finalStoragePath) {
    throw new Error(`Final storage path not found for video ${videoId}`)
  }

  // Update video record with permanent storage path
  await supabase
    .from('videos')
    .update({
      status: 'completed',
      final_storage_path: finalStoragePath, // Permanent Supabase Storage path
      processed_url: finalStoragePath, // Legacy field, keep for backward compatibility
      completed_at: new Date().toISOString(),
      progress: 100,
    } as never)
    .eq('id', videoId)

  console.log(`✅ Pipeline completed for video ${videoId}`)
  console.log(`📦 Final storage path: ${finalStoragePath}`)
}

/**
 * Poll a single pipeline step
 *
 * Returns true if step completed, false if still processing
 */
export async function pollPipelineStep(step: ProcessingPipeline): Promise<boolean> {
  const supabase = createServiceClient()

  if (step.provider === 'wavespeed') {
    const waveSpeed = getWaveSpeedClient()
    const result = await waveSpeed.getPredictionResult(step.external_job_id!)

    console.log(`🔄 WaveSpeed step ${step.step_order} status:`, result.status)

    if (result.status === 'completed') {
      const temporaryUrl = result.outputs?.[0]

      if (!temporaryUrl) {
        throw new Error(`No output URL for completed step ${step.id}`)
      }

      // CRITICAL: Transfer video to Supabase Storage immediately
      // WaveSpeed URLs may be temporary and could expire
      console.log(`🔄 Transferring WaveSpeed output to Supabase Storage for video ${step.video_id}`)
      const storagePath = await transferVideoToStorage(
        temporaryUrl,
        step.video_id,
        'watermark_removed'
      )

      // Update step as completed with storage path
      await supabase
        .from('processing_pipeline')
        .update({
          status: 'completed',
          output_video_url: temporaryUrl, // Keep original URL for reference
          output_storage_path: storagePath, // Permanent storage path
          completed_at: new Date().toISOString(),
          progress: 100,
        } as never)
        .eq('id', step.id)

      return true
    } else if (result.status === 'failed') {
      // Mark as failed
      await supabase
        .from('processing_pipeline')
        .update({
          status: 'failed',
          error_message: 'WaveSpeed processing failed',
          completed_at: new Date().toISOString(),
        } as never)
        .eq('id', step.id)

      throw new Error(`WaveSpeed processing failed for step ${step.id}`)
    }

    return false
  } else if (step.provider === 'replicate') {
    const replicate = getReplicateClient()
    const result = await replicate.getPrediction(step.external_job_id!)

    console.log(`🔄 Replicate step ${step.step_order} status:`, result.status)

    if (result.status === 'succeeded') {
      const temporaryUrl = result.output

      if (!temporaryUrl) {
        throw new Error(`No output URL for completed step ${step.id}`)
      }

      // CRITICAL: Transfer video to Supabase Storage immediately
      // Replicate output URLs expire after 1 hour!
      // See: https://replicate.com/docs/topics/predictions/output-files.md
      console.log(`🔄 Transferring Replicate output to Supabase Storage for video ${step.video_id}`)
      const storagePath = await transferVideoToStorage(
        temporaryUrl,
        step.video_id,
        'quality_enhanced'
      )

      // Update step as completed with storage path
      await supabase
        .from('processing_pipeline')
        .update({
          status: 'completed',
          output_video_url: temporaryUrl, // Keep original URL for reference
          output_storage_path: storagePath, // Permanent storage path
          completed_at: new Date().toISOString(),
          progress: 100,
        } as never)
        .eq('id', step.id)

      return true
    } else if (result.status === 'failed') {
      // Mark as failed
      await supabase
        .from('processing_pipeline')
        .update({
          status: 'failed',
          error_message: result.error || 'Replicate processing failed',
          completed_at: new Date().toISOString(),
        } as never)
        .eq('id', step.id)

      throw new Error(`Replicate processing failed for step ${step.id}: ${result.error}`)
    }

    return false
  }

  return false
}
