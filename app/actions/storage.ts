/**
 * Storage Helper Actions
 *
 * Provides pre-signed upload URLs to bypass size limits
 */

'use server'

import { createServerClient } from '@/lib/supabase/server'

/**
 * Get a pre-signed upload URL for video
 *
 * This allows direct upload to Supabase Storage from the client
 * without going through Server Actions (avoids 1MB limit)
 *
 * @returns Upload URL and storage path
 */
export async function getUploadUrl(videoId: string, filename: string) {
  console.log('🔑 getUploadUrl called:', { videoId, filename })

  const supabase = await createServerClient()

  // Authenticate
  console.log('🔐 Authenticating user...')
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('❌ User not authenticated')
    return { error: 'Unauthorized' }
  }

  console.log('✅ User authenticated:', user.id)

  // Generate storage path with user ID (required for RLS)
  const storagePath = `${user.id}/${videoId}/original.mp4`
  console.log('📂 Storage path:', storagePath)

  // Create signed upload URL (valid for 1 hour)
  console.log('🔗 Creating signed upload URL...')
  const { data, error } = await supabase.storage.from('videos').createSignedUploadUrl(storagePath)

  if (error) {
    console.error('❌ Failed to create upload URL:', error)
    return { error: 'Failed to create upload URL' }
  }

  console.log('✅ Signed upload URL created')
  console.log('   URL length:', data.signedUrl.length)
  console.log('   Token:', data.token?.substring(0, 20) + '...')

  return {
    success: true,
    uploadUrl: data.signedUrl,
    storagePath,
    token: data.token,
  }
}
