import { source } from '@/lib/source'
import Main from './Main'

export default async function Page() {
  const posts = source.getPages().map((page) => ({
    slug: page.url.replace('/blog/', ''),
    date: page.data.date || new Date().toISOString(),
    title: page.data.title,
    summary: page.data.description,
    tags: page.data.tags || [],
    images: [],
    draft: false,
  }))

  // Sort by date descending
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return <Main posts={sortedPosts} />
}
