/**
 * Pricing Data Configuration
 *
 * Credit Packages (流量包模式)
 * - Pay-as-you-go model, NOT subscription
 * - 1 credit = $0.01
 * - 30s video ≈ 240 credits ($2.40)
 * - Volume discounts: 10% → 20% → 30%
 */

export interface PricingTier {
  name: string
  credits: number
  price: number // in cents
  priceDisplay: string
  discount: number
  description: string
  features: Array<{ text: string; included: boolean; highlight?: boolean }>
  ctaText: string
  popular?: boolean
}

export const creditPackages: PricingTier[] = [
  {
    name: 'Trial Pack',
    credits: 100,
    price: 100, // cents
    priceDisplay: '$1.00',
    discount: 0,
    description: 'Perfect for trying out ReelVan',
    features: [
      { text: 'Process ~1 short video (10-30s)', included: true },
      { text: 'All features included', included: true },
      { text: 'Watermark removal', included: true },
      { text: 'Up to 4K quality', included: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Buy Now',
    popular: false,
  },
  {
    name: 'Casual Pack',
    credits: 500,
    price: 450, // cents
    priceDisplay: '$4.50',
    discount: 10,
    description: 'Great for casual users',
    features: [
      { text: 'Process ~5 videos', included: true },
      { text: 'Save 10% ($0.50)', included: true, highlight: true },
      { text: 'All features included', included: true },
      { text: 'Unlock 50 videos/day limit', included: true, highlight: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Buy Now',
    popular: false,
  },
  {
    name: 'Regular Pack',
    credits: 2000,
    price: 1600, // cents
    priceDisplay: '$16.00',
    discount: 20,
    description: 'Best for regular creators',
    features: [
      { text: 'Process ~20 videos', included: true },
      { text: 'Save 20% ($4.00)', included: true, highlight: true },
      { text: 'All features included', included: true },
      { text: 'Unlock 50 videos/day limit', included: true, highlight: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Buy Now',
    popular: true,
  },
  {
    name: 'Business Pack',
    credits: 10000,
    price: 7000, // cents
    priceDisplay: '$70.00',
    discount: 30,
    description: 'For professionals & teams',
    features: [
      { text: 'Process ~100 videos', included: true },
      { text: 'Save 30% ($30.00)', included: true, highlight: true },
      { text: 'All features included', included: true },
      { text: 'Unlock 200 videos/day (Pro tier)', included: true, highlight: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Buy Now',
    popular: false,
  },
]
