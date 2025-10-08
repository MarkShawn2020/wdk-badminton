/**
 * Video Download API Route
 *
 * GET /api/videos/[videoId]/download
 * Downloads the processed video with proper Content-Disposition header
 *
 * This endpoint proxies the video download from CloudFront/S3
 * to force browser download instead of opening in new tab
 */

import { NextRequest } from 'next/server'
import { errorResponse } from '@/lib/api/response'
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

    // 3. Query video from database
    const supabase = await createServerClient()
    const { data: video, error } = await supabase
      .from('videos')
      .select('id, original_filename, processed_url, status')
      .eq('id', videoId)
      .eq('user_id', user.id) // Ensure user owns this video
      .single()

    if (error || !video) {
      return errorResponse('Video not found', 404)
    }

    // 4. Verify video is completed and has processed URL
    if (video.status !== 'completed' || !video.processed_url) {
      return errorResponse('Video processing not completed', 400)
    }

    // 5. Fetch video from external URL
    console.log(`📥 Downloading video ${videoId} from ${video.processed_url}`)

    const videoResponse = await fetch(video.processed_url)

    if (!videoResponse.ok) {
      console.error('Failed to fetch video from external URL:', videoResponse.status)
      return errorResponse('Failed to download video', 500)
    }

    // 6. Get video blob
    const videoBlob = await videoResponse.blob()

    // 7. Generate download filename
    const originalName = video.original_filename || 'video.mp4'
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    const downloadFilename = `${nameWithoutExt}_processed.mp4`

    console.log(`✅ Serving video download: ${downloadFilename}`)

    // 8. Return video with download headers
    return new Response(videoBlob, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': videoBlob.size.toString(),
      },
    })
  } catch (error) {
    console.error('Download API error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    return errorResponse('Internal server error', 500)
  }
}
