/**
 * Video Transfer to Supabase Storage
 *
 * Transfers processed videos from upstream providers (Replicate, WaveSpeed)
 * to Supabase Storage for permanent storage.
 *
 * CRITICAL RATIONALE:
 * - Replicate outputs expire after 1 hour (see: https://replicate.com/docs/topics/predictions/output-files.md)
 * - WaveSpeed URLs may also be temporary
 * - Storing in Supabase prevents link expiration and hides upstream providers
 *
 * Cost: ~$0.021/GB/month storage + $0.09/GB bandwidth
 */

import { createServiceClient } from '@/lib/supabase/server'

export type StepType = 'watermark_removed' | 'quality_enhanced'

/**
 * Transfer video from upstream provider's temporary URL to Supabase Storage
 *
 * @param temporaryUrl - Temporary URL from upstream provider (Replicate/WaveSpeed)
 * @param videoId - Video ID for storage path generation
 * @param stepType - Processing step type for path organization
 * @returns Supabase Storage path (relative path in 'videos' bucket)
 *
 * @throws Error if download from upstream fails
 * @throws Error if upload to Supabase Storage fails
 */
export async function transferVideoToStorage(
  temporaryUrl: string,
  videoId: string,
  stepType: StepType
): Promise<string> {
  const supabase = createServiceClient()

  // 1. Download video from upstream provider
  const upstreamHost = new URL(temporaryUrl).hostname
  console.log(`📥 Downloading video from upstream: ${upstreamHost} (hiding from frontend)`)

  let response: Response
  try {
    response = await fetch(temporaryUrl, {
      method: 'GET',
      redirect: 'follow',
      // Add timeout to prevent hanging on slow upstream responses
      signal: AbortSignal.timeout(300000), // 5 minutes timeout
    })
  } catch (fetchError) {
    console.error('❌ Failed to fetch from upstream:', fetchError)
    throw new Error(
      `Network error downloading from upstream: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`
    )
  }

  if (!response.ok) {
    throw new Error(`Upstream provider returned error: ${response.status} ${response.statusText}`)
  }

  // 2. Get video data
  const videoBlob = await response.blob()
  const videoBuffer = await videoBlob.arrayBuffer()

  const fileSizeMB = (videoBlob.size / 1024 / 1024).toFixed(2)
  console.log(`📦 Downloaded video: ${fileSizeMB}MB`)

  // 3. Generate storage path
  // Format: processed/{step_type}/{video_id}_{timestamp}.mp4
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const storagePath = `processed/${stepType}/${videoId}_${timestamp}.mp4`

  console.log(`📤 Uploading to Supabase Storage: ${storagePath}`)

  // 4. Upload to Supabase Storage (videos bucket)
  const { data, error } = await supabase.storage.from('videos').upload(storagePath, videoBuffer, {
    contentType: 'video/mp4',
    cacheControl: '31536000', // 1 year cache (365 days)
    upsert: false, // Don't overwrite if exists (should never happen with timestamp)
  })

  if (error) {
    console.error('❌ Supabase Storage upload failed:', error)
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`)
  }

  console.log(`✅ Video transferred successfully: ${storagePath}`)
  console.log(
    `💾 Storage cost estimate: ~$${((videoBlob.size / 1024 / 1024 / 1024) * 0.021).toFixed(4)}/month`
  )

  return storagePath
}

/**
 * Get public URL for a storage path
 *
 * @param storagePath - Storage path in 'videos' bucket
 * @returns Public URL (Supabase CDN)
 *
 * Note: This returns a permanent URL that doesn't expire.
 * It uses Supabase's CDN for optimal delivery performance.
 */
export async function getPublicUrl(storagePath: string): Promise<string> {
  const supabase = createServiceClient()

  const { data } = supabase.storage.from('videos').getPublicUrl(storagePath)

  return data.publicUrl
}

/**
 * Get signed URL for a storage path (with expiration)
 *
 * @param storagePath - Storage path in 'videos' bucket
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL with expiration
 *
 * Use this for sensitive videos that should have time-limited access.
 * For public videos, use getPublicUrl() instead.
 */
export async function getSignedUrl(storagePath: string, expiresIn: number = 3600): Promise<string> {
  const supabase = createServiceClient()

  const { data, error } = await supabase.storage
    .from('videos')
    .createSignedUrl(storagePath, expiresIn)

  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message || 'Unknown error'}`)
  }

  return data.signedUrl
}

/**
 * Delete video from Supabase Storage
 *
 * @param storagePath - Storage path in 'videos' bucket
 *
 * Use this when cleaning up old videos or after user deletion.
 */
export async function deleteVideo(storagePath: string): Promise<void> {
  const supabase = createServiceClient()

  const { error } = await supabase.storage.from('videos').remove([storagePath])

  if (error) {
    console.error('❌ Failed to delete video from storage:', error)
    throw new Error(`Failed to delete video: ${error.message}`)
  }

  console.log(`🗑️ Deleted video from storage: ${storagePath}`)
}
