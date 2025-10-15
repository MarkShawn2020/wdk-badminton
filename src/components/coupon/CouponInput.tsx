'use client'

/**
 * Coupon Input Component
 *
 * Allows users to redeem promotional coupon codes
 * Features:
 * - Input validation
 * - Loading states
 * - Success/Error feedback
 * - Credits balance update
 */

import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Input } from '@/components/components/ui/input'
import { AlertCircle, CheckCircle2, Gift, Loader2 } from 'lucide-react'

interface CouponInputProps {
  onSuccess?: (creditsReceived: number, newBalance: number) => void
  className?: string
}

export function CouponInput({ onSuccess, className }: CouponInputProps) {
  const [code, setCode] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleRedeem = async () => {
    // Clear previous message
    setMessage(null)

    // Validate input
    const trimmedCode = code.trim()
    if (!trimmedCode) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' })
      return
    }

    setIsRedeeming(true)

    try {
      const response = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmedCode }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Success!
        setMessage({
          type: 'success',
          text: `🎉 ${data.data.message}`,
        })
        setCode('') // Clear input

        // Notify parent component
        if (onSuccess) {
          onSuccess(data.data.creditsReceived, data.data.newBalance)
        }
      } else {
        // Error
        setMessage({
          type: 'error',
          text: data.error || 'Failed to redeem coupon',
        })
      }
    } catch (error) {
      console.error('Coupon redemption error:', error)
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.',
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRedeeming) {
      handleRedeem()
    }
  }

  return (
    <div className={className}>
      {/* Input Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Gift className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            disabled={isRedeeming}
            className="pl-10 font-mono uppercase"
            maxLength={50}
          />
        </div>
        <Button onClick={handleRedeem} disabled={isRedeeming || !code.trim()}>
          {isRedeeming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redeeming...
            </>
          ) : (
            'Redeem'
          )}
        </Button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${
            message.type === 'success'
              ? 'bg-success/10 text-success-foreground'
              : 'bg-destructive/10 text-destructive-foreground'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="flex-1">{message.text}</p>
        </div>
      )}
    </div>
  )
}
