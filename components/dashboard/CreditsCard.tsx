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
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 rounded-full p-3">
          <CreditCard className="text-primary h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">Credits</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCredits(currentBalance)}
          </p>
          <p className="text-xs text-gray-500">{formatCreditsAsUSD(currentBalance)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <Link href="/pricing" className="block">
          <Button variant="outline" size="sm" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setShowCoupon(!showCoupon)}
        >
          <Gift className="mr-2 h-4 w-4" />
          Redeem Coupon
          {showCoupon ? (
            <ChevronUp className="ml-auto h-4 w-4" />
          ) : (
            <ChevronDown className="ml-auto h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Coupon Input (Collapsible) */}
      {showCoupon && (
        <div className="mt-4 border-t pt-4">
          <CouponInput onSuccess={handleCouponSuccess} />
        </div>
      )}

      {/* Usage Stats (Optional) */}
      {(totalEarned !== undefined || totalSpent !== undefined) && (
        <div className="mt-4 border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Total Earned:</span>
            <span className="font-medium">{formatCredits(totalEarned || 0)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span>Total Spent:</span>
            <span className="font-medium">{formatCredits(totalSpent || 0)}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
