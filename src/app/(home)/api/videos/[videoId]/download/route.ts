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
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']

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

    const typedVideo = video as Video

    // 4. Verify video is completed and has processed URL
    if (typedVideo.status !== 'completed' || !typedVideo.processed_url) {
      return errorResponse('Video processing not completed', 400)
    }

    // 5. Fetch video from external URL
    console.log(`📥 Downloading video ${videoId}`)

    let videoResponse: Response
    try {
      videoResponse = await fetch(typedVideo.processed_url, {
        method: 'GET',
        redirect: 'follow',
      })

      if (!videoResponse.ok) {
        console.error(
          `❌ Failed to fetch video from external URL: ${videoResponse.status} ${videoResponse.statusText}`
        )
        // Don't log the actual URL for security
        return errorResponse(
          `Failed to download video: External URL returned ${videoResponse.status}`,
          500
        )
      }
    } catch (fetchError) {
      console.error('❌ Network error fetching video:', fetchError)
      // Don't log the actual URL for security
      return errorResponse('Failed to download video: Network error or URL expired', 500)
    }

    // 6. Get video blob
    const videoBlob = await videoResponse.blob()

    // 7. Generate download filename
    const originalName = typedVideo.original_filename || 'video.mp4'
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
