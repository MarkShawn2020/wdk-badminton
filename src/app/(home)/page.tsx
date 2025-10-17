import { source } from '@/lib/source'
import Main from './Main'
import type { BlogPageData } from '@/types/content'

/**
 * Homepage - Landing page content
 *
 * Note: This component is ONLY rendered for anonymous users.
 * Authenticated users never reach this component because the Layout
 * intercepts and renders WorkspaceView directly.
 *
 * This elegant design means:
 * - No auth check needed here
 * - No conditional rendering
 * - Single responsibility: render landing page
 */
export default async function Page() {
  // Fetch blog posts for landing page
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
