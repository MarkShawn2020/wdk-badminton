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
  planName: z.string(),
  type: z.enum(['payg', 'subscription', 'enterprise']),
  subscriptionInterval: z.enum(['month', 'year']).optional(), // For subscriptions
  credits: z.number().int().positive().optional(), // For PAYG purchases
  monthlyCredits: z.number().int().positive().optional(), // For monthly subscriptions
  yearlyCredits: z.number().int().positive().optional(), // For yearly subscriptions
  price: z.number().int().positive(), // Price in cents
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth()

    // Parse and validate request
    const body = await request.json()
    const validated = checkoutSchema.parse(body)

    // Get Stripe instance
    const stripe = getStripe()

    // Determine credits and mode based on type
    const isSubscription = validated.type === 'subscription'
    const interval = validated.subscriptionInterval || 'month'
    const credits = isSubscription
      ? interval === 'year'
        ? validated.yearlyCredits!
        : validated.monthlyCredits!
      : validated.credits!

    // Validate credits exist
    if (!credits) {
      return errorResponse('Invalid plan configuration', 400)
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${validated.planName} - ${credits.toLocaleString()} ReelVan Credits`,
              description: isSubscription
                ? interval === 'year'
                  ? `${credits.toLocaleString()} credits per month (billed yearly)`
                  : `${credits.toLocaleString()} credits per month`
                : `${credits.toLocaleString()} PAYG credits (never expire)`,
              images: [`${process.env.NEXT_PUBLIC_APP_URL}/static/images/logo.svg`],
            },
            unit_amount: validated.price, // Price in cents from frontend
            ...(isSubscription && {
              recurring: {
                interval: interval,
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id,
        planName: validated.planName,
        type: validated.type,
        subscriptionInterval: interval,
        credits: credits.toString(),
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
