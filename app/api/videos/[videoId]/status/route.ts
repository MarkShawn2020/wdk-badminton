/**
 * Video Status API Route
 *
 * GET /api/videos/[videoId]/status
 * Get processing status of a specific video
 *
 * This endpoint:
 * 1. Queries the database for the video
 * 2. If video is still processing, fetches latest status from WaveSpeed
 * 3. Updates database with latest status
 * 4. Returns current status to frontend
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'

interface RouteContext {
  params: Promise<{ videoId: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 1. Authenticate user
    const user = await requireAuth()

    // 2. Get videoId from params
    const { videoId } = await context.params

    // 3. Query video status from database
    const supabase = await createServerClient()
    const { data: video, error } = await supabase
      .from('videos')
      .select(
        `
        id,
        user_id,
        status,
        progress,
        original_filename,
        processed_url,
        error_message,
        created_at,
        started_processing_at,
        completed_at,
        estimated_cost_credits,
        external_job_id,
        external_provider
      `
      )
      .eq('id', videoId)
      .eq('user_id', user.id) // Ensure user owns this video
      .single()

    if (error || !video) {
      return errorResponse('Video not found', 404)
    }

    // 4. If video is still processing, fetch latest status from WaveSpeed
    if (
      video.status === 'processing' &&
      video.external_job_id &&
      video.external_provider === 'wavespeed'
    ) {
      try {
        console.log(`🔄 Fetching latest status for video ${videoId} from WaveSpeed...`)

        const waveSpeed = getWaveSpeedClient()
        const prediction = await waveSpeed.getPredictionResult(video.external_job_id)

        console.log(`📊 WaveSpeed status: ${prediction.status}`)

        // Update database based on WaveSpeed status
        const serviceClient = createServiceClient()

        if (prediction.status === 'completed') {
          const processedUrl = prediction.outputs?.[0]

          if (!processedUrl) {
            throw new Error('No output URL in completed prediction')
          }

          await serviceClient
            .from('videos')
            .update({
              status: 'completed',
              processed_url: processedUrl,
              completed_at: new Date().toISOString(),
              progress: 100,
            } as never)
            .eq('id', videoId)

          console.log(`✅ Video ${videoId} completed: ${processedUrl}`)

          // Return updated status
          return successResponse({
            id: video.id,
            status: 'completed',
            progress: 100,
            filename: video.original_filename,
            processedUrl: processedUrl,
            errorMessage: null,
            createdAt: video.created_at,
            startedAt: video.started_processing_at,
            completedAt: new Date().toISOString(),
            creditsUsed: video.estimated_cost_credits,
          })
        } else if (prediction.status === 'failed') {
          // Refund credits on failure
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (serviceClient.rpc as any)('refund_credits', {
            p_user_id: video.user_id,
            p_video_id: videoId,
            p_amount: video.estimated_cost_credits,
          })

          await serviceClient
            .from('videos')
            .update({
              status: 'failed',
              error_message: 'Processing failed at WaveSpeed',
              completed_at: new Date().toISOString(),
            } as never)
            .eq('id', videoId)

          console.log(`❌ Video ${videoId} failed`)

          return successResponse({
            id: video.id,
            status: 'failed',
            progress: video.progress || 0,
            filename: video.original_filename,
            processedUrl: null,
            errorMessage: 'Processing failed at WaveSpeed',
            createdAt: video.created_at,
            startedAt: video.started_processing_at,
            completedAt: new Date().toISOString(),
            creditsUsed: video.estimated_cost_credits,
          })
        } else {
          // Still processing, estimate progress based on time elapsed
          const startedAt = video.started_processing_at
            ? new Date(video.started_processing_at)
            : new Date()
          const elapsedMs = Date.now() - startedAt.getTime()
          const elapsedSeconds = Math.floor(elapsedMs / 1000)

          // Rough estimate: 2x video duration processing time
          const estimatedTotalSeconds = ((video.estimated_cost_credits || 0) / 10) * 5 * 2
          const estimatedProgress = Math.min(
            95,
            Math.floor((elapsedSeconds / estimatedTotalSeconds) * 100)
          )

          // Update progress
          if (estimatedProgress > (video.progress || 0)) {
            await serviceClient
              .from('videos')
              .update({ progress: estimatedProgress } as never)
              .eq('id', videoId)
          }

          console.log(`⏳ Video ${videoId} still processing (${estimatedProgress}%)`)

          return successResponse({
            id: video.id,
            status: 'processing',
            progress: estimatedProgress,
            filename: video.original_filename,
            processedUrl: null,
            errorMessage: null,
            createdAt: video.created_at,
            startedAt: video.started_processing_at,
            completedAt: null,
            creditsUsed: video.estimated_cost_credits,
          })
        }
      } catch (apiError) {
        console.error('Failed to fetch WaveSpeed status:', apiError)
        // Continue with database status if WaveSpeed query fails
      }
    }

    // 5. Return current database status (for completed/failed videos or if WaveSpeed query failed)
    return successResponse({
      id: video.id,
      status: video.status,
      progress: video.progress || 0,
      filename: video.original_filename,
      processedUrl: video.processed_url,
      errorMessage: video.error_message,
      createdAt: video.created_at,
      startedAt: video.started_processing_at,
      completedAt: video.completed_at,
      creditsUsed: video.estimated_cost_credits,
    })
  } catch (error) {
    console.error('Status API error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    return errorResponse('Internal server error', 500)
  }
}
