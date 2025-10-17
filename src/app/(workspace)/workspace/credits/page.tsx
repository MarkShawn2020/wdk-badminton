import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Button } from '@/components/components/ui/button'
import { Badge } from '@/components/components/ui/badge'
import { Separator } from '@/components/components/ui/separator'
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Clock,
  Gift,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { formatCredits } from '@/lib/video/cost'
import { CouponInput } from '@/components/coupon/CouponInput'

/**
 * Credits Page - Purchase credits and view usage history
 *
 * Features:
 * - Current balance display
 * - Credit package selection
 * - Purchase flow
 * - Usage history
 * - Transaction records
 * - Coupon redemption
 */

export default async function CreditsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user profile and credits
  const { data: profile } = await supabase
    .from('user_credits')
    .select('balance, created_at')
    .eq('user_id', user.id)
    .single()

  // Fetch transaction history
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Calculate stats
  const totalEarned =
    transactions?.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0

  const totalSpent =
    transactions?.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  const estimatedVideosRemaining = Math.floor((profile?.balance || 0) / 150)

  // Credit packages (matching pricing page)
  const packages = [
    {
      credits: 500,
      price: 5,
      perCredit: 0.01,
      popular: false,
    },
    {
      credits: 2000,
      price: 18,
      perCredit: 0.009,
      popular: true,
      savings: 10,
    },
    {
      credits: 5000,
      price: 40,
      perCredit: 0.008,
      popular: false,
      savings: 20,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits</h1>
        <p className="text-muted-foreground">Manage your credits and view transaction history</p>
      </div>

      {/* Current Balance */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <CreditCard className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Current Balance</p>
                <p className="text-4xl font-bold">{formatCredits(profile?.balance || 0)}</p>
                <p className="text-sm text-white/60">
                  ≈ {estimatedVideosRemaining} videos remaining
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
            <div>
              <p className="text-xs text-white/60">Total Earned</p>
              <p className="text-lg font-semibold">{formatCredits(totalEarned)}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Total Spent</p>
              <p className="text-lg font-semibold">{formatCredits(totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Gift className="text-primary h-5 w-5" />
            <h3 className="font-semibold">Have a coupon code?</h3>
          </div>
          <CouponInput onSuccess={() => {}} />
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Buy Credits</h2>
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="gap-1">
              View all plans
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.credits} className={pkg.popular ? 'border-primary shadow-lg' : ''}>
              {pkg.popular && (
                <div className="bg-primary text-primary-foreground px-3 py-1 text-center text-xs font-semibold">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold">{formatCredits(pkg.credits)}</div>
                  <div className="text-muted-foreground mt-2 text-sm font-normal">
                    ${pkg.price} USD
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-muted-foreground text-center text-sm">
                  ${pkg.perCredit.toFixed(3)} per credit
                </div>
                {pkg.savings && (
                  <Badge variant="secondary" className="w-full justify-center">
                    Save {pkg.savings}%
                  </Badge>
                )}
                <Button className="w-full gap-2" variant={pkg.popular ? 'default' : 'outline'}>
                  <ShoppingCart className="h-4 w-4" />
                  Purchase
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  ≈ {Math.floor(pkg.credits / 150)} videos
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Transaction History</h2>

        {transactions && transactions.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.map((transaction) => {
                  const isCredit = transaction.amount > 0
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isCredit
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {isCredit ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingDown className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.type.replace('_', ' ')}
                          </p>
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>
                              {transaction.created_at
                                ? new Date(transaction.created_at).toLocaleString()
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            isCredit
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isCredit ? '+' : ''}
                          {formatCredits(transaction.amount)}
                        </p>
                        {transaction.metadata &&
                          typeof transaction.metadata === 'object' &&
                          'video_id' in transaction.metadata && (
                            <p className="text-muted-foreground text-xs">Video processing</p>
                          )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 font-semibold">No transactions yet</h3>
              <p className="text-muted-foreground text-sm">
                Your transaction history will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
