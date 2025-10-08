/**
 * User Dashboard Page
 *
 * Shows:
 * - Credit balance
 * - Video processing history
 * - Usage statistics
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { VideoList } from '@/components/video/VideoList'
import { Button } from '@/components/components/ui/button'
import { Card } from '@/components/components/ui/card'
import { CreditsCard } from '@/components/dashboard/CreditsCard'
import { Sparkles, Video as VideoIcon, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import type { Database } from '@/types/database'

type VideoRow = Database['public']['Tables']['videos']['Row']

export const metadata: Metadata = {
  title: 'Dashboard | ReelVan',
  description: 'View your video processing history and credit balance',
}

export default async function DashboardPage() {
  const supabase = await createServerClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signup')
  }

  // Fetch user credits
  const creditsResult = await supabase
    .from('user_credits')
    .select('balance, total_earned, total_spent, tier')
    .eq('user_id', user.id)
    .single()

  const credits = creditsResult.data as {
    balance: number
    total_earned: number
    total_spent: number
    tier: string
  } | null

  // Fetch videos with pagination
  const result = await supabase
    .from('videos')
    .select(
      `
      id,
      original_filename,
      duration_seconds,
      file_size_bytes,
      status,
      progress,
      error_message,
      original_url,
      processed_url,
      estimated_cost_credits,
      created_at
    `,
      { count: 'exact' }
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const videos = result.data as VideoRow[] | null

  const count = result.count

  // Calculate statistics
  const completedCount = videos?.filter((v) => v.status === 'completed').length || 0
  const processingCount =
    videos?.filter(
      (v) => v.status === 'processing' || v.status === 'uploading' || v.status === 'pending'
    ).length || 0
  const totalVideos = count || 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your videos and credits</p>
        </div>
        <Link href="/enhance">
          <Button size="lg">
            <Sparkles className="mr-2 h-5 w-5" />
            New Video
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Credit Balance with Coupon Input */}
        <CreditsCard
          balance={credits?.balance || 0}
          totalEarned={credits?.total_earned}
          totalSpent={credits?.total_spent}
        />

        {/* Total Videos */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <VideoIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalVideos}</p>
              <p className="text-xs text-gray-500">{completedCount} completed</p>
            </div>
          </div>
        </Card>

        {/* Processing */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {processingCount}
              </p>
              <p className="text-xs text-gray-500">Active jobs</p>
            </div>
          </div>
        </Card>

        {/* Tier Badge */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize dark:text-gray-100">
                {credits?.tier || 'Free'}
              </p>
              <Link href="/pricing" className="text-primary text-xs hover:underline">
                Upgrade
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Video List */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Your Videos</h2>
        <VideoList initialVideos={videos || []} initialTotal={totalVideos} />
      </div>
    </div>
  )
}
