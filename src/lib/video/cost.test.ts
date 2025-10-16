/**
 * Unit Tests: Video Processing Cost Calculation
 *
 * CRITICAL: These tests verify the core business logic for pricing
 * Cost structure: $0.10 per 5 seconds of video
 * User pricing: 4x markup on API costs
 * Credits: 1 credit = $0.01
 *
 * Test coverage:
 * 1. API cost calculation (calculateApiCost)
 * 2. Credits calculation (calculateCreditsRequired)
 * 3. User pricing (calculateUserPrice)
 * 4. Video constraints validation
 * 5. Tier system
 * 6. Cost breakdown
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  calculateApiCost,
  calculateCreditsRequired,
  calculateUserPrice,
  validateVideoConstraints,
  getRateLimit,
  calculateTierFromPurchases,
  formatCredits,
  formatCreditsAsUSD,
  getCostBreakdown,
  PRICING,
} from './cost'

// ============================================================================
// Test Suite 1: API Cost Calculation (calculateApiCost)
// ============================================================================

describe('calculateApiCost', () => {
  describe('基础计费规则：每5秒计费', () => {
    it('应正确计算正好5秒的视频费用', () => {
      const cost = calculateApiCost(5)
      expect(cost).toBe(0.1)
    })

    it('应正确计算10秒的视频费用', () => {
      const cost = calculateApiCost(10)
      expect(cost).toBe(0.2)
    })

    it('应正确计算15秒的视频费用', () => {
      const cost = calculateApiCost(15)
      expect(cost).toBeCloseTo(0.3, 2)
    })

    it('应正确计算30秒的视频费用', () => {
      const cost = calculateApiCost(30)
      // 30 / 5 = 6 segments
      // 6 * 0.10 = 0.60
      expect(cost).toBeCloseTo(0.6, 2)
    })

    it('应正确计算60秒（1分钟）的视频费用', () => {
      const cost = calculateApiCost(60)
      // 60 / 5 = 12 segments
      // 12 * 0.10 = 1.20
      expect(cost).toBeCloseTo(1.2, 2)
    })

    it('应正确计算120秒（2分钟，最大时长）的视频费用', () => {
      const cost = calculateApiCost(120)
      // 120 / 5 = 24 segments
      // 24 * 0.10 = 2.40
      expect(cost).toBeCloseTo(2.4, 2)
    })
  })

  describe('向上取整规则：不足5秒按5秒计费', () => {
    it('1秒的视频应按5秒计费（向上取整）', () => {
      const cost = calculateApiCost(1)
      expect(cost).toBe(0.1) // 1 segment
    })

    it('3秒的视频应按5秒计费（向上取整）', () => {
      const cost = calculateApiCost(3)
      expect(cost).toBe(0.1) // 1 segment
    })

    it('6秒的视频应按10秒计费（向上取整）', () => {
      const cost = calculateApiCost(6)
      expect(cost).toBe(0.2) // 2 segments (ceil(6/5) = 2)
    })

    it('7秒的视频应按10秒计费（向上取整）', () => {
      const cost = calculateApiCost(7)
      expect(cost).toBe(0.2) // 2 segments (ceil(7/5) = 2)
    })

    it('11秒的视频应按15秒计费（向上取整）', () => {
      const cost = calculateApiCost(11)
      expect(cost).toBeCloseTo(0.3, 2) // 3 segments (ceil(11/5) = 3)
    })

    it('29秒的视频应按30秒计费（向上取整）', () => {
      const cost = calculateApiCost(29)
      expect(cost).toBeCloseTo(0.6, 2) // 6 segments (ceil(29/5) = 6)
    })

    it('31秒的视频应按35秒计费（向上取整）', () => {
      const cost = calculateApiCost(31)
      expect(cost).toBeCloseTo(0.7, 2) // 7 segments (ceil(31/5) = 7)
    })
  })

  describe('边界情况', () => {
    it('0秒的视频应返回0费用', () => {
      const cost = calculateApiCost(0)
      expect(cost).toBe(0)
    })

    it('负数时长应返回0费用', () => {
      const cost = calculateApiCost(-5)
      expect(cost).toBe(0)
    })

    it('小数时长应正确向上取整（1.5秒）', () => {
      const cost = calculateApiCost(1.5)
      expect(cost).toBe(0.1) // 1 segment
    })

    it('小数时长应正确向上取整（5.1秒）', () => {
      const cost = calculateApiCost(5.1)
      expect(cost).toBe(0.2) // 2 segments (ceil(5.1/5) = 2)
    })

    it('小数时长应正确向上取整（9.9秒）', () => {
      const cost = calculateApiCost(9.9)
      expect(cost).toBe(0.2) // 2 segments (ceil(9.9/5) = 2)
    })
  })
})

// ============================================================================
// Test Suite 2: Credits Calculation (calculateCreditsRequired)
// ============================================================================

describe('calculateCreditsRequired', () => {
  describe('积分计算规则：API成本 × 4倍加价 × 100（转为积分）', () => {
    it('5秒视频应需要40积分', () => {
      // API: $0.10, User: $0.10 × 4 = $0.40, Credits: 40
      const credits = calculateCreditsRequired(5)
      expect(credits).toBe(40)
    })

    it('10秒视频应需要80积分', () => {
      // API: $0.20, User: $0.20 × 4 = $0.80, Credits: 80
      const credits = calculateCreditsRequired(10)
      expect(credits).toBe(80)
    })

    it('30秒视频应需要240积分', () => {
      // 6 segments × $0.10 = $0.60 API
      // $0.60 × 4 = $2.40 user
      // $2.40 × 100 = 240 credits (with Math.ceil)
      const credits = calculateCreditsRequired(30)
      expect(credits).toBeGreaterThanOrEqual(240)
      expect(credits).toBeLessThanOrEqual(241)
    })

    it('60秒（1分钟）视频应需要480积分', () => {
      // 12 segments × $0.10 = $1.20 API
      // $1.20 × 4 = $4.80 user
      // $4.80 × 100 = 480 credits (with Math.ceil)
      const credits = calculateCreditsRequired(60)
      expect(credits).toBeGreaterThanOrEqual(480)
      expect(credits).toBeLessThanOrEqual(481)
    })

    it('120秒（2分钟）视频应需要960积分', () => {
      // 24 segments × $0.10 = $2.40 API
      // $2.40 × 4 = $9.60 user
      // $9.60 × 100 = 960 credits (with Math.ceil)
      const credits = calculateCreditsRequired(120)
      expect(credits).toBeGreaterThanOrEqual(960)
      expect(credits).toBeLessThanOrEqual(961)
    })
  })

  describe('不足5秒向上取整后的积分计算', () => {
    it('1秒视频应需要40积分（按5秒计费）', () => {
      const credits = calculateCreditsRequired(1)
      expect(credits).toBe(40)
    })

    it('6秒视频应需要80积分（按10秒计费）', () => {
      const credits = calculateCreditsRequired(6)
      expect(credits).toBe(80)
    })

    it('11秒视频应需要120积分（按15秒计费）', () => {
      const credits = calculateCreditsRequired(11)
      expect(credits).toBeGreaterThanOrEqual(120)
      expect(credits).toBeLessThanOrEqual(121)
    })
  })

  describe('验证4倍加价逻辑', () => {
    it('API成本和用户成本应保持4倍关系', () => {
      const durationSeconds = 30
      const apiCost = calculateApiCost(durationSeconds)
      const userPrice = calculateUserPrice(durationSeconds)

      expect(userPrice).toBeCloseTo(apiCost * PRICING.MARKUP_MULTIPLIER, 1)
      expect(userPrice).toBeCloseTo(apiCost * 4, 1)
    })

    it('不同时长下加价倍数应保持一致', () => {
      const durations = [5, 10, 15, 30, 60, 120]

      durations.forEach((duration) => {
        const apiCost = calculateApiCost(duration)
        const userPrice = calculateUserPrice(duration)
        const ratio = userPrice / apiCost

        expect(ratio).toBeCloseTo(PRICING.MARKUP_MULTIPLIER, 1)
      })
    })
  })

  describe('边界情况', () => {
    it('0秒应返回0积分', () => {
      const credits = calculateCreditsRequired(0)
      expect(credits).toBe(0)
    })

    it('负数时长应返回0积分', () => {
      const credits = calculateCreditsRequired(-5)
      expect(credits).toBe(0)
    })
  })
})

// ============================================================================
// Test Suite 3: User Price Calculation (calculateUserPrice)
// ============================================================================

describe('calculateUserPrice', () => {
  it('应将积分正确转换为美元', () => {
    const price = calculateUserPrice(5)
    // 40 credits / 100 = $0.40
    expect(price).toBe(0.4)
  })

  it('30秒视频应为$2.40', () => {
    const price = calculateUserPrice(30)
    expect(price).toBeCloseTo(2.4, 1)
  })

  it('60秒视频应为$4.80', () => {
    const price = calculateUserPrice(60)
    expect(price).toBeCloseTo(4.8, 1)
  })

  it('120秒视频应为$9.60', () => {
    const price = calculateUserPrice(120)
    expect(price).toBeCloseTo(9.6, 1)
  })
})

// ============================================================================
// Test Suite 4: Video Constraints Validation
// ============================================================================

describe('validateVideoConstraints', () => {
  describe('时长验证', () => {
    it('应拒绝0秒视频', () => {
      const result = validateVideoConstraints(0, 1024 * 1024)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('greater than 0')
    })

    it('应拒绝负时长视频', () => {
      const result = validateVideoConstraints(-5, 1024 * 1024)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('greater than 0')
    })

    it('应接受1秒视频', () => {
      const result = validateVideoConstraints(1, 1024 * 1024)
      expect(result.valid).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('应接受120秒（最大时长）视频', () => {
      const result = validateVideoConstraints(120, 1024 * 1024)
      expect(result.valid).toBe(true)
    })

    it('应拒绝超过120秒的视频', () => {
      const result = validateVideoConstraints(121, 1024 * 1024)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Maximum 120 seconds')
    })
  })

  describe('文件大小验证', () => {
    it('应接受1MB文件', () => {
      const result = validateVideoConstraints(30, 1024 * 1024)
      expect(result.valid).toBe(true)
    })

    it('应接受50MB（最大大小）文件', () => {
      const result = validateVideoConstraints(30, 50 * 1024 * 1024)
      expect(result.valid).toBe(true)
    })

    it('应拒绝超过50MB的文件', () => {
      const result = validateVideoConstraints(30, 51 * 1024 * 1024)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('exceeds maximum of 50MB')
    })

    it('应拒绝100MB文件', () => {
      const result = validateVideoConstraints(30, 100 * 1024 * 1024)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('exceeds maximum')
    })
  })

  describe('组合验证', () => {
    it('应同时验证时长和文件大小', () => {
      // 有效时长，有效文件大小
      const valid = validateVideoConstraints(30, 10 * 1024 * 1024)
      expect(valid.valid).toBe(true)

      // 无效时长，有效文件大小
      const invalidDuration = validateVideoConstraints(150, 10 * 1024 * 1024)
      expect(invalidDuration.valid).toBe(false)

      // 有效时长，无效文件大小
      const invalidSize = validateVideoConstraints(30, 60 * 1024 * 1024)
      expect(invalidSize.valid).toBe(false)
    })
  })
})

// ============================================================================
// Test Suite 5: Tier System
// ============================================================================

describe('Tier System', () => {
  describe('getRateLimit', () => {
    it('免费用户每天限制3个视频', () => {
      expect(getRateLimit('free')).toBe(3)
    })

    it('付费用户每天限制50个视频', () => {
      expect(getRateLimit('paid')).toBe(50)
    })

    it('专业用户每天限制200个视频', () => {
      expect(getRateLimit('pro')).toBe(200)
    })
  })

  describe('calculateTierFromPurchases', () => {
    it('0积分应为免费用户', () => {
      expect(calculateTierFromPurchases(0)).toBe('free')
    })

    it('1积分应升级为付费用户', () => {
      expect(calculateTierFromPurchases(1)).toBe('paid')
    })

    it('100积分应为付费用户', () => {
      expect(calculateTierFromPurchases(100)).toBe('paid')
    })

    it('5000积分应升级为专业用户', () => {
      expect(calculateTierFromPurchases(5000)).toBe('pro')
    })

    it('10000积分应为专业用户', () => {
      expect(calculateTierFromPurchases(10000)).toBe('pro')
    })
  })
})

// ============================================================================
// Test Suite 6: Formatting Utilities
// ============================================================================

describe('Formatting Utilities', () => {
  describe('formatCredits', () => {
    it('应格式化积分数量', () => {
      expect(formatCredits(100)).toBe('100 credits')
    })

    it('应为大数字添加千位分隔符', () => {
      expect(formatCredits(1000)).toBe('1,000 credits')
    })

    it('应处理5000积分', () => {
      expect(formatCredits(5000)).toBe('5,000 credits')
    })
  })

  describe('formatCreditsAsUSD', () => {
    it('应将积分转换为美元格式', () => {
      expect(formatCreditsAsUSD(100)).toBe('$1.00')
    })

    it('应处理小数', () => {
      expect(formatCreditsAsUSD(250)).toBe('$2.50')
    })

    it('应处理40积分', () => {
      expect(formatCreditsAsUSD(40)).toBe('$0.40')
    })

    it('应处理大金额', () => {
      expect(formatCreditsAsUSD(5000)).toBe('$50.00')
    })
  })
})

// ============================================================================
// Test Suite 7: Cost Breakdown
// ============================================================================

describe('getCostBreakdown', () => {
  it('应返回完整的成本分解', () => {
    const breakdown = getCostBreakdown(30)

    expect(breakdown).toHaveProperty('durationSeconds')
    expect(breakdown).toHaveProperty('segments')
    expect(breakdown).toHaveProperty('apiCost')
    expect(breakdown).toHaveProperty('userCost')
    expect(breakdown).toHaveProperty('credits')
    expect(breakdown).toHaveProperty('markup')
    expect(breakdown).toHaveProperty('profitMargin')
  })

  it('30秒视频的成本分解应正确', () => {
    const breakdown = getCostBreakdown(30)

    expect(breakdown.durationSeconds).toBe(30)
    expect(breakdown.segments).toBe(6) // ceil(30/5)
    expect(breakdown.apiCost).toBeCloseTo(0.6, 2) // 6 * 0.10
    expect(breakdown.userCost).toBeCloseTo(2.4, 1) // 0.6 * 4
    expect(breakdown.credits).toBeGreaterThanOrEqual(240) // 2.4 * 100 with Math.ceil
    expect(breakdown.credits).toBeLessThanOrEqual(241)
    expect(breakdown.markup).toBe(4)
    expect(breakdown.profitMargin).toBeCloseTo(1.8, 1) // 2.4 - 0.6
  })

  it('利润率应为用户成本减去API成本', () => {
    const durations = [5, 10, 30, 60, 120]

    durations.forEach((duration) => {
      const breakdown = getCostBreakdown(duration)
      const expectedProfit = breakdown.userCost - breakdown.apiCost

      expect(breakdown.profitMargin).toBe(expectedProfit)
    })
  })
})

// ============================================================================
// Test Suite 8: Business Logic Validation
// ============================================================================

describe('Business Logic Validation', () => {
  describe('利润率验证', () => {
    it('利润率应始终为API成本的3倍', () => {
      const durations = [5, 10, 15, 30, 60, 120]

      durations.forEach((duration) => {
        const breakdown = getCostBreakdown(duration)
        const expectedProfit = breakdown.apiCost * 3 // 4x markup - 1x cost = 3x profit

        expect(breakdown.profitMargin).toBeCloseTo(expectedProfit, 1)
      })
    })
  })

  describe('定价一致性', () => {
    it('从积分计算的价格应等于calculateUserPrice的结果', () => {
      const durations = [5, 10, 30, 60, 120]

      durations.forEach((duration) => {
        const credits = calculateCreditsRequired(duration)
        const priceFromCredits = credits / PRICING.CREDITS_PER_DOLLAR
        const directPrice = calculateUserPrice(duration)

        expect(priceFromCredits).toBe(directPrice)
      })
    })
  })

  describe('免费注册积分验证', () => {
    it('免费注册积分应能处理至少1个5秒视频', () => {
      const freeCredits = PRICING.FREE_SIGNUP_CREDITS // 100 credits
      const costPerMinVideo = calculateCreditsRequired(5) // 40 credits

      expect(freeCredits).toBeGreaterThanOrEqual(costPerMinVideo)
    })

    it('免费注册积分应能处理至少1个10秒视频', () => {
      const freeCredits = PRICING.FREE_SIGNUP_CREDITS // 100 credits
      const cost = calculateCreditsRequired(10) // 80 credits

      expect(freeCredits).toBeGreaterThanOrEqual(cost)
    })

    it('免费注册积分不足以处理1个15秒视频', () => {
      const freeCredits = PRICING.FREE_SIGNUP_CREDITS // 100 credits
      const cost = calculateCreditsRequired(15) // 120 credits

      expect(freeCredits).toBeLessThan(cost)
    })
  })
})

// ============================================================================
// Test Suite 9: Real-world Scenarios
// ============================================================================

describe('Real-world Scenarios', () => {
  it('场景1：用户上传5秒Sora视频', () => {
    const duration = 5
    const fileSize = 2 * 1024 * 1024 // 2MB

    // 验证约束
    const validation = validateVideoConstraints(duration, fileSize)
    expect(validation.valid).toBe(true)

    // 计算成本
    const credits = calculateCreditsRequired(duration)
    expect(credits).toBe(40)

    // 用户价格
    const price = calculateUserPrice(duration)
    expect(price).toBe(0.4)
  })

  it('场景2：用户上传30秒Veo视频', () => {
    const duration = 30
    const fileSize = 15 * 1024 * 1024 // 15MB

    const validation = validateVideoConstraints(duration, fileSize)
    expect(validation.valid).toBe(true)

    const credits = calculateCreditsRequired(duration)
    expect(credits).toBeGreaterThanOrEqual(240) // $2.40 with Math.ceil
    expect(credits).toBeLessThanOrEqual(241)

    const breakdown = getCostBreakdown(duration)
    expect(breakdown.apiCost).toBeCloseTo(0.6, 2)
    expect(breakdown.profitMargin).toBeCloseTo(1.8, 1)
  })

  it('场景3：用户尝试上传3分钟视频（应拒绝）', () => {
    const duration = 180 // 3 minutes
    const fileSize = 30 * 1024 * 1024

    const validation = validateVideoConstraints(duration, fileSize)
    expect(validation.valid).toBe(false)
    expect(validation.reason).toContain('Maximum 120 seconds')
  })

  it('场景4：免费用户首次使用（100积分）', () => {
    const freeCredits = PRICING.FREE_SIGNUP_CREDITS // 100 credits

    // 可以处理多少秒的视频？
    // 100 credits / 8 credits per second = 12.5 seconds
    // But we charge per 5 seconds, so:
    // 5 seconds = 40 credits ✓
    // 10 seconds = 80 credits ✓
    // 15 seconds = 120 credits ✗

    expect(calculateCreditsRequired(5)).toBeLessThanOrEqual(freeCredits)
    expect(calculateCreditsRequired(10)).toBeLessThanOrEqual(freeCredits)
    expect(calculateCreditsRequired(15)).toBeGreaterThan(freeCredits)
  })

  it('场景5：付费用户购买1000积分（$10）', () => {
    const purchasedCredits = 1000

    // 升级为付费用户
    const tier = calculateTierFromPurchases(purchasedCredits)
    expect(tier).toBe('paid')

    // 每日限制
    const dailyLimit = getRateLimit(tier)
    expect(dailyLimit).toBe(50)

    // 可以处理多少秒的视频？
    // 1000 / 8 = 125 seconds (max 120s anyway)
    const maxDuration = 120
    const cost = calculateCreditsRequired(maxDuration)
    expect(cost).toBeLessThanOrEqual(purchasedCredits)
  })
})
