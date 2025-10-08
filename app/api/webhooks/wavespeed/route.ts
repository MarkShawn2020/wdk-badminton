/**
 * WaveSpeed Webhook Handler
 *
 * POST /api/webhooks/wavespeed
 * Receives status updates from WaveSpeed API
 *
 * This is an alternative to polling - WaveSpeed will notify us when jobs complete
 *
 * IMPORTANT: This endpoint should verify webhook signatures in production
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServiceClient } from '@/lib/supabase/server'

// Schema for WaveSpeed webhook payload (adjust based on actual webhook format)
const webhookPayloadSchema = z.object({
  id: z.string().describe('Prediction ID'),
  status: z.enum(['created', 'processing', 'completed', 'failed']),
  outputs: z.array(z.string()).optional(),
  error: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature (if WaveSpeed provides one)
    // const signature = request.headers.get('x-wavespeed-signature')
    // const isValid = verifyWebhookSignature(await request.text(), signature)
    // if (!isValid) {
    //   return errorResponse('Invalid signature', 401)
    // }

    // 2. Parse webhook payload
    const body = await request.json()
    const payload = webhookPayloadSchema.parse(body)

    console.log('📨 Received WaveSpeed webhook:', payload)

    // 3. Find video by external job ID
    const supabase = createServiceClient()
    const { data: video, error: queryError } = await supabase
      .from('videos')
      .select('id, user_id, estimated_cost_credits')
      .eq('external_job_id', payload.id)
      .single()

    if (queryError || !video) {
      console.error('Video not found for job ID:', payload.id)
      // Return 200 to prevent retries
      return successResponse({ message: 'Video not found' })
    }

    // 4. Update video status based on webhook
    if (payload.status === 'completed') {
      const processedUrl = payload.outputs?.[0]

      if (!processedUrl) {
        console.error('No output URL in webhook payload')
        return errorResponse('No output URL', 400)
      }

      await supabase
        .from('videos')
        .update({
          status: 'completed',
          processed_url: processedUrl,
          completed_at: new Date().toISOString(),
          progress: 100,
        } as never)
        .eq('id', video.id)

      console.log(`✅ Video ${video.id} marked as completed via webhook`)
    } else if (payload.status === 'failed') {
      // Refund credits
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.rpc as any)('refund_credits', {
        p_user_id: video.user_id,
        p_video_id: video.id,
        p_amount: video.estimated_cost_credits,
      })

      await supabase
        .from('videos')
        .update({
          status: 'failed',
          error_message: payload.error || 'Processing failed',
          completed_at: new Date().toISOString(),
        } as never)
        .eq('id', video.id)

      console.log(`❌ Video ${video.id} marked as failed via webhook`)
    } else if (payload.status === 'processing') {
      await supabase
        .from('videos')
        .update({
          status: 'processing',
          progress: 50, // Generic progress update
        } as never)
        .eq('id', video.id)
    }

    return successResponse({ message: 'Webhook processed' })
  } catch (error) {
    console.error('Webhook error:', error)

    if (error instanceof z.ZodError) {
      return errorResponse('Invalid webhook payload', 400)
    }

    // Return 200 even on error to prevent retries
    return successResponse({ message: 'Error logged' })
  }
}
