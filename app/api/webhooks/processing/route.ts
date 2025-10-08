/**
 * Video Processing Webhook Handler
 *
 * POST /api/webhooks/processing
 * Receives updates from video processing API (WaveSpeed, Replicate, etc.)
 *
 * CRITICAL: This endpoint handles processing completion and refunds
 */

import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { z } from 'zod'

/**
 * Webhook payload schema
 * Adjust based on your actual API provider
 */
const webhookSchema = z.object({
  video_id: z.string().uuid(),
  status: z.enum(['processing', 'completed', 'failed', 'cancelled']),
  progress: z.number().int().min(0).max(100).optional(),
  processed_url: z.string().url().optional(),
  error: z.string().optional(),

  // External tracking
  job_id: z.string().optional(),

  // Optional metadata
  processing_time_seconds: z.number().optional(),
  file_size_bytes: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Verify webhook signature for security
    // Example for WaveSpeed:
    // const signature = request.headers.get('x-webhook-signature')
    // const isValid = verifyWebhookSignature(signature, body, process.env.VIDEO_API_WEBHOOK_SECRET)
    // if (!isValid) {
    //   return errorResponse('Invalid webhook signature', 401)
    // }

    // Parse and validate webhook payload
    const body = await request.json()
    const validated = webhookSchema.parse(body)

    console.log('Processing webhook received:', {
      video_id: validated.video_id,
      status: validated.status,
      progress: validated.progress,
    })

    const supabase = createServiceClient()

    // Fetch video to get user_id and credits
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('user_id, estimated_cost_credits, status as current_status')
      .eq('id', validated.video_id)
      .single()

    if (fetchError || !video) {
      console.error('Video not found:', validated.video_id)
      return errorResponse('Video not found', 404)
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      status: validated.status,
      progress: validated.progress || (validated.status === 'completed' ? 100 : undefined),
      processed_url: validated.processed_url,
      error_message: validated.error,
    }

    // Set completion timestamp
    if (validated.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
      updateData.actual_cost_credits = video.estimated_cost_credits
    }

    // Set completion/failure timestamp
    if (validated.status === 'failed' || validated.status === 'cancelled') {
      updateData.completed_at = new Date().toISOString()
    }

    // Update video status
    const { error: updateError } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', validated.video_id)

    if (updateError) {
      console.error('Failed to update video:', updateError)
      return errorResponse('Failed to update video status', 500)
    }

    // Handle refunds for failed/cancelled videos
    if (
      (validated.status === 'failed' || validated.status === 'cancelled') &&
      video.current_status !== 'failed' &&
      video.current_status !== 'cancelled'
    ) {
      console.log('Refunding credits for failed video:', {
        video_id: validated.video_id,
        user_id: video.user_id,
        amount: video.estimated_cost_credits,
      })

      const { error: refundError } = await supabase.rpc('refund_credits', {
        p_user_id: video.user_id,
        p_video_id: validated.video_id,
        p_amount: video.estimated_cost_credits,
      })

      if (refundError) {
        console.error('Failed to refund credits:', refundError)
        // Don't fail the webhook - log for manual review
      }
    }

    // TODO: Send email notification to user
    // if (validated.status === 'completed') {
    //   await sendCompletionEmail(video.user_id, validated.video_id)
    // }

    console.log('Webhook processed successfully:', validated.video_id)

    return successResponse({
      received: true,
      video_id: validated.video_id,
      status: validated.status,
    })
  } catch (error) {
    console.error('Webhook processing error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid webhook payload', 400, error.errors)
    }

    // Generic error
    return errorResponse('Webhook processing failed', 500)
  }
}

/**
 * Verify webhook signature (implement based on your API provider)
 */
function verifyWebhookSignature(signature: string | null, body: string, secret: string): boolean {
  // TODO: Implement signature verification
  // Example for HMAC-SHA256:
  // const crypto = require('crypto')
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(body)
  //   .digest('hex')
  // return signature === expectedSignature

  return true // Placeholder - implement actual verification!
}
