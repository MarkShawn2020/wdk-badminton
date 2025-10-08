'use client'

/**
 * Complete video upload and processing flow component
 *
 * Orchestrates:
 * 1. Video file selection
 * 2. Processing options configuration
 * 3. Upload to Supabase Storage
 * 4. Submit to processing API
 * 5. Redirect to processing page
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { VideoUploader } from './VideoUploader'
import { ProcessingOptions } from './ProcessingOptions'
import { Button } from '@/components/components/ui/button'
import { AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { ProcessingOptions as ProcessingOptionsType } from '@/lib/validations/video'
import { calculateCreditsRequired, formatCredits, formatCreditsAsUSD } from '@/lib/video/cost'

interface VideoFile {
  file: File
  duration: number
  size: number
  url: string
}

interface UploadFlowProps {
  userCredits?: number
}

export function VideoUploadFlow({ userCredits }: UploadFlowProps) {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptionsType>({
    removeWatermark: false,
    enhanceQuality: false,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle video selection
   */
  const handleVideoSelected = useCallback((video: VideoFile) => {
    setSelectedVideo(video)
    setError(null)
  }, [])

  /**
   * Handle video removal
   */
  const handleVideoRemoved = useCallback(() => {
    setSelectedVideo(null)
    setError(null)
  }, [])

  /**
   * Handle processing options change
   */
  const handleOptionsChange = useCallback((options: ProcessingOptionsType) => {
    setProcessingOptions(options)
  }, [])

  /**
   * Upload video to Supabase Storage
   */
  const uploadVideoToStorage = async (
    file: File,
    uploadUrl: string,
    token: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error('Upload failed'))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.setRequestHeader('x-upsert', 'true')
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(file)
    })
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!selectedVideo) return

    // Check authentication
    if (userCredits === undefined) {
      router.push('/signup')
      return
    }

    // Check credits
    const requiredCredits = calculateCreditsRequired(selectedVideo.duration)
    if (userCredits < requiredCredits) {
      setError(
        `Insufficient credits. Required: ${formatCredits(requiredCredits)}, Available: ${formatCredits(userCredits)}`
      )
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Step 1: Request upload URL
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedVideo.file.name,
          contentType: selectedVideo.file.type,
          fileSize: selectedVideo.file.size,
        }),
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Failed to request upload URL')
      }

      const uploadData = await uploadResponse.json()
      const { uploadUrl, storagePath, token } = uploadData.data

      // Step 2: Upload file to Supabase Storage
      await uploadVideoToStorage(selectedVideo.file, uploadUrl, token)

      // Step 3: Submit to processing API
      const processResponse = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedVideo.file.name,
          fileSize: selectedVideo.file.size,
          duration: selectedVideo.duration,
          mimeType: selectedVideo.file.type,
          storagePath,
          ...processingOptions,
        }),
      })

      if (!processResponse.ok) {
        const errorData = await processResponse.json()
        throw new Error(errorData.error || 'Failed to start processing')
      }

      const processData = await processResponse.json()
      const { videoId } = processData.data

      // Step 4: Redirect to processing page
      router.push(`/processing/${videoId}`)
    } catch (err) {
      console.error('Upload/processing error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Calculate cost
  const estimatedCost = selectedVideo ? calculateCreditsRequired(selectedVideo.duration) : 0
  const canAfford = userCredits !== undefined && userCredits >= estimatedCost
  const hasVideo = selectedVideo !== null

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Transform Your AI Videos
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Remove watermarks, enhance quality, and optimize for any platform
        </p>
      </div>

      {/* Step 1: Upload Video */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
            1
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Upload Your Video
          </h2>
        </div>
        <VideoUploader onVideoSelected={handleVideoSelected} onVideoRemoved={handleVideoRemoved} />
      </div>

      {/* Step 2: Configure Options */}
      {hasVideo && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
              2
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Configure Processing
            </h2>
          </div>
          <ProcessingOptions onChange={handleOptionsChange} disabled={isUploading} />
        </div>
      )}

      {/* Step 3: Submit */}
      {hasVideo && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
              3
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Start Processing
            </h2>
          </div>

          {/* Cost Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCredits(estimatedCost)}
                </p>
                <p className="text-sm text-gray-500">{formatCreditsAsUSD(estimatedCost)}</p>
              </div>
              {userCredits !== undefined && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Balance</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatCredits(userCredits)}
                  </p>
                  {!canAfford && <p className="mt-1 text-sm text-red-600">Insufficient credits</p>}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!hasVideo || isUploading || (userCredits !== undefined && !canAfford)}
            size="lg"
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Start Processing ({formatCredits(estimatedCost)})
              </>
            )}
          </Button>

          {userCredits === undefined && (
            <p className="text-center text-sm text-gray-500">Please sign in to continue</p>
          )}
        </div>
      )}
    </div>
  )
}
