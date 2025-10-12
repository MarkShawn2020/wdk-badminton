'use client'

/**
 * Video upload component with drag-and-drop support
 *
 * Features:
 * - Drag and drop file upload
 * - URL input with persistent storage (jotai)
 * - File validation (type, size, duration)
 * - Real-time cost estimation
 * - Progress feedback
 */

import { useState, useRef, useCallback } from 'react'
import { Upload, FileVideo, X, AlertCircle, Link2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { ALLOWED_VIDEO_MIME_TYPES, sanitizeFilename } from '@/lib/validations/video'
import { calculateCreditsRequired, formatCredits, PRICING } from '@/lib/video/cost'
import { videoUrlAtom, videoInputSourceAtom } from '@/lib/store/video-atoms'
import { Button } from '@/components/components/ui/button'
import { z } from 'zod'

/**
 * URL validation schema
 */
const videoUrlSchema = z.string().url().startsWith('https://', {
  message: 'URL must start with https://',
})

interface VideoFile {
  file?: File // Optional for URL-based videos
  duration: number
  size: number
  url: string // Local preview URL or remote URL
  sourceType: 'file' | 'url' // Track the source type
  filename?: string // For URL-based videos
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

  // Jotai atoms
  const [videoUrl, setVideoUrl] = useAtom(videoUrlAtom)
  const [inputSource, setInputSource] = useAtom(videoInputSourceAtom)
  const [urlInput, setUrlInput] = useState(videoUrl)

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
   * Get video duration from URL
   */
  const getVideoDurationFromUrl = useCallback((url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.crossOrigin = 'anonymous'

      video.onloadedmetadata = () => {
        resolve(video.duration)
      }

      video.onerror = () => {
        reject(new Error('Failed to load video from URL. Please check if the URL is accessible.'))
      }

      video.src = url
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
          sourceType: 'file',
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
   * Validate and process video URL
   */
  const processUrl = useCallback(
    async (url: string) => {
      setError(null)
      setIsAnalyzing(true)

      try {
        // Validate URL format
        const validationResult = videoUrlSchema.safeParse(url)
        if (!validationResult.success) {
          throw new Error(validationResult.error.errors[0]?.message || 'Invalid URL format')
        }

        // Get video duration
        const duration = await getVideoDurationFromUrl(url)

        // Validate duration
        if (duration > maxDuration) {
          throw new Error(`Video too long (${Math.round(duration)}s). Maximum: ${maxDuration}s`)
        }

        if (duration < PRICING.MIN_VIDEO_DURATION) {
          throw new Error(`Video too short. Minimum: ${PRICING.MIN_VIDEO_DURATION}s`)
        }

        // Extract filename from URL
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split('/')
        const filename = pathParts[pathParts.length - 1] || 'video-from-url'

        const videoFile: VideoFile = {
          duration,
          size: 0, // Size unknown for URL videos
          url,
          sourceType: 'url',
          filename,
        }

        setVideoUrl(url)
        setSelectedVideo(videoFile)
        onVideoSelected(videoFile)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process video URL'
        setError(message)
        setSelectedVideo(null)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [maxDuration, getVideoDurationFromUrl, setVideoUrl, onVideoSelected]
  )

  /**
   * Handle URL submit
   */
  const handleUrlSubmit = useCallback(() => {
    if (!urlInput.trim()) {
      setError('Please enter a video URL')
      return
    }
    processUrl(urlInput.trim())
  }, [urlInput, processUrl])

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
      {/* Input Source Toggle */}
      {!selectedVideo && (
        <div className="mb-4 flex gap-2">
          <Button
            type="button"
            variant={inputSource === 'file' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInputSource('file')}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <Button
            type="button"
            variant={inputSource === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInputSource('url')}
            className="gap-2"
          >
            <Link2 className="h-4 w-4" />
            Enter URL
          </Button>
        </div>
      )}

      {/* Input Area Container - Prevent layout shift */}
      {!selectedVideo && (
        <div className="grid w-full">
          {/* File Upload Area */}
          <div
            onClick={inputSource === 'file' ? handleClick : undefined}
            onDrop={inputSource === 'file' ? handleDrop : undefined}
            onDragOver={inputSource === 'file' ? handleDragOver : undefined}
            onDragLeave={inputSource === 'file' ? handleDragLeave : undefined}
            onKeyDown={
              inputSource === 'file'
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleClick()
                    }
                  }
                : undefined
            }
            role={inputSource === 'file' ? 'button' : undefined}
            tabIndex={inputSource === 'file' ? 0 : undefined}
            style={{ gridArea: '1 / 1' }}
            className={`${inputSource === 'file' ? 'visible' : 'pointer-events-none invisible'} group flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all ${
              isDragging
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-border bg-card hover:border-primary/60 hover:shadow-md'
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
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
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

            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1">
                📦 Max: {Math.round(maxSize / (1024 * 1024))}MB
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">⏱️ Max: {maxDuration}s</span>
            </div>
          </div>

          {/* URL Input Area */}
          <div
            style={{ gridArea: '1 / 1' }}
            className={`${inputSource === 'url' ? 'visible' : 'pointer-events-none invisible'} border-border bg-card flex w-full flex-col items-start rounded-2xl border-2 p-16`}
          >
            <div className="mb-6 flex w-full items-center gap-3">
              <div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
                <Link2 className="text-primary-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="text-foreground text-lg font-semibold">Enter Video URL</h3>
                <p className="text-muted-foreground text-sm">
                  Paste a direct link to your video (must start with https://)
                </p>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUrlSubmit()
                    }
                  }}
                  placeholder="https://example.com/video.mp4"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
                  disabled={isAnalyzing}
                />
              </div>

              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={isAnalyzing || !urlInput.trim()}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Upload className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing video...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-5 w-5" />
                    Load Video
                  </>
                )}
              </Button>

              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1">⏱️ Max: {maxDuration}s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Video Preview */}
      {selectedVideo && (
        <div className="border-primary/20 bg-card rounded-2xl border-2 p-6 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-start gap-5">
              {/* Video Thumbnail */}
              <div className="bg-muted relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                <video
                  src={selectedVideo.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  crossOrigin={selectedVideo.sourceType === 'url' ? 'anonymous' : undefined}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                  <div className="bg-card flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                    {selectedVideo.sourceType === 'url' ? (
                      <Link2 className="text-primary h-6 w-6" />
                    ) : (
                      <FileVideo className="text-primary h-6 w-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground mb-3 text-lg leading-tight font-semibold">
                  {selectedVideo.sourceType === 'file' && selectedVideo.file
                    ? sanitizeFilename(selectedVideo.file.name)
                    : selectedVideo.filename || 'Video from URL'}
                </h3>
                <div className="space-y-2">
                  <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                    {selectedVideo.sourceType === 'file' && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          📦 {Math.round(selectedVideo.size / (1024 * 1024))}MB
                        </span>
                        <span>•</span>
                      </>
                    )}
                    <span className="inline-flex items-center gap-1">
                      ⏱️ {Math.round(selectedVideo.duration)}s
                    </span>
                    {selectedVideo.sourceType === 'url' && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          URL
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex-shrink-0 rounded-lg p-2 transition-colors"
              aria-label="Remove video"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="border-destructive/30 bg-destructive/10 mt-4 flex items-start gap-3 rounded-2xl border-2 p-4 shadow-sm">
          <div className="bg-destructive/20 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-4 w-4" />
          </div>
          <p className="text-destructive-foreground text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
