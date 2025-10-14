'use client'

/**
 * Credits Card Component for Dashboard
 *
 * Shows:
 * - Current credit balance
 * - Coupon redemption input
 * - Buy credits button
 */

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/components/ui/card'
import { Button } from '@/components/components/ui/button'
import { CreditCard, Gift, ChevronDown, ChevronUp } from 'lucide-react'
import { CouponInput } from '@/components/coupon/CouponInput'
import { formatCredits, formatCreditsAsUSD } from '@/lib/video/cost'

interface CreditsCardProps {
  balance: number
  totalEarned?: number
  totalSpent?: number
}

export function CreditsCard({ balance, totalEarned, totalSpent }: CreditsCardProps) {
  const [showCoupon, setShowCoupon] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(balance)

  const handleCouponSuccess = (creditsReceived: number, newBalance: number) => {
    setCurrentBalance(newBalance)
    // Auto-collapse coupon input after success
    setTimeout(() => setShowCoupon(false), 2000)
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <CreditCard className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Available Credits</p>
              <p className="text-4xl font-bold">{formatCredits(currentBalance)}</p>
              <p className="text-sm text-white/60">{formatCreditsAsUSD(currentBalance)}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Link href="/pricing">
              <Button variant="secondary" size="sm" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Buy Credits
              </Button>
            </Link>
          </div>
        </div>

        {/* Usage Stats */}
        {(totalEarned !== undefined || totalSpent !== undefined) && (
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
            <div>
              <p className="text-xs text-white/60">Total Earned</p>
              <p className="text-lg font-semibold">{formatCredits(totalEarned || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Total Spent</p>
              <p className="text-lg font-semibold">{formatCredits(totalSpent || 0)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Coupon Section */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-left"
          onClick={() => setShowCoupon(!showCoupon)}
        >
          <Gift className="text-chart-4 mr-2 h-4 w-4" />
          <span className="flex-1">Have a coupon code?</span>
          {showCoupon ? (
            <ChevronUp className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          )}
        </Button>

        {/* Coupon Input (Collapsible) */}
        {showCoupon && (
          <div className="mt-3">
            <CouponInput onSuccess={handleCouponSuccess} />
          </div>
        )}
      </div>
    </Card>
  )
}
