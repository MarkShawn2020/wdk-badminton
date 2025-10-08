'use client'

/**
 * Processing status component with real-time updates
 *
 * Features:
 * - Real-time status updates via Supabase Realtime
 * - Progress bar with percentage
 * - Status indicators (pending, processing, completed, failed)
 * - Error handling
 * - Auto-redirect when complete
 */

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/components/ui/button'
import { Progress } from '@/components/components/ui/progress'

type VideoStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'

interface ProcessingStatusProps {
  videoId: string
  onComplete?: (processedUrl: string) => void
}

interface StatusInfo {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const STATUS_INFO: Record<VideoStatus, StatusInfo> = {
  pending: {
    icon: <Clock className="h-12 w-12" />,
    title: 'Queued for Processing',
    description: 'Your video is in the queue and will start processing shortly',
    color: 'text-blue-500',
  },
  uploading: {
    icon: <Loader2 className="h-12 w-12 animate-spin" />,
    title: 'Uploading Video',
    description: 'Uploading your video to our servers',
    color: 'text-blue-500',
  },
  processing: {
    icon: <Loader2 className="h-12 w-12 animate-spin" />,
    title: 'Processing Video',
    description: 'AI is working on enhancing your video',
    color: 'text-primary',
  },
  completed: {
    icon: <CheckCircle2 className="h-12 w-12" />,
    title: 'Processing Complete!',
    description: 'Your video has been successfully processed',
    color: 'text-green-500',
  },
  failed: {
    icon: <XCircle className="h-12 w-12" />,
    title: 'Processing Failed',
    description: 'An error occurred while processing your video',
    color: 'text-red-500',
  },
  cancelled: {
    icon: <AlertCircle className="h-12 w-12" />,
    title: 'Processing Cancelled',
    description: 'The processing job was cancelled',
    color: 'text-gray-500',
  },
}

export function ProcessingStatus({ videoId, onComplete }: ProcessingStatusProps) {
  const router = useRouter()
  const [status, setStatus] = useState<VideoStatus>('pending')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  /**
   * Fetch current video status from API
   * The API will query WaveSpeed and update the database automatically
   */
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/status`)

      if (!response.ok) {
        console.error('❌ Failed to fetch video status:', response.status)
        return
      }

      const result = await response.json()

      if (!result.success) {
        console.error('❌ API returned error:', result.error)
        return
      }

      const data = result.data

      console.log('📊 Video status:', {
        status: data.status,
        progress: data.progress,
        hasProcessedUrl: !!data.processedUrl,
        errorMessage: data.errorMessage,
      })

      setStatus(data.status)
      setProgress(data.progress || 0)
      setErrorMessage(data.errorMessage)
      setProcessedUrl(data.processedUrl)

      // Trigger callback if completed
      if (data.status === 'completed' && data.processedUrl) {
        console.log('✅ Video completed, triggering callback')
        onComplete?.(data.processedUrl)
      }
    } catch (error) {
      console.error('❌ Error fetching status:', error)
    }
  }, [videoId, onComplete])

  /**
   * Set up polling on mount
   */
  useEffect(() => {
    console.log('🎬 Initializing video status monitoring for:', videoId)

    // Initial fetch
    console.log('📥 Fetching initial video status...')
    fetchStatus()

    // Start polling immediately
    console.log('⏰ Starting polling (every 5 seconds)...')
    setIsPolling(true)
  }, [videoId, fetchStatus])

  /**
   * Polling for status updates
   */
  useEffect(() => {
    if (!isPolling) return

    // Stop polling if video is in a final state
    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      console.log('Video in final state, stopping polling')
      setIsPolling(false)
      return
    }

    const interval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, 8)
      console.log(`🔄 [${timestamp}] Polling video status...`)
      fetchStatus()
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [isPolling, fetchStatus, status])

  /**
   * Handle retry
   */
  const handleRetry = useCallback(() => {
    router.push('/')
  }, [router])

  /**
   * Handle view result
   */
  const handleViewResult = useCallback(() => {
    if (processedUrl) {
      // Navigate to comparison view or just stay on page
      // For now, we'll refresh the page to show the comparison
      router.refresh()
    }
  }, [processedUrl, router])

  const statusInfo = STATUS_INFO[status]
  const isComplete = status === 'completed'
  const isFailed = status === 'failed' || status === 'cancelled'
  const isProcessing = status === 'processing' || status === 'uploading'

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 py-12">
      {/* Status Icon */}
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 ${statusInfo.color}`}>{statusInfo.icon}</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{statusInfo.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{statusInfo.description}</p>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      )}

      {/* Processing Info */}
      {isProcessing && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">What's happening?</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Analyzing video content</span>
            </li>
            {progress > 20 && (
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                <span>Applying AI enhancements</span>
              </li>
            )}
            {progress > 60 && (
              <li className="flex items-start gap-2">
                <Loader2 className="text-primary h-5 w-5 flex-shrink-0 animate-spin" />
                <span>Rendering final video</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {isFailed && errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error Details:</p>
              <p className="mt-1">{errorMessage}</p>
              <p className="mt-2 text-xs">Your credits have been refunded automatically.</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {isFailed && (
          <Button onClick={handleRetry} className="flex-1" size="lg">
            Try Again
          </Button>
        )}
        {isComplete && processedUrl && (
          <Button onClick={handleViewResult} className="flex-1" size="lg">
            View Result
          </Button>
        )}
        {!isComplete && !isFailed && (
          <Button onClick={() => router.push('/')} variant="outline" className="flex-1" size="lg">
            Back to Home
          </Button>
        )}
      </div>

      {/* Video ID for debugging */}
      <div className="text-center text-xs text-gray-400">
        Video ID: {videoId}
        {isPolling && <span className="ml-2">(Polling mode)</span>}
      </div>
    </div>
  )
}
