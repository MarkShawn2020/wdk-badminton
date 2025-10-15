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

        // Only log in development, without sensitive URLs
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Job status update:', {
            status: status.status,
            progress: status.progress,
            currentStep: status.currentStep,
            hasFinalUrl: !!status.finalVideoUrl,
          })
        }

        setJobStatus(status)
        setRetryCount(0)
        setError(null)

        // Stop polling if completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          if (process.env.NODE_ENV === 'development') {
            console.log('🎉 Job finished!', {
              status: status.status,
            })
          }
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
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      {/* Header - Clean and spacious */}
      <div className="mb-12">
        <h1 className="mb-4 font-serif text-4xl leading-tight font-semibold tracking-tight text-[#181818] lg:text-5xl">
          Processing Your Video
        </h1>
        <p className="text-lg leading-relaxed text-[#87867F] lg:text-xl">
          {initialVideo.original_filename}
        </p>
      </div>

      {/* Overall Progress - Elegant card with soft colors */}
      <div className="mb-8 rounded-3xl bg-[#F9F9F7] p-8 shadow-sm transition-shadow duration-300 hover:shadow-md lg:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-[#181818]">Overall Progress</h2>
          <span className="font-serif text-2xl font-semibold text-[#CC785C]">
            {jobStatus.progress}%
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-[#E8E6DC]">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-[#CC785C] to-[#B49FD8] transition-all duration-700 ease-out"
            style={{ width: `${jobStatus.progress}%` }}
          />
        </div>
        {jobStatus.currentStep && (
          <p className="mt-4 text-sm leading-relaxed text-[#87867F]">
            Currently processing:{' '}
            <span className="font-medium text-[#181818]">{jobStatus.currentStep}</span>
          </p>
        )}
      </div>

      {/* Pipeline Steps - Clean grid layout */}
      <div className="mb-8 rounded-3xl bg-[#F7F4EC] p-8 shadow-sm lg:p-10">
        <h2 className="mb-8 text-2xl font-medium text-[#181818]">Processing Pipeline</h2>
        <div className="space-y-4">
          {jobStatus.steps.map((step, index) => (
            <StepCard key={index} step={step} />
          ))}
        </div>
      </div>

      {/* Completed State - Elegant success card */}
      {jobStatus.status === 'completed' && (
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#629A90]/10 to-[#C2C07D]/10 p-8 shadow-sm backdrop-blur-sm lg:p-10">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#629A90]/20">
                <svg
                  className="h-6 w-6 text-[#629A90]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-serif text-2xl font-semibold text-[#181818]">
                Processing Complete
              </h3>
              <p className="mb-6 text-base leading-relaxed text-[#87867F]">
                Your video has been successfully enhanced and is ready for download.
              </p>
              {jobStatus.finalVideoUrl ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center rounded-xl bg-[#CC785C] px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#CC785C]/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
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
                          className="mr-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download Video
                      </>
                    )}
                  </button>
                  <Link
                    href="/transformer"
                    className="inline-flex items-center rounded-xl border border-[#87867F]/30 bg-white/80 px-6 py-3 font-medium text-[#181818] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#CC785C]/50 hover:bg-white hover:shadow-md"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Process Another
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl bg-white/50 p-4 backdrop-blur-sm">
                  <p className="text-sm text-[#87867F]">
                    Finalizing video... Please refresh the page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Failed State - Soft error display */}
      {jobStatus.status === 'failed' && (
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-sm lg:p-10">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-serif text-2xl font-semibold text-[#181818]">
                Processing Failed
              </h3>
              <p className="mb-2 text-base leading-relaxed text-[#87867F]">
                {jobStatus.errorMessage}
              </p>
              <p className="mb-6 text-sm text-[#87867F]">
                Your credits have been automatically refunded.
              </p>
              <Link
                href="/transformer"
                className="inline-flex items-center rounded-xl bg-[#CC785C] px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#CC785C]/90 hover:shadow-md"
              >
                Try Again
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error State - Soft warning */}
      {error && (
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-sm">
          <p className="mb-3 text-base leading-relaxed text-[#87867F]">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setRetryCount(0)
              setIsPolling(true)
            }}
            className="inline-flex items-center rounded-xl border border-[#C2C07D]/30 bg-white px-5 py-2 text-sm font-medium text-[#181818] transition-all duration-300 hover:border-[#C2C07D] hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Polling Indicator - Subtle and elegant */}
      {isPolling && jobStatus.status === 'processing' && (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-[#87867F]">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#B49FD8]" />
          <span>Auto-refreshing every 5 seconds</span>
        </div>
      )}

      {/* Video Info - Clean data display */}
      <div className="mt-8 overflow-hidden rounded-3xl bg-[#F0EEE6] p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-medium text-[#181818]">Video Information</h3>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <dt className="text-sm text-[#87867F]">Duration</dt>
            <dd className="font-serif text-lg font-semibold text-[#181818]">
              {initialVideo.duration_seconds?.toFixed(1)}s
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-[#87867F]">File Size</dt>
            <dd className="font-serif text-lg font-semibold text-[#181818]">
              {(initialVideo.file_size_bytes / 1024 / 1024).toFixed(1)} MB
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-[#87867F]">Estimated Cost</dt>
            <dd className="font-serif text-lg font-semibold text-[#CC785C]">
              {initialVideo.estimated_cost_credits} credits
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-[#87867F]">Created</dt>
            <dd className="font-serif text-lg font-semibold text-[#181818]">
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
      bgColor: 'bg-[#E8E6DC]',
      ringColor: 'ring-[#87867F]/20',
      dotColor: 'bg-[#87867F]',
      textColor: 'text-[#87867F]',
      label: 'Pending',
    },
    processing: {
      bgColor: 'bg-[#B49FD8]/10',
      ringColor: 'ring-[#B49FD8]/30',
      dotColor: 'bg-[#B49FD8] animate-pulse',
      textColor: 'text-[#B49FD8]',
      label: 'Processing',
    },
    completed: {
      bgColor: 'bg-[#629A90]/10',
      ringColor: 'ring-[#629A90]/30',
      dotColor: 'bg-[#629A90]',
      textColor: 'text-[#629A90]',
      label: 'Completed',
    },
    failed: {
      bgColor: 'bg-red-50',
      ringColor: 'ring-red-200',
      dotColor: 'bg-red-500',
      textColor: 'text-red-600',
      label: 'Failed',
    },
    skipped: {
      bgColor: 'bg-[#E8E6DC]',
      ringColor: 'ring-[#87867F]/10',
      dotColor: 'bg-[#87867F]/50',
      textColor: 'text-[#87867F]',
      label: 'Skipped',
    },
  }

  const config = statusConfig[step.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div
      className={`group rounded-2xl ${config.bgColor} p-5 ring-1 ${config.ringColor} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center gap-5">
        {/* Status Indicator - Elegant dot */}
        <div className="flex-shrink-0">
          <div className={`h-3 w-3 rounded-full ${config.dotColor}`} />
        </div>

        {/* Step Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-[#181818]">{step.stepName}</h3>
            <span className="rounded-lg bg-white/60 px-2.5 py-1 text-xs font-medium text-[#87867F] backdrop-blur-sm">
              {step.provider}
            </span>
          </div>
          <div className={`mt-1.5 text-sm ${config.textColor}`}>{config.label}</div>
        </div>

        {/* Progress for processing steps */}
        {step.status === 'processing' && step.progress > 0 && (
          <div className="flex-shrink-0 text-right">
            <div className="mb-1.5 font-serif text-base font-semibold text-[#181818]">
              {step.progress}%
            </div>
            <div className="h-2 w-20 overflow-hidden rounded-full bg-white/60">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#B49FD8] to-[#D2BEDF] transition-all duration-500"
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Completion indicator */}
        {step.status === 'completed' && (
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-[#629A90]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
