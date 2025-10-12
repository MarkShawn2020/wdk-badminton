'use client'

/**
 * Complete video upload and processing dashboard
 *
 * All-in-one view for:
 * 1. Video file upload
 * 2. Processing options selection
 * 3. Cost preview
 * 4. Processing submission
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { VideoUploader } from './VideoUploader'
import { ProcessingOptionsDialog } from './ProcessingOptionsDialog'
import { Button } from '@/components/components/ui/button'
import {
  AlertCircle,
  Loader2,
  Sparkles,
  Upload,
  Settings2,
  Check,
  BadgeCheck,
  Zap,
  ImagePlus,
} from 'lucide-react'
import { calculateCreditsRequired, formatCredits, formatCreditsAsUSD } from '@/lib/video/cost'
import { getUploadUrl } from '@/app/actions/storage'
import { createVideoJob } from '@/app/actions/video-processing'
import {
  removeWatermarkAtom,
  enhanceQualityAtom,
  targetResolutionAtom,
  targetFpsAtom,
  addCustomWatermarkAtom,
  generateCaptionsAtom,
  selectedPlatformsAtom,
  captionToneAtom,
} from '@/lib/store/video-atoms'

interface VideoFile {
  file?: File // Optional for URL-based videos
  duration: number
  size: number
  url: string // Local preview URL or remote URL
  sourceType: 'file' | 'url' // Track the source type
  filename?: string // For URL-based videos
}

interface UploadFlowProps {
  userCredits?: number
}

export function VideoUploadFlow({ userCredits }: UploadFlowProps) {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)

  // Feature toggles with jotai persistence
  const [removeWatermark, setRemoveWatermark] = useAtom(removeWatermarkAtom)
  const [enhanceQuality, setEnhanceQuality] = useAtom(enhanceQualityAtom)
  const [targetResolution, setTargetResolution] = useAtom(targetResolutionAtom)
  const [targetFps, setTargetFps] = useAtom(targetFpsAtom)
  const [addCustomWatermark, setAddCustomWatermark] = useAtom(addCustomWatermarkAtom)
  const [generateCaptions, setGenerateCaptions] = useAtom(generateCaptionsAtom)
  const [selectedPlatforms, setSelectedPlatforms] = useAtom(selectedPlatformsAtom)
  const [captionTone, setCaptionTone] = useAtom(captionToneAtom)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)

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
   * Get active features summary
   */
  const getActiveFeatures = useCallback(() => {
    const features: Array<{ icon: React.ComponentType<{ className?: string }>; label: string }> = []
    if (removeWatermark) features.push({ icon: BadgeCheck, label: 'Remove Watermark' })
    if (enhanceQuality) {
      const resLabel = targetResolution ? ` (${targetResolution})` : ''
      features.push({ icon: Zap, label: `Enhance Quality${resLabel}` })
    }
    if (addCustomWatermark) features.push({ icon: ImagePlus, label: 'Custom Watermark' })
    if (generateCaptions)
      features.push({
        icon: Sparkles,
        label: `AI Captions (${selectedPlatforms.length} platforms)`,
      })
    return features
  }, [
    removeWatermark,
    enhanceQuality,
    targetResolution,
    addCustomWatermark,
    generateCaptions,
    selectedPlatforms.length,
  ])

  /**
   * Upload video to Supabase Storage using pre-signed URL
   */
  const uploadVideoToStorage = async (file: File, uploadUrl: string): Promise<void> => {
    console.log('📤 Starting XHR upload...', {
      fileSize: file.size,
      fileName: file.name,
      mimeType: file.type,
    })

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 40) + 10 // 10-50%
          console.log(`📊 Upload progress: ${e.loaded}/${e.total} bytes (${progress}%)`)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        console.log('📥 XHR load event', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText.substring(0, 200),
        })

        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('✅ Upload successful')
          resolve()
        } else {
          console.error('❌ Upload failed with status:', xhr.status)
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
        }
      })

      xhr.addEventListener('error', (e) => {
        console.error('❌ XHR error event:', e)
        reject(new Error('Network error during upload'))
      })

      xhr.addEventListener('timeout', () => {
        console.error('❌ XHR timeout')
        reject(new Error('Upload timeout'))
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      console.log('🚀 Sending file via XHR...')
      xhr.send(file)
    })
  }

  /**
   * Handle form submission
   * For file: Step 1: Upload to Storage, Step 2: Call Server Action
   * For URL: Skip upload, directly call Server Action
   */
  const handleSubmit = async () => {
    if (!selectedVideo) return

    // Check authentication - userCredits is undefined only if NOT logged in
    // If logged in but no credits record, server will create one with 100 credits
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
      // Generate unique video ID
      const videoId = crypto.randomUUID()

      let storagePath: string

      // Handle URL-based videos (skip Supabase upload)
      if (selectedVideo.sourceType === 'url') {
        console.log('🔗 Processing video from URL...')
        console.log('   Video ID:', videoId)
        console.log('   URL:', selectedVideo.url)
        setUploadProgress(30)

        // Use the URL directly as storage path
        storagePath = selectedVideo.url
        setUploadProgress(50)
      }
      // Handle file-based videos (upload to Supabase)
      else {
        if (!selectedVideo.file) {
          throw new Error('No file provided for file-based video')
        }

        // Step 1: Get pre-signed upload URL
        console.log('🔑 Getting upload URL...')
        setUploadProgress(5)

        const uploadResult = await getUploadUrl(videoId, selectedVideo.file.name)

        console.log('🔑 Upload URL result:', {
          success: !!uploadResult.uploadUrl,
          error: uploadResult.error,
          hasStoragePath: !!uploadResult.storagePath,
        })

        if (uploadResult.error || !uploadResult.uploadUrl) {
          throw new Error(uploadResult.error || 'Failed to get upload URL')
        }

        const { uploadUrl, storagePath: uploadStoragePath } = uploadResult
        storagePath = uploadStoragePath

        // Step 2: Upload to Supabase Storage
        console.log('📤 Uploading video to storage...')
        console.log('   Storage path:', storagePath)
        setUploadProgress(10)

        await uploadVideoToStorage(selectedVideo.file, uploadUrl)

        console.log('✅ Video uploaded to storage')
        setUploadProgress(50)
      }

      // Step 3: Call Server Action with metadata
      console.log('🔧 Creating processing job...')
      console.log('   Video ID:', videoId)
      console.log('   Storage path:', storagePath)
      console.log('   Duration:', selectedVideo.duration)
      console.log('   Source type:', selectedVideo.sourceType)

      const result = await createVideoJob({
        videoId,
        storagePath,
        filename:
          selectedVideo.sourceType === 'file' && selectedVideo.file
            ? selectedVideo.file.name
            : selectedVideo.filename || 'video-from-url',
        fileSize: selectedVideo.size,
        duration: selectedVideo.duration,
        mimeType:
          selectedVideo.sourceType === 'file' && selectedVideo.file
            ? selectedVideo.file.type
            : 'video/mp4',
        options: {
          removeWatermark,
          enhanceQuality,
          generateCaptions,
          targetResolution,
          targetAspectRatio: undefined, // TODO: Add aspect ratio support
        },
      })

      setUploadProgress(100)

      console.log('📦 Server Action result:', result)

      if (result.error) {
        console.error('❌ Server Action returned error:', result.error)
        throw new Error(result.error)
      }

      console.log('✅ Video job created successfully!')
      console.log('📹 Video ID:', result.videoId)

      // Redirect to job status page
      router.push(`/jobs/${result.videoId}`)
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
  const activeFeatures = getActiveFeatures()

  return (
    <>
      {/* Main Upload Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
              {/* Header with Settings Button */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <Upload className="text-primary-foreground h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-card-foreground text-xl font-semibold">Upload & Process</h2>
                    <p className="text-muted-foreground text-sm">
                      Drop your video and configure options
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOptionsDialogOpen(true)}
                  className="gap-2"
                >
                  <Settings2 className="h-4 w-4" />
                  Options
                </Button>
              </div>

              {/* Active Options Summary */}
              {activeFeatures.length > 0 && (
                <div className="border-border bg-muted mb-6 rounded-lg border p-4">
                  <div className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Active Features
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFeatures.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div
                          key={index}
                          className="bg-background text-foreground inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {feature.label}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Video Uploader */}
              <VideoUploader
                onVideoSelected={handleVideoSelected}
                onVideoRemoved={handleVideoRemoved}
              />

              {/* Submit Section (Shown only when video is uploaded) */}
              {selectedVideo && (
                <div className="mt-6 space-y-4">
                  {/* Credits Check */}
                  {userCredits !== undefined && !canAfford && (
                    <div className="border-border bg-muted flex items-center justify-between rounded-lg border p-4">
                      <div className="text-right">
                        <div className="text-destructive text-sm font-semibold">
                          Insufficient credits
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Need {formatCredits(estimatedCost - userCredits)} more
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="border-destructive/30 bg-destructive/10 text-destructive-foreground flex items-start gap-2 rounded-lg border p-4 text-sm">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {uploadProgress < 100
                            ? 'Uploading video...'
                            : 'Starting AI processing...'}
                        </span>
                        <span className="text-foreground font-semibold">{uploadProgress}%</span>
                      </div>
                      <div className="bg-secondary h-2 overflow-hidden rounded-full">
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
                    disabled={isUploading || (userCredits !== undefined && !canAfford)}
                    size="lg"
                    className="w-full text-lg"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Processing video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-6 w-6" />
                        Start Processing (About {formatCredits(estimatedCost)})
                      </>
                    )}
                  </Button>

                  {userCredits === undefined && (
                    <p className="text-text-faded text-center text-sm">
                      Please{' '}
                      <a
                        href="/signup"
                        className="text-primary hover:text-primary/90 font-semibold"
                      >
                        sign in
                      </a>{' '}
                      to continue
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Processing Options Dialog */}
      <ProcessingOptionsDialog
        open={optionsDialogOpen}
        onOpenChange={setOptionsDialogOpen}
        disabled={isUploading}
      />
    </>
  )
}
