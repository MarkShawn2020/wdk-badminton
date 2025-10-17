'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Upload, Video, CreditCard, MoreHorizontal } from 'lucide-react'
import { formatCredits } from '@/lib/video/cost'

/**
 * Mobile Bottom Navigation - Responsive navigation for mobile devices
 *
 * Shows 5 main actions:
 * - Home
 * - Upload (primary action)
 * - My Videos
 * - Credits
 * - More (settings, help, etc.)
 */

interface MobileNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: MobileNavItem[] = [
  { label: 'Home', href: '/workspace/dashboard', icon: Home },
  { label: 'Upload', href: '/workspace/upload', icon: Upload },
  { label: 'Videos', href: '/workspace/videos', icon: Video },
  { label: 'Credits', href: '/workspace/credits', icon: CreditCard },
  { label: 'More', href: '/workspace/settings', icon: MoreHorizontal },
]

interface WorkspaceMobileNavProps {
  credits: number
}

export function WorkspaceMobileNav({ credits }: WorkspaceMobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t lg:hidden">
      <div className="safe-bottom flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
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
      </div>
    </nav>
  )
}
