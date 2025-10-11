/**
 * Pricing Data Configuration
 *
 * Hybrid Model
 * - One-time credits: Pay once, use forever (standard price)
 * - Monthly subscriptions: Better value, credits reset monthly
 * - 1 credit = $0.01 (to user)
 * - 10s video = 100 credits ($1.00) - Upstream cost: $0.10 (10x markup, 90% margin)
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
    name: 'Basic',
    type: 'one-time',
    credits: 300,
    price: 299, // $2.99 one-time
    priceDisplay: '$2.99',
    discount: 0,
    description: 'Perfect to get started',
    videoExamples: '~3 videos (10s each)',
    features: [
      { text: '300 credits (one-time)', included: true },
      { text: '~3 videos (10s each)', included: true },
      { text: 'Credits never expire', included: true, highlight: true },
      { text: 'All features included', included: true },
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
    monthlyCredits: 1500,
    price: 999, // $9.99/month
    priceDisplay: '$9.99',
    discount: 33, // 33% off vs Basic ($0.00665/credit vs $0.00997/credit)
    description: 'Best for regular creators',
    videoExamples: '~15 videos/month',
    features: [
      { text: '1,500 credits/month', included: true },
      { text: 'Worth $14.96 in credit value', included: true, highlight: true },
      {
        text: 'First purchase: 2x credits (3,000)',
        included: true,
        highlight: true,
        badge: 'Limited',
      },
      { text: '~15 videos/month (10s each)', included: true },
      { text: 'All features included', included: true },
      { text: 'Commercial use', included: true },
      { text: '10 videos/day limit', included: true },
    ],
    ctaText: 'Subscribe',
    popular: false,
  },

  {
    name: 'Pro',
    type: 'subscription',
    monthlyCredits: 5000,
    price: 2999, // $29.99/month
    priceDisplay: '$29.99',
    discount: 40, // 40% off vs Basic ($0.00600/credit vs $0.00997/credit)
    description: 'For professional creators',
    videoExamples: '~50 videos/month',
    features: [
      { text: '5,000 credits/month', included: true },
      { text: 'Worth $49.85 in credit value', included: true, highlight: true },
      {
        text: 'First purchase: 2x credits (10,000)',
        included: true,
        highlight: true,
        badge: 'Limited',
      },
      { text: '~50 videos/month (10s each)', included: true },
      { text: 'All features included', included: true },
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
    discount: 30, // Up to 30% - consistent with badge
    description: 'For teams & enterprises',
    videoExamples: 'Unlimited',
    features: [
      { text: 'Custom credit quota', included: true },
      { text: 'Save up to 30%', included: true, highlight: true },
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
