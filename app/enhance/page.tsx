/**
 * Video Enhancement Page
 *
 * Main page for uploading and processing videos
 * Route: /enhance
 */

import { createServerClient, createServiceClient } from '@/lib/supabase/server'
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

    // If query successful and data exists
    if (result.data) {
      userCredits = result.data.balance
    }
    // If PGRST116 error (no rows), create record with signup bonus
    else if (result.error?.code === 'PGRST116') {
      console.log('Creating user_credits record for existing user:', user.id)

      // Use service role client to bypass RLS
      const serviceSupabase = createServiceClient()

      const { error: insertError } = await serviceSupabase.from('user_credits').insert({
        user_id: user.id,
        balance: 100,
        total_earned: 100,
        tier: 'free',
      })

      if (insertError) {
        console.error('Failed to create user_credits:', insertError)
        userCredits = 0 // Fallback to 0 credits
      } else {
        // Also record the signup bonus transaction
        await serviceSupabase.from('credit_transactions').insert({
          user_id: user.id,
          type: 'signup_bonus',
          amount: 100,
          balance_after: 100,
          description: 'Welcome bonus - 100 free credits',
        })
        userCredits = 100
      }
    }
    // Other errors (e.g., RLS policy issues)
    else if (result.error) {
      console.error('Error fetching user_credits:', result.error)
      userCredits = 0 // Fallback to 0 credits to prevent blocking
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <VideoUploadFlow userCredits={userCredits} />
    </div>
  )
}
