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
  isContactSales?: boolean
}

export const creditPackages: PricingTier[] = [
  {
    name: 'Starter',
    credits: 500,
    price: 500, // cents ($5)
    priceDisplay: '$5',
    discount: 0,
    description: 'Perfect for getting started',
    features: [
      { text: 'Process ~2-5 videos', included: true },
      { text: 'All features included', included: true },
      { text: 'Watermark removal', included: true },
      { text: 'Up to 4K quality', included: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    credits: 2000,
    price: 1800, // cents ($18, 10% discount)
    priceDisplay: '$18',
    discount: 10,
    description: 'Best for content creators',
    features: [
      { text: 'Process ~20 videos', included: true },
      { text: 'Save 10% ($2.00)', included: true, highlight: true },
      { text: 'All features included', included: true },
      { text: 'Unlock 50 videos/day limit', included: true, highlight: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Get Started',
    popular: true,
  },
  {
    name: 'Max',
    credits: 10000,
    price: 8000, // cents ($80, 20% discount)
    priceDisplay: '$80',
    discount: 20,
    description: 'For power users',
    features: [
      { text: 'Process ~100 videos', included: true },
      { text: 'Save 20% ($20.00)', included: true, highlight: true },
      { text: 'All features included', included: true },
      { text: 'Unlock 100 videos/day limit', included: true, highlight: true },
      { text: 'Credits never expire', included: true },
    ],
    ctaText: 'Get Started',
    popular: false,
  },
  {
    name: 'Business',
    credits: 0, // Custom amount
    price: 0, // Custom pricing
    priceDisplay: 'Custom',
    discount: 30,
    description: 'For teams & enterprises',
    features: [
      { text: 'Custom credit packages', included: true },
      { text: 'Save up to 30%', included: true, highlight: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated account manager', included: true, highlight: true },
      { text: 'Custom rate limits', included: true },
    ],
    ctaText: 'Contact Sales',
    popular: false,
    isContactSales: true,
  },
]
