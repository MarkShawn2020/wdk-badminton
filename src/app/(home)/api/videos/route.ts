/**
 * Videos API Route
 *
 * GET /api/videos
 * Fetch user's videos with pagination
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth()

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // Filter by status

    // Calculate pagination
    const offset = (page - 1) * limit

    // Build query
    const supabase = await createServerClient()
    let query = supabase
      .from('videos')
      .select(
        `
        id,
        original_filename,
        duration_seconds,
        file_size_bytes,
        status,
        progress,
        error_message,
        original_url,
        processed_url,
        estimated_cost_credits,
        actual_cost_credits,
        created_at,
        completed_at
      `,
        { count: 'exact' }
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status)
    }

    const { data: videos, error, count } = await query

    if (error) {
      console.error('Failed to fetch videos:', error)
      return errorResponse('Failed to fetch videos', 500)
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit)
    const hasMore = page < totalPages

    return successResponse({
      videos,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore,
      },
    })
  } catch (error) {
    console.error('Videos API error:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    return errorResponse('Internal server error', 500)
  }
}
