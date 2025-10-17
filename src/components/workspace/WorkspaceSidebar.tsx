'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/components/ui/button'
import { Separator } from '@/components/components/ui/separator'
import { ScrollArea } from '@/components/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/components/ui/dropdown-menu'
import {
  Home,
  Upload,
  Video,
  Share2,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react'
import { formatCredits } from '@/lib/video/cost'
import { createClient } from '@/lib/supabase/client'

/**
 * Workspace Sidebar - Main navigation for authenticated users
 *
 * Follows ChatGPT/Claude-style left sidebar pattern:
 * - Primary actions at top
 * - Navigation items
 * - Credit balance (always visible)
 * - Secondary actions at bottom
 */

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/workspace/dashboard', icon: Home },
  { label: 'My Videos', href: '/workspace/videos', icon: Video },
  { label: 'Social Hub', href: '/workspace/social', icon: Share2, badge: 'Soon' },
]

const bottomNavItems: NavItem[] = [
  { label: 'Settings', href: '/workspace/settings', icon: Settings },
  { label: 'Help', href: '/docs', icon: HelpCircle },
]

interface WorkspaceSidebarProps {
  credits: number
  userEmail: string
}

export function WorkspaceSidebar({ credits, userEmail }: WorkspaceSidebarProps) {
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
    <aside className="bg-muted/10 hidden w-60 flex-col border-r lg:flex">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            R
          </div>
          <span className="text-lg">ReelVan</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Primary CTA - New Video */}
        <Link href="/workspace/upload" className="mb-4 block">
          <Button className="w-full gap-2 font-semibold" size="lg">
            <Upload className="h-4 w-4" />
            New Video
          </Button>
        </Link>

        <Separator className="my-4" />

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-secondary font-medium'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4" />

        {/* Credits Section */}
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Credits</span>
            <span
              className={cn(
                'text-xl font-bold',
                credits < 100 && 'text-destructive',
                credits >= 100 && credits < 500 && 'text-yellow-600',
                credits >= 500 && 'text-green-600'
              )}
            >
              {formatCredits(credits)}
            </span>
          </div>
          <p className="text-muted-foreground mb-3 text-xs">
            ≈ {Math.floor(credits / 150)} videos remaining
          </p>
          <Link href="/workspace/credits" className="block">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <CreditCard className="h-3 w-3" />
              Buy More
            </Button>
          </Link>
        </div>

        <Separator className="my-4" />

        {/* Bottom Navigation */}
        <nav className="space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-secondary font-medium'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3"
              aria-label="Open account menu"
            >
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                {getInitial(userEmail)}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-medium">{userEmail}</p>
                <p className="text-muted-foreground text-xs">Account</p>
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56" side="top">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{userEmail}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {formatCredits(credits)} credits
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/workspace/settings" className="flex cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/docs" className="flex cursor-pointer items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
