import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { source } from '@/lib/source'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  return tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

  // Get all posts and filter by tag
  const allPosts = source
    .getPages()
    .filter((post) => post.data.tags && post.data.tags.map((t) => slug(t)).includes(tag))
    .sort((a, b) => new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime())
    .map((post) => ({
      slug: post.url.replace('/blog/', ''),
      date: post.data.date || new Date().toISOString(),
      title: post.data.title,
      summary: post.data.description || '',
      tags: post.data.tags || [],
      images: [],
      draft: false,
      path: post.url,
    }))

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = allPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={allPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
