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
      <div className="divide-border divide-y">
        {/* Hero Section */}
        <div className="space-y-4 pt-6 pb-8 md:space-y-6">
          <h1 className="text-foreground text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-xl leading-8">
            Buy credits when you need them. No subscriptions, no monthly fees.
          </p>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
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
                className="text-success h-5 w-5"
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
                className="text-success h-5 w-5"
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-foreground text-3xl font-bold">Choose Your Credit Package</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                1 credit = $0.01 • Typical 30s video ≈ 240 credits ($2.40)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-6">
              {creditPackages.map((pkg) => (
                <PricingCard key={pkg.name} tier={pkg} />
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-foreground mb-12 text-center text-3xl font-bold">How It Works</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    1
                  </span>
                </div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">Buy Credits</h3>
                <p className="text-muted-foreground">
                  Purchase a credit package that fits your needs. Bigger packs = bigger savings.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    2
                  </span>
                </div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">Process Videos</h3>
                <p className="text-muted-foreground">
                  Upload and enhance your videos. Credits are deducted based on video duration.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                    3
                  </span>
                </div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">Buy More Anytime</h3>
                <p className="text-muted-foreground">
                  Credits never expire. Top up whenever you need more processing power.
                </p>
              </div>
            </div>
          </div>

          {/* Rate Limit Benefits */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-foreground mb-8 text-center text-3xl font-bold">
              Unlock Higher Limits with Purchases
            </h2>
            <div className="border-border overflow-hidden rounded-2xl border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">
                      How to Unlock
                    </th>
                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">
                      Daily Limit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  <tr className="bg-card">
                    <td className="text-muted-foreground px-6 py-4 text-sm">Free User</td>
                    <td className="text-muted-foreground px-6 py-4 text-sm">
                      Sign up (100 free credits)
                    </td>
                    <td className="text-foreground px-6 py-4 text-sm font-medium">3 videos/day</td>
                  </tr>
                  <tr className="bg-primary-50 dark:bg-primary-950">
                    <td className="text-primary-700 dark:text-primary-300 px-6 py-4 text-sm font-medium">
                      Paid User ✨
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-sm">Make any purchase</td>
                    <td className="text-primary-600 dark:text-primary-400 px-6 py-4 text-sm font-bold">
                      50 videos/day
                    </td>
                  </tr>
                  <tr className="bg-chart-4/10">
                    <td className="text-chart-4 px-6 py-4 text-sm font-medium">Pro User 🚀</td>
                    <td className="text-muted-foreground px-6 py-4 text-sm">
                      $50+ lifetime purchases
                    </td>
                    <td className="text-chart-4 px-6 py-4 text-sm font-bold">200 videos/day</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              All users get the same features (4K quality, watermark removal, etc.). Limits are
              permanent - once unlocked, they stay forever.
            </p>
          </div>

          {/* Coupon Section */}
          <div className="mx-auto mt-24 max-w-2xl">
            <div className="border-border rounded-2xl border bg-gradient-to-r from-purple-50 to-pink-50 p-8 dark:from-purple-950 dark:to-pink-950">
              <h2 className="text-foreground mb-2 text-center text-2xl font-bold">
                Have a Coupon Code?
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Redeem your coupon to get free credits instantly
              </p>
              <CouponInput />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-8">
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  How does the credit system work?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  Credits are used to process videos. 1 credit = $0.01. Processing cost depends on
                  video duration: approximately 8 credits per second. For example, a 30-second video
                  costs about 240 credits ($2.40). You only pay for what you use.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">Do credits expire?</dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  No, purchased credits never expire. Buy them once and use them whenever you need.
                  Your balance carries over indefinitely.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  What's the difference between Free, Paid, and Pro users?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  All users get the same features (watermark removal, 4K quality, etc.). The only
                  difference is daily processing limits: Free (3 videos/day), Paid (50/day after any
                  purchase), Pro (200/day after $50+ lifetime purchases). These limits are permanent
                  - once unlocked, they never reset.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Is this a subscription service?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  No. ReelVan uses a pay-as-you-go model with no monthly fees or recurring charges.
                  You buy credits once and use them at your own pace. No commitments, no automatic
                  renewals.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  What payment methods do you accept?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  We accept all major credit and debit cards (Visa, Mastercard, American Express,
                  Discover) through Stripe. Your payment information is secure and encrypted.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">Is there a refund policy?</dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  If processing fails, credits are automatically refunded to your account. For
                  quality issues, contact us within 24 hours for a refund. We stand behind our
                  service quality.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Can I get bulk discounts for teams or enterprises?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
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
