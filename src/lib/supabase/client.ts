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
    console.log('[BrowserClient] Returning existing client instance')
    return client
  }

  console.log('[BrowserClient] Creating new browser client instance')

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  console.log('[BrowserClient] Client created successfully')

  return client
}
