/**
 * Supabase server client for Server Components and API routes
 *
 * IMPORTANT: Only use in Server Components, Server Actions, and API Routes
 */

import { createServerClient as createClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          // Only log auth token chunks that have values (reduces noise from chunk probing)
          if (value && process.env.NODE_ENV === 'development') {
            console.log(
              `[Supabase] 🔑 Auth token chunk: ${name.split('.').pop()} (${value.length} bytes)`
            )
          }
          return value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options })
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Supabase] ✅ Cookie set: ${name.split('-').pop()}`)
            }
          } catch (error) {
            // Expected in Server Components - Supabase handles session client-side
            if (process.env.NODE_ENV === 'development') {
              console.log(
                `[Supabase] ⏭️  Cookie set skipped (server component): ${name.split('-').pop()}`
              )
            }
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Supabase] 🗑️  Cookie removed: ${name.split('-').pop()}`)
            }
          } catch (error) {
            // Expected in Server Components
          }
        },
      },
    }
  )
}

/**
 * Service role client with elevated permissions
 * CRITICAL: Only use for trusted operations like credit management
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
