'use client'

/**
 * Dynamic Pricing Card Component
 *
 * Supports 3 card types with dynamic credit selection:
 * 1. One-Time: Dropdown to select credit package
 * 2. Subscription: Toggle (Weekly/Monthly) + Dropdown
 * 3. Enterprise: Contact sales
 *
 * Inspired by watermarkremover.io's interactive pricing cards
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { PricingTier, CreditOption } from '@/data/pricingData'
import { getDefaultCreditOption } from '@/data/pricingData'

interface DynamicPricingCardProps {
  tier: PricingTier
}

export function DynamicPricingCard({ tier }: DynamicPricingCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Subscription interval state
  const [interval, setInterval] = useState<'week' | 'month'>(tier.defaultInterval || 'month')

  // Selected credit option state
  const [selectedOption, setSelectedOption] = useState<CreditOption | null>(() =>
    getDefaultCreditOption(tier, interval)
  )

  // Update selected option when interval changes
  useEffect(() => {
    if (tier.type === 'subscription') {
      const newOption = getDefaultCreditOption(tier, interval)
      setSelectedOption(newOption)
    }
  }, [interval, tier])

  // Check authentication
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
    if (isLoading || !selectedOption) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: tier.name,
          type: tier.type,
          subscriptionInterval: tier.type === 'subscription' ? interval : undefined,
          credits: tier.type === 'one-time' ? selectedOption.credits : undefined,
          weeklyCredits:
            tier.type === 'subscription' && interval === 'week'
              ? selectedOption.credits
              : undefined,
          monthlyCredits:
            tier.type === 'subscription' && interval === 'month'
              ? selectedOption.credits
              : undefined,
          price: selectedOption.price,
        }),
      })

      const data = await response.json()

      if (data.success && data.data.url) {
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

  // Get available options based on tier and interval
  const getAvailableOptions = (): CreditOption[] => {
    if (tier.type === 'one-time') {
      return tier.creditOptions?.oneTime || []
    }
    if (tier.type === 'subscription') {
      return interval === 'week'
        ? tier.creditOptions?.weekly || []
        : tier.creditOptions?.monthly || []
    }
    return []
  }

  // Loading state
  if (isLoggedIn === null) {
    return <PricingCardSkeleton popular={tier.popular} />
  }

  // Card styling
  const cardClasses = tier.isContactSales
    ? 'bg-muted/30 relative flex flex-col h-full rounded-2xl p-6 xl:p-8 ring-1 ring-border transition-all duration-300 hover:shadow-lg'
    : tier.popular
      ? 'bg-primary-600 relative flex flex-col h-full rounded-2xl p-6 xl:p-8 shadow-2xl ring-1 ring-border/10 transition-all duration-300 hover:shadow-3xl'
      : 'relative flex flex-col h-full rounded-2xl bg-card p-6 xl:p-8 ring-1 ring-border transition-all duration-300 hover:shadow-xl'

  const textColor = tier.popular ? 'text-primary-foreground' : 'text-foreground'
  const subtextColor = tier.popular ? 'text-primary-foreground/90' : 'text-muted-foreground'
  const featureColor = tier.popular ? 'text-primary-foreground' : 'text-foreground'

  return (
    <div className={cardClasses}>
      {/* Header Badge */}
      {tier.popular && (
        <div className="bg-primary-700 text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-semibold">
          Most Popular
        </div>
      )}

      <div className="flex-1">
        {/* Title */}
        <div className="mb-4">
          <h3 className={`text-2xl font-bold ${textColor}`}>{tier.name}</h3>
          <p
            className={`mt-1 text-sm font-medium ${tier.popular ? 'text-primary-foreground/80' : 'text-primary-600'}`}
          >
            {tier.tagline}
          </p>
          <p className={`mt-2 text-sm ${subtextColor}`}>{tier.description}</p>
        </div>

        {/* Interactive Selection (One-time & Subscription) */}
        {!tier.isContactSales && (
          <div className="mb-6 space-y-4">
            {/* Subscription Interval Toggle */}
            {tier.hasIntervalToggle && (
              <div className="flex gap-2">
                <button
                  onClick={() => setInterval('week')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    interval === 'week'
                      ? tier.popular
                        ? 'bg-primary-700 text-primary-foreground'
                        : 'bg-primary-600 text-white'
                      : tier.popular
                        ? 'bg-primary-800/50 text-primary-foreground/60 hover:bg-primary-800'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setInterval('month')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    interval === 'month'
                      ? tier.popular
                        ? 'bg-primary-700 text-primary-foreground'
                        : 'bg-primary-600 text-white'
                      : tier.popular
                        ? 'bg-primary-800/50 text-primary-foreground/60 hover:bg-primary-800'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Monthly
                </button>
              </div>
            )}

            {/* Credit Selection - Compact Single Line */}
            <div className="space-y-1">
              <p className={`mb-1.5 text-xs font-medium ${textColor}`}>Choose credits:</p>
              {getAvailableOptions().map((option) => {
                const isSelected = selectedOption?.credits === option.credits
                return (
                  <button
                    key={option.credits}
                    onClick={() => setSelectedOption(option)}
                    className={`flex w-full items-center gap-2 rounded border px-2.5 py-1.5 text-xs transition-all ${
                      isSelected
                        ? tier.popular
                          ? 'border-primary-700 bg-primary-700/20'
                          : 'border-primary-600 bg-primary-50 dark:bg-primary-950/30'
                        : tier.popular
                          ? 'border-primary-800/30 bg-primary-800/10 hover:border-primary-700/50'
                          : 'border-border hover:border-primary-600/50 bg-transparent'
                    }`}
                  >
                    {/* Radio indicator - smaller */}
                    <div
                      className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? tier.popular
                            ? 'border-primary-foreground bg-primary-foreground'
                            : 'border-primary-600 bg-primary-600'
                          : tier.popular
                            ? 'border-primary-foreground/40'
                            : 'border-border'
                      }`}
                    >
                      {isSelected && (
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            tier.popular ? 'bg-primary-600' : 'bg-white'
                          }`}
                        />
                      )}
                    </div>

                    {/* Compact info in one line */}
                    <div className="flex flex-1 items-center justify-between gap-1 overflow-hidden">
                      <span className={`font-medium ${textColor} truncate`}>
                        {option.credits.toLocaleString()}
                      </span>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <span className={`text-[10px] line-through opacity-50 ${subtextColor}`}>
                          {option.basePriceDisplay}
                        </span>
                        <span className={`font-semibold ${textColor}`}>
                          {option.priceDisplay}
                          {tier.type === 'subscription' && (
                            <span className="text-[10px] font-normal">
                              /{interval === 'week' ? 'w' : 'm'}
                            </span>
                          )}
                        </span>
                        {option.discount > 0 && (
                          <span
                            className={`flex-shrink-0 rounded px-1 py-0.5 text-[10px] leading-none font-semibold ${
                              tier.popular
                                ? 'bg-primary-800 text-primary-foreground'
                                : 'bg-primary-600 text-white'
                            }`}
                          >
                            -{option.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Enterprise - Custom Pricing */}
        {tier.isContactSales && (
          <div className="border-border from-muted/50 mb-6 rounded-lg border bg-gradient-to-br to-transparent p-6 text-center">
            <div className="text-foreground text-4xl font-bold">Custom</div>
            <div className="text-muted-foreground mt-1 text-sm">Volume pricing available</div>
          </div>
        )}

        {/* Features List */}
        <ul className="space-y-2.5">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span
                className={
                  tier.popular
                    ? 'text-primary-foreground mt-0.5 flex-shrink-0 text-base'
                    : 'text-primary-600 mt-0.5 flex-shrink-0 text-base'
                }
              >
                {feature.included ? '✓' : '−'}
              </span>
              <span
                className={`text-sm ${feature.included ? featureColor : 'text-muted-foreground'} ${feature.highlight ? 'font-semibold' : ''}`}
              >
                {feature.text}
                {feature.badge && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      tier.popular
                        ? 'bg-primary-800 text-primary-foreground'
                        : 'bg-primary-600 text-white'
                    }`}
                  >
                    {feature.badge}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="mt-6">
        {tier.isContactSales ? (
          <Link
            href="mailto:sales@reelvan.com?subject=Enterprise%20Plan%20Inquiry"
            className="bg-secondary text-foreground hover:bg-muted block rounded-lg px-6 py-3.5 text-center text-base font-semibold transition-colors"
          >
            {tier.ctaText}
          </Link>
        ) : isLoggedIn ? (
          <button
            onClick={handlePurchase}
            disabled={isLoading || !selectedOption}
            className={`block w-full rounded-lg px-6 py-3.5 text-center text-base font-semibold transition-colors disabled:opacity-50 ${
              tier.popular
                ? 'text-primary-600 bg-background hover:bg-secondary'
                : 'bg-primary-600 hover:bg-primary-700 text-primary-foreground'
            }`}
          >
            {isLoading ? 'Loading...' : tier.ctaText}
          </button>
        ) : (
          <Link
            href="/signup"
            className={`block rounded-lg px-6 py-3.5 text-center text-base font-semibold transition-colors ${
              tier.popular
                ? 'text-primary-600 bg-background hover:bg-secondary'
                : 'bg-primary-600 hover:bg-primary-700 text-primary-foreground'
            }`}
          >
            Get started
          </Link>
        )}
      </div>
    </div>
  )
}

// Loading skeleton
function PricingCardSkeleton({ popular }: { popular?: boolean }) {
  return (
    <div
      className={
        popular
          ? 'bg-primary-600 ring-border/10 relative flex flex-col rounded-2xl p-8 shadow-2xl ring-1'
          : 'bg-card ring-border relative flex flex-col rounded-2xl p-8 ring-1'
      }
    >
      <div className="h-96 animate-pulse space-y-4">
        <div className="bg-muted h-6 w-32 rounded" />
        <div className="bg-muted h-12 w-24 rounded" />
        <div className="bg-muted h-4 w-48 rounded" />
      </div>
    </div>
  )
}
