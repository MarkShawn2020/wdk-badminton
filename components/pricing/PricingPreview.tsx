import { creditPackages } from '@/data/pricingData'
import { PricingCard } from './PricingCard'

/**
 * Pricing Preview Component for Homepage
 *
 * Reuses PricingCard component to display all credit packages.
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
            Buy credits when you need them. No subscriptions, no monthly fees. Volume discounts up
            to 30% off.
          </p>
        </div>

        <div
          className="mx-auto mt-16 grid grid-cols-1 items-stretch gap-6 space-y-6 sm:mt-20 sm:max-w-xl sm:grid-cols-2 xl:max-w-none xl:grid-cols-4 xl:gap-8"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          {creditPackages.map((pkg) => (
            <PricingCard key={pkg.name} tier={pkg} />
          ))}
        </div>

        <p className="text-muted-foreground mx-auto mt-10 max-w-2xl text-center text-sm">
          All users get the same features. Start with 100 free credits on signup. 1 credit = $0.01 •
          Typical 30s video ≈ 240 credits ($2.40)
        </p>
      </div>
    </section>
  )
}
