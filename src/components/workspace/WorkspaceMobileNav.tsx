'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Upload, Video, CreditCard, User, LogOut, Settings, HelpCircle } from 'lucide-react'
import { formatCredits } from '@/lib/video/cost'
import { createClient } from '@/lib/supabase/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/components/ui/sheet'
import { Button } from '@/components/components/ui/button'
import { Separator } from '@/components/components/ui/separator'

/**
 * Mobile Bottom Navigation - Responsive navigation for mobile devices
 *
 * Shows 5 main actions:
 * - Home
 * - Upload (primary action)
 * - My Videos
 * - Credits
 * - Account (with logout)
 */

interface MobileNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: MobileNavItem[] = [
  { label: 'Home', href: '/workspace/dashboard', icon: Home },
  { label: 'Upload', href: '/workspace/upload', icon: Upload },
  { label: 'Videos', href: '/workspace/videos', icon: Video },
  { label: 'Credits', href: '/workspace/credits', icon: CreditCard },
]

interface WorkspaceMobileNavProps {
  credits: number
  userEmail: string
}

export function WorkspaceMobileNav({ credits, userEmail }: WorkspaceMobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'local' })
    router.push('/')
    router.refresh()
  }

  // Get first character safely
  const getInitial = (email: string) => {
    return email && email.length > 0 ? email[0].toUpperCase() : '?'
  }

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t lg:hidden">
      <div className="safe-bottom flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isUpload = item.label === 'Upload'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors',
                isActive && 'bg-secondary',
                !isActive && 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isUpload && 'text-primary',
                    isActive && !isUpload && 'text-foreground'
                  )}
                />
                {/* Show credit count badge on Credits icon */}
                {item.label === 'Credits' && (
                  <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-medium">
                    {credits < 1000 ? credits : '999+'}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive && 'text-foreground',
                  isUpload && 'text-primary'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Account Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors',
                pathname.includes('settings') && 'bg-secondary',
                !pathname.includes('settings') && 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Open account menu"
            >
              <div className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                {getInitial(userEmail)}
              </div>
              <span className="text-xs font-medium">Account</span>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Account</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* User Info */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-muted-foreground text-xs">
                  {formatCredits(credits)} credits remaining
                </p>
              </div>

              <Separator />

              {/* Menu Items */}
              <div className="space-y-2">
                <Link href="/workspace/settings" className="block">
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>

                <Link href="/docs" className="block">
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </Button>
                </Link>

                <Separator />

                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start gap-3"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
