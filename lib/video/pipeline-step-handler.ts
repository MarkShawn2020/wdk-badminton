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
      // Parse config from database (stored in step metadata)
      const config = {
        target_resolution: '1080p' as '720p' | '1080p' | '4k',
        target_fps: 60,
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

  // Get final output URL from last completed step
  const finalUrl = await getFinalOutputUrl(videoId)

  if (!finalUrl) {
    throw new Error(`Final output URL not found for video ${videoId}`)
  }

  // Update video record
  await supabase
    .from('videos')
    .update({
      status: 'completed',
      processed_url: finalUrl,
      completed_at: new Date().toISOString(),
      progress: 100,
    } as never)
    .eq('id', videoId)

  console.log(`✅ Pipeline completed for video ${videoId}`)
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
      const outputUrl = result.outputs?.[0]

      if (!outputUrl) {
        throw new Error(`No output URL for completed step ${step.id}`)
      }

      // Update step as completed
      await supabase
        .from('processing_pipeline')
        .update({
          status: 'completed',
          output_video_url: outputUrl,
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
      const outputUrl = result.output

      if (!outputUrl) {
        throw new Error(`No output URL for completed step ${step.id}`)
      }

      // Update step as completed
      await supabase
        .from('processing_pipeline')
        .update({
          status: 'completed',
          output_video_url: outputUrl,
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
