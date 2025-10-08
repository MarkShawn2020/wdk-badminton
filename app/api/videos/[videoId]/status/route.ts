/**
 * Video Status API Route
 *
 * GET /api/videos/[videoId]/status
 * Get processing status of a specific video
 *
 * This endpoint allows users to poll for their video's processing status
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'
import { createServerClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ videoId: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 1. Authenticate user
    const user = await requireAuth()

    // 2. Get videoId from params
    const { videoId } = await context.params

    // 3. Query video status
    const supabase = await createServerClient()
    const { data: video, error } = await supabase
      .from('videos')
      .select(
        `
        id,
        status,
        progress,
        original_filename,
        processed_url,
        error_message,
        created_at,
        started_processing_at,
        completed_at,
        estimated_cost_credits
      `
      )
      .eq('id', videoId)
      .eq('user_id', user.id) // Ensure user owns this video
      .single()

    if (error || !video) {
      return errorResponse('Video not found', 404)
    }

    // 4. Return status
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
