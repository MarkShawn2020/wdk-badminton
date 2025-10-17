import { SearchProvider, SearchConfig } from 'pliny/search'
import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import { WorkspaceView } from '@/components/workspace/WorkspaceView'
import siteMetadata from '@/data/siteMetadata'

/**
 * Home Layout - Smart layout that adapts to authentication state
 *
 * This is the ONLY place that checks auth for the homepage.
 * Based on auth state, it either:
 * - Shows workspace (logged in) → No Header/Footer, renders WorkspaceView
 * - Shows landing page (anonymous) → Wraps children with Header/Footer
 *
 * Benefits:
 * - Single auth check (no redundancy)
 * - Clean separation of concerns
 * - No layout conflicts
 * - URL stays at "/"
 */
export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Authenticated users: Show workspace directly from layout
  if (user) {
    // Fetch user credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    const credits = profile?.credits || 0

    // Render workspace view (bypassing children/page component)
    return <WorkspaceView credits={credits} userEmail={user.email || ''} />
  }

  // Anonymous users: Wrap children (landing page) with Header + Footer
  return (
    <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
      <Header />
      <SectionContainer>
        <main className="mb-auto">{children}</main>
      </SectionContainer>
      <Footer />
    </SearchProvider>
  )
}
