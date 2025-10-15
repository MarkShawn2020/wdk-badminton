/**
 * ReelVan Pricing Data Configuration
 *
 * Based on 定价章程 (Pricing Charter) - Operation-Based Model
 *
 * Core Concepts:
 * - Default Input: 10s Sora2 video (720p 30fps)
 * - Standard Output: 10s video (1080p 60fps)
 * - "次" (Transaction): Processing 1 standard unit (10s video)
 * - Unit: Minimum processing unit = 5 seconds
 * - Credit: ≈ $0.01 API cost
 * - CM (Cost Multiple): Selling Price / API Cost
 *
 * Operations & Costs:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Service │ Cost/10s │ Credits/10s │ Credits/5s │ Description    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ WMR     │ $0.10    │ 10          │ 5          │ Watermark only │
 * │ E       │ $0.12-0.2│ 20          │ 10         │ Enhancement    │
 * │ FB      │ $0.22-0.3│ 30          │ 15         │ Full Bundle    │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Pricing Strategy (3 Tiers):
 * 1. PAYG (诱饵定价 Decoy Pricing) - High anchor pricing
 * 2. Subscription (目标定价 Target Pricing) - Best value
 * 3. Enterprise (Custom) - Large volume
 *
 * Free Strategy:
 * - New users: 15 credits (can process 5s FB video)
 * - Insufficient credit warning with partial processing option
 */

/**
 * Operation Types
 * - WMR: Watermark Removal only
 * - E: Enhancement only (720p→1080p 60fps)
 * - FB: Full Bundle (WMR + Enhancement) - DEFAULT
 */
export type OperationType = 'WMR' | 'E' | 'FB'

/**
 * Operation Costs (per 10s video)
 */
export const OPERATION_COSTS = {
  WMR: { credits: 10, apiCost: 0.1, creditsPerUnit: 5 }, // 5 credits per 5s
  E: { credits: 20, apiCost: 0.16, creditsPerUnit: 10 }, // 10 credits per 5s
  FB: { credits: 30, apiCost: 0.26, creditsPerUnit: 15 }, // 15 credits per 5s (DEFAULT)
} as const

export interface CreditOption {
  credits: number
  price: number // Price in cents
  priceDisplay: string
  originalPrice?: number // For showing strikethrough
  originalPriceDisplay?: string
  discount?: number // percentage off
  // How many FB operations (10s videos) this can process
  fbCount: number
  fbCountDisplay: string // e.g., "3.66次 FB"
  // Internal classification
  category: 'decoy' | 'target' | 'deletable' | 'popular'
}

export interface PricingTier {
  id: string
  name: string
  type: 'payg' | 'subscription' | 'enterprise'
  tagline: string
  description: string

  // For subscription tier (monthly/yearly toggle)
  hasIntervalToggle?: boolean
  defaultInterval?: 'month' | 'year'

  // Credit options
  options?: CreditOption[]
  monthlyOptions?: CreditOption[]
  yearlyOptions?: CreditOption[]

  // Features list
  features: Array<{
    text: string
    included: boolean
    highlight?: boolean
    badge?: string
  }>

  ctaText: string
  popular?: boolean
  mostPopular?: boolean // "Most Popular" badge
  isContactSales?: boolean
}

// ==========================================
// PRICING OPTIONS (Based on CSV Data)
// ==========================================
//
// Strategy:
// 1. PAYG: 诱饵定价 (Decoy Pricing) - High unit price to anchor
// 2. Monthly: 目标定价 (Target Pricing) - Best value for regular users
// 3. Yearly: 目标定价 (Target Pricing) - Best value for committed users
//
// Note on "可删除" (Deletable):
// - These tiers are valid but may be removed for cleaner UI
// - Decision pending frontend layout considerations
// ==========================================

/**
 * PAYG Options - 诱饵定价 (Decoy Pricing)
 * Purpose: Anchor effect, not expected to be main revenue
 * All are "decoy" category
 */
const PAYG_OPTIONS: CreditOption[] = [
  {
    credits: 10,
    price: 449, // $4.49
    priceDisplay: '$4.49',
    originalPrice: 449,
    originalPriceDisplay: '$4.49',
    discount: 0,
    fbCount: 0.33, // 10/30 = 0.33
    fbCountDisplay: '0.33次',
    category: 'decoy',
  },
  {
    credits: 20,
    price: 899, // $8.99
    priceDisplay: '$8.99',
    originalPrice: 899,
    originalPriceDisplay: '$8.99',
    discount: 0,
    fbCount: 0.66, // 20/30 = 0.66
    fbCountDisplay: '0.66次',
    category: 'decoy',
  },
  {
    credits: 30,
    price: 1299, // $12.99
    priceDisplay: '$12.99',
    originalPrice: 1348, // $13.48 (original)
    originalPriceDisplay: '$13.48',
    discount: 3.6, // 3.6% off
    fbCount: 1,
    fbCountDisplay: '1次 FB',
    category: 'decoy',
  },
]

/**
 * Monthly Subscription Options
 * Category: target (目标), deletable (可删除), popular (Most Popular)
 */
const MONTHLY_OPTIONS: CreditOption[] = [
  {
    credits: 110,
    price: 999, // $9.99
    priceDisplay: '$9.99',
    originalPrice: 4990, // $49.90 (10 credits @ $4.49 each)
    originalPriceDisplay: '$49.90',
    discount: 80, // 80% off
    fbCount: 3.66, // 110/30 ≈ 3.66
    fbCountDisplay: '3.66次 FB',
    category: 'target',
  },
  {
    credits: 220,
    price: 1499, // $14.99
    priceDisplay: '$14.99',
    originalPrice: 9840, // $98.40 (calculated from CSV)
    originalPriceDisplay: '$98.40',
    discount: 84.8, // 84.8% off
    fbCount: 7.33, // 220/30 ≈ 7.33
    fbCountDisplay: '7.33次 FB',
    category: 'deletable',
  },
  {
    credits: 560,
    price: 2999, // $29.99
    priceDisplay: '$29.99',
    originalPrice: 25070, // $250.70 (calculated)
    originalPriceDisplay: '$250.70',
    discount: 88, // 88% off
    fbCount: 18.6, // 560/30 ≈ 18.6
    fbCountDisplay: '18.6次 FB',
    category: 'popular',
  },
  {
    credits: 1180,
    price: 4999, // $49.99
    priceDisplay: '$49.99',
    originalPrice: 52976, // $529.76 (calculated)
    originalPriceDisplay: '$529.76',
    discount: 90.6, // 90.6% off
    fbCount: 39.3, // 1180/30 ≈ 39.3
    fbCountDisplay: '39.3次 FB',
    category: 'popular',
  },
]

/**
 * Yearly Subscription Options
 * Note: Prices shown should be divided by 12 for monthly equivalent in UI
 * Category: decoy (诱饵), deletable (可删除), popular (Most Popular)
 */
const YEARLY_OPTIONS: CreditOption[] = [
  {
    credits: 1320, // 110 credits/month × 12 months
    price: 9999, // $99.99/year = $8.33/month
    priceDisplay: '$99.99',
    originalPrice: 59312, // $593.12
    originalPriceDisplay: '$593.12',
    discount: 83.1, // 83.1% off
    fbCount: 44, // 1320/30 = 44
    fbCountDisplay: '44次 FB',
    category: 'decoy',
  },
  {
    credits: 2640, // 220 credits/month × 12 months
    price: 14999, // $149.99/year = $12.50/month
    priceDisplay: '$149.99',
    originalPrice: 118624, // $1186.24
    originalPriceDisplay: '$1186.24',
    discount: 87.4, // 87.4% off
    fbCount: 88, // 2640/30 = 88
    fbCountDisplay: '88次 FB',
    category: 'deletable',
  },
  {
    credits: 6660, // 555 credits/month × 12 months
    price: 19999, // $199.99/year = $16.67/month
    priceDisplay: '$199.99',
    originalPrice: 296560, // $2965.60
    originalPriceDisplay: '$2965.60',
    discount: 93.3, // 93.3% off
    fbCount: 220, // 6660/30 = 222
    fbCountDisplay: '220次 FB',
    category: 'popular',
  },
  {
    credits: 13200, // 1100 credits/month × 12 months
    price: 35999, // $359.99/year = $30.00/month
    priceDisplay: '$359.99',
    originalPrice: 593120, // $5931.20
    originalPriceDisplay: '$5931.20',
    discount: 93.9, // 93.9% off
    fbCount: 440, // 13200/30 = 440
    fbCountDisplay: '440次 FB',
    category: 'popular',
  },
]

// ==========================================
// PRICING TIERS (3 Cards)
// Based on 定价章程 Strategy
// ==========================================

export const pricingPlans: PricingTier[] = [
  // ==========================================
  // CARD 1: PAYG (Pay As You Go)
  // 诱饵定价 (Decoy Pricing) - Anchor Effect
  // ==========================================
  {
    id: 'payg',
    name: 'Pay As You Go',
    type: 'payg',
    tagline: 'Simple one-time purchase',
    description: 'Perfect for trying ReelVan. No commitment required.',

    options: PAYG_OPTIONS,

    features: [
      { text: 'Credits never expire', included: true, highlight: true },
      { text: 'From $4.49 (10 credits)', included: true },
      { text: 'Watermark removal', included: true },
      { text: 'Quality enhancement', included: true },
      { text: 'HD & 1080p 60fps export', included: true },
      { text: 'Commercial use rights', included: true },
      { text: 'Email support', included: true },
    ],

    ctaText: 'Buy Credits',
    popular: false,
  },

  // ==========================================
  // CARD 2: Subscription (Monthly + Yearly)
  // 目标定价 (Target Pricing) - Best Value
  // ==========================================
  {
    id: 'subscription',
    name: 'Subscription',
    type: 'subscription',
    tagline: 'Best value for regular use',
    description: 'Save up to 93% with flexible plans. Credits reset monthly.',

    hasIntervalToggle: true,
    defaultInterval: 'month',

    monthlyOptions: MONTHLY_OPTIONS,
    yearlyOptions: YEARLY_OPTIONS,

    features: [
      { text: 'Save up to 93% vs PAYG', included: true, highlight: true, badge: 'Best Value' },
      { text: 'From $9.99/month', included: true, highlight: true },
      { text: 'Credits reset every month', included: true },
      { text: 'Cancel anytime', included: true },
      { text: 'Yearly: Pay 10 months, get 12', included: true, highlight: true },
      { text: 'Full Bundle (WMR + Enhancement)', included: true },
      { text: 'HD & 1080p 60fps export', included: true },
      { text: 'Commercial use rights', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Priority processing queue', included: true, highlight: true },
    ],

    ctaText: 'Subscribe Now',
    popular: true,
    mostPopular: true,
  },

  // ==========================================
  // CARD 3: Enterprise
  // Custom Pricing for Large Volume
  // ==========================================
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'enterprise',
    tagline: 'Custom solutions for teams',
    description: 'Volume pricing, dedicated support, and custom integrations.',

    features: [
      { text: 'Custom credit packages', included: true, highlight: true },
      { text: 'Volume discounts (save even more)', included: true, highlight: true },
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
  if (plan.type === 'enterprise') return null

  if (plan.type === 'payg') {
    return plan.options?.[2] || null // Default to FB option (30 credits)
  }

  if (plan.type === 'subscription') {
    const targetInterval = interval || plan.defaultInterval || 'month'
    const options = targetInterval === 'year' ? plan.yearlyOptions : plan.monthlyOptions
    // Default to first "popular" option or second option
    const popularOption = options?.find((opt) => opt.category === 'popular')
    return popularOption || options?.[0] || null
  }

  return null
}

/**
 * Calculate cost per FB operation (10s video)
 */
export function calculateCostPerFB(credits: number, price: number): string {
  const fbCount = credits / OPERATION_COSTS.FB.credits
  const costPerFB = price / 100 / fbCount // Convert cents to dollars
  return `$${costPerFB.toFixed(2)}/video`
}

/**
 * Calculate margin for a credit option
 * Based on FB operation: API cost ≈ $0.26 per 10s video (30 credits)
 */
export function calculateMargin(option: CreditOption): number {
  const apiCostPerCredit = OPERATION_COSTS.FB.apiCost / OPERATION_COSTS.FB.credits
  const apiCost = option.credits * apiCostPerCredit
  const revenue = option.price / 100 // Convert cents to dollars
  const margin = ((revenue - apiCost) / revenue) * 100
  return Math.round(margin)
}

/**
 * Calculate how many seconds of video can be processed with given credits
 * Assumes FB operation (15 credits per 5s)
 */
export function calculateProcessingTime(
  credits: number,
  operation: OperationType = 'FB'
): {
  seconds: number
  display: string
} {
  const creditsPerUnit = OPERATION_COSTS[operation].creditsPerUnit
  const units = credits / creditsPerUnit // How many 5s units
  const seconds = units * 5

  let display: string
  if (seconds < 60) {
    display = `${seconds}s`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    display = remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  return { seconds, display }
}

/**
 * Get all credit options across all plans
 */
export function getAllCreditOptions(): {
  payg: CreditOption[]
  monthly: CreditOption[]
  yearly: CreditOption[]
} {
  return {
    payg: PAYG_OPTIONS,
    monthly: MONTHLY_OPTIONS,
    yearly: YEARLY_OPTIONS,
  }
}

/**
 * Get pricing tier by type
 */
export function getPlansByType(type: 'payg' | 'subscription' | 'enterprise'): PricingTier[] {
  return pricingPlans.filter((plan) => plan.type === type)
}

/**
 * Get the most popular plan
 */
export function getPopularPlan(): PricingTier | undefined {
  return pricingPlans.find((plan) => plan.mostPopular || plan.popular)
}

/**
 * Filter options by category
 */
export function filterOptionsByCategory(
  options: CreditOption[],
  excludeCategories?: Array<'decoy' | 'deletable'>
): CreditOption[] {
  if (!excludeCategories || excludeCategories.length === 0) return options
  return options.filter((opt) => {
    // Type-safe category check: only filter out if category matches excluded ones
    if (opt.category === 'decoy' || opt.category === 'deletable') {
      return !excludeCategories.includes(opt.category)
    }
    // Keep 'target' and 'popular' categories
    return true
  })
}

// Legacy exports for backward compatibility
export const subscriptionPlans = pricingPlans.filter((p) => p.type === 'subscription')
export const creditPackages = pricingPlans.filter((p) => p.type === 'payg')
