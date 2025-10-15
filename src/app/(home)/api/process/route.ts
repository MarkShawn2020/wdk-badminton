/**
 * Video Processing API Route
 *
 * POST /api/process
 * Starts video processing job
 *
 * CRITICAL FLOW:
 * 1. Authenticate user
 * 2. Validate video metadata
 * 3. Calculate cost
 * 4. Check user credits
 * 5. Deduct credits (optimistically)
 * 6. Create database record
 * 7. Submit to processing API
 * 8. If failure: refund credits
 *
 * IMPORTANT: This route handles real money. Every step must be carefully validated.
 */

import { NextRequest } from 'next/server'
import { z, ZodError } from 'zod'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { videoUploadSchema, processingOptionsSchema } from '@/lib/validations/video'
import { Database } from '@/types/database'
import {
  calculateCreditsRequired,
  calculateApiCost,
  validateVideoConstraints,
} from '@/lib/video/cost'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'
import { getReplicateClient } from '@/lib/video-api/replicate'
import {
  buildPipeline,
  createPipelineSteps,
  calculatePipelineCost,
} from '@/lib/video/pipeline-orchestrator'

/**
 * Combined request schema for video processing
 */
const processRequestSchema = z
  .object({
    // Video metadata from upload
    filename: videoUploadSchema.shape.filename,
    fileSize: videoUploadSchema.shape.fileSize,
    duration: videoUploadSchema.shape.duration,
    mimeType: videoUploadSchema.shape.mimeType,

    // Storage path from upload API
    storagePath: z.string().min(1),
  })
  .merge(processingOptionsSchema)

export async function POST(request: NextRequest) {
  let videoId: string | null = null
  let creditsDeducted = false

  try {
    // 1. Authenticate user
    const user = await requireAuth()

    // 2. Parse and validate request
    const body = await request.json()
    const validated = processRequestSchema.parse(body)

    // 3. Validate video constraints (universal limits)
    const constraintsValidation = validateVideoConstraints(validated.duration, validated.fileSize)
    if (!constraintsValidation.valid) {
      return errorResponse(constraintsValidation.reason!, 400)
    }

    // 4. Get user credits and tier
    const supabase = await createServerClient()
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance, tier')
      .eq('user_id', user.id)
      .single()

    if (creditsError || !userCredits) {
      return errorResponse('User credits not found', 404)
    }

    // Note: Tier only affects rate limiting, not video capabilities
    // Rate limiting is handled separately (see /api/rate-limit or client-side)

    // 5. Build processing pipeline based on user options
    const pipeline = buildPipeline(
      {
        removeWatermark: validated.removeWatermark,
        enhanceQuality: validated.enhanceQuality,
        targetResolution: validated.targetResolution,
        targetFps: validated.targetFps,
      },
      '', // URL will be set later
      validated.duration
    )

    // 6. Calculate total cost for all pipeline steps
    const creditsRequired = calculatePipelineCost(pipeline)
    const apiCostUsd = pipeline.reduce((sum, step) => {
      // Estimate API cost for each step
      if (step.provider === 'wavespeed') {
        return sum + calculateApiCost(validated.duration)
      } else if (step.provider === 'replicate') {
        // Replicate cost is already in estimatedCostCredits / 100
        return sum + step.estimatedCostCredits / 100
      }
      return sum
    }, 0)

    // 7. Check sufficient balance
    const userBalance = (userCredits as { balance: number }).balance
    if (userBalance < creditsRequired) {
      return errorResponse(
        `Insufficient credits. Required: ${creditsRequired}, Available: ${userBalance}`,
        402 // Payment Required
      )
    }

    // Log pipeline summary
    console.log('📋 Processing pipeline:', {
      steps: pipeline.map((s) => s.stepName),
      totalCredits: creditsRequired,
      totalSteps: pipeline.length,
    })

    // 8. Get storage URL
    const { data: urlData } = await supabase.storage
      .from('videos')
      .createSignedUrl(validated.storagePath, 3600 * 24) // 24 hour expiry

    if (!urlData?.signedUrl) {
      return errorResponse('Failed to generate video URL', 500)
    }

    // 9. Create video record in database
    const videoInsertData = {
      user_id: user.id,
      original_filename: validated.filename,
      original_url: urlData.signedUrl,
      original_storage_path: validated.storagePath,
      duration_seconds: validated.duration,
      file_size_bytes: validated.fileSize,
      mime_type: validated.mimeType,
      remove_watermark: validated.removeWatermark,
      target_resolution: validated.targetResolution,
      target_aspect_ratio: validated.targetAspectRatio,
      enhance_quality: validated.enhanceQuality,
      status: 'pending' as const,
      estimated_cost_credits: creditsRequired,
      api_cost_usd: apiCostUsd,
      pipeline_enabled: pipeline.length > 1, // Enable pipeline if multiple steps
      total_pipeline_steps: pipeline.length,
      current_pipeline_step: 1,
    }

    const { data: video, error: insertError } = (await supabase
      .from('videos')
      .insert(videoInsertData as never)
      .select()
      .single()) as { data: { id: string } | null; error: unknown }

    if (insertError || !video) {
      console.error('Failed to create video record:', insertError)
      return errorResponse('Failed to create processing job', 500)
    }

    videoId = video.id

    // 10. Create pipeline steps in database
    try {
      await createPipelineSteps(videoId, pipeline, urlData.signedUrl)
      console.log(`✅ Created ${pipeline.length} pipeline steps for video ${videoId}`)
    } catch (pipelineError) {
      console.error('Failed to create pipeline steps:', pipelineError)
      // Cleanup: delete video record
      await supabase.from('videos').delete().eq('id', videoId)
      return errorResponse('Failed to create processing pipeline', 500)
    }

    // 11. Deduct credits using database function
    const serviceClient = createServiceClient()
    // NOTE: Type assertion needed due to Supabase RPC type inference issue
    // See: https://github.com/supabase/supabase-js/issues/1018
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: deductError } = await (serviceClient.rpc as any)('deduct_credits', {
      p_user_id: user.id,
      p_video_id: videoId,
      p_amount: creditsRequired,
    })

    if (deductError) {
      console.error('Failed to deduct credits:', deductError)
      // Cleanup: delete video record
      await supabase.from('videos').delete().eq('id', videoId)
      return errorResponse(
        'Failed to deduct credits: ' + (deductError.message || 'Unknown error'),
        500
      )
    }

    creditsDeducted = true

    // 12. Start the first pipeline step
    try {
      const firstStep = pipeline[0]

      if (firstStep.stepType === 'remove_watermark') {
        // Start WaveSpeed watermark removal
        const waveSpeed = getWaveSpeedClient()
        const prediction = await waveSpeed.createPrediction(urlData.signedUrl)

        // Update the first pipeline step
        await supabase
          .from('processing_pipeline')
          .update({
            status: 'processing',
            started_at: new Date().toISOString(),
            external_job_id: prediction.id,
          } as never)
          .eq('video_id', videoId)
          .eq('step_order', 1)

        console.log('✅ Started pipeline step 1 (remove_watermark):', {
          videoId,
          predictionId: prediction.id,
        })
      } else if (firstStep.stepType === 'enhance_quality') {
        // Start Replicate quality enhancement
        const replicate = getReplicateClient()
        const prediction = await replicate.createPrediction({
          video: urlData.signedUrl,
          target_resolution: firstStep.config?.targetResolution,
          target_fps: firstStep.config?.targetFps,
        })

        // Update the first pipeline step
        await supabase
          .from('processing_pipeline')
          .update({
            status: 'processing',
            started_at: new Date().toISOString(),
            external_job_id: prediction.id,
          } as never)
          .eq('video_id', videoId)
          .eq('step_order', 1)

        console.log('✅ Started pipeline step 1 (enhance_quality):', {
          videoId,
          predictionId: prediction.id,
        })
      }

      // Update video status to processing
      await supabase
        .from('videos')
        .update({
          status: 'processing',
          started_processing_at: new Date().toISOString(),
          external_job_id: pipeline[0].provider, // Store provider for reference
          external_provider: pipeline[0].provider,
        } as never)
        .eq('id', videoId)
    } catch (apiError) {
      console.error('Failed to start first pipeline step:', apiError)
      console.error('API Error details:', {
        message: apiError instanceof Error ? apiError.message : 'Unknown error',
        stack: apiError instanceof Error ? apiError.stack : undefined,
      })

      // Refund credits
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (serviceClient.rpc as any)('refund_credits', {
        p_user_id: user.id,
        p_video_id: videoId,
        p_amount: creditsRequired,
      })

      // Update video status to failed
      await supabase
        .from('videos')
        .update({
          status: 'failed',
          error_message:
            apiError instanceof Error ? apiError.message : 'Failed to submit to processing API',
        } as never)
        .eq('id', videoId)

      return errorResponse('Failed to start processing', 500)
    }

    // 13. Return success
    return successResponse({
      videoId,
      status: 'processing',
      pipelineEnabled: pipeline.length > 1,
      totalSteps: pipeline.length,
      estimatedTime: Math.ceil(validated.duration * 2 * pipeline.length), // Estimate: 2x per step
      creditsDeducted: creditsRequired,
    })
  } catch (error) {
    console.error('Process API error:', error)

    // Refund credits if they were deducted
    if (creditsDeducted && videoId) {
      try {
        const user = await requireAuth()
        const serviceClient = createServiceClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (serviceClient.rpc as any)('refund_credits', {
          p_user_id: user.id,
          p_video_id: videoId,
          p_amount: calculateCreditsRequired(0), // This would need the actual amount
        })
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError)
      }
    }

    // Handle validation errors
    if (error instanceof ZodError) {
      return errorResponse('Invalid request data', 400, error.issues)
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    // Generic error
    return errorResponse('Internal server error', 500)
  }
}
