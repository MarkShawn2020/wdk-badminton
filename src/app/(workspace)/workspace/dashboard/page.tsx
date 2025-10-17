import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Progress } from '@/components/components/ui/progress'
import { Upload, Video, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCredits } from '@/lib/video/cost'

/**
 * Dashboard Page - Home view for authenticated users
 *
 * Features:
 * - Welcome message with credit balance
 * - Quick access to upload
 * - Processing videos status (real-time)
 * - Recent videos grid
 * - Usage statistics
 */

export default async function DashboardPage() {
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

  // Fetch processing videos
  const { data: processingVideos } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch recent completed videos
  const { data: recentVideos } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(6)

  // Calculate stats
  const { count: totalVideos } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: creditStats } = await supabase
    .from('credit_transactions')
    .select('amount, type')
    .eq('user_id', user.id)

  const totalSpent =
    creditStats
      ?.filter((t) => t.type === 'video_processing')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  const estimatedVideosRemaining = Math.floor((profile?.balance || 0) / 150)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            You have {formatCredits(profile?.balance || 0)} credits remaining (≈{' '}
            {estimatedVideosRemaining} videos)
          </p>
        </div>
        <Link href="/workspace/upload">
          <Button size="lg" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New Video
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideos || 0}</div>
            <p className="text-muted-foreground text-xs">All time processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Spent</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCredits(totalSpent)}</div>
            <p className="text-muted-foreground text-xs">Lifetime usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingVideos?.length || 0}</div>
            <p className="text-muted-foreground text-xs">Videos in queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Videos */}
      {processingVideos && processingVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing ({processingVideos.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingVideos.map((video) => (
              <div key={video.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{video.original_filename}</p>
                    <p className="text-muted-foreground text-sm capitalize">
                      {video.status}
                      {video.status === 'processing' && '...'}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {video.status === 'processing' ? '~2 min' : 'Queued'}
                  </span>
                </div>
                <Progress value={video.status === 'processing' ? 45 : 10} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Videos */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Videos</h2>
          <Link href="/workspace/videos">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        {recentVideos && recentVideos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="bg-muted relative aspect-video">
                  <div className="flex h-full items-center justify-center">
                    <Video className="text-muted-foreground h-12 w-12" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="truncate font-medium">{video.original_filename}</p>
                  <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
                    <span>
                      {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <span>{formatCredits(video.actual_cost_credits || 0)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 font-semibold">No videos yet</h3>
              <p className="text-muted-foreground mb-4 text-center text-sm">
                Upload your first AI-generated video to get started
              </p>
              <Link href="/workspace/upload">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
