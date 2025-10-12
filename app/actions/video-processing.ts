/**
 * Server Actions for Video Processing Pipeline
 *
 * Handles:
 * - Creating video processing jobs
 * - Checking and advancing pipeline steps
 * - Coordinating with external APIs (WaveSpeed, Replicate)
 */

'use server'

import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'
import { getReplicateClient } from '@/lib/video-api/replicate'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Database } from '@/types/database'

// ============================================================================
// Type Definitions
// ============================================================================

type Video = Database['public']['Tables']['videos']['Row']
type VideoInsert = Database['public']['Tables']['videos']['Insert']
type PipelineStep = Database['public']['Tables']['processing_pipeline']['Row']
type PipelineInsert = Database['public']['Tables']['processing_pipeline']['Insert']

interface ProcessingOptions {
  removeWatermark: boolean
  enhanceQuality: boolean
  generateCaptions?: boolean
  targetResolution?: '720p' | '1080p' | '4k'
  targetAspectRatio?: '16:9' | '9:16' | '1:1' | '4:5'
}

interface JobStatus {
  id: string
  status: string
  progress: number
  currentStep?: string
  finalVideoUrl?: string
  errorMessage?: string
  steps: Array<{
    stepName: string
    status: string
    progress: number
    provider: string
  }>
}

// ============================================================================
// Validation Schemas
// ============================================================================

const createJobSchema = z.object({
  filename: z.string().min(1).max(255),
  fileSize: z
    .number()
    .positive()
    .max(500 * 1024 * 1024), // 500MB
  duration: z.number().positive().max(120), // 2 minutes
  mimeType: z.enum(['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']),
  options: z.object({
    removeWatermark: z.boolean(),
    enhanceQuality: z.boolean(),
    generateCaptions: z.boolean().optional(),
    targetResolution: z.enum(['720p', '1080p', '4k']).optional(),
    targetAspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).optional(),
  }),
})

// ============================================================================
// Main Server Actions
// ============================================================================

/**
 * Create a new video processing job
 *
 * Video file should be uploaded to Supabase Storage BEFORE calling this
 *
 * @param input - Video metadata and options (NO file data)
 * @returns Job ID or error
 */
export async function createVideoJob(input: {
  videoId: string
  storagePath: string
  filename: string
  fileSize: number
  duration: number
  mimeType: string
  options: ProcessingOptions
}) {
  try {
    const supabase = await createServerClient()

    // 1. Authenticate
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    // 2. Validate input
    const validated = createJobSchema.parse({
      filename: input.filename,
      fileSize: input.fileSize,
      duration: input.duration,
      mimeType: input.mimeType,
      options: input.options,
    })

    const options = validated.options

    // 3. Calculate cost
    const estimatedCost = calculatePipelineCost(validated.duration, options)

    // 4. Check credits
    const { data: credits } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (!credits || credits.balance < estimatedCost) {
      return { error: `Insufficient credits. Need ${estimatedCost}, have ${credits?.balance || 0}` }
    }

    // 5. Verify video exists in storage
    const { data: fileList, error: listError } = await supabase.storage
      .from('videos')
      .list(input.storagePath.split('/').slice(0, -1).join('/'))

    if (listError || !fileList) {
      return { error: 'Video file not found in storage' }
    }

    // 6. Get public URL
    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(input.storagePath)

    const serviceSupabase = createServiceClient()

    // 7. Create video record FIRST (required for foreign key constraint)
    const videoData: VideoInsert = {
      id: input.videoId,
      user_id: user.id,
      original_filename: validated.filename,
      original_url: urlData.publicUrl,
      original_storage_path: input.storagePath,
      duration_seconds: validated.duration,
      file_size_bytes: validated.fileSize,
      mime_type: validated.mimeType,
      remove_watermark: options.removeWatermark,
      enhance_quality: options.enhanceQuality,
      target_resolution: options.targetResolution,
      target_aspect_ratio: options.targetAspectRatio,
      status: 'pending',
      estimated_cost_credits: estimatedCost,
      pipeline_enabled: true,
    }

    const { error: videoError } = await serviceSupabase.from('videos').insert(videoData as never)

    if (videoError) {
      console.error('Failed to create video record:', videoError)
      // Cleanup uploaded file
      await supabase.storage.from('videos').remove([input.storagePath])
      return { error: 'Failed to create video record' }
    }

    // 8. Deduct credits AFTER video record exists (for foreign key)
    const { data: deductResult, error: deductError } = await serviceSupabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_video_id: input.videoId,
      p_amount: estimatedCost,
    })

    if (deductError) {
      console.error('Deduct credits error:', {
        error: deductError,
        userId: user.id,
        videoId: input.videoId,
        amount: estimatedCost,
      })
      // Cleanup video record and uploaded file
      await serviceSupabase.from('videos').delete().eq('id', input.videoId)
      await supabase.storage.from('videos').remove([input.storagePath])
      return { error: `Failed to deduct credits: ${deductError.message}` }
    }

    console.log('Credits deducted successfully:', deductResult)

    // 9. Create pipeline steps
    const steps = buildPipelineSteps(input.videoId, urlData.publicUrl, options)

    const { error: stepsError } = await serviceSupabase
      .from('processing_pipeline')
      .insert(steps as never)

    if (stepsError) {
      console.error('Failed to create pipeline steps:', stepsError)
      return { error: 'Failed to create pipeline' }
    }

    revalidatePath('/dashboard')

    console.log(`✅ Video job created: ${input.videoId}`)

    return { success: true, videoId: input.videoId }
  } catch (error) {
    console.error('Create job error:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input: ' + error.issues[0].message }
    }
    return { error: 'Failed to create job' }
  }
}

/**
 * Check and advance video processing pipeline
 *
 * Called by frontend polling every 5 seconds
 *
 * @param videoId - Video ID to check
 * @returns Current job status
 */
export async function checkAndAdvanceJob(videoId: string): Promise<JobStatus> {
  const supabase = await createServerClient()

  // 1. Authenticate
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 2. Get video and pipeline steps
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  if (videoError || !video) {
    throw new Error('Video not found')
  }

  // If already completed or failed, return status
  if (video.status === 'completed' || video.status === 'failed') {
    return formatJobStatus(video, [])
  }

  // 3. Get pipeline steps
  const { data: steps } = await supabase
    .from('processing_pipeline')
    .select('*')
    .eq('video_id', videoId)
    .order('step_order', { ascending: true })

  if (!steps || steps.length === 0) {
    throw new Error('No pipeline steps found')
  }

  // 4. Find current processing step
  const currentStep = steps.find((s) => s.status === 'processing')

  if (!currentStep) {
    // No processing step, find next pending
    const nextStep = steps.find((s) => s.status === 'pending')

    if (nextStep) {
      // Start next step
      await startStep(videoId, nextStep as PipelineStep, video as Video)
      // Recursively check again
      return checkAndAdvanceJob(videoId)
    } else {
      // All steps completed
      await completeJob(videoId, video as Video, steps as PipelineStep[])
      return formatJobStatus({ ...video, status: 'completed', progress: 100 }, steps)
    }
  }

  // 5. Check current step status with external API
  try {
    const isComplete = await checkExternalJobStatus(currentStep as PipelineStep)

    if (isComplete) {
      // Mark step complete
      const serviceSupabase = createServiceClient()
      await serviceSupabase
        .from('processing_pipeline')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          progress: 100,
        } as never)
        .eq('id', currentStep.id)

      // Recursively check next step
      return checkAndAdvanceJob(videoId)
    }

    // Still processing, return current status
    return formatJobStatus(video, steps)
  } catch (error) {
    console.error('Step processing error:', error)
    await failJob(videoId, video as Video, (error as Error).message)
    throw error
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build pipeline steps based on options
 */
function buildPipelineSteps(
  videoId: string,
  videoUrl: string,
  options: ProcessingOptions
): PipelineInsert[] {
  const steps: PipelineInsert[] = []
  let order = 1
  let currentUrl = videoUrl

  if (options.removeWatermark) {
    steps.push({
      video_id: videoId,
      step_order: order++,
      step_type: 'remove_watermark',
      step_name: 'Remove Watermark',
      status: 'pending',
      provider: 'wavespeed',
      input_video_url: currentUrl,
      estimated_cost_credits: 50, // ~$0.50
      progress: 0,
    })
    currentUrl = '' // Will be updated after completion
  }

  if (options.enhanceQuality) {
    steps.push({
      video_id: videoId,
      step_order: order++,
      step_type: 'enhance_quality',
      step_name: 'Enhance Quality',
      status: 'pending',
      provider: 'replicate',
      input_video_url: currentUrl || videoUrl,
      estimated_cost_credits: 100, // ~$1.00
      progress: 0,
    })
  }

  if (options.generateCaptions) {
    steps.push({
      video_id: videoId,
      step_order: order++,
      step_type: 'generate_captions' as never,
      step_name: 'Generate Captions',
      status: 'pending',
      provider: 'internal',
      input_video_url: currentUrl || videoUrl,
      estimated_cost_credits: 10,
      progress: 0,
    })
  }

  return steps
}

/**
 * Calculate total pipeline cost
 */
function calculatePipelineCost(durationSeconds: number, options: ProcessingOptions): number {
  let cost = 0

  if (options.removeWatermark) {
    // WaveSpeed: ~$0.10 per 5 seconds
    const segments = Math.ceil(durationSeconds / 5)
    cost += segments * 10 // 10 credits = $0.10
  }

  if (options.enhanceQuality) {
    // Replicate: ~$0.0075 per processing second (2-3x video duration)
    const processingTime = durationSeconds * 2.5
    cost += Math.ceil(processingTime * 0.75) // 0.75 credits = $0.0075
  }

  if (options.generateCaptions) {
    cost += 10 // Flat fee
  }

  return Math.ceil(cost)
}

/**
 * Start a pipeline step
 */
async function startStep(videoId: string, step: PipelineStep, video: Video) {
  const serviceSupabase = createServiceClient()

  // Mark as processing
  await serviceSupabase
    .from('processing_pipeline')
    .update({
      status: 'processing',
      started_at: new Date().toISOString(),
      progress: 5,
    } as never)
    .eq('id', step.id)

  // Update video status
  await serviceSupabase
    .from('videos')
    .update({
      status: 'processing',
      started_processing_at: new Date().toISOString(),
    } as never)
    .eq('id', videoId)

  console.log(`🚀 Starting step: ${step.step_name} for video ${videoId}`)

  // Call appropriate API based on step type
  switch (step.step_type) {
    case 'remove_watermark':
      await startWatermarkRemoval(step)
      break
    case 'enhance_quality':
      await startQualityEnhance(step, video)
      break
    default:
      console.log(`⚠️ Unknown step type: ${step.step_type}`)
  }
}

/**
 * Start watermark removal with WaveSpeed
 */
async function startWatermarkRemoval(step: PipelineStep) {
  const serviceSupabase = createServiceClient()

  try {
    const wavespeed = getWaveSpeedClient()
    const prediction = await wavespeed.createPrediction(step.input_video_url)

    // Save external job ID
    await serviceSupabase
      .from('processing_pipeline')
      .update({
        external_job_id: prediction.id,
        progress: 10,
      } as never)
      .eq('id', step.id)

    console.log(`✅ WaveSpeed job created: ${prediction.id}`)
  } catch (error) {
    console.error('Failed to start watermark removal:', error)
    throw error
  }
}

/**
 * Start quality enhancement with Replicate
 */
async function startQualityEnhance(step: PipelineStep, video: Video) {
  const serviceSupabase = createServiceClient()

  try {
    // Get input URL (from previous step or original)
    let inputUrl = step.input_video_url

    if (!inputUrl) {
      // Get output from previous step
      const { data: prevStep } = await serviceSupabase
        .from('processing_pipeline')
        .select('output_video_url')
        .eq('video_id', video.id)
        .eq('status', 'completed')
        .order('step_order', { ascending: false })
        .limit(1)
        .single()

      inputUrl = prevStep?.output_video_url || video.original_url!
    }

    const replicate = getReplicateClient()
    const prediction = await replicate.createPrediction({
      video: inputUrl,
      target_resolution: (video.target_resolution as '720p' | '1080p' | '4k') || '1080p',
    })

    // Save external job ID
    await serviceSupabase
      .from('processing_pipeline')
      .update({
        external_job_id: prediction.id,
        input_video_url: inputUrl,
        progress: 10,
      } as never)
      .eq('id', step.id)

    console.log(`✅ Replicate job created: ${prediction.id}`)
  } catch (error) {
    console.error('Failed to start quality enhance:', error)
    throw error
  }
}

/**
 * Check external API job status
 *
 * @returns true if completed, false if still processing
 */
async function checkExternalJobStatus(step: PipelineStep): Promise<boolean> {
  if (!step.external_job_id) {
    return false
  }

  const serviceSupabase = createServiceClient()

  switch (step.provider) {
    case 'wavespeed': {
      const wavespeed = getWaveSpeedClient()
      const result = await wavespeed.getPredictionResult(step.external_job_id)

      // Update progress
      const progressMap: Record<string, number> = {
        created: 10,
        processing: 50,
        completed: 100,
        failed: 0,
      }

      await serviceSupabase
        .from('processing_pipeline')
        .update({ progress: progressMap[result.status] || 10 } as never)
        .eq('id', step.id)

      if (result.status === 'completed') {
        // Save output URL
        await serviceSupabase
          .from('processing_pipeline')
          .update({
            output_video_url: result.outputs![0],
          } as never)
          .eq('id', step.id)

        return true
      }

      if (result.status === 'failed') {
        throw new Error('WaveSpeed processing failed')
      }

      return false
    }

    case 'replicate': {
      const replicate = getReplicateClient()
      const result = await replicate.getPrediction(step.external_job_id)

      // Update progress
      const progressMap: Record<string, number> = {
        starting: 10,
        processing: 50,
        succeeded: 100,
      }

      await serviceSupabase
        .from('processing_pipeline')
        .update({ progress: progressMap[result.status] || 10 } as never)
        .eq('id', step.id)

      if (result.status === 'succeeded') {
        // Save output URL
        await serviceSupabase
          .from('processing_pipeline')
          .update({
            output_video_url: result.output as string,
          } as never)
          .eq('id', step.id)

        return true
      }

      if (result.status === 'failed' || result.status === 'canceled') {
        throw new Error(`Replicate processing ${result.status}`)
      }

      return false
    }

    default:
      return false
  }
}

/**
 * Complete job successfully
 */
async function completeJob(videoId: string, video: Video, steps: PipelineStep[]) {
  const serviceSupabase = createServiceClient()

  // Get final output URL from last completed step
  const lastStep = steps
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.step_order - a.step_order)[0]

  const finalUrl = lastStep?.output_video_url || video.original_url

  await serviceSupabase
    .from('videos')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      processed_url: finalUrl,
      progress: 100,
    } as never)
    .eq('id', videoId)

  revalidatePath(`/jobs/${videoId}`)
  console.log(`✅ Job ${videoId} completed!`)
}

/**
 * Fail job and refund credits
 */
async function failJob(videoId: string, video: Video, errorMessage: string) {
  const serviceSupabase = createServiceClient()

  await serviceSupabase
    .from('videos')
    .update({
      status: 'failed',
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
    } as never)
    .eq('id', videoId)

  // Refund credits
  await serviceSupabase.rpc('refund_credits', {
    p_user_id: video.user_id,
    p_video_id: videoId,
    p_amount: video.estimated_cost_credits,
  })

  console.error(`❌ Job ${videoId} failed: ${errorMessage}`)
}

/**
 * Format job status for frontend
 */
function formatJobStatus(video: Video, steps: PipelineStep[]): JobStatus {
  return {
    id: video.id,
    status: video.status,
    progress: calculateOverallProgress(steps),
    currentStep: steps.find((s) => s.status === 'processing')?.step_name,
    finalVideoUrl: video.processed_url || undefined,
    errorMessage: video.error_message || undefined,
    steps: steps.map((s) => ({
      stepName: s.step_name,
      status: s.status,
      progress: s.progress || 0,
      provider: s.provider,
    })),
  }
}

/**
 * Calculate overall progress from steps
 */
function calculateOverallProgress(steps: PipelineStep[]): number {
  if (steps.length === 0) return 0

  const totalProgress = steps.reduce((sum, s) => sum + (s.progress || 0), 0)
  return Math.floor(totalProgress / steps.length)
}
