import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Pricing - ReelVan',
  description:
    'Transparent pricing for AI video enhancement. Free tier available, pay-as-you-go for flexibility, or subscribe for the best value.',
})

export default function Pricing() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Pricing
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Start free, pay as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="py-16">
          {/* Pricing comparison */}
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Free Tier */}
              <div className="flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Free</h3>
                  <p className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      $0
                    </span>
                  </p>
                  <p className="mt-6 text-base text-gray-500 dark:text-gray-400">
                    Perfect for trying out ReelVan
                  </p>

                  <ul className="mt-8 space-y-4">
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">1 video per day</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Maximum 30 seconds per video
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">1080p quality max</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">All core features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-gray-400">−</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ReelVan watermark on output
                      </span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="mt-8 block rounded-lg bg-gray-50 px-4 py-3 text-center text-base font-semibold text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Get started
                </Link>
              </div>

              {/* Pay-as-you-go - Highlighted */}
              <div className="bg-primary-600 relative flex flex-col rounded-3xl p-8 shadow-2xl ring-1 ring-gray-900/10">
                <div className="bg-primary-700 absolute -top-5 right-0 left-0 mx-auto w-32 rounded-full px-3 py-2 text-center text-sm font-semibold text-white">
                  Most Popular
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Pay-as-you-go</h3>
                  <p className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight text-white">~$0.07</span>
                    <span className="ml-1 text-xl text-gray-100">/second</span>
                  </p>
                  <p className="mt-6 text-base text-gray-100">Perfect for active creators</p>

                  <ul className="mt-8 space-y-4">
                    <li className="flex items-start">
                      <span className="mr-3 text-white">✓</span>
                      <span className="text-white">No daily limits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-white">✓</span>
                      <span className="text-white">Up to 2 minutes per video</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-white">✓</span>
                      <span className="text-white">4K quality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-white">✓</span>
                      <span className="text-white">No ReelVan watermark</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-white">✓</span>
                      <span className="text-white">Buy credits anytime</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-white">✓</span>
                      <span className="text-white">7-day file retention</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="text-primary-600 mt-8 block rounded-lg bg-white px-4 py-3 text-center text-base font-semibold hover:bg-gray-50"
                >
                  Buy credits
                </Link>
              </div>

              {/* Pro Subscription */}
              <div className="flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pro</h3>
                  <p className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      $29
                    </span>
                    <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">/month</span>
                  </p>
                  <p className="mt-6 text-base text-gray-500 dark:text-gray-400">
                    Best value for professionals
                  </p>

                  <ul className="mt-8 space-y-4">
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        500 credits included (~70 seconds)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        20% discount on additional credits
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Priority processing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        30-day file retention
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Saved templates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Email support</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="bg-primary-600 hover:bg-primary-700 mt-8 block rounded-lg px-4 py-3 text-center text-base font-semibold text-white"
                >
                  Subscribe
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Frequently Asked Questions
              </h2>
              <dl className="mt-10 space-y-8">
                <div>
                  <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    How does the credit system work?
                  </dt>
                  <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Credits are used to process videos. 1 credit = $0.01. Processing cost is based
                    on video duration: approximately 7 credits per second (~$0.07/second). For
                    example, a 60-second video costs about 420 credits ($4.20).
                  </dd>
                </div>
                <div>
                  <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Do credits expire?
                  </dt>
                  <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    No, purchased credits never expire. Use them whenever you need to process
                    videos.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Can I cancel my Pro subscription?
                  </dt>
                  <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Yes, you can cancel anytime. You'll continue to have Pro access until the end of
                    your billing period. Unused credits remain in your account.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    What payment methods do you accept?
                  </dt>
                  <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    We accept all major credit cards (Visa, Mastercard, American Express) through
                    Stripe. Your payment information is secure and encrypted.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Is there a refund policy?
                  </dt>
                  <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    If you're not satisfied with the quality of processing, contact us within 24
                    hours of processing for a full refund. We stand behind our service quality.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Do you offer enterprise or team plans?
                  </dt>
                  <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Yes! For teams processing 50+ videos per month, we offer custom enterprise plans
                    with volume discounts, dedicated support, and API access. Contact us at
                    enterprise@reelvan.com for details.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
