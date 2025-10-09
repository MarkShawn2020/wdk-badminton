import { source, authorsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PostLayout from '@/layouts/PostLayout'
import type { CoreContent, Blog } from '@/types/content'

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const page = source.getPage([params.slug])

  if (!page) notFound()

  const MDX = page.data.body

  // Get author details
  const authorList = page.data.authors || ['default']
  const authorDetails = authorList
    .map((author) => {
      const authorData = authorsSource.getPage([author])
      return authorData?.data
    })
    .filter(
      (author): author is NonNullable<typeof author> => author !== null && author !== undefined
    )

  // Transform page data to match PostLayout expectations
  const content: CoreContent<Blog> = {
    filePath: page.file.path,
    path: page.url,
    slug: params.slug,
    date: page.data.date || new Date().toISOString(),
    title: page.data.title,
    tags: page.data.tags || [],
    summary: page.data.description || '',
    images: page.data.images || [],
    draft: page.data.draft || false,
  }

  // Get all posts for prev/next navigation
  const allPosts = source
    .getPages()
    .sort((a, b) => new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime())

  const postIndex = allPosts.findIndex((p) => p.url === page.url)
  const prev =
    postIndex > 0
      ? { path: allPosts[postIndex - 1].url, title: allPosts[postIndex - 1].data.title }
      : undefined
  const next =
    postIndex < allPosts.length - 1
      ? { path: allPosts[postIndex + 1].url, title: allPosts[postIndex + 1].data.title }
      : undefined

  return (
    <PostLayout content={content} authorDetails={authorDetails} next={next} prev={prev}>
      <MDX />
    </PostLayout>
  )
}

export async function generateStaticParams() {
  return source.generateParams().map((param) => ({
    slug: param.slug?.[0] || '',
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage([params.slug])

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
