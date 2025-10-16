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

  console.log('[ServerClient] Creating server client...')

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          console.log('[ServerClient] Cookie GET:', {
            name,
            hasValue: !!value,
            valueLength: value?.length,
          })
          return value
        },
        set(name: string, value: string, options) {
          try {
            console.log('[ServerClient] Cookie SET:', {
              name,
              valueLength: value?.length,
              options: {
                ...options,
                expires: options?.expires?.toString(),
              },
            })
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // EXPECTED: Cookie writes fail in Server Components
            // This is normal behavior - Supabase will handle session management client-side
            console.log(
              '[ServerClient] Cookie SET skipped (Server Component - expected behavior):',
              { name }
            )
            // No need to log the full error as this is not an error condition
          }
        },
        remove(name: string, options) {
          try {
            console.log('[ServerClient] Cookie REMOVE:', { name })
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // EXPECTED: Cookie removal fails in Server Components
            console.log(
              '[ServerClient] Cookie REMOVE skipped (Server Component - expected behavior):',
              { name }
            )
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
