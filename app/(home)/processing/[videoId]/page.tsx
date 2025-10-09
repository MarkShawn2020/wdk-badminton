/**
 * Video Processing Status Page
 *
 * Dynamic route: /processing/[videoId]
 * Shows real-time processing status and comparison when complete
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ProcessingStatus } from '@/components/video/ProcessingStatus'
import { VideoComparison } from '@/components/video/VideoComparison'
import type { Metadata } from 'next'
import type { Database } from '@/types/database'

type VideoRow = Database['public']['Tables']['videos']['Row']

interface ProcessingPageProps {
  params: Promise<{
    videoId: string
  }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProcessingPageProps): Promise<Metadata> {
  await params // Await params in Next.js 15
  return {
    title: 'Processing Video | ReelVan',
    description: 'Your video is being processed with AI enhancement',
    robots: {
      index: false, // Don't index processing pages
      follow: false,
    },
  }
}

/**
 * Processing Page (Server Component)
 */
export default async function ProcessingPage({ params }: ProcessingPageProps) {
  const { videoId } = await params // Await params in Next.js 15

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(videoId)) {
    notFound()
  }

  // Fetch video data
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if not authenticated
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Authentication Required
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Please sign in to view your video processing status
        </p>
      </div>
    )
  }

  const result = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  const video = result.data as VideoRow | null

  if (result.error || !video) {
    notFound()
  }

  // If video is completed, show comparison
  const showComparison = video.status === 'completed' && video.processed_url

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Processing Status */}
      {!showComparison && <ProcessingStatus videoId={videoId} />}

      {/* Video Comparison (when complete) */}
      {showComparison && (
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Your Video is Ready!
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Compare the original and processed versions below
            </p>
          </div>

          {/* Video Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Filename</dt>
                <dd className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                  {video.original_filename}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                <dd className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                  {Math.round(video.duration_seconds)}s
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Credits Used</dt>
                <dd className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                  {video.actual_cost_credits || video.estimated_cost_credits}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Processing Time</dt>
                <dd className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                  {video.started_processing_at && video.completed_at
                    ? Math.round(
                        (new Date(video.completed_at).getTime() -
                          new Date(video.started_processing_at).getTime()) /
                          1000
                      ) + 's'
                    : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Comparison */}
          <VideoComparison originalUrl={video.original_url!} processedUrl={video.processed_url!} />

          {/* Download Section */}
          <div className="flex gap-4">
            <a
              href={`/api/videos/${video.id}/download`}
              className="bg-primary hover:bg-primary/90 flex-1 rounded-lg px-6 py-3 text-center font-semibold text-white"
            >
              Download Processed Video
            </a>
            <Link
              href="/"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
            >
              Process Another Video
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
