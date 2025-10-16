/**
 * Video Download API Route
 *
 * GET /api/videos/[videoId]/download
 * Downloads the processed video with proper Content-Disposition header
 *
 * CRITICAL: Uses Supabase Storage for permanent video access
 * - No URL expiration issues (Replicate URLs expire after 1 hour)
 * - Hides upstream provider information from users
 * - Provides consistent download experience
 */

import { NextRequest } from 'next/server'
import { errorResponse } from '@/lib/api/response'
import { requireAuth } from '@/lib/api/auth'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

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
      .select('id, original_filename, processed_storage_path, processed_url, status')
      .eq('id', videoId)
      .eq('user_id', user.id) // Ensure user owns this video
      .single()

    if (error || !video) {
      return errorResponse('Video not found', 404)
    }

    // 4. Verify video is completed
    if (video.status !== 'completed') {
      return errorResponse('Video processing not completed', 400)
    }

    // 5. Download from Supabase Storage (permanent, no expiration)
    console.log(`📥 Downloading video ${videoId} from Supabase Storage`)

    let videoBlob: Blob

    // Prefer processed_storage_path (new system) over processed_url (legacy)
    if (video.processed_storage_path) {
      // New system: Download from Supabase Storage
      // Use service client because processed/ folder requires service role access
      const serviceSupabase = createServiceClient()

      console.log(
        '📥 Downloading from Supabase Storage with service role:',
        video.processed_storage_path
      )

      const { data: fileData, error: downloadError } = await serviceSupabase.storage
        .from('videos')
        .download(video.processed_storage_path)

      if (downloadError || !fileData) {
        console.error('❌ Failed to download from Supabase Storage:', downloadError)
        console.error('   Path:', video.processed_storage_path)
        console.error('   Error details:', JSON.stringify(downloadError, null, 2))
        return errorResponse('Failed to download video from storage', 500)
      }

      videoBlob = fileData
      console.log(`✅ Downloaded from Supabase Storage: ${video.processed_storage_path}`)
      console.log(`   File size: ${(fileData.size / 1024 / 1024).toFixed(2)}MB`)
    } else if (video.processed_url) {
      // Legacy fallback: Download from external URL (may be expired)
      console.warn(
        `⚠️ Using legacy processed_url for video ${videoId} (may expire if Replicate URL)`
      )

      try {
        const videoResponse = await fetch(video.processed_url, {
          method: 'GET',
          redirect: 'follow',
        })

        if (!videoResponse.ok) {
          console.error(
            `❌ Failed to fetch video from external URL: ${videoResponse.status} ${videoResponse.statusText}`
          )
          return errorResponse(
            `Failed to download video: External URL returned ${videoResponse.status}. Video may have expired.`,
            500
          )
        }

        videoBlob = await videoResponse.blob()
      } catch (fetchError) {
        console.error('❌ Network error fetching video:', fetchError)
        return errorResponse(
          'Failed to download video: Network error or URL expired. Please contact support.',
          500
        )
      }
    } else {
      return errorResponse('Video has no download URL available', 500)
    }

    // 6. Generate download filename
    const originalName = video.original_filename || 'video.mp4'
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    const downloadFilename = `${nameWithoutExt}_processed.mp4`

    console.log(`✅ Serving video download: ${downloadFilename}`)

    // 7. Return video with download headers
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
