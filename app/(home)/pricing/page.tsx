'use client'

import { PricingCard } from '@/components/pricing/PricingCard'
import { CouponInput } from '@/components/coupon/CouponInput'
import { pricingPlans } from '@/data/pricingData'

// Note: metadata must be exported from server component
// Moved to layout.tsx or separate metadata file

export default function Pricing() {
  return (
    <>
      <div className="divide-border divide-y">
        {/* Promotion Banner */}
        <div className="from-primary-600 to-primary-700 bg-gradient-to-r py-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white md:text-base">
            <span className="text-xl">🎉</span>
            <span>First subscription gets 2x credits! Save up to 43%</span>
            <span className="hidden sm:inline">· Cancel anytime, no commitment</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 pt-6 pb-8 md:space-y-6">
          <h1 className="text-foreground text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-xl leading-8">
            Pay once or subscribe. Choose what works best for you.
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
              <span>Subscriptions: Save up to 43%</span>
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
              <span>First purchase: 2x credits bonus</span>
            </div>
          </div>
        </div>

        <div className="py-16">
          {/* Pricing Plans */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground text-3xl font-bold">Choose Your Plan</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                1 credit = $0.01 • 10s video ≈ 80 credits ($0.80)
              </p>
            </div>

            {/* Negative margin to expand cards beyond max-w-7xl */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-16 xl:-mx-24">
              <div className="mx-auto grid grid-cols-1 gap-5 px-4 pt-6 sm:max-w-2xl sm:grid-cols-2 sm:px-6 lg:max-w-none lg:grid-cols-4 lg:gap-6 lg:px-16 xl:px-24">
                {pricingPlans.map((plan) => (
                  <PricingCard key={plan.name} tier={plan} />
                ))}
              </div>
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
                      Starter/Pro ✨
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-sm">
                      Purchase Starter or Pro package
                    </td>
                    <td className="text-primary-600 dark:text-primary-400 px-6 py-4 text-sm font-bold">
                      50 videos/day
                    </td>
                  </tr>
                  <tr className="bg-chart-4/10">
                    <td className="text-chart-4 px-6 py-4 text-sm font-medium">Max/Business 🚀</td>
                    <td className="text-muted-foreground px-6 py-4 text-sm">
                      Purchase Max package or higher
                    </td>
                    <td className="text-chart-4 px-6 py-4 text-sm font-bold">100 videos/day</td>
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
                  Pay-as-you-go vs Subscription: What's the difference?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  <strong>Pay-as-you-go:</strong> $10 for 1,000 credits that never expire. Perfect
                  for occasional users who want flexibility.
                  <br />
                  <br />
                  <strong>Subscription:</strong> Monthly plans with more credits at better prices -
                  save up to 43%! First purchase gets 2x credits. Credits reset monthly
                  (use-it-or-lose-it). Ideal for regular creators.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Do subscription credits expire?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  Yes. Subscription credits reset monthly (use-it-or-lose-it) to encourage
                  consistent creation. However, pay-as-you-go credits never expire! Your first
                  purchase 2x bonus credits are also permanent.
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  What's included in each plan?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  All plans include the same core features (watermark removal, 4K quality, etc.).
                  The differences:
                  <br />• <strong>Pay-as-you-go</strong>: 1,000 credits (lifetime), 3 videos/day
                  <br />• <strong>Starter</strong>: 2,500 credits/month, save 24%, 3 videos/day
                  <br />• <strong>Pro</strong>: 7,000 credits/month, save 43%, 50 videos/day +
                  priority
                  <br />• <strong>Business</strong>: Custom, save up to 50%
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Can I cancel my subscription anytime?
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  Absolutely! Cancel anytime with no penalties. You'll keep access until the end of
                  your current billing period. Pay-as-you-go credits never expire. We want happy
                  customers, not trapped ones.
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
                  Yes! Our Max package ($80 for 10,000 credits) offers 20% savings. For teams and
                  enterprises needing larger volumes, dedicated support, and custom solutions,
                  contact our sales team at sales@reelvan.com for tailored pricing with up to 30%
                  savings.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
