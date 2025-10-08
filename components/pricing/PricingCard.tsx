'use client'

/**
 * Pricing Card Component
 *
 * Shows appropriate CTA button based on user authentication status:
 * - Not logged in: "Get started" → /signup
 * - Logged in: "Buy credits" → Stripe checkout (TODO)
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface PricingCardProps {
  tier: {
    name: string
    price: string
    description: string
    features: Array<{ text: string; included: boolean }>
    highlighted?: boolean
    ctaText: string
  }
}

export function PricingCard({ tier }: PricingCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

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

  // Show loading state while checking auth
  if (isLoggedIn === null) {
    return <PricingCardSkeleton highlighted={tier.highlighted} />
  }

  const cardClasses = tier.highlighted
    ? 'bg-primary-600 relative flex flex-col rounded-3xl p-8 shadow-2xl ring-1 ring-gray-900/10'
    : 'flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800'

  const textColor = tier.highlighted ? 'text-white' : 'text-gray-900 dark:text-gray-100'
  const subtextColor = tier.highlighted ? 'text-gray-100' : 'text-gray-500 dark:text-gray-400'
  const featureColor = tier.highlighted ? 'text-white' : 'text-gray-700 dark:text-gray-300'

  return (
    <div className={cardClasses}>
      {tier.highlighted && (
        <div className="bg-primary-700 absolute -top-5 right-0 left-0 mx-auto w-32 rounded-full px-3 py-2 text-center text-sm font-semibold text-white">
          Most Popular
        </div>
      )}

      <div className="flex-1">
        <h3 className={`text-xl font-semibold ${textColor}`}>{tier.name}</h3>
        <p className="mt-4 flex items-baseline">
          <span className={`text-5xl font-bold tracking-tight ${textColor}`}>{tier.price}</span>
          {tier.name === 'Pay-as-you-go' && (
            <span className={`ml-1 text-xl ${subtextColor}`}>/second</span>
          )}
          {tier.name === 'Pro' && <span className={`ml-1 text-xl ${subtextColor}`}>/month</span>}
        </p>
        <p className={`mt-6 text-base ${subtextColor}`}>{tier.description}</p>

        <ul className="mt-8 space-y-4">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <span className={tier.highlighted ? 'mr-3 text-white' : 'text-primary-600 mr-3'}>
                {feature.included ? '✓' : '−'}
              </span>
              <span
                className={feature.included ? featureColor : 'text-gray-500 dark:text-gray-400'}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      {isLoggedIn ? (
        // Logged in: Show appropriate action
        tier.name === 'Free' ? (
          <Link
            href="/enhance"
            className={
              tier.highlighted
                ? 'text-primary-600 mt-8 block rounded-lg bg-white px-4 py-3 text-center text-base font-semibold hover:bg-gray-50'
                : 'mt-8 block rounded-lg bg-gray-50 px-4 py-3 text-center text-base font-semibold text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
            }
          >
            Start Processing
          </Link>
        ) : (
          // TODO: Implement Stripe checkout
          <button
            onClick={() => alert('Stripe checkout coming soon!')}
            className={
              tier.highlighted
                ? 'text-primary-600 mt-8 block w-full rounded-lg bg-white px-4 py-3 text-center text-base font-semibold hover:bg-gray-50'
                : tier.name === 'Pro'
                  ? 'bg-primary-600 hover:bg-primary-700 mt-8 block w-full rounded-lg px-4 py-3 text-center text-base font-semibold text-white'
                  : 'mt-8 block w-full rounded-lg bg-gray-50 px-4 py-3 text-center text-base font-semibold text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
            }
          >
            {tier.ctaText}
          </button>
        )
      ) : (
        // Not logged in: Show signup
        <Link
          href="/signup"
          className={
            tier.highlighted
              ? 'text-primary-600 mt-8 block rounded-lg bg-white px-4 py-3 text-center text-base font-semibold hover:bg-gray-50'
              : tier.name === 'Pro'
                ? 'bg-primary-600 hover:bg-primary-700 mt-8 block rounded-lg px-4 py-3 text-center text-base font-semibold text-white'
                : 'mt-8 block rounded-lg bg-gray-50 px-4 py-3 text-center text-base font-semibold text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
          }
        >
          Get started
        </Link>
      )}
    </div>
  )
}

// Loading skeleton
function PricingCardSkeleton({ highlighted }: { highlighted?: boolean }) {
  return (
    <div
      className={
        highlighted
          ? 'bg-primary-600 relative flex flex-col rounded-3xl p-8 shadow-2xl ring-1 ring-gray-900/10'
          : 'flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800'
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
