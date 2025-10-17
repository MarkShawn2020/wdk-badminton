import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to handle OAuth callbacks
 *
 * Problem: Supabase redirects OAuth callbacks to the Site URL (/) instead of /auth/callback
 * Solution: Detect OAuth code in root URL and redirect to /auth/callback
 *
 * This ensures the server-side callback route handles the PKCE code exchange,
 * which is necessary because the code verifier must match between sign-in and callback.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)

  // Check if this is an OAuth callback (has 'code' parameter) at root path
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (pathname === '/' && code) {
    console.log('[Middleware] Detected OAuth callback at root, redirecting to /auth/callback')

    // Construct the callback URL with all parameters
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.searchParams.set('code', code)
    if (next) {
      callbackUrl.searchParams.set('next', next)
    }

    // Preserve any other parameters Google might have added
    searchParams.forEach((value, key) => {
      if (key !== 'code' && key !== 'next') {
        callbackUrl.searchParams.set(key, value)
      }
    })

    console.log('[Middleware] Redirecting to:', callbackUrl.pathname + callbackUrl.search)

    // Redirect to the callback route
    return NextResponse.redirect(callbackUrl)
  }

  // Continue with normal request
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}
