import { MetadataRoute } from 'next'
import { source } from '@/lib/source'
import siteMetadata from '@/data/siteMetadata'
import type { BlogPageData } from '@/types/content'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  // Get all blog posts dynamically
  const blogRoutes = source.getPages().map((post) => {
    const postData = post.data as unknown as BlogPageData
    return {
      url: `${siteUrl}${post.url}`,
      lastModified: postData.date || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  // Core pages with highest priority - these appear in Sitelinks
  const corePages = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0, // Homepage
    },
    {
      url: `${siteUrl}/transformer`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.95, // Core product feature
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // High priority conversion page
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8, // SEO content hub
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8, // Documentation
    },
    {
      url: `${siteUrl}/discover`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ]

  // Secondary pages
  const secondaryPages = [
    'about',
    'terms',
    'privacy',
    'refund',
    'signup',
    'dashboard',
    'projects',
    'tags',
  ].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...corePages, ...secondaryPages, ...blogRoutes]
}
