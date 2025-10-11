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
 * Professional Pricing Structure:
 * - Consistent 4 tiers: 50, 100, 200, 500 credits (across all types)
 * - Smooth discount progression: one-time < weekly < monthly
 * - Clear value ladder: longer commitment = better savings
 * - Easy price comparison: same credits, different commitment levels
 *
 * Discount Strategy (Science-based):
 * - One-time: 0-15% off (Standard pricing + small volume discount)
 * - Weekly: 15-30% off (Moderate subscription commitment)
 * - Monthly: 30-60% off (Best value for highest commitment)
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
  defaultInterval?: 'month' | 'year'

  // Credit options for this tier
  creditOptions?: {
    oneTime?: CreditOption[]
    monthly?: CreditOption[]
    yearly?: CreditOption[]
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
//
// Professional Pricing Strategy:
// - Consistent 4 tiers across ALL purchase types (50, 100, 200, 500 credits)
// - Smooth, predictable discount progression
// - Clear value proposition: Longer commitment = Better discount
//
// CRITICAL UNDERSTANDING: Credits Reset Logic
// - Monthly: X credits PER MONTH (resets monthly, does NOT accumulate)
// - Yearly: X credits PER MONTH (resets monthly, does NOT accumulate)
// - Both Monthly and Yearly give SAME credit amount per month
// - Yearly = Monthly × 10 (pay for 10 months, get 12 months - 2 months free)
//
// Discount Structure:
// - One-time:  0%, 5%, 10%, 15% (Standard + small volume discount)
// - Monthly:   30%, 40%, 50%, 60% off standard (Flexible monthly billing)
// - Yearly:    41%, 50%, 58%, 66% off standard (Best value for commitment)
//
// Example for 100 credits:
// - One-time: $9.50 (5% off) - 100 credits forever
// - Monthly: $6.00/month (40% off) - 100 credits/month
// - Yearly: $60.00/year = $5.00/month avg (50% off) - 100 credits/month (save $12/year)
//
// User Choice Logic:
// - Occasional use → One-time (永不过期，按需使用)
// - Trial/Short-term → Monthly (随时取消，灵活)
// - Long-term users → Yearly (最优惠，年付送2个月)
// ==========================================

const ONE_TIME_OPTIONS: CreditOption[] = [
  {
    credits: 50,
    basePrice: 500, // $5.00 standard
    price: 500, // $5.00 (no discount - standard pricing)
    basePriceDisplay: '$5',
    priceDisplay: '$5.00',
    pricePerCredit: '$0.10/credit',
    discount: 0,
    videoCount: '~50s',
  },
  {
    credits: 100,
    basePrice: 1000, // $10.00 standard
    price: 950, // $9.50 (5% volume discount)
    basePriceDisplay: '$10',
    priceDisplay: '$9.50',
    pricePerCredit: '$0.095/credit',
    discount: 5,
    videoCount: '~2 min',
  },
  {
    credits: 200,
    basePrice: 2000, // $20.00 standard
    price: 1800, // $18.00 (10% volume discount)
    basePriceDisplay: '$20',
    priceDisplay: '$18.00',
    pricePerCredit: '$0.09/credit',
    discount: 10,
    videoCount: '~3 min',
  },
  {
    credits: 500,
    basePrice: 5000, // $50.00 standard
    price: 4250, // $42.50 (15% volume discount)
    basePriceDisplay: '$50',
    priceDisplay: '$42.50',
    pricePerCredit: '$0.085/credit',
    discount: 15,
    videoCount: '~8 min',
  },
]

const YEARLY_OPTIONS: CreditOption[] = [
  {
    credits: 50,
    basePrice: 6000, // $60.00 standard per year
    price: 3500, // $35.00/year ($2.92/month avg, pay 10 months get 12)
    basePriceDisplay: '$60',
    priceDisplay: '$35.00',
    pricePerCredit: '$0.058/credit',
    discount: 41, // vs standard yearly rate
    videoCount: '~50s/mo',
  },
  {
    credits: 100,
    basePrice: 12000, // $120.00 standard per year
    price: 6000, // $60.00/year ($5.00/month avg, pay 10 months get 12)
    basePriceDisplay: '$120',
    priceDisplay: '$60.00',
    pricePerCredit: '$0.050/credit',
    discount: 50, // vs standard yearly rate
    videoCount: '~100s/mo',
  },
  {
    credits: 200,
    basePrice: 24000, // $240.00 standard per year
    price: 10000, // $100.00/year ($8.33/month avg, pay 10 months get 12)
    basePriceDisplay: '$240',
    priceDisplay: '$100.00',
    pricePerCredit: '$0.042/credit',
    discount: 58, // vs standard yearly rate
    videoCount: '~200s/mo',
  },
  {
    credits: 500,
    basePrice: 60000, // $600.00 standard per year
    price: 20000, // $200.00/year ($16.67/month avg, pay 10 months get 12)
    basePriceDisplay: '$600',
    priceDisplay: '$200.00',
    pricePerCredit: '$0.033/credit',
    discount: 66, // vs standard yearly rate
    videoCount: '~500s/mo',
  },
]

const MONTHLY_OPTIONS: CreditOption[] = [
  {
    credits: 50,
    basePrice: 500, // $5.00 standard
    price: 350, // $3.50/month (30% best value discount)
    basePriceDisplay: '$5',
    priceDisplay: '$3.50',
    pricePerCredit: '$0.07/credit',
    discount: 30,
    videoCount: '~50s/mo',
  },
  {
    credits: 100,
    basePrice: 1000, // $10.00 standard
    price: 600, // $6.00/month (40% best value discount)
    basePriceDisplay: '$10',
    priceDisplay: '$6.00',
    pricePerCredit: '$0.06/credit',
    discount: 40,
    videoCount: '~2 min/mo',
  },
  {
    credits: 200,
    basePrice: 2000, // $20.00 standard
    price: 1000, // $10.00/month (50% best value discount)
    basePriceDisplay: '$20',
    priceDisplay: '$10.00',
    pricePerCredit: '$0.05/credit',
    discount: 50,
    videoCount: '~3 min/mo',
  },
  {
    credits: 500,
    basePrice: 5000, // $50.00 standard
    price: 2000, // $20.00/month (60% best value discount)
    basePriceDisplay: '$50',
    priceDisplay: '$20.00',
    pricePerCredit: '$0.04/credit',
    discount: 60,
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
    description: 'Perfect for occasional use. Starting from just $5.00.',

    creditOptions: {
      oneTime: ONE_TIME_OPTIONS,
    },

    features: [
      { text: 'Credits never expire', included: true, highlight: true },
      { text: 'From $5 (50 credits)', included: true, highlight: true },
      { text: 'Standard pricing', included: true },
      { text: 'All enhancement features', included: true },
      { text: 'HD & 4K quality export', included: true },
      { text: 'Commercial use rights', included: true },
      { text: 'Email support', included: true },
    ],

    ctaText: 'Buy Now',
    popular: false,
  },

  // ==========================================
  // CARD 2: Subscription (Monthly + Yearly)
  // ==========================================
  {
    id: 'subscription',
    name: 'Subscription',
    type: 'subscription',
    tagline: 'Best value for regular creators',
    description: 'Save up to 66% with flexible plans. Get 2 months free with yearly.',

    hasIntervalToggle: true,
    defaultInterval: 'month',

    creditOptions: {
      monthly: MONTHLY_OPTIONS,
      yearly: YEARLY_OPTIONS,
    },

    features: [
      { text: 'Save up to 66% vs standard', included: true, highlight: true, badge: 'Best Value' },
      { text: 'From $3.50/month or $35/year', included: true, highlight: true },
      { text: 'Credits reset monthly', included: true },
      { text: 'Cancel anytime, no commitment', included: true },
      { text: 'Yearly: 2 months free (pay 10, get 12)', included: true, highlight: true },
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
  interval?: 'month' | 'year'
): CreditOption | null {
  if (plan.type === 'contact') return null

  if (plan.type === 'one-time') {
    return plan.creditOptions?.oneTime?.[1] || null // Default to second option (100 credits)
  }

  if (plan.type === 'subscription') {
    const targetInterval = interval || plan.defaultInterval || 'month'
    const options =
      targetInterval === 'year' ? plan.creditOptions?.yearly : plan.creditOptions?.monthly
    return options?.[1] || null // Default to second option (100 credits)
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
  monthly: CreditOption[]
  yearly: CreditOption[]
} {
  return {
    oneTime: ONE_TIME_OPTIONS,
    monthly: MONTHLY_OPTIONS,
    yearly: YEARLY_OPTIONS,
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
