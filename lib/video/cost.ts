/**
 * Video processing cost calculation utilities
 *
 * CRITICAL: These calculations determine pricing and must be accurate
 * API cost structure: $0.10 per 5 seconds of video
 * User pricing: 4x markup on API costs
 */

export const PRICING = {
  // API costs
  API_COST_PER_5_SECONDS: parseFloat(process.env.VIDEO_API_COST_PER_5_SECONDS || '0.10'),

  // Credit system
  CREDITS_PER_DOLLAR: 100, // 1 credit = $0.01
  MARKUP_MULTIPLIER: 4, // 4x markup on API costs for profit margin

  // Free tier
  FREE_SIGNUP_CREDITS: 100, // $1 worth of credits on signup
  MAX_FREE_VIDEO_DURATION: 30, // 30 seconds max for free users

  // Limits
  MAX_VIDEO_DURATION: 120, // 2 minutes max
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB max
  MIN_VIDEO_DURATION: 1, // 1 second minimum

  // Rate limits per tier
  RATE_LIMITS: {
    free: {
      videosPerDay: 1,
      maxDuration: 30, // seconds
      maxFileSize: 100 * 1024 * 1024, // 100MB
    },
    paid: {
      videosPerDay: 50,
      maxDuration: 120, // seconds
      maxFileSize: 500 * 1024 * 1024, // 500MB
    },
    pro: {
      videosPerDay: 200,
      maxDuration: 120, // seconds
      maxFileSize: 1024 * 1024 * 1024, // 1GB
    },
  },
} as const

export type UserTier = keyof typeof PRICING.RATE_LIMITS

/**
 * Calculate raw API cost in USD
 *
 * @param durationSeconds - Video duration in seconds
 * @returns Cost in USD (e.g., 0.60 for 30 second video)
 *
 * @example
 * calculateApiCost(30) // => 0.60 (6 segments × $0.10)
 * calculateApiCost(7)  // => 0.20 (2 segments × $0.10, rounded up)
 */
export function calculateApiCost(durationSeconds: number): number {
  if (durationSeconds <= 0) return 0

  // Round up to nearest 5-second segment
  const segments = Math.ceil(durationSeconds / 5)
  return segments * PRICING.API_COST_PER_5_SECONDS
}

/**
 * Calculate credits required for user (includes markup)
 *
 * @param durationSeconds - Video duration in seconds
 * @returns Credits required (1 credit = $0.01)
 *
 * @example
 * calculateCreditsRequired(30) // => 240 credits ($2.40)
 * // Calculation: 6 segments × $0.10 = $0.60 API cost
 * //              $0.60 × 4 markup = $2.40 user cost
 * //              $2.40 × 100 = 240 credits
 */
export function calculateCreditsRequired(durationSeconds: number): number {
  const apiCostUsd = calculateApiCost(durationSeconds)
  const userCostUsd = apiCostUsd * PRICING.MARKUP_MULTIPLIER

  // Round up to nearest credit
  return Math.ceil(userCostUsd * PRICING.CREDITS_PER_DOLLAR)
}

/**
 * Calculate user-facing price in USD
 *
 * @param durationSeconds - Video duration in seconds
 * @returns Price in USD (e.g., 2.40)
 */
export function calculateUserPrice(durationSeconds: number): number {
  const credits = calculateCreditsRequired(durationSeconds)
  return credits / PRICING.CREDITS_PER_DOLLAR
}

/**
 * Check if user can process video based on tier limits
 *
 * @param durationSeconds - Video duration in seconds
 * @param fileSizeBytes - File size in bytes
 * @param tier - User tier
 * @returns Object with canProcess flag and reason if rejected
 */
export function checkTierLimits(
  durationSeconds: number,
  fileSizeBytes: number,
  tier: UserTier
): { canProcess: boolean; reason?: string } {
  const limits = PRICING.RATE_LIMITS[tier]

  if (durationSeconds > limits.maxDuration) {
    return {
      canProcess: false,
      reason: `Video duration (${durationSeconds}s) exceeds ${tier} tier limit of ${limits.maxDuration}s`,
    }
  }

  if (fileSizeBytes > limits.maxFileSize) {
    const maxSizeMB = Math.round(limits.maxFileSize / (1024 * 1024))
    const actualSizeMB = Math.round(fileSizeBytes / (1024 * 1024))
    return {
      canProcess: false,
      reason: `File size (${actualSizeMB}MB) exceeds ${tier} tier limit of ${maxSizeMB}MB`,
    }
  }

  return { canProcess: true }
}

/**
 * Validate video duration against absolute limits
 */
export function validateVideoDuration(durationSeconds: number): {
  valid: boolean
  reason?: string
} {
  if (durationSeconds < PRICING.MIN_VIDEO_DURATION) {
    return {
      valid: false,
      reason: `Video too short. Minimum ${PRICING.MIN_VIDEO_DURATION} second`,
    }
  }

  if (durationSeconds > PRICING.MAX_VIDEO_DURATION) {
    return {
      valid: false,
      reason: `Video too long. Maximum ${PRICING.MAX_VIDEO_DURATION} seconds (2 minutes)`,
    }
  }

  return { valid: true }
}

/**
 * Format credits as currency
 */
export function formatCredits(credits: number): string {
  return `${credits.toLocaleString()} credits`
}

/**
 * Format currency from credits
 */
export function formatCreditsAsUSD(credits: number): string {
  const usd = credits / PRICING.CREDITS_PER_DOLLAR
  return `$${usd.toFixed(2)}`
}

/**
 * Calculate cost breakdown for transparency
 */
export function getCostBreakdown(durationSeconds: number) {
  const segments = Math.ceil(durationSeconds / 5)
  const apiCost = calculateApiCost(durationSeconds)
  const userCost = calculateUserPrice(durationSeconds)
  const credits = calculateCreditsRequired(durationSeconds)

  return {
    durationSeconds,
    segments,
    apiCost, // What we pay
    userCost, // What user pays
    credits,
    markup: PRICING.MARKUP_MULTIPLIER,
    profitMargin: userCost - apiCost,
  }
}
