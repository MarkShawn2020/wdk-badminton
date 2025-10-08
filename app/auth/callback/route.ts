/**
 * OAuth Callback Route
 *
 * Handles the OAuth code exchange for Google Sign-In (PKCE flow).
 *
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Redirected to Google's consent screen
 * 3. Google redirects back to this route with a code
 * 4. This route exchanges the code for a session
 * 5. User is redirected to the app (dashboard or specified route)
 *
 * Security:
 * - Uses PKCE flow (more secure than implicit flow)
 * - Validates redirect URLs
 * - Only allows relative URLs for 'next' parameter
 */

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Security: Only allow relative URLs for redirect
  const redirectTo = next.startsWith('/') ? next : '/dashboard'

  if (code) {
    try {
      const supabase = await createServerClient()

      // Exchange the OAuth code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Code exchange error:', error)
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
        )
      }

      // Optional: Extract provider tokens for accessing Google APIs
      if (data.session) {
        const { provider_token, provider_refresh_token } = data.session

        // Log tokens for debugging (remove in production)
        console.log('✅ Google Sign-In successful')
        console.log('User ID:', data.user?.id)
        console.log('Email:', data.user?.email)
        console.log('Has provider_token:', !!provider_token)
        console.log('Has provider_refresh_token:', !!provider_refresh_token)

        // TODO: Store provider tokens if you need to access Google APIs
        // For example: Google Drive, Gmail, Calendar, etc.
        // Store them securely in your database associated with the user
      }

      // Success: Redirect to the requested page or dashboard
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // Local development: use origin directly
        return NextResponse.redirect(`${origin}${redirectTo}`)
      } else if (forwardedHost) {
        // Production with load balancer: use forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${redirectTo}`)
      } else {
        // Fallback: use origin
        return NextResponse.redirect(`${origin}${redirectTo}`)
      }
    } catch (error) {
      console.error('Callback processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(errorMessage)}`
      )
    }
  }

  // No code provided: redirect to error page
  return NextResponse.redirect(`${origin}/auth/error?message=No authorization code provided`)
}
