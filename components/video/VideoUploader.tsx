'use client'

/**
 * Video upload component with drag-and-drop support
 *
 * Features:
 * - Drag and drop file upload
 * - File validation (type, size, duration)
 * - Real-time cost estimation
 * - Progress feedback
 */

import { useState, useRef, useCallback } from 'react'
import { Upload, FileVideo, X, AlertCircle } from 'lucide-react'
import { ALLOWED_VIDEO_MIME_TYPES, sanitizeFilename } from '@/lib/validations/video'
import { calculateCreditsRequired, formatCredits, PRICING } from '@/lib/video/cost'

interface VideoFile {
  file: File
  duration: number
  size: number
  url: string // Local preview URL
}

interface VideoUploaderProps {
  onVideoSelected: (video: VideoFile) => void
  onVideoRemoved: () => void
  maxSize?: number
  maxDuration?: number
}

export function VideoUploader({
  onVideoSelected,
  onVideoRemoved,
  maxSize = PRICING.MAX_FILE_SIZE,
  maxDuration = PRICING.MAX_VIDEO_DURATION,
}: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Get video duration from file
   */
  const getVideoDuration = useCallback((file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(video.duration)
      }

      video.onerror = () => {
        reject(new Error('Failed to load video metadata'))
      }

      video.src = window.URL.createObjectURL(file)
    })
  }, [])

  /**
   * Validate and process video file
   */
  const processVideo = useCallback(
    async (file: File) => {
      setError(null)
      setIsAnalyzing(true)

      try {
        // Validate file type
        if (
          !ALLOWED_VIDEO_MIME_TYPES.includes(file.type as (typeof ALLOWED_VIDEO_MIME_TYPES)[number])
        ) {
          throw new Error(
            `Invalid file type. Allowed types: ${ALLOWED_VIDEO_MIME_TYPES.join(', ')}`
          )
        }

        // Validate file size
        if (file.size > maxSize) {
          const maxSizeMB = Math.round(maxSize / (1024 * 1024))
          const actualSizeMB = Math.round(file.size / (1024 * 1024))
          throw new Error(`File too large (${actualSizeMB}MB). Maximum: ${maxSizeMB}MB`)
        }

        // Get video duration
        const duration = await getVideoDuration(file)

        // Validate duration
        if (duration > maxDuration) {
          throw new Error(`Video too long (${Math.round(duration)}s). Maximum: ${maxDuration}s`)
        }

        if (duration < PRICING.MIN_VIDEO_DURATION) {
          throw new Error(`Video too short. Minimum: ${PRICING.MIN_VIDEO_DURATION}s`)
        }

        // Create preview URL
        const url = window.URL.createObjectURL(file)

        const videoFile: VideoFile = {
          file,
          duration,
          size: file.size,
          url,
        }

        setSelectedVideo(videoFile)
        onVideoSelected(videoFile)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process video'
        setError(message)
        setSelectedVideo(null)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [maxSize, maxDuration, getVideoDuration, onVideoSelected]
  )

  /**
   * Handle file drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length === 0) return

      const file = files[0]
      processVideo(file)
    },
    [processVideo]
  )

  /**
   * Handle file input change
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      const file = files[0]
      processVideo(file)
    },
    [processVideo]
  )

  /**
   * Remove selected video
   */
  const handleRemove = useCallback(() => {
    if (selectedVideo) {
      window.URL.revokeObjectURL(selectedVideo.url)
    }
    setSelectedVideo(null)
    setError(null)
    onVideoRemoved()

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [selectedVideo, onVideoRemoved])

  /**
   * Handle drag events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  /**
   * Trigger file input click
   */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Calculate cost if video is selected
  const estimatedCost = selectedVideo ? calculateCreditsRequired(selectedVideo.duration) : null

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!selectedVideo && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
          role="button"
          tabIndex={0}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 transition-all ${
            isDragging
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 shadow-lg'
              : 'hover:border-primary-400 dark:hover:border-primary-600 border-gray-300 bg-gradient-to-b from-gray-50 to-white hover:shadow-md dark:border-gray-700 dark:from-gray-900 dark:to-gray-950'
          } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''} `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_VIDEO_MIME_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={isAnalyzing}
          />

          <div
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-colors ${
              isDragging
                ? 'bg-primary-600 text-white'
                : 'group-hover:bg-primary-100 group-hover:text-primary-600 dark:group-hover:bg-primary-900 bg-gray-100 text-gray-400 dark:bg-gray-800'
            }`}
          >
            <Upload className="h-10 w-10" />
          </div>

          <p className="text-foreground mb-3 text-xl font-bold">
            {isAnalyzing ? 'Analyzing video...' : 'Drop your video here'}
          </p>

          <p className="text-muted-foreground mb-6 text-base">
            or click to browse files (MP4, MOV, WebM)
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              📦 Max: {Math.round(maxSize / (1024 * 1024))}MB
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">⏱️ Max: {maxDuration}s</span>
          </div>
        </div>
      )}

      {/* Selected Video Preview */}
      {selectedVideo && (
        <div className="border-primary-200 from-primary-50 dark:border-primary-900 dark:from-primary-950/20 rounded-xl border-2 bg-gradient-to-br to-white p-6 shadow-md dark:to-gray-950">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-start gap-5">
              {/* Video Thumbnail */}
              <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-md dark:bg-gray-900">
                <video
                  src={selectedVideo.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <FileVideo className="text-primary-600 h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground mb-3 text-lg leading-tight font-semibold">
                  {sanitizeFilename(selectedVideo.file.name)}
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      📦 {Math.round(selectedVideo.size / (1024 * 1024))}MB
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      ⏱️ {Math.round(selectedVideo.duration)}s
                    </span>
                  </div>
                  {estimatedCost && (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm dark:bg-gray-900">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated cost:
                      </span>
                      <span className="text-primary-700 dark:text-primary-400 text-base font-bold">
                        {formatCredits(estimatedCost)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="flex-shrink-0 rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              aria-label="Remove video"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900 dark:bg-red-950/20">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}
