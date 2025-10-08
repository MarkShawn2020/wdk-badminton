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
  validateVideoDuration,
  checkTierLimits,
  UserTier,
} from '@/lib/video/cost'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'

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

    // 3. Validate video duration
    const durationValidation = validateVideoDuration(validated.duration)
    if (!durationValidation.valid) {
      return errorResponse(durationValidation.reason!, 400)
    }

    // 4. Get user tier and check limits
    const supabase = await createServerClient()
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance, tier')
      .eq('user_id', user.id)
      .single()

    if (creditsError || !userCredits) {
      return errorResponse('User credits not found', 404)
    }

    // TypeScript type assertion - we know userCredits exists after the check
    const userTier = (userCredits as { balance: number; tier?: string }).tier || 'free'
    const tier = userTier as UserTier
    const tierCheck = checkTierLimits(validated.duration, validated.fileSize, tier)
    if (!tierCheck.canProcess) {
      return errorResponse(tierCheck.reason!, 403)
    }

    // 5. Calculate cost
    const creditsRequired = calculateCreditsRequired(validated.duration)
    const apiCostUsd = calculateApiCost(validated.duration)

    // 6. Check sufficient balance
    const userBalance = (userCredits as { balance: number }).balance
    if (userBalance < creditsRequired) {
      return errorResponse(
        `Insufficient credits. Required: ${creditsRequired}, Available: ${userBalance}`,
        402 // Payment Required
      )
    }

    // 7. Get storage URL
    const { data: urlData } = await supabase.storage
      .from('videos')
      .createSignedUrl(validated.storagePath, 3600 * 24) // 24 hour expiry

    if (!urlData?.signedUrl) {
      return errorResponse('Failed to generate video URL', 500)
    }

    // 8. Create video record in database
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

    // 9. Deduct credits using database function
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

    // 10. Submit to WaveSpeed API
    try {
      const waveSpeed = getWaveSpeedClient()
      const prediction = await waveSpeed.createPrediction(urlData.signedUrl)

      // Update database with external job ID
      await supabase
        .from('videos')
        .update({
          status: 'processing',
          started_processing_at: new Date().toISOString(),
          external_job_id: prediction.id,
          external_provider: 'wavespeed',
        } as never)
        .eq('id', videoId)

      console.log('✅ Video submitted to WaveSpeed:', {
        videoId,
        predictionId: prediction.id,
        status: prediction.status,
      })
    } catch (apiError) {
      console.error('Failed to submit to WaveSpeed API:', apiError)

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

    // 11. Return success
    return successResponse({
      videoId,
      status: 'processing',
      estimatedTime: Math.ceil(validated.duration * 2), // Estimate: 2x video duration
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
