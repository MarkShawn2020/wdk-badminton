/**
 * Job Status Client Component
 *
 * Polls Server Action every 5 seconds to check job progress
 * Updates UI in real-time as steps complete
 */

'use client'

import { useEffect, useState } from 'react'
import { checkAndAdvanceJob } from '@/app/actions/video-processing'
import Link from 'next/link'

interface JobStatus {
  id: string
  status: string
  progress: number
  currentStep?: string
  finalVideoUrl?: string
  errorMessage?: string
  steps: Array<{
    stepName: string
    status: string
    progress: number
    provider: string
  }>
}

interface Video {
  id: string
  status: string
  progress: number | null
  original_filename: string
  processed_url: string | null
  error_message: string | null
  duration_seconds: number
  file_size_bytes: number
  estimated_cost_credits: number
  created_at: string | null
}

interface Step {
  step_name: string
  status: string
  progress: number | null
  provider: string
}

interface Props {
  videoId: string
  initialVideo: Video
  initialSteps: Step[]
}

export function JobStatusClient({ videoId, initialVideo, initialSteps }: Props) {
  const [jobStatus, setJobStatus] = useState<JobStatus>({
    id: videoId,
    status: initialVideo.status,
    progress: initialVideo.progress || 0,
    finalVideoUrl: initialVideo.processed_url ?? undefined,
    errorMessage: initialVideo.error_message ?? undefined,
    steps: initialSteps.map((s) => ({
      stepName: s.step_name,
      status: s.status,
      progress: s.progress || 0,
      provider: s.provider,
    })),
  })

  const [isPolling, setIsPolling] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!jobStatus.finalVideoUrl) return

    try {
      setIsDownloading(true)

      // Fetch the video as a blob
      const response = await fetch(jobStatus.finalVideoUrl)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Create temporary link and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = initialVideo.original_filename || 'video.mp4'
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download video. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    // Stop polling if job is completed or failed
    if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
      setIsPolling(false)
      return
    }

    if (!isPolling) return

    const pollJobStatus = async () => {
      try {
        const status = await checkAndAdvanceJob(videoId)
        console.log('📊 Job status update:', {
          status: status.status,
          progress: status.progress,
          currentStep: status.currentStep,
          hasFinalUrl: !!status.finalVideoUrl,
          finalUrl: status.finalVideoUrl?.substring(0, 50) + '...',
        })

        setJobStatus(status)
        setRetryCount(0)
        setError(null)

        // Stop polling if completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          console.log('🎉 Job finished!', {
            status: status.status,
            finalVideoUrl: status.finalVideoUrl,
          })
          setIsPolling(false)
        }
      } catch (err) {
        console.error('Failed to check job status:', err)

        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1)
        } else {
          setIsPolling(false)
          setError('Failed to check status after 3 retries. Please refresh the page.')
        }
      }
    }

    // Poll immediately on mount
    pollJobStatus()

    // Then poll every 5 seconds
    const interval = setInterval(pollJobStatus, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, isPolling, retryCount])

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Processing Video</h1>
        <p className="mt-2 text-gray-600">{initialVideo.original_filename}</p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">{jobStatus.progress}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${jobStatus.progress}%` }}
          />
        </div>
        {jobStatus.currentStep && (
          <p className="mt-2 text-xs text-gray-500">Current: {jobStatus.currentStep}</p>
        )}
      </div>

      {/* Pipeline Steps */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Processing Steps</h2>
        <div className="space-y-4">
          {jobStatus.steps.map((step, index) => (
            <StepCard key={index} step={step} />
          ))}
        </div>
      </div>

      {/* Completed State */}
      {jobStatus.status === 'completed' && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-green-800">Processing Complete!</h3>
              <p className="mt-1 text-sm text-green-700">
                Your video has been successfully processed.
              </p>
              {jobStatus.finalVideoUrl ? (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download Video
                      </>
                    )}
                  </button>
                  <Link
                    href="/transformer"
                    className="inline-flex items-center rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    再处理一个
                  </Link>
                </div>
              ) : (
                <div className="mt-4 text-sm text-green-700">
                  <p>Finalizing video... Please refresh the page.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Failed State */}
      {jobStatus.status === 'failed' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Processing Failed</h3>
              <p className="mt-1 text-sm text-red-700">{jobStatus.errorMessage}</p>
              <p className="mt-2 text-xs text-red-600">
                Your credits have been automatically refunded.
              </p>
              <div className="mt-4">
                <Link
                  href="/transformer"
                  className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Try Again
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setRetryCount(0)
              setIsPolling(true)
            }}
            className="mt-2 text-sm font-medium text-yellow-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Polling Indicator */}
      {isPolling && jobStatus.status === 'processing' && (
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          Auto-refreshing every 5 seconds...
        </div>
      )}

      {/* Video Info */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Video Information</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Duration</dt>
            <dd className="font-medium text-gray-900">
              {initialVideo.duration_seconds?.toFixed(1)}s
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">File Size</dt>
            <dd className="font-medium text-gray-900">
              {(initialVideo.file_size_bytes / 1024 / 1024).toFixed(1)} MB
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Estimated Cost</dt>
            <dd className="font-medium text-gray-900">
              {initialVideo.estimated_cost_credits} credits
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Created</dt>
            <dd className="font-medium text-gray-900">
              {initialVideo.created_at ? new Date(initialVideo.created_at).toLocaleString() : 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function StepCard({ step }: { step: JobStatus['steps'][0] }) {
  const statusConfig = {
    pending: {
      color: 'bg-gray-300',
      textColor: 'text-gray-600',
      icon: '⏳',
      label: 'Pending',
    },
    processing: {
      color: 'bg-blue-500 animate-pulse',
      textColor: 'text-blue-600',
      icon: '🔄',
      label: 'Processing',
    },
    completed: {
      color: 'bg-green-500',
      textColor: 'text-green-600',
      icon: '✅',
      label: 'Completed',
    },
    failed: {
      color: 'bg-red-500',
      textColor: 'text-red-600',
      icon: '❌',
      label: 'Failed',
    },
    skipped: {
      color: 'bg-gray-400',
      textColor: 'text-gray-500',
      icon: '⏭️',
      label: 'Skipped',
    },
  }

  const config = statusConfig[step.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div className="rounded-lg border border-gray-200 p-4 transition hover:border-gray-300">
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className={`h-3 w-3 flex-shrink-0 rounded-full ${config.color}`} />

        {/* Step Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{step.stepName}</h3>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {step.provider}
            </span>
          </div>
          <div className={`mt-1 text-xs ${config.textColor}`}>
            {config.icon} {config.label}
          </div>
        </div>

        {/* Progress */}
        {step.status === 'processing' && step.progress > 0 && (
          <div className="flex-shrink-0 text-right">
            <div className="text-sm font-medium text-gray-900">{step.progress}%</div>
            <div className="mt-1 h-1.5 w-16 rounded-full bg-gray-200">
              <div
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        )}

        {step.status === 'completed' && (
          <div className="flex-shrink-0 text-sm font-medium text-green-600">Done</div>
        )}
      </div>
    </div>
  )
}
