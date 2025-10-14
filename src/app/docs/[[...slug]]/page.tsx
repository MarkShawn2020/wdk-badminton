import { docs } from '@/lib/source'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { notFound } from 'next/navigation'
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData'
import siteMetadata from '@/data/siteMetadata'

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const page = docs.getPage(slug)

  if (!page) notFound()

  const MDX = page.data.body

  // Build breadcrumb trail
  const breadcrumbItems = [
    { name: 'Home', url: siteMetadata.siteUrl },
    { name: 'Docs', url: `${siteMetadata.siteUrl}/docs` },
  ]

  if (slug && slug.length > 0) {
    let currentPath = '/docs'
    slug.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === slug.length - 1
      breadcrumbItems.push({
        name: isLast ? page.data.title : segment,
        url: `${siteMetadata.siteUrl}${currentPath}`,
      })
    })
  }

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsBody>
          <h1>{page.data.title}</h1>
          <MDX components={defaultMdxComponents} />
        </DocsBody>
      </DocsPage>
    </>
  )
}

export async function generateStaticParams() {
  return docs.getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const page = docs.getPage(slug)

  if (!page) notFound()

  const canonicalUrl = `${siteMetadata.siteUrl}/docs${slug ? `/${slug.join('/')}` : ''}`

  return {
    title: `${page.data.title} | ReelVan Docs`,
    description: page.data.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${page.data.title} | ReelVan Docs`,
      description: page.data.description,
      url: canonicalUrl,
      siteName: 'ReelVan',
      type: 'article',
    },
  }
}
