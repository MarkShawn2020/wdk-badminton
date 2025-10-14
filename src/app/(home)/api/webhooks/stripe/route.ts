/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 * Handles Stripe payment events
 *
 * CRITICAL: This endpoint adds credits after successful payments
 */

import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * Get Stripe instance (lazy initialization to avoid build-time errors)
 */
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
  })
}

/**
 * Stripe webhook endpoint
 * Must use raw body for signature verification
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing Stripe signature')
    return Response.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Stripe webhook received:', event.type)

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Checkout session completed:', {
          session_id: session.id,
          customer_email: session.customer_email,
          payment_status: session.payment_status,
        })

        // Only process if payment is successful
        if (session.payment_status !== 'paid') {
          console.log('Payment not completed yet, skipping')
          break
        }

        // Extract metadata
        const userId = session.metadata?.userId
        const credits = session.metadata?.credits

        if (!userId || !credits) {
          console.error('Missing metadata in checkout session:', session.id)
          break
        }

        // Check for promotion code usage
        let promotionInfo: {
          discount_amount: number
          original_amount: number
          paid_amount: number
          discount_percent: number
          session_id: string
        } | null = null

        if (
          session.total_details?.amount_discount &&
          session.total_details.amount_discount > 0 &&
          session.amount_total !== null
        ) {
          // Fetch full session with line items to get promotion code details
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['total_details.breakdown'],
          })

          const originalAmount = session.amount_total + session.total_details.amount_discount
          const discountPercent = Math.round(
            (session.total_details.amount_discount / originalAmount) * 100
          )

          promotionInfo = {
            discount_amount: session.total_details.amount_discount, // in cents
            original_amount: originalAmount,
            paid_amount: session.amount_total,
            discount_percent: discountPercent,
            // Note: Getting exact promo code requires expanded session
            session_id: session.id,
          }

          console.log('🎟️  Promotion code applied:', {
            discount: `$${(session.total_details.amount_discount / 100).toFixed(2)}`,
            discount_percent: `${discountPercent}%`,
            original: `$${(originalAmount / 100).toFixed(2)}`,
            paid: `$${(session.amount_total / 100).toFixed(2)}`,
          })
        }

        // Add credits to user account
        // IMPORTANT: User gets FULL credits regardless of discount (true promotion)
        // The promotion code only affects payment amount, not credit amount
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: addCreditsError } = await (supabase.rpc as any)('add_credits', {
          p_user_id: userId,
          p_amount: parseInt(credits),
          p_stripe_payment_id: session.payment_intent as string,
          p_stripe_session_id: session.id,
        })

        if (addCreditsError) {
          console.error('Failed to add credits:', addCreditsError)
          // Don't throw - log for manual review
        } else {
          console.log('✅ Credits added successfully:', {
            user_id: userId,
            amount: credits,
            promotion_applied: !!promotionInfo,
          })
        }

        // Update transaction record with promotion info if applicable
        if (promotionInfo) {
          const { error: updateError } = await supabase
            .from('credit_transactions')
            .update({
              metadata: {
                promotion: promotionInfo,
                note: 'User received full credits with promotional discount on payment',
              },
            })
            .eq('stripe_session_id', session.id)

          if (updateError) {
            console.error('Failed to update transaction with promotion info:', updateError)
          } else {
            console.log('✅ Transaction updated with promotion info')
          }
        }

        // TODO: Send confirmation email
        // await sendPurchaseConfirmationEmail(userId, parseInt(credits))

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.log('Payment intent succeeded:', {
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
        })

        // Most credit additions are handled in checkout.session.completed
        // This is a backup or for direct payment intents
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.error('Payment intent failed:', {
          payment_intent_id: paymentIntent.id,
          last_payment_error: paymentIntent.last_payment_error,
        })

        // TODO: Notify user of payment failure
        // await sendPaymentFailureEmail(paymentIntent.metadata?.userId)

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        console.log('Charge refunded:', {
          charge_id: charge.id,
          amount_refunded: charge.amount_refunded,
        })

        // TODO: Handle refunds - deduct credits if applicable
        // This requires storing charge IDs in transactions table

        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // TODO: Handle subscription events when implementing subscription tiers
        const subscription = event.data.object as Stripe.Subscription

        console.log('Subscription event:', {
          type: event.type,
          subscription_id: subscription.id,
          status: subscription.status,
        })

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return Response.json({ received: true, type: event.type })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

/**
 * Disable body parsing for this route
 * Stripe requires raw body for signature verification
 */
export const runtime = 'nodejs'
