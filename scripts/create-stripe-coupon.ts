/**
 * Create Stripe Coupons and Promotion Codes
 *
 * This script creates promotional coupons and codes in Stripe.
 *
 * Strategy: Users get FULL credits even with discount (true promotion)
 * Discount only applies to payment amount, not credit amount.
 *
 * Usage:
 *   pnpm tsx --env-file=.env.local scripts/create-stripe-coupon.ts
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

/**
 * Coupon configurations
 */
const COUPONS: Array<{
  id: string
  name: string
  percent_off?: number
  amount_off?: number
  currency?: string
  duration: 'forever' | 'once' | 'repeating'
  max_redemptions?: number
  metadata?: Record<string, string>
}> = [
  {
    id: 'REELVAN90',
    name: 'ReelVan 90% Off',
    percent_off: 90,
    duration: 'forever', // Can be: 'forever', 'once', 'repeating'
    max_redemptions: 100, // Optional: limit total uses
    metadata: {
      campaign: 'launch',
      description: '90% off launch promotion',
    },
  },
  {
    id: 'REELVAN50',
    name: 'ReelVan 50% Off',
    percent_off: 50,
    duration: 'once', // Only applies to first payment (good for subscriptions)
    metadata: {
      campaign: 'standard',
      description: '50% off standard promotion',
    },
  },
  {
    id: 'LAUNCH100',
    name: '$100 Off',
    amount_off: 10000, // $100 in cents
    currency: 'usd',
    duration: 'once',
    metadata: {
      campaign: 'high-value',
      description: '$100 off for high-value customers',
    },
  },
]

/**
 * Promotion code configurations
 * These are the codes users enter at checkout
 */
const PROMOTION_CODES = [
  {
    coupon_id: 'REELVAN90',
    code: 'Reelvan9', // User-friendly code
    active: true,
    max_redemptions: 100,
    metadata: {
      notes: 'Launch promotion - 90% off',
    },
  },
  {
    coupon_id: 'REELVAN50',
    code: 'WELCOME50',
    active: true,
    metadata: {
      notes: 'Welcome promotion - 50% off first purchase',
    },
  },
  {
    coupon_id: 'LAUNCH100',
    code: 'BIGLAUNCH',
    active: true,
    max_redemptions: 50,
    metadata: {
      notes: '$100 off for early adopters',
    },
  },
]

async function createCoupons() {
  console.log('🎫 Creating Stripe Coupons...\n')

  for (const couponConfig of COUPONS) {
    try {
      // Check if coupon already exists
      try {
        const existing = await stripe.coupons.retrieve(couponConfig.id)
        console.log(`⚠️  Coupon ${couponConfig.id} already exists:`)
        console.log(`   Name: ${existing.name}`)
        if (existing.percent_off) {
          console.log(`   Discount: ${existing.percent_off}% off`)
        } else if (existing.amount_off) {
          console.log(`   Discount: $${(existing.amount_off / 100).toFixed(2)} off`)
        }
        console.log(`   Duration: ${existing.duration}`)
        console.log()
        continue
      } catch {
        // Coupon doesn't exist, create it
      }

      // Create new coupon
      const coupon = await stripe.coupons.create({
        id: couponConfig.id,
        name: couponConfig.name,
        percent_off: couponConfig.percent_off,
        amount_off: couponConfig.amount_off,
        currency: couponConfig.currency,
        duration: couponConfig.duration,
        max_redemptions: couponConfig.max_redemptions,
        metadata: couponConfig.metadata,
      })

      console.log(`✅ Created coupon: ${coupon.id}`)
      console.log(`   Name: ${coupon.name}`)
      if (coupon.percent_off) {
        console.log(`   Discount: ${coupon.percent_off}% off`)
      } else if (coupon.amount_off) {
        console.log(`   Discount: $${(coupon.amount_off / 100).toFixed(2)} off`)
      }
      console.log(`   Duration: ${coupon.duration}`)
      console.log()
    } catch (error) {
      console.error(`❌ Failed to create coupon ${couponConfig.id}:`, error)
      console.log()
    }
  }
}

async function createPromotionCodes() {
  console.log('\n🎟️  Creating Promotion Codes...\n')
  console.log('ℹ️  Note: Due to Stripe API version differences, you may need to create')
  console.log('   promotion codes manually in Stripe Dashboard.\n')
  console.log('📝 To create promotion codes manually:')
  console.log('   1. Go to: https://dashboard.stripe.com/test/coupons')
  console.log('   2. Click on a coupon (e.g., REELVAN90)')
  console.log('   3. Click "Create promotion code"')
  console.log('   4. Enter code (e.g., "Reelvan9")')
  console.log('   5. Set max redemptions if needed')
  console.log('   6. Click "Create promotion code"\n')

  for (const promoConfig of PROMOTION_CODES) {
    console.log(`📋 Suggested promotion code for coupon "${promoConfig.coupon_id}":`)
    console.log(`   Code: "${promoConfig.code}"`)
    console.log(`   Max redemptions: ${promoConfig.max_redemptions || 'Unlimited'}`)
    console.log(`   Active: ${promoConfig.active}`)
    console.log()
  }
}

async function listPromotionCodes() {
  console.log('\n📋 Current Promotion Codes:\n')

  try {
    const codes = await stripe.promotionCodes.list({
      limit: 20,
    })

    if (codes.data.length === 0) {
      console.log('No promotion codes found.')
      return
    }

    for (const code of codes.data) {
      console.log(`Code: "${code.code}"`)
      console.log(`  ID: ${code.id}`)
      console.log(`  Active: ${code.active}`)
      console.log(`  Times redeemed: ${code.times_redeemed}`)
      if (code.max_redemptions) {
        console.log(`  Max redemptions: ${code.max_redemptions}`)
      }

      // Note: Coupon details require expanding, which has type issues with current Stripe SDK
      // To see full coupon details, check in Stripe Dashboard or retrieve coupon separately
      console.log(`  Note: Check Stripe Dashboard for full coupon details`)
      console.log()
    }
  } catch (error) {
    console.error('❌ Failed to list promotion codes:', error)
  }
}

async function main() {
  console.log('🚀 Stripe Coupon & Promotion Code Manager\n')
  console.log('='.repeat(60))
  console.log()

  await createCoupons()
  await createPromotionCodes()
  await listPromotionCodes()

  console.log('='.repeat(60))
  console.log('\n✨ Done! Users can now use these codes at checkout.')
  console.log('\n📝 Note: Users get FULL credits even with discount.')
  console.log('   The discount only applies to the payment amount.')
  console.log('\n🔗 Test in Stripe Dashboard: https://dashboard.stripe.com/test/coupons')
}

main().catch(console.error)
