/**
 * Job Polling API Route
 *
 * GET /api/poll-jobs
 * Polls WaveSpeed for processing status updates
 *
 * This endpoint should be called periodically by a cron job or background worker
 * to check the status of pending video processing jobs.
 *
 * IMPORTANT: This route should be protected by a secret token in production
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServiceClient } from '@/lib/supabase/server'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']
type VideoUpdate = Database['public']['Tables']['videos']['Update']

export async function GET(request: NextRequest) {
  try {
    // 1. Verify request is from authorized source (cron job)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return errorResponse('Unauthorized', 401)
    }

    // 2. Get all processing videos
    const supabase = createServiceClient()
    const { data: processingVideos, error: queryError } = await supabase
      .from('videos')
      .select('id, user_id, external_job_id, external_provider, estimated_cost_credits')
      .eq('status', 'processing')
      .not('external_job_id', 'is', null)

    if (queryError) {
      console.error('Failed to query processing videos:', queryError)
      return errorResponse('Database query failed', 500)
    }

    if (!processingVideos || processingVideos.length === 0) {
      return successResponse({
        message: 'No processing jobs to poll',
        count: 0,
      })
    }

    console.log(`📊 Polling ${processingVideos.length} processing jobs...`)

    // 3. Poll each job
    const waveSpeed = getWaveSpeedClient()
    const results = {
      completed: 0,
      failed: 0,
      stillProcessing: 0,
      errors: 0,
    }

    for (const video of processingVideos as Video[]) {
      try {
        if (video.external_provider !== 'wavespeed' || !video.external_job_id) {
          console.warn(`⚠️ Video ${video.id} has invalid provider or job ID`)
          continue
        }

        // Poll WaveSpeed API
        const prediction = await waveSpeed.getPredictionResult(video.external_job_id)

        console.log(`🔄 Job ${video.external_job_id} status: ${prediction.status}`)

        // Update based on status
        if (prediction.status === 'completed') {
          // Get processed video URL
          const processedUrl = prediction.outputs?.[0]

          if (!processedUrl) {
            throw new Error('No output URL in completed prediction')
          }

          // Update database
          const updateData: VideoUpdate = {
            status: 'completed',
            processed_url: processedUrl,
            completed_at: new Date().toISOString(),
            progress: 100,
          }
          await supabase
            .from('videos')
            .update(updateData as never)
            .eq('id', video.id)

          console.log(`✅ Video ${video.id} completed: ${processedUrl}`)
          results.completed++
        } else if (prediction.status === 'failed') {
          // Refund credits on failure
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.rpc as any)('refund_credits', {
            p_user_id: video.user_id,
            p_video_id: video.id,
            p_amount: video.estimated_cost_credits,
          })

          // Update database
          const updateData: VideoUpdate = {
            status: 'failed',
            error_message: 'Processing failed at WaveSpeed',
            completed_at: new Date().toISOString(),
          }
          await supabase
            .from('videos')
            .update(updateData as never)
            .eq('id', video.id)

          console.log(`❌ Video ${video.id} failed`)
          results.failed++
        } else {
          // Still processing
          results.stillProcessing++
        }
      } catch (error) {
        console.error(`❌ Error polling video ${video.id}:`, error)
        console.error('Error details:', {
          videoId: video.id,
          externalJobId: video.external_job_id,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        })
        results.errors++
      }
    }

    console.log('📊 Polling results:', results)

    return successResponse({
      message: 'Polling completed',
      totalJobs: processingVideos.length,
      results,
    })
  } catch (error) {
    console.error('Poll jobs error:', error)
    return errorResponse('Internal server error', 500)
  }
}
