'use client'

/**
 * Video list component for dashboard
 *
 * Displays user's video processing history with status
 */

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { FileVideo, CheckCircle2, XCircle, Loader2, Clock, Download } from 'lucide-react'
import { Button } from '@/components/components/ui/button'
import { Badge } from '@/components/components/ui/badge'
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']

interface VideoListProps {
  initialVideos: Video[]
  initialTotal: number
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: 'Queued',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    spin: false,
  },
  uploading: {
    icon: Loader2,
    label: 'Uploading',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    spin: true,
  },
  processing: {
    icon: Loader2,
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    spin: true,
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    spin: false,
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    spin: false,
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    spin: false,
  },
}

export function VideoList({ initialVideos, initialTotal }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialVideos.length < initialTotal)

  /**
   * Load more videos
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const response = await fetch(`/api/videos?page=${page + 1}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setVideos((prev) => [...prev, ...data.data.videos])
        setPage(data.data.pagination.page)
        setHasMore(data.data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Failed to load more videos:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  /**
   * Format date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
        <FileVideo className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          No videos yet
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Upload your first video to get started
        </p>
        <Link href="/enhance">
          <Button className="mt-4">Upload Video</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Video Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const statusConfig = STATUS_CONFIG[video.status]
          const StatusIcon = statusConfig.icon

          return (
            <Link
              key={video.id}
              href={`/processing/${video.id}`}
              className="group hover:border-primary relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-900">
                {video.original_url ? (
                  <video
                    src={video.original_url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FileVideo className="h-12 w-12 text-gray-600" />
                  </div>
                )}

                {/* Status Badge Overlay */}
                <div className="absolute top-2 left-2">
                  <Badge className={statusConfig.color}>
                    <StatusIcon
                      className={`mr-1 h-3 w-3 ${statusConfig.spin ? 'animate-spin' : ''}`}
                    />
                    {statusConfig.label}
                  </Badge>
                </div>

                {/* Progress Bar */}
                {video.status === 'processing' && video.progress > 0 && (
                  <div className="absolute right-0 bottom-0 left-0 h-1 bg-gray-800">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {video.original_filename}
                </h3>

                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(video.file_size_bytes)}</span>
                  <span>{Math.round(video.duration_seconds)}s</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatDate(video.created_at)}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {video.estimated_cost_credits} credits
                  </span>
                </div>

                {/* Download Button (completed videos) */}
                {video.status === 'completed' && video.processed_url && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(video.processed_url!, '_blank')
                    }}
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}

                {/* Error Message */}
                {video.status === 'failed' && video.error_message && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {video.error_message}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
