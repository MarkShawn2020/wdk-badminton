'use client'

/**
 * Google Sign In Button Component
 *
 * Provides a clean, branded Google sign-in button that integrates with Supabase Auth.
 *
 * Features:
 * - OAuth 2.0 PKCE flow for security
 * - Automatic redirect handling
 * - Loading states
 * - Error handling
 * - Mobile-responsive
 */

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
  redirectTo?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
  className?: string
}

export function GoogleSignInButton({
  redirectTo = '/',
  onSuccess,
  onError,
  className = '',
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('[GoogleSignIn] Starting Google sign-in flow...')

      const supabase = createClient()

      // Get current origin for redirect
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      // Note: Supabase will redirect to Site URL (/), but our middleware
      // will intercept and redirect to /auth/callback for proper PKCE handling
      const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`

      console.log('[GoogleSignIn] Redirect configuration:', {
        origin,
        redirectTo,
        callbackUrl,
        currentUrl: window.location.href,
      })

      // WARNING: Check if Supabase Site URL matches current origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.warn(
          '[GoogleSignIn] ⚠️  Local development detected! Ensure Supabase Site URL is set to:',
          origin
        )
        console.warn(
          '[GoogleSignIn] ⚠️  Go to Supabase Dashboard → Authentication → URL Configuration'
        )
      }

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // PKCE flow: Supabase will redirect to Site URL (/),
          // but our middleware intercepts and redirects to /auth/callback
          redirectTo: callbackUrl,
          // Request offline access to get refresh token
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      console.log('[GoogleSignIn] signInWithOAuth result:', {
        hasData: !!data,
        hasError: !!signInError,
        data,
      })

      if (signInError) throw signInError

      console.log('[GoogleSignIn] Redirecting to Google consent screen...')

      // Success callback
      if (onSuccess) {
        onSuccess()
      }

      // Note: User will be redirected to Google's consent screen
      // The actual sign-in completes in the callback route
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google'
      setError(errorMessage)
      console.error('[GoogleSignIn] Error:', err)

      if (onError && err instanceof Error) {
        onError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-2">
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        className={`w-full ${className}`}
        type="button"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive-foreground flex items-start gap-2 rounded-lg border p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
