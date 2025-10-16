'use client'

/**
 * User Avatar Component
 *
 * Displays user avatar in the navigation header with dropdown menu.
 *
 * Features:
 * - Shows Google profile picture or initials fallback
 * - Dropdown menu with user info and actions
 * - Real-time auth state updates
 * - Sign out functionality
 * - Loading and unauthenticated states
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/components/ui/dropdown-menu'
import { Button } from '@/components/components/ui/button'
import { LogIn, LogOut, Settings, User as UserIcon, Video } from 'lucide-react'
import Link from 'next/link'

export function UserAvatar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    console.log('[UserAvatar] Component mounted, checking session...')

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        console.log('[UserAvatar] Initial session check:', {
          hasSession: !!session,
          hasError: !!error,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          expiresAt: session?.expires_at,
          error,
        })
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[UserAvatar] Failed to get session:', err)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[UserAvatar] Auth state changed:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      })
      setUser(session?.user ?? null)
    })

    return () => {
      console.log('[UserAvatar] Component unmounting, unsubscribing...')
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'local' })
    router.push('/')
    router.refresh()
  }

  // Loading state
  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
  }

  // Not authenticated - show login button
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      </Link>
    )
  }

  // Authenticated - show avatar with dropdown
  const userMetadata = user.user_metadata
  const displayName = userMetadata?.full_name || userMetadata?.name || user.email?.split('@')[0]
  const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture
  const email = user.email

  // Get initials for fallback
  const getInitials = (name: string | undefined) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-visible:ring-primary-500 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
          <Avatar className="hover:border-border h-8 w-8 cursor-pointer border-2 border-gray-200 transition-all dark:hover:border-gray-600">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info Section */}
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{displayName}</p>
            <p className="text-muted-foreground text-xs leading-none">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Navigation Items */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex cursor-pointer items-center">
            <Video className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/transformer" className="flex cursor-pointer items-center">
            <Video className="mr-2 h-4 w-4" />
            <span>Upload Video</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
