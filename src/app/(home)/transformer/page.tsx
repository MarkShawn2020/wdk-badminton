/**
 * Video Transformer Page
 *
 * Main page for uploading and transforming videos for social media
 * Route: /transformer
 */

import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { VideoUploadFlow } from '@/components/video/VideoUploadFlow'
import { ClientOnly } from '@/components/utils/ClientOnly'
import type { Metadata } from 'next'
import type { Database } from '@/types/database'

type UserCreditsInsert = Database['public']['Tables']['user_credits']['Insert']
type CreditTransactionInsert = Database['public']['Tables']['credit_transactions']['Insert']

export const metadata: Metadata = {
  title: 'Transform Your Video | ReelVan',
  description:
    'Transform AI videos into ready-to-post social content. Remove watermarks, enhance quality, add branding, and get AI-generated captions for Instagram, TikTok, YouTube.',
  openGraph: {
    title: 'Transform Your Video | ReelVan',
    description:
      'Turn your AI video instantly shareable with professional processing and AI captions',
  },
}

export default async function TransformerPage() {
  const supabase = await createServerClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user credits if authenticated
  let userCredits: number | undefined

  if (user) {
    type UserCreditsRow = { balance: number }
    type QueryResult = {
      data: UserCreditsRow | null
      error: { code?: string } | null
    }

    const result = (await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()) as unknown as QueryResult

    // If query successful and data exists
    if (result.data) {
      userCredits = result.data.balance
    }
    // If PGRST116 error (no rows), create record with signup bonus
    else if (result.error?.code === 'PGRST116') {
      console.log('Creating user_credits record for existing user:', user.id)

      // Use service role client to bypass RLS
      const serviceSupabase = createServiceClient()

      const creditsData: UserCreditsInsert = {
        user_id: user.id,
        balance: 100,
        total_earned: 100,
        tier: 'free',
      }

      const { error: insertError } = await serviceSupabase
        .from('user_credits')
        .insert(creditsData as never)

      if (insertError) {
        console.error('Failed to create user_credits:', insertError)
        userCredits = 0 // Fallback to 0 credits
      } else {
        // Also record the signup bonus transaction
        const transactionData: CreditTransactionInsert = {
          user_id: user.id,
          type: 'signup_bonus',
          amount: 100,
          balance_after: 100,
          description: 'Welcome bonus - 100 free credits',
        }
        await serviceSupabase.from('credit_transactions').insert(transactionData as never)
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
    <ClientOnly
      fallback={
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
                <div className="flex animate-pulse flex-col gap-4">
                  <div className="h-10 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-64 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    >
      <VideoUploadFlow userCredits={userCredits} />
    </ClientOnly>
  )
}
