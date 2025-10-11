/**
 * Video Status API Route
 *
 * GET /api/videos/[videoId]/status
 * Get processing status of a specific video
 *
 * This endpoint:
 * 1. Queries the database for the video
 * 2. If pipeline enabled, queries pipeline steps for status
 * 3. Fetches latest status from external API (WaveSpeed/Replicate)
 * 4. Updates database with latest status
 * 5. Returns current status to frontend
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { getWaveSpeedClient } from '@/lib/video-api/wavespeed'
import { getReplicateClient } from '@/lib/video-api/replicate'
import { calculatePipelineProgress } from '@/lib/video/pipeline-orchestrator'
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']
type VideoUpdate = Database['public']['Tables']['videos']['Update']
type ProcessingPipeline = Database['public']['Tables']['processing_pipeline']['Row']
type PipelineUpdate = Database['public']['Tables']['processing_pipeline']['Update']

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
        pipeline_enabled,
        total_pipeline_steps,
        current_pipeline_step
      `
      )
      .eq('id', videoId)
      .eq('user_id', user.id) // Ensure user owns this video
      .single()

    if (error || !video) {
      return errorResponse('Video not found', 404)
    }

    const typedVideo = video as Video

    // 4. Handle pipeline-enabled videos
    if (typedVideo.pipeline_enabled && typedVideo.status === 'processing') {
      try {
        // Get the current processing step from pipeline
        const { data: currentStep, error: stepError } = await supabase
          .from('processing_pipeline')
          .select('*')
          .eq('video_id', videoId)
          .eq('status', 'processing')
          .order('step_order', { ascending: true })
          .limit(1)
          .single()

        if (stepError || !currentStep) {
          console.log(`⚠️ No active pipeline step found for video ${videoId}`)
          // Check if pipeline is completed
          const { data: completedSteps } = await supabase
            .from('processing_pipeline')
            .select('step_order, output_video_url')
            .eq('video_id', videoId)
            .eq('status', 'completed')
            .order('step_order', { ascending: false })
            .limit(1)

          if (completedSteps && completedSteps.length > 0) {
            const lastStep = completedSteps[0]
            if (lastStep.step_order === typedVideo.total_pipeline_steps) {
              // All steps completed!
              const serviceClient = createServiceClient()
              await serviceClient
                .from('videos')
                .update({
                  status: 'completed',
                  processed_url: lastStep.output_video_url,
                  completed_at: new Date().toISOString(),
                  progress: 100,
                } as never)
                .eq('id', videoId)

              return successResponse({
                id: typedVideo.id,
                status: 'completed',
                progress: 100,
                filename: typedVideo.original_filename,
                processedUrl: lastStep.output_video_url,
                errorMessage: null,
                createdAt: typedVideo.created_at,
                startedAt: typedVideo.started_processing_at,
                completedAt: new Date().toISOString(),
                creditsUsed: typedVideo.estimated_cost_credits,
              })
            }
          }

          // Otherwise, return current database status
          return successResponse({
            id: typedVideo.id,
            status: typedVideo.status,
            progress: typedVideo.progress || 0,
            filename: typedVideo.original_filename,
            processedUrl: typedVideo.processed_url,
            errorMessage: typedVideo.error_message,
            createdAt: typedVideo.created_at,
            startedAt: typedVideo.started_processing_at,
            completedAt: typedVideo.completed_at,
            creditsUsed: typedVideo.estimated_cost_credits,
          })
        }

        const typedStep = currentStep as ProcessingPipeline
        console.log(
          `🔄 Checking status for video ${videoId}, step ${typedStep.step_order}/${typedVideo.total_pipeline_steps} (${typedStep.provider})...`
        )

        // Fetch status from external API based on provider
        const serviceClient = createServiceClient()

        if (typedStep.provider === 'wavespeed' && typedStep.external_job_id) {
          const waveSpeed = getWaveSpeedClient()
          const prediction = await waveSpeed.getPredictionResult(typedStep.external_job_id)

          console.log(`📊 WaveSpeed status: ${prediction.status}`)

          if (prediction.status === 'completed') {
            const processedUrl = prediction.outputs?.[0]

            if (!processedUrl) {
              throw new Error('No output URL in completed WaveSpeed prediction')
            }

            // Update pipeline step
            await serviceClient
              .from('processing_pipeline')
              .update({
                status: 'completed',
                output_video_url: processedUrl,
                completed_at: new Date().toISOString(),
                progress: 100,
              } as never)
              .eq('id', typedStep.id)

            console.log(
              `✅ Pipeline step ${typedStep.step_order} completed: ${processedUrl.substring(0, 50)}...`
            )

            // Check if this is the last step
            if (typedStep.step_order === typedVideo.total_pipeline_steps) {
              // All steps completed!
              await serviceClient
                .from('videos')
                .update({
                  status: 'completed',
                  processed_url: processedUrl,
                  completed_at: new Date().toISOString(),
                  progress: 100,
                } as never)
                .eq('id', videoId)

              return successResponse({
                id: typedVideo.id,
                status: 'completed',
                progress: 100,
                filename: typedVideo.original_filename,
                processedUrl: processedUrl,
                errorMessage: null,
                createdAt: typedVideo.created_at,
                startedAt: typedVideo.started_processing_at,
                completedAt: new Date().toISOString(),
                creditsUsed: typedVideo.estimated_cost_credits,
              })
            } else {
              // More steps to go - the cron job will pick up the next step
              const overallProgress = await calculatePipelineProgress(videoId)

              return successResponse({
                id: typedVideo.id,
                status: 'processing',
                progress: overallProgress,
                filename: typedVideo.original_filename,
                processedUrl: null,
                errorMessage: null,
                createdAt: typedVideo.created_at,
                startedAt: typedVideo.started_processing_at,
                completedAt: null,
                creditsUsed: typedVideo.estimated_cost_credits,
              })
            }
          } else if (prediction.status === 'failed') {
            // Mark step as failed
            await serviceClient
              .from('processing_pipeline')
              .update({
                status: 'failed',
                error_message: 'WaveSpeed processing failed',
                completed_at: new Date().toISOString(),
              } as never)
              .eq('id', typedStep.id)

            // Mark video as failed and refund credits
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (serviceClient.rpc as any)('refund_credits', {
              p_user_id: typedVideo.user_id,
              p_video_id: videoId,
              p_amount: typedVideo.estimated_cost_credits,
            })

            await serviceClient
              .from('videos')
              .update({
                status: 'failed',
                error_message: `Processing failed at step ${typedStep.step_order}: WaveSpeed error`,
                completed_at: new Date().toISOString(),
              } as never)
              .eq('id', videoId)

            console.log(`❌ Video ${videoId} failed at step ${typedStep.step_order}`)

            return successResponse({
              id: typedVideo.id,
              status: 'failed',
              progress: typedVideo.progress || 0,
              filename: typedVideo.original_filename,
              processedUrl: null,
              errorMessage: `Processing failed at step ${typedStep.step_order}`,
              createdAt: typedVideo.created_at,
              startedAt: typedVideo.started_processing_at,
              completedAt: new Date().toISOString(),
              creditsUsed: typedVideo.estimated_cost_credits,
            })
          } else {
            // Still processing
            const overallProgress = await calculatePipelineProgress(videoId)

            return successResponse({
              id: typedVideo.id,
              status: 'processing',
              progress: overallProgress,
              filename: typedVideo.original_filename,
              processedUrl: null,
              errorMessage: null,
              createdAt: typedVideo.created_at,
              startedAt: typedVideo.started_processing_at,
              completedAt: null,
              creditsUsed: typedVideo.estimated_cost_credits,
            })
          }
        } else if (typedStep.provider === 'replicate' && typedStep.external_job_id) {
          const replicate = getReplicateClient()
          const prediction = await replicate.getPrediction(typedStep.external_job_id)

          console.log(`📊 Replicate status: ${prediction.status}`)

          if (prediction.status === 'succeeded') {
            const processedUrl = typeof prediction.output === 'string' ? prediction.output : null

            if (!processedUrl) {
              throw new Error('No output URL in completed Replicate prediction')
            }

            // Update pipeline step
            await serviceClient
              .from('processing_pipeline')
              .update({
                status: 'completed',
                output_video_url: processedUrl,
                completed_at: new Date().toISOString(),
                progress: 100,
              } as never)
              .eq('id', typedStep.id)

            console.log(
              `✅ Pipeline step ${typedStep.step_order} completed: ${processedUrl.substring(0, 50)}...`
            )

            // Check if this is the last step
            if (typedStep.step_order === typedVideo.total_pipeline_steps) {
              // All steps completed!
              await serviceClient
                .from('videos')
                .update({
                  status: 'completed',
                  processed_url: processedUrl,
                  completed_at: new Date().toISOString(),
                  progress: 100,
                } as never)
                .eq('id', videoId)

              return successResponse({
                id: typedVideo.id,
                status: 'completed',
                progress: 100,
                filename: typedVideo.original_filename,
                processedUrl: processedUrl,
                errorMessage: null,
                createdAt: typedVideo.created_at,
                startedAt: typedVideo.started_processing_at,
                completedAt: new Date().toISOString(),
                creditsUsed: typedVideo.estimated_cost_credits,
              })
            } else {
              // More steps to go
              const overallProgress = await calculatePipelineProgress(videoId)

              return successResponse({
                id: typedVideo.id,
                status: 'processing',
                progress: overallProgress,
                filename: typedVideo.original_filename,
                processedUrl: null,
                errorMessage: null,
                createdAt: typedVideo.created_at,
                startedAt: typedVideo.started_processing_at,
                completedAt: null,
                creditsUsed: typedVideo.estimated_cost_credits,
              })
            }
          } else if (prediction.status === 'failed' || prediction.status === 'canceled') {
            // Mark step as failed
            await serviceClient
              .from('processing_pipeline')
              .update({
                status: 'failed',
                error_message: prediction.error || 'Replicate processing failed',
                completed_at: new Date().toISOString(),
              } as never)
              .eq('id', typedStep.id)

            // Mark video as failed and refund credits
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (serviceClient.rpc as any)('refund_credits', {
              p_user_id: typedVideo.user_id,
              p_video_id: videoId,
              p_amount: typedVideo.estimated_cost_credits,
            })

            await serviceClient
              .from('videos')
              .update({
                status: 'failed',
                error_message: `Processing failed at step ${typedStep.step_order}: ${prediction.error || 'Replicate error'}`,
                completed_at: new Date().toISOString(),
              } as never)
              .eq('id', videoId)

            console.log(`❌ Video ${videoId} failed at step ${typedStep.step_order}`)

            return successResponse({
              id: typedVideo.id,
              status: 'failed',
              progress: typedVideo.progress || 0,
              filename: typedVideo.original_filename,
              processedUrl: null,
              errorMessage: `Processing failed at step ${typedStep.step_order}`,
              createdAt: typedVideo.created_at,
              startedAt: typedVideo.started_processing_at,
              completedAt: new Date().toISOString(),
              creditsUsed: typedVideo.estimated_cost_credits,
            })
          } else {
            // Still processing (starting or processing)
            const overallProgress = await calculatePipelineProgress(videoId)

            return successResponse({
              id: typedVideo.id,
              status: 'processing',
              progress: overallProgress,
              filename: typedVideo.original_filename,
              processedUrl: null,
              errorMessage: null,
              createdAt: typedVideo.created_at,
              startedAt: typedVideo.started_processing_at,
              completedAt: null,
              creditsUsed: typedVideo.estimated_cost_credits,
            })
          }
        }
      } catch (apiError) {
        console.error('Failed to fetch pipeline status:', apiError)
        // Return current database status if API query fails
        const overallProgress = await calculatePipelineProgress(videoId)
        return successResponse({
          id: typedVideo.id,
          status: 'processing',
          progress: overallProgress,
          filename: typedVideo.original_filename,
          processedUrl: null,
          errorMessage: null,
          createdAt: typedVideo.created_at,
          startedAt: typedVideo.started_processing_at,
          completedAt: null,
          creditsUsed: typedVideo.estimated_cost_credits,
        })
      }
    }

    // 5. Return current database status (for non-pipeline or completed/failed videos)
    return successResponse({
      id: typedVideo.id,
      status: typedVideo.status,
      progress: typedVideo.progress || 0,
      filename: typedVideo.original_filename,
      processedUrl: typedVideo.processed_url,
      errorMessage: typedVideo.error_message,
      createdAt: typedVideo.created_at,
      startedAt: typedVideo.started_processing_at,
      completedAt: typedVideo.completed_at,
      creditsUsed: typedVideo.estimated_cost_credits,
    })
  } catch (error) {
    console.error('Status API error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    return errorResponse('Internal server error', 500)
  }
}
