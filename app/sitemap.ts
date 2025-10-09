import { MetadataRoute } from 'next'
import { source } from '@/lib/source'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = source.getPages().map((post) => ({
    url: `${siteUrl}${post.url}`,
    lastModified: post.data.date || new Date().toISOString(),
  }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
