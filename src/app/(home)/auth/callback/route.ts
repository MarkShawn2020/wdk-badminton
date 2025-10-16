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

  console.log('[AuthCallback] Callback route triggered:', {
    hasCode: !!code,
    next,
    origin,
    searchParams: Object.fromEntries(searchParams.entries()),
  })

  // Security: Only allow relative URLs for redirect
  const redirectTo = next.startsWith('/') ? next : '/dashboard'

  if (code) {
    try {
      console.log('[AuthCallback] Creating server client...')
      const supabase = await createServerClient()

      console.log('[AuthCallback] Exchanging code for session...')
      // Exchange the OAuth code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('[AuthCallback] ❌ Code exchange error:', error)
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
        )
      }

      console.log('[AuthCallback] ✅ Code exchange successful!')
      console.log('[AuthCallback] Session data:', {
        hasSession: !!data.session,
        hasUser: !!data.user,
        userId: data.user?.id,
        userEmail: data.user?.email,
        expiresAt: data.session?.expires_at,
      })

      // Optional: Extract provider tokens for accessing Google APIs
      if (data.session) {
        const { provider_token, provider_refresh_token, access_token, refresh_token } = data.session

        // Log tokens for debugging
        console.log('[AuthCallback] Token information:', {
          hasProviderToken: !!provider_token,
          hasProviderRefreshToken: !!provider_refresh_token,
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          accessTokenLength: access_token?.length,
          refreshTokenLength: refresh_token?.length,
        })

        // TODO: Store provider tokens if you need to access Google APIs
        // For example: Google Drive, Gmail, Calendar, etc.
        // Store them securely in your database associated with the user
      }

      // Success: Redirect to the requested page or dashboard
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const finalRedirectUrl = isLocalEnv
        ? `${origin}${redirectTo}`
        : forwardedHost
          ? `https://${forwardedHost}${redirectTo}`
          : `${origin}${redirectTo}`

      console.log('[AuthCallback] Redirecting user:', {
        isLocalEnv,
        forwardedHost,
        redirectTo,
        finalRedirectUrl,
      })

      // Create response with explicit cookie setting
      const response = NextResponse.redirect(finalRedirectUrl)

      // Log cookies for debugging
      const requestCookies = request.headers.get('cookie')
      console.log('[AuthCallback] Request cookies:', requestCookies ? 'present' : 'none')

      // Log response cookies that will be set
      const responseCookies = response.headers.getSetCookie()
      console.log('[AuthCallback] Response Set-Cookie headers:', {
        count: responseCookies.length,
        cookieNames: responseCookies.map((c) => {
          const nameMatch = c.match(/^([^=]+)=/)
          return nameMatch ? nameMatch[1] : 'unknown'
        }),
      })

      // Log each cookie being set (for debugging)
      responseCookies.forEach((cookie, index) => {
        const parts = cookie.split(';').map((p) => p.trim())
        const [nameValue] = parts
        const attrs = parts.slice(1)
        console.log(`[AuthCallback] Set-Cookie[${index}]:`, {
          nameValue: nameValue.substring(0, 50) + '...', // Truncate for readability
          attributes: attrs,
        })
      })

      console.log('[AuthCallback] ✅ Redirect response created with cookies')

      return response
    } catch (error) {
      console.error('[AuthCallback] ❌ Callback processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(errorMessage)}`
      )
    }
  }

  // No code provided: redirect to error page
  console.error('[AuthCallback] ❌ No authorization code provided')
  return NextResponse.redirect(`${origin}/auth/error?message=No authorization code provided`)
}
