import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

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

      {/* Problem Section */}
      <section className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-primary-600 text-base leading-7 font-semibold">
              Built for AI Creators
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              AI Videos Are Amazing, But...
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col">
                <dt className="text-2xl leading-7 font-bold text-gray-900 dark:text-gray-100">
                  ❌
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Platform watermarks ruin your professional presentation
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xl leading-7 font-bold text-gray-900 dark:text-gray-100">
                  ❌
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">AI videos often have quality artifacts and noise</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xl leading-7 font-bold text-gray-900 dark:text-gray-100">
                  ❌
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">Fixed aspect ratios don't work across all platforms</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xl leading-7 font-bold text-gray-900 dark:text-gray-100">
                  ❌
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">No easy way to add your own branding</p>
                </dd>
              </div>
            </dl>
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
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-primary-600 text-base leading-7 font-semibold">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
              Start Free, Pay As You Grow
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
            {/* Free Tier */}
            <div className="rounded-3xl p-8 ring-1 ring-gray-200 sm:p-10 dark:ring-gray-800">
              <h3 className="text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                Free
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  $0
                </span>
              </p>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
                Try ReelVan risk-free
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                <li className="flex gap-x-3">
                  <span>✓ 1 video per day</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Max 30 seconds</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ 1080p quality</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ All core features</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="text-primary-600 ring-primary-200 hover:ring-primary-300 mt-8 block rounded-md px-3 py-2 text-center text-sm leading-6 font-semibold ring-1 ring-inset"
              >
                Start free
              </Link>
            </div>

            {/* Pay-as-you-go */}
            <div className="bg-primary-600 relative rounded-3xl p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
              <h3 className="text-base leading-7 font-semibold text-white">Pay-as-you-go</h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-white">~$0.07</span>
                <span className="text-base leading-7 font-semibold text-gray-100">/second</span>
              </p>
              <p className="mt-6 text-base leading-7 text-gray-100">Perfect for active creators</p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-white">
                <li className="flex gap-x-3">
                  <span>✓ No daily limits</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Up to 2 minutes per video</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ 4K quality</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ No ReelVan watermark</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Buy credits anytime</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="text-primary-600 mt-8 block rounded-md bg-white px-3 py-2 text-center text-sm leading-6 font-semibold shadow-sm hover:bg-gray-50"
              >
                Buy credits
              </Link>
            </div>

            {/* Pro Subscription */}
            <div className="rounded-3xl p-8 ring-1 ring-gray-200 sm:p-10 dark:ring-gray-800">
              <h3 className="text-base leading-7 font-semibold text-gray-900 dark:text-gray-100">
                Pro
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  $29
                </span>
                <span className="text-base leading-7 font-semibold text-gray-600 dark:text-gray-400">
                  /month
                </span>
              </p>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
                Best value for professionals
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                <li className="flex gap-x-3">
                  <span>✓ 500 credits included</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ 20% discount on extras</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Priority processing</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Saved templates</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Email support</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="text-primary-600 ring-primary-200 hover:ring-primary-300 mt-8 block rounded-md px-3 py-2 text-center text-sm leading-6 font-semibold ring-1 ring-inset"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-primary-600 text-lg leading-8 font-semibold tracking-tight">
              Trusted by AI creators
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Join thousands enhancing their AI videos
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col rounded-2xl bg-white p-8 dark:bg-gray-900">
              <div className="flex items-center gap-x-4">
                <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                  JD
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">John Doe</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Content Creator</div>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
                "ReelVan saved me hours of manual editing. The watermark removal is flawless and the
                quality enhancement made my Sora videos look incredible. Highly recommend!"
              </p>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-8 dark:bg-gray-900">
              <div className="flex items-center gap-x-4">
                <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Sarah Miller</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Marketing Professional
                  </div>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
                "The aspect ratio converter is a game-changer. I can now repurpose AI videos for all
                our social channels in minutes. The pricing is fair and transparent."
              </p>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-8 dark:bg-gray-900">
              <div className="flex items-center gap-x-4">
                <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                  MK
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Mike Kim</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Video Producer</div>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
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
