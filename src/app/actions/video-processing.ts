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
import { transferVideoToStorage } from '@/lib/storage/video-transfer'
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
  targetFps?: number
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
    .nonnegative() // Allow 0 for URL-based videos (size unknown)
    .max(500 * 1024 * 1024), // 500MB
  duration: z.number().positive().max(120), // 2 minutes
  mimeType: z.enum(['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']),
  options: z.object({
    removeWatermark: z.boolean(),
    enhanceQuality: z.boolean(),
    generateCaptions: z.boolean().optional(),
    targetResolution: z.enum(['720p', '1080p', '4k']).optional(),
    targetFps: z.number().int().min(15).max(60).optional(),
    targetAspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).optional(),
  }),
})

// ============================================================================
// Main Server Actions
// ============================================================================

/**
 * Create a new video processing job
 *
 * Supports two modes:
 * 1. File upload: Video should be uploaded to Supabase Storage BEFORE calling this
 * 2. URL mode: External video URL can be passed directly via storagePath
 *
 * @param input - Video metadata and options (NO file data)
 * @param input.storagePath - Either a Supabase Storage path or an external HTTPS URL
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
  console.log('🔧 createVideoJob called with:', {
    videoId: input.videoId,
    storagePath: input.storagePath,
    filename: input.filename,
    fileSize: input.fileSize,
    duration: input.duration,
    mimeType: input.mimeType,
    options: input.options,
  })

  try {
    const supabase = await createServerClient()

    // 1. Authenticate
    console.log('🔐 Authenticating user...')
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ Authentication failed:', authError)
      return { error: 'Unauthorized' }
    }

    console.log('✅ User authenticated:', user.id)

    // 2. Validate input
    console.log('📋 Validating input...')
    const validated = createJobSchema.parse({
      filename: input.filename,
      fileSize: input.fileSize,
      duration: input.duration,
      mimeType: input.mimeType,
      options: input.options,
    })

    const options = validated.options
    console.log('✅ Input validated')

    // 3. Calculate cost
    const estimatedCost = calculatePipelineCost(validated.duration, options)
    console.log('💰 Estimated cost:', estimatedCost, 'credits')

    // 4. Check credits
    console.log('💳 Checking user credits...')
    const { data: credits } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    console.log('💳 User balance:', credits?.balance, 'credits')

    if (!credits || credits.balance < estimatedCost) {
      console.error('❌ Insufficient credits')
      return { error: `Insufficient credits. Need ${estimatedCost}, have ${credits?.balance || 0}` }
    }

    // 5. Determine if video is from external URL or Supabase Storage
    const isExternalUrl =
      input.storagePath.startsWith('https://') || input.storagePath.startsWith('http://')
    let videoUrl: string

    if (isExternalUrl) {
      // For external URLs, use the URL directly
      console.log('🔗 Using external URL:', input.storagePath)
      videoUrl = input.storagePath
    } else {
      // For Supabase Storage, verify and create signed URL
      console.log('📦 Verifying video in Supabase storage...')
      const storageFolderPath = input.storagePath.split('/').slice(0, -1).join('/')
      console.log('   Folder path:', storageFolderPath)

      const { data: fileList, error: listError } = await supabase.storage
        .from('videos')
        .list(storageFolderPath)

      if (listError) {
        console.error('❌ Storage list error:', listError)
        return { error: 'Video file not found in storage' }
      }

      console.log(
        '📦 Files in storage:',
        fileList?.map((f) => f.name)
      )

      if (!fileList || fileList.length === 0) {
        console.error('❌ No files found in storage')
        return { error: 'Video file not found in storage' }
      }

      // 6. Get signed URL for external API access (bucket is private)
      console.log('🔗 Creating signed URL for external API access...')
      const { data: signedData, error: signedError } = await supabase.storage
        .from('videos')
        .createSignedUrl(input.storagePath, 3600 * 24) // Valid for 24 hours

      if (signedError || !signedData) {
        console.error('❌ Failed to create signed URL:', signedError)
        return { error: 'Failed to create signed URL for video' }
      }

      console.log('🔗 Signed URL created, length:', signedData.signedUrl.length)
      videoUrl = signedData.signedUrl
    }

    const serviceSupabase = createServiceClient()

    // 7. Create video record FIRST (required for foreign key constraint)
    console.log('💾 Creating video record...')
    const videoData: VideoInsert = {
      id: input.videoId,
      user_id: user.id,
      original_filename: validated.filename,
      original_url: videoUrl,
      original_storage_path: input.storagePath,
      duration_seconds: validated.duration,
      file_size_bytes: validated.fileSize,
      mime_type: validated.mimeType,
      remove_watermark: options.removeWatermark,
      enhance_quality: options.enhanceQuality,
      target_resolution: options.targetResolution,
      target_fps: options.targetFps,
      target_aspect_ratio: options.targetAspectRatio,
      status: 'pending',
      estimated_cost_credits: estimatedCost,
      pipeline_enabled: true,
    }

    const { error: videoError } = await serviceSupabase.from('videos').insert(videoData as never)

    if (videoError) {
      console.error('❌ Failed to create video record:', videoError)
      // Cleanup uploaded file (only for Supabase Storage, not external URLs)
      if (!isExternalUrl) {
        console.log('🗑️  Cleaning up uploaded file...')
        await supabase.storage.from('videos').remove([input.storagePath])
      }
      return { error: 'Failed to create video record' }
    }

    console.log('✅ Video record created')

    // 8. Deduct credits AFTER video record exists (for foreign key)
    console.log('💳 Deducting credits...')
    const { data: deductResult, error: deductError } = await serviceSupabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_video_id: input.videoId,
      p_amount: estimatedCost,
    })

    if (deductError) {
      console.error('❌ Deduct credits error:', {
        error: deductError,
        userId: user.id,
        videoId: input.videoId,
        amount: estimatedCost,
      })
      // Cleanup video record and uploaded file (only for Supabase Storage)
      console.log('🗑️  Cleaning up video record and file...')
      await serviceSupabase.from('videos').delete().eq('id', input.videoId)
      if (!isExternalUrl) {
        await supabase.storage.from('videos').remove([input.storagePath])
      }
      return { error: `Failed to deduct credits: ${deductError.message}` }
    }

    console.log('✅ Credits deducted successfully:', deductResult)

    // 9. Create pipeline steps
    console.log('🔧 Creating pipeline steps...')
    const steps = buildPipelineSteps(input.videoId, videoUrl, options)
    console.log('🔧 Pipeline steps:', steps.length)

    const { error: stepsError } = await serviceSupabase
      .from('processing_pipeline')
      .insert(steps as never)

    if (stepsError) {
      console.error('❌ Failed to create pipeline steps:', stepsError)
      return { error: 'Failed to create pipeline' }
    }

    console.log('✅ Pipeline steps created')

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

  // 3. Get pipeline steps (always fetch for proper display)
  const { data: steps } = await supabase
    .from('processing_pipeline')
    .select('*')
    .eq('video_id', videoId)
    .order('step_order', { ascending: true })

  if (!steps || steps.length === 0) {
    throw new Error('No pipeline steps found')
  }

  // If already completed or failed, return status with steps
  if (video.status === 'completed' || video.status === 'failed') {
    return formatJobStatus(video, steps as PipelineStep[])
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

      // Refetch video to get updated processed_url
      const { data: updatedVideo } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()

      console.log('✅ Job completed, final video URL:', updatedVideo?.processed_url)

      return formatJobStatus(updatedVideo as Video, steps)
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
    // Mark that subsequent steps depend on this step's output
    currentUrl = null as never
  }

  if (options.enhanceQuality) {
    steps.push({
      video_id: videoId,
      step_order: order++,
      step_type: 'enhance_quality',
      step_name: 'Enhance Quality',
      status: 'pending',
      provider: 'replicate',
      // If currentUrl is null, it means this step depends on the previous step's output
      // The actual input URL will be resolved at runtime in startQualityEnhance()
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
    // ALWAYS check for previous step's output first (for pipeline chaining)
    // This ensures we use the watermark-removed video, not the original
    console.log('🔍 Checking for previous pipeline step output...')
    const { data: prevStep } = await serviceSupabase
      .from('processing_pipeline')
      .select('output_video_url, step_name, step_order')
      .eq('video_id', video.id)
      .eq('status', 'completed')
      .lt('step_order', step.step_order) // Previous steps only
      .order('step_order', { ascending: false })
      .limit(1)
      .single()

    let inputUrl: string

    if (prevStep?.output_video_url) {
      // Use output from previous step (e.g., watermark-removed video)
      inputUrl = prevStep.output_video_url
      console.log(
        `✅ Using output from previous step "${prevStep.step_name}" (order ${prevStep.step_order})`
      )
      console.log(`   Input URL: ${inputUrl}`)
    } else {
      // No previous step or no output, use original video
      inputUrl = video.original_url!
      console.log('📹 No previous step output found, using original video')
      console.log(`   Input URL: ${inputUrl}`)
    }

    console.log('🎬 Starting Replicate quality enhancement...')
    const replicate = getReplicateClient()

    // Determine target FPS (default to 60fps for maximum quality)
    const targetFps = video.target_fps || 60
    const targetResolution = (video.target_resolution as '720p' | '1080p' | '4k') || '1080p'

    console.log('📋 Replicate API Call Parameters:')
    console.log(`   Video ID: ${video.id}`)
    console.log(`   Input URL: ${inputUrl}`)
    console.log(`   Target Resolution: ${targetResolution}`)
    console.log(`   Target FPS: ${targetFps}`)
    console.log(`   Video.target_fps (from DB): ${video.target_fps}`)
    console.log(`   Video.target_resolution (from DB): ${video.target_resolution}`)

    const apiInput = {
      video: inputUrl,
      target_resolution: targetResolution,
      target_fps: targetFps,
    }

    console.log('📤 Sending to Replicate API:', JSON.stringify(apiInput, null, 2))

    const prediction = await replicate.createPrediction(apiInput)

    console.log('📥 Replicate API Response:', {
      id: prediction.id,
      status: prediction.status,
      input: prediction.input,
      created_at: prediction.created_at,
    })

    // Save external job ID and the resolved input URL
    await serviceSupabase
      .from('processing_pipeline')
      .update({
        external_job_id: prediction.id,
        input_video_url: inputUrl, // Save the actual URL we used
        progress: 10,
      } as never)
      .eq('id', step.id)

    console.log(`✅ Replicate prediction created: ${prediction.id}`)
    console.log(`   Confirmed input.target_fps: ${prediction.input.target_fps}`)
    console.log(`   Confirmed input.target_resolution: ${prediction.input.target_resolution}`)
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
      console.log('🔍 Checking WaveSpeed job:', step.external_job_id)

      const result = await wavespeed.getPredictionResult(step.external_job_id)

      console.log('🔍 WaveSpeed result:', {
        id: result.id,
        status: result.status,
        outputs: result.outputs,
        has_nsfw_contents: result.has_nsfw_contents,
      })

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
        if (!result.outputs || result.outputs.length === 0) {
          console.error('❌ WaveSpeed completed but no outputs')
          throw new Error('WaveSpeed completed but no output video URL')
        }

        const temporaryUrl = result.outputs[0]
        console.log('✅ WaveSpeed completed, temporary URL:', temporaryUrl)

        // CRITICAL: Transfer to Supabase Storage immediately
        console.log('🔄 Transferring WaveSpeed output to Supabase Storage...')
        const storagePath = await transferVideoToStorage(
          temporaryUrl,
          step.video_id,
          'watermark_removed'
        )
        console.log('✅ Transferred to Supabase Storage:', storagePath)

        // Save both URLs (temporary for reference, storage path for permanence)
        await serviceSupabase
          .from('processing_pipeline')
          .update({
            output_video_url: temporaryUrl, // Keep for reference
            output_storage_path: storagePath, // Permanent storage
          } as never)
          .eq('id', step.id)

        return true
      }

      if (result.status === 'failed') {
        console.error('❌ WaveSpeed processing failed:', {
          id: result.id,
          status: result.status,
          full_result: JSON.stringify(result, null, 2),
        })
        throw new Error('WaveSpeed processing failed - check if video URL is accessible')
      }

      console.log('⏳ WaveSpeed still processing...')
      return false
    }

    case 'replicate': {
      const replicate = getReplicateClient()
      console.log('🔍 Checking Replicate job:', step.external_job_id)

      const result = await replicate.getPrediction(step.external_job_id)

      console.log('🔍 Replicate result summary:', {
        id: result.id,
        status: result.status,
        has_output: !!result.output,
      })

      console.log('📋 Replicate input parameters (what we sent):', {
        video: result.input.video,
        target_resolution: result.input.target_resolution,
        target_fps: result.input.target_fps,
      })

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
        const temporaryUrl = result.output as string
        console.log('✅ Replicate completed!')
        console.log('📥 Temporary output URL:', temporaryUrl)
        console.log('⏱️  Processing time:', {
          created_at: result.created_at,
          started_at: result.started_at,
          completed_at: result.completed_at,
        })

        // CRITICAL: Transfer to Supabase Storage immediately (1-hour expiration!)
        console.log(
          '🔄 Transferring Replicate output to Supabase Storage (before 1-hour expiration)...'
        )
        const storagePath = await transferVideoToStorage(
          temporaryUrl,
          step.video_id,
          'quality_enhanced'
        )
        console.log('✅ Transferred to Supabase Storage:', storagePath)

        // Save both URLs (temporary for reference, storage path for permanence)
        await serviceSupabase
          .from('processing_pipeline')
          .update({
            output_video_url: temporaryUrl, // Keep for reference
            output_storage_path: storagePath, // Permanent storage
          } as never)
          .eq('id', step.id)

        return true
      }

      if (result.status === 'failed' || result.status === 'canceled') {
        console.error('❌ Replicate processing failed/canceled:', {
          id: result.id,
          status: result.status,
          error: result.error,
          input: result.input,
          full_result: JSON.stringify(result, null, 2),
        })
        throw new Error(`Replicate processing ${result.status}: ${result.error || 'Unknown error'}`)
      }

      console.log('⏳ Replicate still processing...')
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

  // Get final output from last completed step
  const completedSteps = steps.filter((s) => s.status === 'completed')
  console.log('📊 Completed steps:', completedSteps.length)

  const lastStep = completedSteps.sort((a, b) => b.step_order - a.step_order)[0]

  // Prefer storage path (permanent) over temporary URL
  const finalStoragePath = lastStep?.output_storage_path
  const finalTempUrl = lastStep?.output_video_url || video.original_url

  console.log('🔗 Final temporary URL:', finalTempUrl)
  console.log('📦 Final storage path:', finalStoragePath || '(none - legacy video)')

  if (!finalStoragePath && !finalTempUrl) {
    console.error('❌ No final video URL found!')
    throw new Error('No final video URL available')
  }

  const { error: updateError } = await serviceSupabase
    .from('videos')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      processed_url: finalTempUrl, // Legacy field
      final_storage_path: finalStoragePath, // New permanent path
      progress: 100,
    } as never)
    .eq('id', videoId)

  if (updateError) {
    console.error('❌ Failed to update video as completed:', updateError)
    throw updateError
  }

  revalidatePath(`/jobs/${videoId}`)
  console.log(`✅ Job ${videoId} completed!`)
  console.log(`   📦 Supabase Storage: ${finalStoragePath || 'N/A (legacy)'}`)
  console.log(`   🔗 Temporary URL: ${finalTempUrl} (for reference only)`)
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
 *
 * Security: Hides sensitive upstream information:
 * - Uses proxy URL instead of direct storage URL
 * - Masks third-party provider names
 */
function formatJobStatus(video: Video, steps: PipelineStep[]): JobStatus {
  // Use download proxy URL instead of exposing direct storage URL
  const finalVideoUrl =
    video.status === 'completed' && video.processed_url
      ? `/api/videos/${video.id}/download`
      : undefined

  return {
    id: video.id,
    status: video.status,
    progress: calculateOverallProgress(steps),
    currentStep: steps.find((s) => s.status === 'processing')?.step_name,
    finalVideoUrl,
    errorMessage: video.error_message || undefined,
    steps: steps.map((s) => ({
      stepName: s.step_name,
      status: s.status,
      progress: s.progress || 0,
      // Hide third-party provider names from frontend
      provider: 'AI Processing',
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
