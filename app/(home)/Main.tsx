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
            <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl">
              Share Your AI Video
            </h1>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
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
              <Link href="#features" className="text-foreground text-base leading-7 font-semibold">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* How It Works - Visual Process */}
          <div className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-5xl">
              <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="bg-primary-600 relative flex h-20 w-20 items-center justify-center rounded-full shadow-xl ring-4 ring-white/20">
                      <span className="text-3xl font-bold text-white">1</span>
                      <div className="bg-primary-600/20 absolute inset-0 rounded-full blur-lg"></div>
                    </div>
                    <div className="bg-primary-600/20 absolute top-1/2 left-[calc(50%+2.5rem)] hidden h-0.5 w-[calc(100%+4rem)] -translate-y-1/2 lg:block"></div>
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-semibold">Upload Video</p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Drag and drop your AI video
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="bg-primary-600 relative flex h-20 w-20 items-center justify-center rounded-full shadow-xl ring-4 ring-white/20">
                      <span className="text-3xl font-bold text-white">2</span>
                      <div className="bg-primary-600/20 absolute inset-0 rounded-full blur-lg"></div>
                    </div>
                    <div className="bg-primary-600/20 absolute top-1/2 left-[calc(50%+2.5rem)] hidden h-0.5 w-[calc(100%+4rem)] -translate-y-1/2 lg:block"></div>
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-semibold">Select Features</p>
                    <p className="text-muted-foreground mt-2 text-sm">Choose enhancements</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="bg-primary-600 relative flex h-20 w-20 items-center justify-center rounded-full shadow-xl ring-4 ring-white/20">
                      <span className="text-3xl font-bold text-white">3</span>
                      <div className="bg-primary-600/20 absolute inset-0 rounded-full blur-lg"></div>
                    </div>
                    <div className="bg-primary-600/20 absolute top-1/2 left-[calc(50%+2.5rem)] hidden h-0.5 w-[calc(100%+4rem)] -translate-y-1/2 lg:block"></div>
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-semibold">We Process</p>
                    <p className="text-muted-foreground mt-2 text-sm">AI works in 2-5 minutes</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="bg-primary-600 relative flex h-20 w-20 items-center justify-center rounded-full shadow-xl ring-4 ring-white/20">
                      <span className="text-3xl font-bold text-white">4</span>
                      <div className="bg-primary-600/20 absolute inset-0 rounded-full blur-lg"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-semibold">Download</p>
                    <p className="text-muted-foreground mt-2 text-sm">Get enhanced video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center" style={{ width: '100%' }}>
            <h2
              className="text-primary-600 text-base leading-7 font-semibold"
              style={{ width: '100%', display: 'block' }}
            >
              Everything You Need
            </h2>
            <p
              className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ width: '100%', display: 'block' }}
            >
              ReelVan Transforms Your AI Videos
            </p>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              All-in-one platform designed specifically for AI-generated video content. Process your
              videos in minutes, not hours.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">🎬</span>
                  </div>
                  Watermark Removal
                </dt>
                <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">
                    Automatically detect and remove watermarks from Sora, Veo, Kling, JiMeng, and
                    other AI platforms. Get clean, professional videos.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">✨</span>
                  </div>
                  Quality Enhancement
                </dt>
                <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">
                    Upscale to 4K, reduce noise, fix artifacts, and enhance colors. AI-powered
                    processing makes your videos look stunning.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">📐</span>
                  </div>
                  Aspect Ratio Conversion
                </dt>
                <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">
                    Smart cropping for 16:9, 9:16 Stories, 1:1 Square, and 4:5 Feed. Optimized for
                    YouTube, TikTok, Instagram, and more.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">🎨</span>
                  </div>
                  Custom Branding
                </dt>
                <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">
                    Add your own logo or watermark. Full control over position, size, and opacity.
                    Save templates for reuse.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">⚡</span>
                  </div>
                  Fast Processing
                </dt>
                <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">
                    Cloud-based processing with real-time status updates. Most videos done in under
                    5 minutes. No software to install.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                  <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span className="text-xl text-white">💳</span>
                  </div>
                  Pay As You Go
                </dt>
                <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
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

      {/* Pricing Preview Section */}
      <PricingPreview />

      {/* Social Proof Section */}
      <section className="bg-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center" style={{ minWidth: '100%', width: '100%' }}>
            <h2
              className="text-primary-600 text-base leading-7 font-semibold tracking-tight sm:text-lg sm:leading-8"
              style={{ width: '100%', display: 'block' }}
            >
              Trusted by AI creators
            </h2>
            <p
              className="text-foreground mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              style={{ width: '100%', display: 'block' }}
            >
              Join thousands enhancing their AI videos
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:mt-16 sm:gap-8 xl:mx-0 xl:max-w-none xl:grid-cols-3">
            <div className="bg-card flex flex-col rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                  JD
                </div>
                <div className="min-w-0">
                  <div className="text-foreground text-sm font-semibold sm:text-base">John Doe</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">AI Content Creator</div>
                </div>
              </div>
              <p className="text-muted-foreground mt-4 text-sm leading-6 sm:mt-6 sm:text-base sm:leading-7">
                "ReelVan saved me hours of manual editing. The watermark removal is flawless and the
                quality enhancement made my Sora videos look incredible. Highly recommend!"
              </p>
            </div>
            <div className="bg-card flex flex-col rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                  SM
                </div>
                <div className="min-w-0">
                  <div className="text-foreground text-sm font-semibold sm:text-base">
                    Sarah Miller
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    Marketing Professional
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mt-4 text-sm leading-6 sm:mt-6 sm:text-base sm:leading-7">
                "The aspect ratio converter is a game-changer. I can now repurpose AI videos for all
                our social channels in minutes. The pricing is fair and transparent."
              </p>
            </div>
            <div className="bg-card flex flex-col rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                  MK
                </div>
                <div className="min-w-0">
                  <div className="text-foreground text-sm font-semibold sm:text-base">Mike Kim</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">Video Producer</div>
                </div>
              </div>
              <p className="text-muted-foreground mt-4 text-sm leading-6 sm:mt-6 sm:text-base sm:leading-7">
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
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your AI videos?
            </h2>
            <p className="text-muted-foreground mx-auto mt-6 text-lg leading-8">
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
              <Link href="/pricing" className="text-foreground text-base leading-7 font-semibold">
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
