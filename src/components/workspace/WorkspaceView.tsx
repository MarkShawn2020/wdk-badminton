import { WorkspaceSidebar } from './WorkspaceSidebar'
import { WorkspaceHeader } from './WorkspaceHeader'
import { WorkspaceMobileNav } from './WorkspaceMobileNav'
import DashboardPage from '@/app/(workspace)/workspace/dashboard/page'

/**
 * WorkspaceView - Complete workspace layout with dashboard
 *
 * This is a reusable component that renders the full workspace experience:
 * - Sidebar navigation (desktop)
 * - Top header with search/notifications
 * - Dashboard content
 * - Bottom navigation (mobile)
 *
 * Used by homepage to show workspace at "/" for authenticated users
 */

interface WorkspaceViewProps {
  credits: number
  userEmail: string
}

export function WorkspaceView({ credits, userEmail }: WorkspaceViewProps) {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <WorkspaceSidebar credits={credits} userEmail={userEmail} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <WorkspaceHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <DashboardPage />
        </main>
      </div>

      {/* Mobile Navigation - Bottom */}
      <WorkspaceMobileNav credits={credits} userEmail={userEmail} />
    </div>
  )
}
