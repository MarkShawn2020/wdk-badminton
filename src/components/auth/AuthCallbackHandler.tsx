'use client'

/**
 * Auth Callback Handler Component
 *
 * This component handles OAuth callback codes that appear in the URL.
 * It's necessary because Supabase may redirect to the Site URL (/)
 * instead of the designated callback route (/auth/callback).
 *
 * When this component detects a 'code' parameter in the URL:
 * 1. Exchanges the code for a session (client-side)
 * 2. Sets auth cookies automatically
 * 3. Redirects to the target page (from 'next' parameter or '/')
 * 4. Forces a router refresh to update server components with new auth state
 */

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const next = searchParams.get('next') || '/'

      // Only process if there's a code and we haven't started processing
      if (!code || isProcessing) {
        return
      }

      setIsProcessing(true)

      try {
        console.log('[AuthCallback] Detected OAuth code in URL, exchanging for session...')

        const supabase = createClient()

        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('[AuthCallback] Code exchange failed:', error)
          // Redirect to error page or home
          router.push('/')
          return
        }

        console.log('[AuthCallback] ✅ Code exchange successful!', {
          hasSession: !!data.session,
          hasUser: !!data.user,
          userId: data.user?.id,
        })

        // Clean the URL by removing code and next parameters
        const url = new URL(window.location.href)
        url.searchParams.delete('code')
        url.searchParams.delete('next')

        // Replace the URL without the code (don't add to history)
        window.history.replaceState({}, '', url.pathname)

        // Force router refresh to update server components with new auth state
        console.log('[AuthCallback] Refreshing router to update auth state...')
        router.refresh()

        console.log('[AuthCallback] ✅ Authentication complete!')
      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err)
        router.push('/')
      }
    }

    handleCallback()
  }, [searchParams, router, isProcessing])

  // Don't render anything (invisible component)
  return null
}
