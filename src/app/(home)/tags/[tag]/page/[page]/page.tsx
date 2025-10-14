import type { BlogPageData } from '@/types/content'
import { slug } from 'github-slugger'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { source } from '@/lib/source'
import tagData from '@/app/tag-data.json'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  return Object.keys(tagCounts).flatMap((tag) => {
    const postCount = tagCounts[tag]
    const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      tag: encodeURI(tag),
      page: (i + 1).toString(),
    }))
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const pageNumber = parseInt(params.page)

  // Get all posts filtered by tag and sort by date
  const filteredPosts = source
    .getPages()
    .filter((post) => {
      const postData = post.data as unknown as BlogPageData
      return postData.tags && postData.tags.map((t) => slug(t)).includes(tag)
    })
    .sort((a, b) => {
      const aData = a.data as unknown as BlogPageData
      const bData = b.data as unknown as BlogPageData
      return new Date(bData.date || 0).getTime() - new Date(aData.date || 0).getTime()
    })
    .map((post) => {
      const postData = post.data as unknown as BlogPageData
      return {
        slug: post.url.replace('/blog/', ''),
        date: postData.date || new Date().toISOString(),
        title: postData.title,
        summary: postData.description || '',
        tags: postData.tags || [],
        images: [],
        draft: false,
        path: post.url,
      }
    })

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
