import { pricingPlans } from '@/data/pricingData'
import { DynamicPricingCard } from './DynamicPricingCard'

/**
 * Pricing Preview Component for Homepage
 *
 * Shows 3 interactive pricing cards with dynamic credit selection:
 * 1. One-Time Purchase (with dropdown)
 * 2. Subscription (with weekly/monthly toggle + dropdown)
 * 3. Enterprise (contact sales)
 *
 * Inspired by watermarkremover.io's pricing UX
 */
export function PricingPreview() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-primary-600 text-base leading-7 font-semibold">Pricing</h2>
          <p className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </p>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
            Pay as you go or subscribe. Save up to 93% with subscription plans.
          </p>
        </div>

        {/* 3 Dynamic Pricing Cards */}
        <div className="mt-16 sm:mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {pricingPlans.map((plan) => (
                <DynamicPricingCard key={plan.id} tier={plan} />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="text-muted-foreground mx-auto mt-12 max-w-3xl text-center">
          <p className="text-sm">
            All plans include watermark removal and quality enhancement. Start with 15 free credits
            on signup.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-lg">✨</span>
              <span className="font-medium">Full Bundle: 30 credits per 10s video</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-lg">⚡</span>
              <span className="font-medium">Starting from $9.99/month</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-lg">🎯</span>
              <span className="font-medium">Yearly: Pay 10 months, get 12</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
