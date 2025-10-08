/**
 * Video Enhancement Page
 *
 * Main page for uploading and processing videos
 * Route: /enhance
 */

import { createServerClient } from '@/lib/supabase/server'
import { VideoUploadFlow } from '@/components/video/VideoUploadFlow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enhance Your Video | ReelVan',
  description:
    'Upload and enhance your AI-generated videos. Remove watermarks, upscale quality, and optimize for any platform.',
  openGraph: {
    title: 'Enhance Your Video | ReelVan',
    description: 'Transform AI videos with professional enhancements',
  },
}

export default async function EnhancePage() {
  const supabase = await createServerClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user credits if authenticated
  let userCredits: number | undefined

  if (user) {
    const result = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    const credits = result.data as { balance: number } | null
    userCredits = credits?.balance
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <VideoUploadFlow userCredits={userCredits} />
    </div>
  )
}
