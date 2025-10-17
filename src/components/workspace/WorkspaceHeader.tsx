'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/components/ui/button'
import { Input } from '@/components/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/components/ui/dropdown-menu'
import { Badge } from '@/components/components/ui/badge'

/**
 * Workspace Header - Top navigation bar
 *
 * Features:
 * - Search functionality (for My Videos page)
 * - Notifications dropdown
 * - Hidden on mobile (uses bottom nav instead)
 */

export function WorkspaceHeader() {
  // TODO: Fetch real notifications from database
  const notifications = [
    {
      id: '1',
      title: 'Video processing complete',
      message: 'Your video "demo.mp4" is ready!',
      time: '2 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Credits added',
      message: 'You purchased 2000 credits',
      time: '1 hour ago',
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="hidden h-16 items-center justify-between border-b px-6 lg:flex">
      {/* Search Bar */}
      <div className="max-w-md flex-1">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="search" placeholder="Search videos..." className="pl-10" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <h3 className="mb-2 font-semibold">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">No notifications</p>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex cursor-pointer flex-col items-start gap-1 p-3"
                    >
                      <div className="flex w-full items-start justify-between">
                        <span className="text-sm font-medium">{notif.title}</span>
                        {!notif.read && <div className="bg-primary h-2 w-2 rounded-full" />}
                      </div>
                      <p className="text-muted-foreground text-xs">{notif.message}</p>
                      <span className="text-muted-foreground text-xs">{notif.time}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
