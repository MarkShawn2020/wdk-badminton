import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: readonly string[]
  image?: string
  noindex?: boolean
}

/**
 * Generate optimized metadata for better Google sitelinks
 *
 * Key SEO factors:
 * - Clear, descriptive titles (50-60 chars)
 * - Compelling descriptions (150-160 chars)
 * - Proper Open Graph tags
 * - Canonical URLs
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    keywords = [],
    image = siteMetadata.socialBanner,
    noindex = false,
  } = options

  const canonicalUrl = `${siteMetadata.siteUrl}${path}`
  const fullTitle = `${title} | ReelVan`

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'AI video', 'video enhancement', 'ReelVan'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'ReelVan',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Core pages that should appear in Google sitelinks
 * These must have:
 * 1. Clear, descriptive titles
 * 2. High priority in sitemap
 * 3. Prominent links from homepage
 * 4. BreadcrumbList structured data
 */
export const SITELINK_PAGES = {
  pricing: {
    title: 'Pricing - Simple & Transparent Plans',
    description:
      'Affordable AI video enhancement pricing. Pay-as-you-go credits starting at $2.99. Remove watermarks, enhance quality. 100 free credits for new users.',
    path: '/pricing',
    keywords: ['pricing', 'plans', 'credits', 'cost', 'video enhancement pricing'],
  },
  blog: {
    title: 'Blog - AI Video Tips & Tutorials',
    description:
      'Learn how to enhance AI-generated videos. Guides for Sora, Veo, Kling, and JiMeng videos. Watermark removal tutorials and video editing tips.',
    path: '/blog',
    keywords: ['blog', 'tutorials', 'guides', 'AI video tips', 'video enhancement'],
  },
  docs: {
    title: 'Documentation - How to Use ReelVan',
    description:
      'Complete ReelVan documentation. Learn how to remove watermarks, enhance video quality, change aspect ratios, and add custom branding.',
    path: '/docs',
    keywords: ['documentation', 'how to', 'user guide', 'tutorial', 'help'],
  },
  discover: {
    title: 'Discover - AI Video Examples & Showcase',
    description:
      'Discover amazing AI-generated videos enhanced with ReelVan. Browse examples from Sora, Veo, Kling, and JiMeng. Get inspiration for your projects.',
    path: '/discover',
    keywords: ['discover', 'examples', 'showcase', 'gallery', 'AI video examples'],
  },
  about: {
    title: 'About - ReelVan AI Video Enhancement Platform',
    description:
      'ReelVan helps creators transform AI-generated videos into professional, shareable content. Remove watermarks, enhance quality, and add branding.',
    path: '/about',
    keywords: ['about', 'company', 'mission', 'AI video platform'],
  },
  transformer: {
    title: 'Video Transformer - AI Video Enhancement Tool',
    description:
      'Transform your AI videos instantly. Remove watermarks, enhance quality to 4K, change aspect ratios. Upload and enhance videos in minutes.',
    path: '/transformer',
    keywords: ['transformer', 'video tool', 'enhance', 'upload', 'AI video editor'],
  },
} as const
