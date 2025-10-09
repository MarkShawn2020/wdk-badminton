import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { PricingPreview } from '@/components/pricing/PricingPreview'

export default function Home({ posts }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">
              Share Your AI Video
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Transform AI-generated videos into professional, share-ready content. Remove
              watermarks from Sora, Veo, Kling & JiMeng. Enhance quality, change aspect ratios, add
              custom branding.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/enhance"
                className="bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Enhance Your Video
              </Link>
              <Link
                href="#features"
                className="text-base leading-7 font-semibold text-gray-900 dark:text-gray-100"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Video Demo Placeholder */}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-gray-100/5 dark:ring-gray-100/10">
              <div className="aspect-video overflow-hidden rounded-md bg-gray-900 shadow-2xl ring-1 ring-gray-900/10">
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">Video Demo Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-primary-600 text-base leading-7 font-semibold">
              Everything You Need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              ReelVan Transforms Your AI Videos
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              All-in-one platform designed specifically for AI-generated video content. Process your
              videos in minutes, not hours.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">🎬</span>
                  </div>
                  Watermark Removal
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Automatically detect and remove watermarks from Sora, Veo, Kling, JiMeng, and
                    other AI platforms. Get clean, professional videos.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">✨</span>
                  </div>
                  Quality Enhancement
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Upscale to 4K, reduce noise, fix artifacts, and enhance colors. AI-powered
                    processing makes your videos look stunning.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">📐</span>
                  </div>
                  Aspect Ratio Conversion
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Smart cropping for 16:9, 9:16 Stories, 1:1 Square, and 4:5 Feed. Optimized for
                    YouTube, TikTok, Instagram, and more.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">🎨</span>
                  </div>
                  Custom Branding
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Add your own logo or watermark. Full control over position, size, and opacity.
                    Save templates for reuse.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">⚡</span>
                  </div>
                  Fast Processing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Cloud-based processing with real-time status updates. Most videos done in under
                    5 minutes. No software to install.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">💳</span>
                  </div>
                  Pay As You Go
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    No subscriptions required. Buy credits when you need them. Free tier available
                    to try. Only pay for what you process.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-primary-600 text-base leading-7 font-semibold">Simple Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              From Upload to Download in Minutes
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <dt className="text-primary-600 text-5xl font-bold">1</dt>
                <dd className="mt-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Upload Video
                  </p>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Drag and drop your AI-generated video. MP4, MOV, WebM supported. Up to 2
                    minutes.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="text-primary-600 text-5xl font-bold">2</dt>
                <dd className="mt-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Select Features
                  </p>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Choose watermark removal, quality enhancement, aspect ratio, and custom
                    branding.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="text-primary-600 text-5xl font-bold">3</dt>
                <dd className="mt-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    We Process
                  </p>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Our AI does the work. Watch real-time progress. Typically completes in 2-5
                    minutes.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="text-primary-600 text-5xl font-bold">4</dt>
                <dd className="mt-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Download</p>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Download your enhanced video. Compare before/after. Share anywhere.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <PricingPreview />

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-primary-600 text-base leading-7 font-semibold tracking-tight sm:text-lg sm:leading-8">
              Trusted by AI creators
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
              Join thousands enhancing their AI videos
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:mt-16 sm:gap-8 xl:mx-0 xl:max-w-none xl:grid-cols-3">
            <div className="flex flex-col rounded-2xl bg-white p-6 sm:p-8 dark:bg-gray-900">
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                  JD
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 sm:text-base dark:text-gray-100">
                    John Doe
                  </div>
                  <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                    AI Content Creator
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 sm:mt-6 sm:text-base sm:leading-7 dark:text-gray-400">
                "ReelVan saved me hours of manual editing. The watermark removal is flawless and the
                quality enhancement made my Sora videos look incredible. Highly recommend!"
              </p>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-6 sm:p-8 dark:bg-gray-900">
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                  SM
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 sm:text-base dark:text-gray-100">
                    Sarah Miller
                  </div>
                  <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                    Marketing Professional
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 sm:mt-6 sm:text-base sm:leading-7 dark:text-gray-400">
                "The aspect ratio converter is a game-changer. I can now repurpose AI videos for all
                our social channels in minutes. The pricing is fair and transparent."
              </p>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-6 sm:p-8 dark:bg-gray-900">
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                  MK
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 sm:text-base dark:text-gray-100">
                    Mike Kim
                  </div>
                  <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                    Video Producer
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 sm:mt-6 sm:text-base sm:leading-7 dark:text-gray-400">
                "Finally, a tool built specifically for AI videos! The quality is top-notch and
                processing is lightning fast. This is exactly what I needed for my workflow."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Ready to transform your AI videos?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              Start with our free tier. No credit card required. Process your first video in under 5
              minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Get started for free
              </Link>
              <Link
                href="/pricing"
                className="text-base leading-7 font-semibold text-gray-900 dark:text-gray-100"
              >
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
