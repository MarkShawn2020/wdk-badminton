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
    subscriptionInterval?: 'week' | 'month'
    credits?: number
    weeklyCredits?: number
    monthlyCredits?: number
    price: number
    priceDisplay: string
    pricePerCredit: string
    discount: number
    description: string
    videoExamples: string
    features: Array<{ text: string; included: boolean; highlight?: boolean; badge?: string }>
    popular?: boolean
    ctaText: string
    isContactSales?: boolean
    // Flexible content fields (can be customized from data layer)
    regularPriceDisplay?: string // For strikethrough price display
    savingsText?: string // Custom savings text (e.g., "Save 50% vs Basic")
    popularBadgeText?: string // Custom "Most Popular" badge text
    discountBadgeText?: string // Custom discount badge (e.g., "Save 30%", "Up to 30%")
    tierBadge?: string // Custom tier badge (e.g., "Enterprise", "Pro")
    emptyStateText?: string // Text for contact/enterprise cards
    signupCtaText?: string // CTA text for non-logged-in users
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
          subscriptionInterval: tier.subscriptionInterval,
          credits: tier.credits,
          weeklyCredits: tier.weeklyCredits,
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
    ? 'bg-muted/30 relative flex flex-col h-full rounded-2xl p-4 xl:p-5 ring-1 ring-border transition-all duration-300 hover:shadow-lg min-w-[320px]'
    : tier.popular
      ? 'bg-primary-600 relative flex flex-col h-full rounded-2xl p-4 xl:p-5 shadow-2xl ring-1 ring-border/10 transition-all duration-300 hover:shadow-3xl min-w-[320px]'
      : 'relative flex flex-col h-full rounded-2xl bg-card p-4 xl:p-5 ring-1 ring-border transition-all duration-300 hover:shadow-xl min-w-[320px]'

  const textColor = tier.popular ? 'text-primary-foreground' : 'text-foreground'
  const subtextColor = tier.popular ? 'text-primary-foreground/90' : 'text-muted-foreground'
  const featureColor = tier.popular ? 'text-primary-foreground' : 'text-foreground'

  return (
    <div className={cardClasses}>
      {/* Badges Section - contained within card */}
      <div className="mb-3 flex min-h-[1.75rem] items-center justify-between gap-2">
        {tier.popular && (
          <div className="bg-primary-700 text-primary-foreground inline-block rounded-full px-3 py-1 text-xs leading-tight font-semibold">
            {tier.popularBadgeText || 'Most Popular'}
          </div>
        )}
        {tier.discount > 0 && (
          <div
            className={`${tier.popular ? 'bg-primary-800' : tier.isContactSales ? 'bg-muted text-muted-foreground' : 'bg-primary-600'} ml-auto inline-block rounded-full px-3 py-1 text-xs leading-tight font-semibold ${tier.isContactSales ? '' : 'text-white'}`}
          >
            {tier.discountBadgeText || `Save ${tier.discount}%`}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-lg font-bold xl:text-xl ${textColor}`}>{tier.name}</h3>
          {tier.tierBadge && (
            <span className="border-border bg-background text-muted-foreground rounded border px-2 py-1 text-xs font-semibold">
              {tier.tierBadge}
            </span>
          )}
        </div>

        <div className="mt-3">
          {/* Regular price display (optional) */}
          {tier.regularPriceDisplay && (
            <p className={`text-xs line-through ${subtextColor} mb-1 opacity-75`}>
              {tier.regularPriceDisplay}
            </p>
          )}

          <div className="flex items-baseline gap-1.5">
            <p className={`text-3xl font-bold tracking-tight xl:text-4xl ${textColor}`}>
              {tier.priceDisplay}
            </p>
            {tier.type === 'subscription' && (
              <span className={`text-base ${subtextColor}`}>
                {tier.subscriptionInterval === 'week' ? '/week' : '/month'}
              </span>
            )}
          </div>
          <p className={`mt-1.5 text-sm ${subtextColor}`}>
            {tier.isContactSales
              ? tier.emptyStateText || 'Tailored to your needs'
              : tier.type === 'one-time'
                ? `${tier.credits?.toLocaleString()} credits (one-time)`
                : tier.subscriptionInterval === 'week'
                  ? `${tier.weeklyCredits?.toLocaleString()} credits/week`
                  : `${tier.monthlyCredits?.toLocaleString()} credits/month`}
          </p>
          <p className={`mt-0.5 text-xs ${subtextColor} opacity-75`}>{tier.pricePerCredit}</p>
          {tier.discount > 0 && !tier.isContactSales && tier.savingsText && (
            <p className="text-success mt-1 text-xs font-semibold xl:text-sm">{tier.savingsText}</p>
          )}
        </div>

        <p className={`mt-3 text-xs leading-relaxed xl:text-sm ${subtextColor}`}>
          {tier.description}
        </p>

        <ul className="mt-3 space-y-1.5">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start justify-between gap-2">
              <div className="flex items-start">
                <span
                  className={
                    tier.popular
                      ? 'text-primary-foreground mr-1.5 flex-shrink-0 text-sm'
                      : 'text-primary-600 mr-1.5 flex-shrink-0 text-sm'
                  }
                >
                  {feature.included ? '✓' : '−'}
                </span>
                <span
                  className={`text-xs leading-relaxed xl:text-sm ${feature.included ? featureColor : 'text-muted-foreground'} ${feature.highlight ? 'font-semibold' : ''}`}
                >
                  {feature.text}
                </span>
              </div>
              {feature.badge && (
                <span
                  className={`${tier.popular ? 'bg-primary-800' : 'bg-primary-600'} flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white`}
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
          className="bg-secondary text-foreground hover:bg-muted mt-4 block rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors"
        >
          {tier.ctaText}
        </Link>
      ) : isLoggedIn ? (
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`${
            tier.popular
              ? 'text-primary-600 bg-background hover:bg-secondary mt-4 block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors disabled:opacity-50'
              : 'bg-primary-600 hover:bg-primary-700 text-primary-foreground mt-4 block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors disabled:opacity-50'
          }`}
        >
          {isLoading ? 'Loading...' : tier.ctaText}
        </button>
      ) : (
        <Link
          href="/signup"
          className={
            tier.popular
              ? 'text-primary-600 bg-background hover:bg-secondary mt-4 block rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors'
              : 'bg-primary-600 hover:bg-primary-700 text-primary-foreground mt-4 block rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors'
          }
        >
          {tier.signupCtaText || 'Get started'}
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
          ? 'bg-primary-600 ring-border/10 relative flex min-w-[320px] flex-col rounded-2xl p-4 shadow-2xl ring-1 xl:p-5'
          : 'bg-card ring-border relative flex min-w-[320px] flex-col rounded-2xl p-4 ring-1 xl:p-5'
      }
    >
      <div className="h-80 animate-pulse">
        <div className="bg-muted h-5 w-28 rounded" />
        <div className="bg-muted mt-3 h-10 w-20 rounded" />
        <div className="bg-muted mt-4 h-3 w-40 rounded" />
      </div>
    </div>
  )
}
