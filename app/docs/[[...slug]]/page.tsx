import { docs } from '@/lib/source'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug)

  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return docs.getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug)

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
