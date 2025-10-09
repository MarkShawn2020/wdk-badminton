/**
 * Pricing Data Configuration
 *
 * Hybrid Model
 * - One-time credits: Pay once, use forever (standard price)
 * - Monthly subscriptions: Better value, credits reset monthly
 * - 1 credit = $0.01 (standard)
 * - 10s video ≈ 80 credits ($0.80) - based on 8 credits/second
 * - Subscription bonus: 2x credits on first purchase
 */

export interface PricingTier {
  name: string
  type: 'one-time' | 'subscription' | 'contact' // Payment type
  credits?: number // For one-time purchase
  monthlyCredits?: number // For subscriptions
  price: number // in cents (one-time or monthly)
  priceDisplay: string // Display price
  discount: number // Discount percentage vs one-time
  description: string
  features: Array<{ text: string; included: boolean; highlight?: boolean; badge?: string }>
  ctaText: string
  popular?: boolean
  isContactSales?: boolean
  videoExamples: string // e.g., "~12 videos (10s each)"
}

export const pricingPlans: PricingTier[] = [
  // One-time purchase
  {
    name: 'Pay-as-you-go',
    type: 'one-time',
    credits: 1000,
    price: 1000, // $10 one-time
    priceDisplay: '$10',
    discount: 0,
    description: 'Try it out, pay once',
    videoExamples: '~12 videos (10s each)',
    features: [
      { text: '1,000 credits (one-time)', included: true },
      { text: '~12 videos (10s each)', included: true },
      { text: 'Credits never expire', included: true, highlight: true },
      { text: 'All features (watermark removal, 4K)', included: true },
      { text: 'Commercial use', included: true },
      { text: '3 videos/day limit', included: true },
    ],
    ctaText: 'Buy Now',
    popular: false,
  },

  // Monthly subscriptions
  {
    name: 'Starter',
    type: 'subscription',
    monthlyCredits: 2500,
    price: 1900, // $19/month
    priceDisplay: '$19',
    discount: 24, // 24% off vs one-time
    description: 'Best for regular creators',
    videoExamples: '~31 videos/month',
    features: [
      { text: '2,500 credits/month', included: true },
      {
        text: 'First purchase: 2x credits (5,000)',
        included: true,
        highlight: true,
        badge: 'Limited',
      },
      { text: '~31 videos/month (10s each)', included: true },
      { text: 'Save 24% vs pay-as-you-go', included: true, highlight: true },
      { text: 'All features (watermark removal, 4K)', included: true },
      { text: 'Commercial use', included: true },
      { text: '3 videos/day limit', included: true },
    ],
    ctaText: 'Subscribe',
    popular: false,
  },

  {
    name: 'Pro',
    type: 'subscription',
    monthlyCredits: 7000,
    price: 4900, // $49/month
    priceDisplay: '$49',
    discount: 43, // 43% off vs one-time
    description: 'For professional creators',
    videoExamples: '~87 videos/month',
    features: [
      { text: '7,000 credits/month', included: true },
      {
        text: 'First purchase: 2x credits (14,000)',
        included: true,
        highlight: true,
        badge: 'Limited',
      },
      { text: '~87 videos/month (10s each)', included: true },
      { text: 'Save 43% vs pay-as-you-go', included: true, highlight: true },
      { text: 'All features (watermark removal, 4K)', included: true },
      { text: 'Commercial use', included: true },
      { text: '50 videos/day limit', included: true, highlight: true },
      { text: 'Priority processing', included: true },
    ],
    ctaText: 'Subscribe',
    popular: true,
  },

  // Enterprise
  {
    name: 'Business',
    type: 'contact',
    price: 0,
    priceDisplay: 'Custom',
    discount: 50,
    description: 'For teams & enterprises',
    videoExamples: 'Unlimited',
    features: [
      { text: 'Custom credit quota', included: true },
      { text: 'Save up to 50%', included: true, highlight: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom API integration', included: true, highlight: true },
      { text: 'Unlimited daily processing', included: true },
    ],
    ctaText: 'Contact Sales',
    popular: false,
    isContactSales: true,
  },
]

// Legacy: Keep for backward compatibility
export const subscriptionPlans = pricingPlans
export const creditPackages = pricingPlans
