/**
 * Supabase client for Client Components
 *
 * IMPORTANT: Only use in Client Components (with 'use client' directive)
 */

'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  // Singleton pattern to reuse client instance
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Optional: Log meaningful auth events (not cookie I/O)
  if (process.env.NODE_ENV === 'development') {
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log(`[Auth] ✅ Signed in: ${session?.user.email}`)
      } else if (event === 'SIGNED_OUT') {
        console.log('[Auth] 👋 Signed out')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('[Auth] 🔄 Token refreshed')
      }
    })
  }

  return client
}
