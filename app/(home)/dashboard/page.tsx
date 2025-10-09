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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your videos and credits</p>
          </div>
          <Link href="/transformer">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              New Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Credits Card - Full Width */}
      <div className="mb-6">
        <CreditsCard
          balance={credits?.balance || 0}
          totalEarned={credits?.total_earned}
          totalSpent={credits?.total_spent}
        />
      </div>

      {/* Stats Cards - 3 Columns */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Videos */}
        <Card className="p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-info/20 rounded-xl p-3">
              <VideoIcon className="text-info h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Total Videos</p>
              <p className="text-foreground text-2xl font-bold">{totalVideos}</p>
              <p className="text-muted-foreground text-xs">{completedCount} completed</p>
            </div>
          </div>
        </Card>

        {/* Processing */}
        <Card className="p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-warning/20 rounded-xl p-3">
              <Clock className="text-warning h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Processing</p>
              <p className="text-foreground text-2xl font-bold">{processingCount}</p>
              <p className="text-muted-foreground text-xs">Active jobs</p>
            </div>
          </div>
        </Card>

        {/* Tier Badge */}
        <Card className="p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-chart-4/20 rounded-xl p-3">
              <Sparkles className="text-chart-4 h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize dark:text-gray-100">
                {credits?.tier || 'Free'}
              </p>
              <Link
                href="/pricing"
                className="text-primary hover:text-primary/80 text-xs font-medium underline-offset-4 hover:underline"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Video List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-xl font-bold">Your Videos</h2>
          {totalVideos > 0 && <p className="text-muted-foreground text-sm">{totalVideos} total</p>}
        </div>
        <VideoList initialVideos={videos || []} initialTotal={totalVideos} />
      </div>
    </div>
  )
}
