'use client'

/**
 * Pricing Card Component (流量包模式)
 *
 * Shows credit packages with Stripe checkout integration:
 * - Not logged in: "Get started" → /signup
 * - Logged in: "Buy Now" → Stripe checkout
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface PricingCardProps {
  tier: {
    name: string
    type: 'one-time' | 'subscription' | 'contact'
    credits?: number
    monthlyCredits?: number
    price: number
    priceDisplay: string
    discount: number
    description: string
    videoExamples: string
    features: Array<{ text: string; included: boolean; highlight?: boolean; badge?: string }>
    popular?: boolean
    ctaText: string
    isContactSales?: boolean
  }
}

export function PricingCard({ tier }: PricingCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()
  }, [])

  const handlePurchase = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Call /api/checkout to create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: tier.name,
          type: tier.type,
          credits: tier.credits,
          monthlyCredits: tier.monthlyCredits,
          price: tier.price,
        }),
      })

      const data = await response.json()

      if (data.success && data.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.data.url
      } else {
        console.error('Checkout failed:', data)
        alert('Failed to create checkout session. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth
  if (isLoggedIn === null) {
    return <PricingCardSkeleton popular={tier.popular} />
  }

  const cardClasses = tier.isContactSales
    ? 'bg-muted/30 relative flex flex-col h-full rounded-2xl p-5 xl:p-6 ring-1 ring-border transition-all duration-300 hover:shadow-lg min-w-[320px]'
    : tier.popular
      ? 'bg-primary-600 relative flex flex-col h-full rounded-2xl p-5 xl:p-6 shadow-2xl ring-1 ring-border/10 transition-all duration-300 hover:shadow-3xl min-w-[320px]'
      : 'relative flex flex-col h-full rounded-2xl bg-card p-5 xl:p-6 ring-1 ring-border transition-all duration-300 hover:shadow-xl min-w-[320px]'

  const textColor = tier.popular ? 'text-primary-foreground' : 'text-foreground'
  const subtextColor = tier.popular ? 'text-primary-foreground/90' : 'text-muted-foreground'
  const featureColor = tier.popular ? 'text-primary-foreground' : 'text-foreground'

  return (
    <div className={cardClasses}>
      {/* Badges Section - contained within card */}
      <div className="mb-4 flex min-h-[2rem] items-center justify-between gap-2">
        {tier.popular && (
          <div className="bg-primary-700 text-primary-foreground inline-block rounded-full px-3.5 py-1.5 text-sm leading-tight font-semibold">
            Most Popular
          </div>
        )}
        {tier.discount > 0 && (
          <div
            className={`${tier.popular ? 'bg-primary-800' : tier.isContactSales ? 'bg-muted text-muted-foreground' : 'bg-primary-600'} ml-auto inline-block rounded-full px-3.5 py-1.5 text-sm leading-tight font-semibold ${tier.isContactSales ? '' : 'text-white'}`}
          >
            {tier.isContactSales ? 'Up to 30%' : `Save ${tier.discount}%`}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-lg font-bold xl:text-xl ${textColor}`}>{tier.name}</h3>
          {tier.isContactSales && (
            <span className="border-border bg-background text-muted-foreground rounded border px-2 py-1 text-xs font-semibold">
              Enterprise
            </span>
          )}
        </div>

        <div className="mt-4 flex h-28 flex-col justify-center xl:mt-5 xl:h-32">
          {/* Regular price display for subscriptions */}
          {tier.type === 'subscription' && tier.discount > 0 && (
            <p className={`text-xs line-through ${subtextColor} opacity-75`}>
              Regular value:{' '}
              {tier.name === 'Starter' ? '$14.96' : tier.name === 'Pro' ? '$49.85' : ''}
            </p>
          )}

          <div className="flex items-baseline gap-2">
            <p className={`text-4xl font-bold tracking-tight xl:text-5xl ${textColor}`}>
              {tier.priceDisplay}
            </p>
            {tier.type === 'subscription' && <span className={`text-lg ${subtextColor}`}>/mo</span>}
          </div>
          <p className={`mt-2 text-sm xl:text-base ${subtextColor}`}>
            {tier.isContactSales
              ? 'Tailored to your needs'
              : tier.type === 'one-time'
                ? `${tier.credits?.toLocaleString()} credits (one-time)`
                : `${tier.monthlyCredits?.toLocaleString()} credits/month`}
          </p>
          {tier.discount > 0 && !tier.isContactSales && (
            <p className="text-success mt-1 text-sm font-semibold xl:text-base">
              Save {tier.discount}% vs Basic
            </p>
          )}
        </div>

        <p className={`mt-4 text-sm leading-relaxed xl:mt-5 xl:text-base ${subtextColor}`}>
          {tier.description}
        </p>

        <ul className="mt-4 space-y-2 xl:mt-5 xl:space-y-2.5">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start justify-between gap-2">
              <div className="flex items-start">
                <span
                  className={
                    tier.popular
                      ? 'text-primary-foreground mr-2 flex-shrink-0 text-base'
                      : 'text-primary-600 mr-2 flex-shrink-0 text-base'
                  }
                >
                  {feature.included ? '✓' : '−'}
                </span>
                <span
                  className={`text-sm leading-relaxed xl:text-base ${feature.included ? featureColor : 'text-muted-foreground'} ${feature.highlight ? 'font-semibold' : ''}`}
                >
                  {feature.text}
                </span>
              </div>
              {feature.badge && (
                <span
                  className={`${tier.popular ? 'bg-primary-800' : 'bg-primary-600'} flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white`}
                >
                  {feature.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      {tier.isContactSales ? (
        <Link
          href="mailto:sales@reelvan.com?subject=Business%20Plan%20Inquiry"
          className="bg-secondary text-foreground hover:bg-muted mt-5 block rounded-lg px-4 py-2.5 text-center text-base font-semibold transition-colors xl:mt-6 xl:py-3 xl:text-lg"
        >
          {tier.ctaText}
        </Link>
      ) : isLoggedIn ? (
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`${
            tier.popular
              ? 'text-primary-600 bg-background hover:bg-secondary mt-5 block w-full rounded-lg px-4 py-2.5 text-center text-base font-semibold transition-colors disabled:opacity-50 xl:mt-6 xl:py-3 xl:text-lg'
              : 'bg-primary-600 hover:bg-primary-700 text-primary-foreground mt-5 block w-full rounded-lg px-4 py-2.5 text-center text-base font-semibold transition-colors disabled:opacity-50 xl:mt-6 xl:py-3 xl:text-lg'
          }`}
        >
          {isLoading ? 'Loading...' : tier.ctaText}
        </button>
      ) : (
        <Link
          href="/signup"
          className={
            tier.popular
              ? 'text-primary-600 bg-background hover:bg-secondary mt-5 block rounded-lg px-4 py-2.5 text-center text-base font-semibold transition-colors xl:mt-6 xl:py-3 xl:text-lg'
              : 'bg-primary-600 hover:bg-primary-700 text-primary-foreground mt-5 block rounded-lg px-4 py-2.5 text-center text-base font-semibold transition-colors xl:mt-6 xl:py-3 xl:text-lg'
          }
        >
          Get started
        </Link>
      )}
    </div>
  )
}

// Loading skeleton
function PricingCardSkeleton({ popular }: { popular?: boolean }) {
  return (
    <div
      className={
        popular
          ? 'bg-primary-600 ring-border/10 relative flex min-w-[320px] flex-col rounded-3xl p-8 shadow-2xl ring-1'
          : 'bg-card ring-border relative flex min-w-[320px] flex-col rounded-3xl p-8 ring-1'
      }
    >
      <div className="h-96 animate-pulse">
        <div className="bg-muted h-6 w-32 rounded" />
        <div className="bg-muted mt-4 h-12 w-24 rounded" />
        <div className="bg-muted mt-6 h-4 w-48 rounded" />
      </div>
    </div>
  )
}
