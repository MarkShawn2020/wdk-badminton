import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/components/ui/button'
import { Card, CardContent } from '@/components/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/components/ui/dropdown-menu'
import { Badge } from '@/components/components/ui/badge'
import { Video, Download, Share2, Trash2, MoreVertical, Filter, Upload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCredits } from '@/lib/video/cost'

/**
 * My Videos Page - Library view of all processed videos
 *
 * Features:
 * - Grid view of videos
 * - Filter by status
 * - Sort options
 * - Quick actions (download, share, delete)
 * - Pagination
 * - Video detail modal
 */

interface PageProps {
  searchParams: {
    status?: string
    sort?: string
    page?: string
  }
}

export default async function VideosPage({ searchParams }: PageProps) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Parse search params
  const status = searchParams.status || 'all'
  const sort = searchParams.sort || 'recent'
  const page = parseInt(searchParams.page || '1')
  const pageSize = 12

  // Build query
  let query = supabase.from('videos').select('*', { count: 'exact' }).eq('user_id', user.id)

  // Filter by status
  if (status !== 'all') {
    query = query.eq('status', status)
  }

  // Sort
  if (sort === 'recent') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else if (sort === 'cost') {
    query = query.order('cost_credits', { ascending: false })
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data: videos, count } = await query

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Videos</h1>
          <p className="text-muted-foreground">
            {count || 0} video{(count || 0) !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <Link href="/workspace/upload">
          <Button size="lg" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New Video
          </Button>
        </Link>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-2">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Status: {status === 'all' ? 'All' : status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?status=all">All</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?status=completed">Completed</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?status=processing">Processing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?status=failed">Failed</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort: {sort === 'recent' ? 'Recent' : sort === 'oldest' ? 'Oldest' : 'Cost'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?sort=recent">Most Recent</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?sort=oldest">Oldest First</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/workspace/videos?sort=cost">Highest Cost</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Video Grid */}
      {videos && videos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="group overflow-hidden">
              {/* Thumbnail */}
              <div className="bg-muted relative aspect-video overflow-hidden">
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.original_filename}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Video className="text-muted-foreground h-12 w-12" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={
                      video.status === 'completed'
                        ? 'default'
                        : video.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="capitalize"
                  >
                    {video.status}
                  </Badge>
                </div>

                {/* Quick Actions Overlay */}
                {video.status === 'completed' && video.processed_url && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" variant="secondary" asChild>
                      <a href={video.processed_url} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="flex-1 truncate font-medium" title={video.original_filename}>
                    {video.original_filename}
                  </p>

                  {/* More Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {video.processed_url && (
                        <>
                          <DropdownMenuItem asChild>
                            <a href={video.processed_url} download>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  <span>{formatCredits(video.cost_credits || 0)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 font-semibold">No videos found</h3>
            <p className="text-muted-foreground mb-4 text-center text-sm">
              {status !== 'all'
                ? `No ${status} videos yet. Try changing the filter.`
                : 'Upload your first video to get started'}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} asChild={page > 1}>
            {page > 1 ? (
              <Link href={`/workspace/videos?page=${page - 1}&status=${status}&sort=${sort}`}>
                Previous
              </Link>
            ) : (
              <span>Previous</span>
            )}
          </Button>

          <span className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            asChild={page < totalPages}
          >
            {page < totalPages ? (
              <Link href={`/workspace/videos?page=${page + 1}&status=${status}&sort=${sort}`}>
                Next
              </Link>
            ) : (
              <span>Next</span>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
