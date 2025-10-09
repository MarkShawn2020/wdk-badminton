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
    credits: number
    price: number // in cents
    priceDisplay: string
    discount: number
    description: string
    features: Array<{ text: string; included: boolean; highlight?: boolean }>
    popular?: boolean
    ctaText: string
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

  const handleBuyCredits = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Call /api/checkout to create Stripe session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: tier.credits,
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

  const cardClasses = tier.popular
    ? 'bg-primary-600 relative flex flex-col rounded-3xl p-8 shadow-2xl ring-1 ring-gray-900/10'
    : 'relative flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800'

  const textColor = tier.popular ? 'text-white' : 'text-gray-900 dark:text-gray-100'
  const subtextColor = tier.popular ? 'text-gray-100' : 'text-gray-500 dark:text-gray-400'
  const featureColor = tier.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'

  return (
    <div className={cardClasses}>
      {tier.popular && (
        <div className="bg-primary-700 absolute -top-5 right-0 left-0 mx-auto w-32 rounded-full px-3 py-2 text-center text-sm font-semibold text-white">
          Most Popular
        </div>
      )}

      {tier.discount > 0 && (
        <div className="absolute -top-3 -right-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
          Save {tier.discount}%
        </div>
      )}

      <div className="flex-1">
        <h3 className={`text-lg font-semibold sm:text-xl ${textColor}`}>{tier.name}</h3>

        <div className="mt-6">
          <p className={`text-4xl font-bold tracking-tight sm:text-5xl ${textColor}`}>
            {tier.priceDisplay}
          </p>
          <p className={`mt-2 text-xs sm:text-sm ${subtextColor}`}>
            {tier.credits.toLocaleString()} credits
          </p>
        </div>

        <p className={`mt-6 text-sm sm:text-base ${subtextColor}`}>{tier.description}</p>

        <ul className="mt-6 space-y-2 sm:mt-8 sm:space-y-3">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <span
                className={
                  tier.popular ? 'mr-2 text-white sm:mr-3' : 'text-primary-600 mr-2 sm:mr-3'
                }
              >
                {feature.included ? '✓' : '−'}
              </span>
              <span
                className={`text-sm sm:text-base ${feature.included ? featureColor : 'text-gray-500 dark:text-gray-400'} ${feature.highlight ? 'font-semibold' : ''}`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      {isLoggedIn ? (
        <button
          onClick={handleBuyCredits}
          disabled={isLoading}
          className={`${
            tier.popular
              ? 'text-primary-600 mt-8 block w-full rounded-lg bg-white px-4 py-3 text-center text-base font-semibold hover:bg-gray-50 disabled:opacity-50'
              : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 mt-8 block w-full rounded-lg px-4 py-3 text-center text-base font-semibold text-white disabled:opacity-50'
          }`}
        >
          {isLoading ? 'Loading...' : tier.ctaText}
        </button>
      ) : (
        <Link
          href="/signup"
          className={
            tier.popular
              ? 'text-primary-600 mt-8 block rounded-lg bg-white px-4 py-3 text-center text-base font-semibold hover:bg-gray-50'
              : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 mt-8 block rounded-lg px-4 py-3 text-center text-base font-semibold text-white'
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
          ? 'bg-primary-600 relative flex flex-col rounded-3xl p-8 shadow-2xl ring-1 ring-gray-900/10'
          : 'relative flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800'
      }
    >
      <div className="h-96 animate-pulse">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-12 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-6 h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}
