import { pricingPlans } from '@/data/pricingData'
import { PricingCard } from './PricingCard'

/**
 * Pricing Preview Component for Homepage
 *
 * Reuses PricingCard component to display all pricing plans.
 * Uses negative margins to expand beyond container for better visibility.
 * Maintains consistency with /pricing page.
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
            Pay once or subscribe. Save up to 43% with Pro plan. First subscription gets 2x credits.
          </p>
        </div>

        {/* Negative margin to expand pricing cards beyond container */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-16 xl:-mx-24">
          <div className="mx-auto mt-16 grid grid-cols-1 gap-5 px-4 pt-6 sm:mt-20 sm:max-w-2xl sm:grid-cols-2 sm:px-6 lg:max-w-none lg:grid-cols-4 lg:gap-6 lg:px-16 xl:px-24">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} tier={plan} />
            ))}
          </div>
        </div>

        <p className="text-muted-foreground mx-auto mt-10 max-w-2xl text-center text-sm">
          All plans include the same features. Start with 100 free credits on signup. 1 credit =
          $0.01 • 10s video ≈ 80 credits ($0.80)
        </p>
      </div>
    </section>
  )
}
