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
            Choose your credits, pick your plan. Save up to 75% with subscriptions.
          </p>
        </div>

        {/* 3 Dynamic Pricing Cards */}
        <div className="mt-16 sm:mt-20">
          <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {pricingPlans.map((plan) => (
              <DynamicPricingCard key={plan.id} tier={plan} />
            ))}
          </div>
        </div>

        {/* Pricing Info */}
        <div className="text-muted-foreground mx-auto mt-12 max-w-3xl text-center">
          <p className="text-sm">
            All plans include the same core features. Start with 100 free credits on signup.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-lg">💎</span>
              <span className="font-medium">1 credit = 1 second of video</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-lg">⚡</span>
              <span className="font-medium">Starting from $2.99/month</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-lg">🎯</span>
              <span className="font-medium">Save up to 76% with subscriptions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
