/**
 * API authentication helpers
 */

import { createServerClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Require authentication for API route
 * Throws error if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Get optional user (doesn't throw if not authenticated)
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
