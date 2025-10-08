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
 * Credit package pricing
 * Can be customized or fetched from database
 */
const PRICING_TIERS = [
  { credits: 100, price: 100, discount: 0 }, // $1.00
  { credits: 500, price: 450, discount: 10 }, // $4.50 (10% off)
  { credits: 1000, price: 800, discount: 20 }, // $8.00 (20% off)
  { credits: 5000, price: 3500, discount: 30 }, // $35.00 (30% off)
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
              images: [`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`],
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
