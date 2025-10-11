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
import { getReplicateClient } from '@/lib/video-api/replicate'
import type { Database } from '@/types/database'
import { isPipelineCompleted } from '@/lib/video/pipeline-orchestrator'
import {
  pollPipelineStep,
  startNextPipelineStep,
  finalizePipeline,
} from '@/lib/video/pipeline-step-handler'

type Video = Database['public']['Tables']['videos']['Row']
type VideoUpdate = Database['public']['Tables']['videos']['Update']
type ProcessingPipeline = Database['public']['Tables']['processing_pipeline']['Row']

export async function GET(request: NextRequest) {
  try {
    // 1. Verify request is from authorized source (cron job)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return errorResponse('Unauthorized', 401)
    }

    // 2. Get all processing pipeline steps
    const supabase = createServiceClient()
    const { data: processingSteps, error: queryError } = await supabase
      .from('processing_pipeline')
      .select('*')
      .eq('status', 'processing')
      .not('external_job_id', 'is', null)

    if (queryError) {
      console.error('Failed to query processing pipeline steps:', queryError)
      return errorResponse('Database query failed', 500)
    }

    if (!processingSteps || processingSteps.length === 0) {
      return successResponse({
        message: 'No processing pipeline steps to poll',
        count: 0,
      })
    }

    console.log(`📊 Polling ${processingSteps.length} processing pipeline steps...`)

    // 3. Poll each pipeline step
    const results = {
      stepsCompleted: 0,
      stepsFailed: 0,
      stepsProcessing: 0,
      pipelinesCompleted: 0,
      errors: 0,
    }

    for (const step of processingSteps as ProcessingPipeline[]) {
      try {
        console.log(`🔄 Polling step ${step.step_order} for video ${step.video_id}`)

        // Poll the step
        const isCompleted = await pollPipelineStep(step)

        if (isCompleted) {
          console.log(`✅ Step ${step.step_order} completed for video ${step.video_id}`)
          results.stepsCompleted++

          // Check if this was the last step
          const pipelineComplete = await isPipelineCompleted(step.video_id)

          if (pipelineComplete) {
            // Finalize the pipeline
            await finalizePipeline(step.video_id)
            results.pipelinesCompleted++
            console.log(`🎉 Pipeline completed for video ${step.video_id}`)
          } else {
            // Start next step
            try {
              await startNextPipelineStep(step.video_id)
              console.log(`🚀 Started next step for video ${step.video_id}`)
            } catch (nextStepError) {
              console.error(`Failed to start next step for video ${step.video_id}:`, nextStepError)

              // Mark video as failed
              await supabase
                .from('videos')
                .update({
                  status: 'failed',
                  error_message: 'Failed to start next pipeline step',
                  completed_at: new Date().toISOString(),
                } as never)
                .eq('id', step.video_id)

              // Refund credits
              const { data: video } = await supabase
                .from('videos')
                .select('user_id, estimated_cost_credits')
                .eq('id', step.video_id)
                .single()

              if (video) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase.rpc as any)('refund_credits', {
                  p_user_id: video.user_id,
                  p_video_id: step.video_id,
                  p_amount: video.estimated_cost_credits,
                })
              }

              results.stepsFailed++
            }
          }
        } else {
          // Still processing
          results.stepsProcessing++
        }
      } catch (error) {
        console.error(`❌ Error polling step ${step.id}:`, error)
        console.error('Error details:', {
          stepId: step.id,
          videoId: step.video_id,
          stepOrder: step.step_order,
          provider: step.provider,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        })

        // Mark step as failed
        try {
          await supabase
            .from('processing_pipeline')
            .update({
              status: 'failed',
              error_message: error instanceof Error ? error.message : 'Unknown error',
              completed_at: new Date().toISOString(),
            } as never)
            .eq('id', step.id)

          // Mark video as failed
          await supabase
            .from('videos')
            .update({
              status: 'failed',
              error_message: `Pipeline step ${step.step_order} failed`,
              completed_at: new Date().toISOString(),
            } as never)
            .eq('id', step.video_id)

          // Refund credits
          const { data: video } = await supabase
            .from('videos')
            .select('user_id, estimated_cost_credits')
            .eq('id', step.video_id)
            .single()

          if (video) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.rpc as any)('refund_credits', {
              p_user_id: video.user_id,
              p_video_id: step.video_id,
              p_amount: video.estimated_cost_credits,
            })
          }
        } catch (cleanupError) {
          console.error('Failed to cleanup after error:', cleanupError)
        }

        results.errors++
      }
    }

    console.log('📊 Polling results:', results)

    return successResponse({
      message: 'Polling completed',
      totalSteps: processingSteps.length,
      results,
    })
  } catch (error) {
    console.error('Poll jobs error:', error)
    return errorResponse('Internal server error', 500)
  }
}
