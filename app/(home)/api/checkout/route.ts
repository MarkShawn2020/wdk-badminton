/**
 * Checkout API Route
 *
 * POST /api/checkout
 * Creates Stripe checkout session for credit purchase
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'

/**
 * Get Stripe instance (lazy initialization to avoid build-time errors)
 */
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
  })
}

/**
 * Request schema
 */
const checkoutSchema = z.object({
  credits: z
    .number()
    .int()
    .positive()
    .min(100, 'Minimum purchase is 100 credits')
    .max(100000, 'Maximum purchase is 100,000 credits'),
})

/**
 * Credit package pricing (simplified)
 *
 * Design philosophy:
 * - No pre-created Stripe Products needed (dynamic pricing)
 * - Clear value progression (100 → 500 → 2000 → 10000)
 * - Discount incentives for larger purchases
 *
 * User segments:
 * - 100 credits: Trial users (1 short video)
 * - 500 credits: Casual users (~5 videos)
 * - 2000 credits: Regular users (~20 videos)
 * - 10000 credits: Business/Pro users (~100 videos)
 */
const PRICING_TIERS = [
  { credits: 100, price: 100, discount: 0 }, // $1.00 - Trial
  { credits: 500, price: 450, discount: 10 }, // $4.50 - Save $0.50
  { credits: 2000, price: 1600, discount: 20 }, // $16.00 - Save $4
  { credits: 10000, price: 7000, discount: 30 }, // $70.00 - Save $30
]

/**
 * Calculate price for credits
 */
function calculatePrice(credits: number): number {
  // Find matching tier
  const tier = PRICING_TIERS.find((t) => t.credits === credits)
  if (tier) return tier.price

  // Calculate custom amount (no discount)
  return credits // 1 credit = $0.01
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth()

    // Parse and validate request
    const body = await request.json()
    const validated = checkoutSchema.parse(body)

    // Calculate price
    const price = calculatePrice(validated.credits)

    // Get Stripe instance
    const stripe = getStripe()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${validated.credits.toLocaleString()} ReelVan Credits`,
              description: 'Credits for video processing on ReelVan',
              images: [`${process.env.NEXT_PUBLIC_APP_URL}/static/images/logo.svg`],
            },
            unit_amount: price, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id,
        credits: validated.credits.toString(),
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session')
    }

    return successResponse({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Checkout API error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid request data', 400, error.issues)
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    // Generic error
    return errorResponse('Failed to create checkout session', 500)
  }
}
