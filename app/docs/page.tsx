import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Documentation - ReelVan',
  description:
    'Complete documentation and guides for using ReelVan to enhance your AI-generated videos.',
})

interface DocItem {
  title: string
  description: string
  href: string
  imgSrc?: string
}

const docsData: DocItem[] = [
  {
    title: 'Getting Started',
    description:
      'Learn the basics of ReelVan. Create your account, upload your first video, and start enhancing your AI-generated content in minutes.',
    href: '/docs/getting-started',
    imgSrc: '/static/images/docs/getting-started.png',
  },
  {
    title: 'Watermark Removal',
    description:
      'Comprehensive guide to removing watermarks from Sora, Veo, Kling, JiMeng, and other AI video platforms. Automatic detection and manual options.',
    href: '/docs/watermark-removal',
    imgSrc: '/static/images/docs/watermark.png',
  },
  {
    title: 'Quality Enhancement',
    description:
      'Upscale your videos to 4K, reduce noise, fix artifacts, and enhance colors. Learn about quality presets and when to use each option.',
    href: '/docs/quality-enhancement',
    imgSrc: '/static/images/docs/quality.png',
  },
  {
    title: 'Aspect Ratio Conversion',
    description:
      'Convert videos for different platforms: 16:9 for YouTube, 9:16 for Stories, 1:1 for Square, 4:5 for Feed. Smart cropping and manual controls.',
    href: '/docs/aspect-ratio',
    imgSrc: '/static/images/docs/aspect-ratio.png',
  },
  {
    title: 'Custom Watermarks',
    description:
      'Add your own branding to processed videos. Upload logos, control position and opacity, and save templates for future use.',
    href: '/docs/custom-watermarks',
    imgSrc: '/static/images/docs/watermark-custom.png',
  },
  {
    title: 'Pricing & Credits',
    description:
      'Understand how credits work, pricing structure, and how to maximize value. Learn about free tier limits and subscription benefits.',
    href: '/docs/pricing',
    imgSrc: '/static/images/docs/pricing.png',
  },
  {
    title: 'API Documentation',
    description:
      'Integrate ReelVan into your workflow with our API. Authentication, endpoints, rate limits, and code examples for developers.',
    href: '/docs/api',
    imgSrc: '/static/images/docs/api.png',
  },
  {
    title: 'Troubleshooting',
    description:
      'Common issues and solutions. Upload errors, processing failures, quality problems, and how to get support when you need help.',
    href: '/docs/troubleshooting',
    imgSrc: '/static/images/docs/troubleshooting.png',
  },
  {
    title: 'Best Practices',
    description:
      'Tips and tricks for getting the best results. Optimal video formats, quality settings, processing workflows, and cost optimization.',
    href: '/docs/best-practices',
    imgSrc: '/static/images/docs/best-practices.png',
  },
]

export default function Docs() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Documentation
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Everything you need to know about using ReelVan to enhance your AI-generated videos.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {docsData.map((doc) => (
              <Card
                key={doc.title}
                title={doc.title}
                description={doc.description}
                imgSrc={doc.imgSrc}
                href={doc.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
