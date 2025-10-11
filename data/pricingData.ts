/**
 * ReelVan Pricing Data Configuration
 *
 * Pricing Strategy (3-Card Dynamic Selection):
 * - 3 card types with dynamic credit selection
 * - Users select credit amount within each card
 * - Clear comparison: One-time vs Subscription vs Enterprise
 *
 * Pricing Standard:
 * - Standard rate: $1 = 10 credits ($0.10/credit)
 * - Video cost: 1 second = 1 credit (10s video = 10 credits = $1 standard)
 * - API cost: $0.02 per second ($0.20 per 10s video)
 * - Target margin: 70-80%
 *
 * Competitive Advantage:
 * - Ultra-low entry price: $2.99/month (50 credits) - lowest in market
 * - 10-15% cheaper than watermarkremover.io across all tiers
 * - Better volume discounts
 * - Starting from 30 credits (vs competitor's 50 minimum)
 *
 * Discount Strategy:
 * - One-time: 0-30% off standard rate
 * - Weekly subscription: 20-40% off standard rate
 * - Monthly subscription: 40-76% off standard rate
 * - Enterprise: Custom pricing (contact sales)
 */

export interface CreditOption {
  credits: number
  basePrice: number // Standard price in cents ($1 = 10 credits)
  price: number // Actual price in cents (after discount)
  priceDisplay: string
  basePriceDisplay: string // Standard price for display (strikethrough)
  pricePerCredit: string
  discount: number // percentage off base rate
  videoCount: string // e.g., "~10 videos (10s each)"
}

export interface PricingTier {
  id: string // Unique identifier
  name: string
  type: 'one-time' | 'subscription' | 'contact'
  tagline: string
  description: string

  // For subscription cards
  hasIntervalToggle?: boolean
  defaultInterval?: 'week' | 'month'

  // Credit options for this tier
  creditOptions?: {
    oneTime?: CreditOption[]
    weekly?: CreditOption[]
    monthly?: CreditOption[]
  }

  // Static features (same for all options)
  features: Array<{ text: string; included: boolean; highlight?: boolean; badge?: string }>

  ctaText: string
  popular?: boolean
  isContactSales?: boolean
}

// ==========================================
// CREDIT OPTION DEFINITIONS
// Standard rate: $1 = 10 credits = $0.10/credit
// Competitor analysis: watermarkremover.io charges $0.02-0.16/credit
// Our strategy: 10-15% cheaper than watermarkremover.io
// ==========================================

const ONE_TIME_OPTIONS: CreditOption[] = [
  {
    credits: 30,
    basePrice: 300, // $3.00 standard
    price: 299, // $2.99 (ultra-low entry)
    basePriceDisplay: '$3',
    priceDisplay: '$2.99',
    pricePerCredit: '$0.10/credit',
    discount: 0,
    videoCount: '~30s',
  },
  {
    credits: 50,
    basePrice: 500, // $5.00 standard
    price: 499, // $4.99
    basePriceDisplay: '$5',
    priceDisplay: '$4.99',
    pricePerCredit: '$0.10/credit',
    discount: 0,
    videoCount: '~50s',
  },
  {
    credits: 100,
    basePrice: 1000, // $10.00 standard
    price: 899, // $8.99 (competitor: $7.99 for 50 credits = $0.16/credit)
    basePriceDisplay: '$10',
    priceDisplay: '$8.99',
    pricePerCredit: '$0.09/credit',
    discount: 10,
    videoCount: '~2 min',
  },
  {
    credits: 200,
    basePrice: 2000, // $20.00 standard
    price: 1599, // $15.99
    basePriceDisplay: '$20',
    priceDisplay: '$15.99',
    pricePerCredit: '$0.08/credit',
    discount: 20,
    videoCount: '~3 min',
  },
  {
    credits: 500,
    basePrice: 5000, // $50.00 standard
    price: 3499, // $34.99 (competitor: $54.99)
    basePriceDisplay: '$50',
    priceDisplay: '$34.99',
    pricePerCredit: '$0.07/credit',
    discount: 30,
    videoCount: '~8 min',
  },
]

const WEEKLY_OPTIONS: CreditOption[] = [
  {
    credits: 50,
    basePrice: 500, // $5.00 standard
    price: 399, // $3.99/week
    basePriceDisplay: '$5',
    priceDisplay: '$3.99',
    pricePerCredit: '$0.08/credit',
    discount: 20,
    videoCount: '~50s/wk',
  },
  {
    credits: 100,
    basePrice: 1000, // $10.00 standard
    price: 699, // $6.99/week
    basePriceDisplay: '$10',
    priceDisplay: '$6.99',
    pricePerCredit: '$0.07/credit',
    discount: 30,
    videoCount: '~2 min/wk',
  },
  {
    credits: 200,
    basePrice: 2000, // $20.00 standard
    price: 1199, // $11.99/week
    basePriceDisplay: '$20',
    priceDisplay: '$11.99',
    pricePerCredit: '$0.06/credit',
    discount: 40,
    videoCount: '~3 min/wk',
  },
]

const MONTHLY_OPTIONS: CreditOption[] = [
  {
    credits: 50,
    basePrice: 500, // $5.00 standard
    price: 299, // $2.99/month (ultra-low entry)
    basePriceDisplay: '$5',
    priceDisplay: '$2.99',
    pricePerCredit: '$0.06/credit',
    discount: 40,
    videoCount: '~50s/mo',
  },
  {
    credits: 100,
    basePrice: 1000, // $10.00 standard
    price: 499, // $4.99/month (competitor: $6.99)
    basePriceDisplay: '$10',
    priceDisplay: '$4.99',
    pricePerCredit: '$0.05/credit',
    discount: 50,
    videoCount: '~2 min/mo',
  },
  {
    credits: 200,
    basePrice: 2000, // $20.00 standard
    price: 799, // $7.99/month (competitor: $9.99)
    basePriceDisplay: '$20',
    priceDisplay: '$7.99',
    pricePerCredit: '$0.04/credit',
    discount: 60,
    videoCount: '~3 min/mo',
  },
  {
    credits: 500,
    basePrice: 5000, // $50.00 standard
    price: 1199, // $11.99/month (competitor: $14.99)
    basePriceDisplay: '$50',
    priceDisplay: '$11.99',
    pricePerCredit: '$0.024/credit',
    discount: 76,
    videoCount: '~8 min/mo',
  },
]

// ==========================================
// PRICING TIERS (3 Cards)
// ==========================================

export const pricingPlans: PricingTier[] = [
  // ==========================================
  // CARD 1: One-Time Purchase
  // ==========================================
  {
    id: 'one-time',
    name: 'One-Time Purchase',
    type: 'one-time',
    tagline: 'Pay once, use forever',
    description: 'Perfect for occasional use. Starting from just $2.99.',

    creditOptions: {
      oneTime: ONE_TIME_OPTIONS,
    },

    features: [
      { text: 'Credits never expire', included: true, highlight: true },
      { text: 'From $2.99 (30 credits)', included: true, highlight: true },
      { text: 'All enhancement features', included: true },
      { text: 'HD & 4K quality export', included: true },
      { text: 'Commercial use rights', included: true },
      { text: 'Email support', included: true },
      { text: 'No commitment', included: true },
    ],

    ctaText: 'Buy Now',
    popular: false,
  },

  // ==========================================
  // CARD 2: Subscription (Weekly + Monthly)
  // ==========================================
  {
    id: 'subscription',
    name: 'Subscription',
    type: 'subscription',
    tagline: 'Best value for regular creators',
    description: 'Save 20-76% with weekly or monthly plans. Cancel anytime.',

    hasIntervalToggle: true,
    defaultInterval: 'month',

    creditOptions: {
      weekly: WEEKLY_OPTIONS,
      monthly: MONTHLY_OPTIONS,
    },

    features: [
      { text: 'Save up to 76% vs standard', included: true, highlight: true, badge: 'Best Value' },
      { text: 'From $2.99/month', included: true, highlight: true },
      { text: 'Credits reset weekly/monthly', included: true },
      { text: 'Cancel anytime, no commitment', included: true },
      { text: 'All enhancement features', included: true },
      { text: 'HD & 4K quality export', included: true },
      { text: 'Commercial use rights', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Priority processing queue', included: true, highlight: true },
    ],

    ctaText: 'Start Subscription',
    popular: true,
  },

  // ==========================================
  // CARD 3: Enterprise
  // ==========================================
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'contact',
    tagline: 'Custom solutions for teams',
    description: 'Volume pricing, dedicated support, and custom integrations.',

    features: [
      { text: 'Custom credit packages', included: true, highlight: true },
      { text: 'Volume discounts (save up to 80%)', included: true, highlight: true },
      { text: 'Dedicated account manager', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Custom API integration', included: true, highlight: true },
      { text: 'White-label options', included: true },
      { text: 'Unlimited daily processing', included: true },
      { text: 'SLA guarantees (99.9% uptime)', included: true },
      { text: 'Custom feature development', included: true },
      { text: 'On-premise deployment option', included: true },
    ],

    ctaText: 'Contact Sales',
    popular: false,
    isContactSales: true,
  },
]

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get plan by ID
 */
export function getPlanById(id: string): PricingTier | undefined {
  return pricingPlans.find((plan) => plan.id === id)
}

/**
 * Get default credit option for a plan
 */
export function getDefaultCreditOption(
  plan: PricingTier,
  interval?: 'week' | 'month'
): CreditOption | null {
  if (plan.type === 'contact') return null

  if (plan.type === 'one-time') {
    return plan.creditOptions?.oneTime?.[2] || null // Default to middle option
  }

  if (plan.type === 'subscription') {
    const targetInterval = interval || plan.defaultInterval || 'month'
    const options =
      targetInterval === 'week' ? plan.creditOptions?.weekly : plan.creditOptions?.monthly
    return options?.[1] || null // Default to second option (good value)
  }

  return null
}

/**
 * Calculate margin for a credit option
 * Assumes: 1 credit = 1 second of video, API cost = $0.02/second
 */
export function calculateMargin(option: CreditOption): number {
  const apiCost = option.credits * 0.02 // $0.02 per credit/second
  const revenue = option.price / 100 // Convert cents to dollars
  const margin = ((revenue - apiCost) / revenue) * 100
  return Math.round(margin)
}

/**
 * Get all credit options across all plans
 */
export function getAllCreditOptions(): {
  oneTime: CreditOption[]
  weekly: CreditOption[]
  monthly: CreditOption[]
} {
  return {
    oneTime: ONE_TIME_OPTIONS,
    weekly: WEEKLY_OPTIONS,
    monthly: MONTHLY_OPTIONS,
  }
}

// Legacy exports for backward compatibility
export const subscriptionPlans = pricingPlans.filter((p) => p.type === 'subscription')
export const creditPackages = pricingPlans.filter((p) => p.type === 'one-time')

/**
 * Get pricing tier by type
 */
export function getPlansByType(type: 'one-time' | 'subscription' | 'contact'): PricingTier[] {
  return pricingPlans.filter((plan) => plan.type === type)
}

/**
 * Get the most popular plan
 */
export function getPopularPlan(): PricingTier | undefined {
  return pricingPlans.find((plan) => plan.popular)
}
