import { ReactNode } from 'react'
import type { Blog, Authors, CoreContent } from '@/types/content'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Script from 'next/script'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

// FAQ Schema generator for SEO
function generateFAQSchema(slug: string, title: string) {
  // FAQ data for each blog post
  const faqData: Record<string, Array<{ question: string; answer: string }>> = {
    'remove-sora-watermark': [
      {
        question: 'Is removing Sora watermarks legal?',
        answer:
          "Removing watermarks is legal if you own the content rights and comply with OpenAI's Terms of Service. Always ensure you have proper licensing for commercial use.",
      },
      {
        question: 'Will removing watermarks affect video quality?',
        answer:
          'With professional AI-powered services like ReelVan, quality is preserved or even enhanced. Manual methods may risk quality degradation if not done carefully.',
      },
      {
        question: 'How much does watermark removal cost?',
        answer:
          'Professional services like ReelVan cost $2-5 per video with pay-as-you-go pricing. Manual software ranges from $0-300 one-time or $12-50/month subscription. Free tools are available but require technical knowledge.',
      },
      {
        question: 'Can I batch process multiple Sora videos?',
        answer:
          'Yes! ReelVan supports batch processing for efficient workflow. Upload multiple videos and process them simultaneously.',
      },
      {
        question: "What's the typical processing time?",
        answer:
          'ReelVan processes videos in 5-10 minutes per video. Manual editing takes 1-4 hours per video. Other AI tools typically take 15-30 minutes per video.',
      },
      {
        question: 'Do I need to disclose AI-generated content?',
        answer:
          "While not always legally required, it's best practice to disclose AI-generated content in video descriptions, especially on platforms like YouTube and for commercial use.",
      },
    ],
    'remove-veo-watermark': [
      {
        question: 'Can I remove watermarks from Google Veo videos?',
        answer:
          'Yes, you can remove watermarks from Google Veo videos using professional services like ReelVan or manual editing tools, provided you own the content rights.',
      },
      {
        question: 'Is it legal to remove Veo watermarks?',
        answer:
          "It's legal if you created the video using your Veo account and comply with Google's Terms of Service. Always check the latest TOS before removing watermarks.",
      },
      {
        question: 'How long does Veo watermark removal take?',
        answer:
          'With ReelVan, the process takes 5-10 minutes per video. Manual editing with Adobe After Effects or similar tools can take 1-4 hours.',
      },
      {
        question: 'Will removing the watermark reduce video quality?',
        answer:
          'No, professional AI-powered watermark removal services like ReelVan preserve and can even enhance the original video quality through upscaling and denoising.',
      },
    ],
    'remove-kling-watermark': [
      {
        question: 'How do I remove Kling AI watermarks?',
        answer:
          'The easiest method is using AI-powered watermark removal services like ReelVan. Upload your Kling video, and the platform automatically detects and removes the watermark in minutes.',
      },
      {
        question: 'Is removing Kling watermarks legal?',
        answer:
          'Yes, if you generated the video using your own Kling account and comply with their Terms of Service. Always ensure you have commercial rights if using for business.',
      },
      {
        question: 'Can I remove Kling watermarks for free?',
        answer:
          'Free tools like Lama Cleaner exist but require technical setup. For beginners, services like ReelVan offer pay-as-you-go pricing starting at $2-5 per video with professional results.',
      },
      {
        question: 'What quality can I expect after watermark removal?',
        answer:
          'Professional services maintain or enhance original quality. ReelVan can upscale Kling videos to 4K while removing watermarks, ensuring no quality loss.',
      },
    ],
    'enhance-ai-video-quality': [
      {
        question: 'Can AI really enhance video quality?',
        answer:
          'Yes, modern AI video enhancement tools can upscale resolution, reduce noise, improve sharpness, and restore details in AI-generated videos, often achieving 4K quality from lower resolution sources.',
      },
      {
        question: 'How much does AI video enhancement cost?',
        answer:
          'Costs vary widely. ReelVan offers pay-as-you-go pricing at approximately $2-5 per video. Subscription services range from $12-95/month. One-time software purchases like Topaz Video AI cost around $299.',
      },
      {
        question: 'Will enhancement work on all AI video platforms?',
        answer:
          'Yes, AI video enhancement works on videos from Sora, Veo, Kling, JiMeng, and other AI video generators. The process is platform-agnostic and focuses on improving the underlying video data.',
      },
      {
        question: 'Can I enhance quality and remove watermarks simultaneously?',
        answer:
          'Yes! Services like ReelVan allow you to enhance video quality (upscaling, denoising) and remove watermarks in a single processing workflow, saving time and maintaining consistency.',
      },
    ],
  }

  const faqs = faqData[slug]
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return schema
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags } = content
  const basePath = path.split('/')[1] || 'blog' // Get 'blog' from '/blog/slug'
  const filePath = `content${path}.mdx` // Reconstruct filePath from path

  // Generate FAQ Schema for SEO
  const faqSchema = generateFAQSchema(slug, title)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      {/* FAQ Schema for SEO - Not visible to users */}
      {faqSchema && (
        <Script
          id={`faq-schema-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-muted-foreground text-base leading-6 font-medium">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author, index) => (
                    <li
                      className="flex items-center space-x-2"
                      key={author.slug || `author-${index}`}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-foreground">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter
                                .replace('https://twitter.com/', '@')
                                .replace('https://x.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose prose-lg dark:prose-invert selection:bg-primary-200 selection:text-primary-900 dark:selection:bg-primary-800 dark:selection:text-primary-100 max-w-none pt-10 pb-8">
                {children}
              </div>
              <div className="text-foreground pt-6 pb-6 text-sm">
                <Link href={discussUrl(path)} rel="nofollow">
                  Discuss on Twitter
                </Link>
                {` • `}
                <Link href={editUrl(filePath)}>View on GitHub</Link>
              </div>
              {siteMetadata.comments && (
                <div className="text-foreground pt-6 pb-6 text-center" id="comment">
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={prev.path}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={next.path}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
