import { source, authorsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PostLayout from '@/layouts/PostLayout'
import type { CoreContent, Blog, BlogPageData, AuthorPageData } from '@/types/content'

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const page = source.getPage([params.slug])

  if (!page) notFound()

  const pageData = page.data as unknown as BlogPageData
  const MDX = pageData.body

  // Get author details
  const authorList = pageData.authors || ['default']
  const authorDetails = authorList
    .map((authorSlug) => {
      const authorData = authorsSource.getPage([authorSlug])
      if (!authorData) return undefined
      const data = authorData.data as unknown as AuthorPageData
      return {
        slug: authorSlug,
        name: data.name,
        title: data.title,
        avatar: data.avatar,
        occupation: data.occupation,
        company: data.company,
        email: data.email,
        twitter: data.twitter,
        linkedin: data.linkedin,
        github: data.github,
      }
    })
    .filter((author) => author !== undefined)

  // Transform page data to match PostLayout expectations
  const content: CoreContent<Blog> = {
    path: page.url,
    slug: params.slug,
    date: pageData.date || new Date().toISOString(),
    title: pageData.title,
    tags: pageData.tags || [],
    summary: pageData.description || '',
    images: pageData.images || [],
    draft: pageData.draft || false,
  }

  // Get all posts for prev/next navigation
  const allPosts = source.getPages().sort((a, b) => {
    const aData = a.data as unknown as BlogPageData
    const bData = b.data as unknown as BlogPageData
    return new Date(bData.date || 0).getTime() - new Date(aData.date || 0).getTime()
  })

  const postIndex = allPosts.findIndex((p) => p.url === page.url)
  const prev =
    postIndex > 0
      ? {
          path: allPosts[postIndex - 1].url,
          title: (allPosts[postIndex - 1].data as unknown as BlogPageData).title,
        }
      : undefined
  const next =
    postIndex < allPosts.length - 1
      ? {
          path: allPosts[postIndex + 1].url,
          title: (allPosts[postIndex + 1].data as unknown as BlogPageData).title,
        }
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
