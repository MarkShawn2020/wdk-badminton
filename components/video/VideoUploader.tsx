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
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'hover:border-primary border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900'
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

          <Upload className="mb-4 h-12 w-12 text-gray-400" />

          <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {isAnalyzing ? 'Analyzing video...' : 'Drop your video here'}
          </p>

          <p className="mb-4 text-sm text-gray-500">or click to browse (MP4, MOV, WebM, AVI)</p>

          <p className="text-xs text-gray-400">
            Max size: {Math.round(maxSize / (1024 * 1024))}MB • Max duration: {maxDuration}s
          </p>
        </div>
      )}

      {/* Selected Video Preview */}
      {selectedVideo && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Video Thumbnail */}
              <div className="relative h-24 w-32 overflow-hidden rounded bg-gray-100 dark:bg-gray-900">
                <video
                  src={selectedVideo.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <FileVideo className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {sanitizeFilename(selectedVideo.file.name)}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>
                    Size: {Math.round(selectedVideo.size / (1024 * 1024))}MB • Duration:{' '}
                    {Math.round(selectedVideo.duration)}s
                  </p>
                  {estimatedCost && (
                    <p className="text-primary font-semibold">
                      Estimated cost: {formatCredits(estimatedCost)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              aria-label="Remove video"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
