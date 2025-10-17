import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { WorkspaceMobileNav } from '@/components/workspace/WorkspaceMobileNav'

/**
 * Workspace Layout - Protected route group for authenticated users
 *
 * Features:
 * - Sidebar navigation with credit display
 * - Top header with search and notifications
 * - Mobile-responsive bottom navigation
 * - Automatic auth check and redirect
 */
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  // Check authentication
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user credits
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  const credits = profile?.credits || 0

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <WorkspaceSidebar credits={credits} userEmail={user.email || ''} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <WorkspaceHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Navigation - Bottom */}
      <WorkspaceMobileNav credits={credits} />
    </div>
  )
}
