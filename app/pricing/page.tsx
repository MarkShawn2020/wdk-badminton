import { genPageMetadata } from 'app/seo'
import { PricingCard } from '@/components/pricing/PricingCard'
import { CouponInput } from '@/components/coupon/CouponInput'

export const metadata = genPageMetadata({
  title: 'Pricing - ReelVan',
  description:
    'Transparent pricing for AI video enhancement. Free tier available, pay-as-you-go for flexibility, or subscribe for the best value.',
})

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out ReelVan',
    features: [
      { text: '1 video per day', included: true },
      { text: 'Maximum 30 seconds per video', included: true },
      { text: '1080p quality max', included: true },
      { text: 'All core features', included: true },
      { text: 'ReelVan watermark on output', included: false },
    ],
    ctaText: 'Get started',
  },
  {
    name: 'Pay-as-you-go',
    price: '~$0.07',
    description: 'Perfect for active creators',
    highlighted: true,
    features: [
      { text: 'No daily limits', included: true },
      { text: 'Up to 2 minutes per video', included: true },
      { text: '4K quality', included: true },
      { text: 'No ReelVan watermark', included: true },
      { text: 'Buy credits anytime', included: true },
      { text: '7-day file retention', included: true },
    ],
    ctaText: 'Buy credits',
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Best value for professionals',
    features: [
      { text: '500 credits included (~70 seconds)', included: true },
      { text: '20% discount on additional credits', included: true },
      { text: 'Priority processing', included: true },
      { text: '30-day file retention', included: true },
      { text: 'Saved templates', included: true },
      { text: 'Email support', included: true },
    ],
    ctaText: 'Subscribe',
  },
]

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
          {/* Coupon Section */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8 dark:border-gray-800 dark:from-purple-950 dark:to-pink-950">
              <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                Have a Coupon Code?
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                Redeem your coupon to get free credits instantly
              </p>
              <CouponInput />
            </div>
          </div>

          {/* Pricing comparison */}
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <PricingCard key={tier.name} tier={tier} />
              ))}
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
