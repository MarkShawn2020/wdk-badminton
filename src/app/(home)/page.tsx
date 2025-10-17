import { source } from '@/lib/source'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Main from './Main'
import type { BlogPageData } from '@/types/content'

/**
 * Homepage - Smart routing based on authentication
 *
 * - Authenticated users → Redirect to /workspace/dashboard
 * - Anonymous users → Show landing page
 */
export default async function Page() {
  // Check if user is authenticated
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect authenticated users to workspace
  if (user) {
    redirect('/workspace/dashboard')
  }

  // Show landing page for anonymous users
  const posts = source.getPages().map((page) => {
    const pageData = page.data as unknown as BlogPageData
    return {
      slug: page.url.replace('/blog/', ''),
      date: pageData.date || new Date().toISOString(),
      title: pageData.title,
      summary: pageData.description,
      tags: pageData.tags || [],
      images: [],
      draft: false,
    }
  })

  // Sort by date descending
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return <Main posts={sortedPosts} />
}
