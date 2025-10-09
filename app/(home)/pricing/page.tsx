import { genPageMetadata } from 'app/seo'
import { PricingCard } from '@/components/pricing/PricingCard'
import { CouponInput } from '@/components/coupon/CouponInput'
import { creditPackages } from '@/data/pricingData'

export const metadata = genPageMetadata({
  title: 'Pricing - ReelVan',
  description:
    'Buy credits when you need them. No subscriptions, no monthly fees. Volume discounts up to 30% off. Start with 100 free credits.',
})

export default function Pricing() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Hero Section */}
        <div className="space-y-4 pt-6 pb-8 md:space-y-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl leading-8 text-gray-600 dark:text-gray-400">
            Buy credits when you need them. No subscriptions, no monthly fees.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Start with 100 free credits</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Credits never expire</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Volume discounts up to 30%</span>
            </div>
          </div>
        </div>

        <div className="py-16">
          {/* Credit Packages */}
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Choose Your Credit Package
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                1 credit = $0.01 • Typical 30s video ≈ 240 credits ($2.40)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {creditPackages.map((pkg) => (
                <PricingCard key={pkg.name} tier={pkg} />
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    1
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Buy Credits
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Purchase a credit package that fits your needs. Bigger packs = bigger savings.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    2
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Process Videos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload and enhance your videos. Credits are deducted based on video duration.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    3
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Buy More Anytime
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Credits never expire. Top up whenever you need more processing power.
                </p>
              </div>
            </div>
          </div>

          {/* Rate Limit Benefits */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
              Unlock Higher Limits with Purchases
            </h2>
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      How to Unlock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Daily Limit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-900">
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      Free User
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      Sign up (100 free credits)
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      3 videos/day
                    </td>
                  </tr>
                  <tr className="bg-primary-50 dark:bg-primary-950">
                    <td className="text-primary-700 dark:text-primary-300 px-6 py-4 text-sm font-medium">
                      Paid User ✨
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      Make any purchase
                    </td>
                    <td className="text-primary-600 dark:text-primary-400 px-6 py-4 text-sm font-bold">
                      50 videos/day
                    </td>
                  </tr>
                  <tr className="bg-purple-50 dark:bg-purple-950">
                    <td className="px-6 py-4 text-sm font-medium text-purple-700 dark:text-purple-300">
                      Pro User 🚀
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      $50+ lifetime purchases
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-purple-600 dark:text-purple-400">
                      200 videos/day
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              All users get the same features (4K quality, watermark removal, etc.). Limits are
              permanent - once unlocked, they stay forever.
            </p>
          </div>

          {/* Coupon Section */}
          <div className="mx-auto mt-24 max-w-2xl">
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

          {/* FAQ Section */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-8">
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  How does the credit system work?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Credits are used to process videos. 1 credit = $0.01. Processing cost depends on
                  video duration: approximately 8 credits per second. For example, a 30-second video
                  costs about 240 credits ($2.40). You only pay for what you use.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Do credits expire?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  No, purchased credits never expire. Buy them once and use them whenever you need.
                  Your balance carries over indefinitely.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  What's the difference between Free, Paid, and Pro users?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  All users get the same features (watermark removal, 4K quality, etc.). The only
                  difference is daily processing limits: Free (3 videos/day), Paid (50/day after any
                  purchase), Pro (200/day after $50+ lifetime purchases). These limits are permanent
                  - once unlocked, they never reset.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Is this a subscription service?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  No. ReelVan uses a pay-as-you-go model with no monthly fees or recurring charges.
                  You buy credits once and use them at your own pace. No commitments, no automatic
                  renewals.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  What payment methods do you accept?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  We accept all major credit and debit cards (Visa, Mastercard, American Express,
                  Discover) through Stripe. Your payment information is secure and encrypted.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Is there a refund policy?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  If processing fails, credits are automatically refunded to your account. For
                  quality issues, contact us within 24 hours for a refund. We stand behind our
                  service quality.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Can I get bulk discounts for teams or enterprises?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  Yes! The Business Pack ($70 for 10,000 credits) offers 30% savings. For even
                  larger volumes or custom solutions, contact us at enterprise@reelvan.com for
                  tailored pricing and dedicated support.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
