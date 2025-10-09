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

  // Feature toggles (default: watermark removal + quality enhancement enabled)
  const [removeWatermark, setRemoveWatermark] = useState(true)
  const [enhanceQuality, setEnhanceQuality] = useState(true)
  const [targetResolution, setTargetResolution] = useState<'1080p' | '1440p' | '4K' | undefined>(
    undefined
  )
  const [addCustomWatermark, setAddCustomWatermark] = useState(false)
  const [generateCaptions, setGenerateCaptions] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram'])
  const [captionTone, setCaptionTone] = useState<string>('professional')

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
   * Toggle platform selection for captions
   */
  const togglePlatform = useCallback((platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }, [])

  /**
   * Get active features summary
   */
  const getActiveFeatures = useCallback(() => {
    const features = []
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

      // Step 2.5: Get public URL for the uploaded video
      const publicUrlResponse = await fetch('/api/storage/public-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storagePath }),
      })

      if (publicUrlResponse.ok) {
        const publicUrlData = await publicUrlResponse.json()
        const publicUrl = publicUrlData.data.publicUrl
        console.log('✅ Video uploaded successfully!')
        console.log('📹 Storage Path:', storagePath)
        console.log('🔗 Public URL:', publicUrl)
        console.log('📊 File Size:', (selectedVideo.file.size / (1024 * 1024)).toFixed(2), 'MB')
        console.log('⏱️ Duration:', selectedVideo.duration.toFixed(1), 'seconds')
      }

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
          removeWatermark,
          enhanceQuality,
          targetResolution,
          addCustomWatermark,
          generateCaptions,
          captionPlatforms: generateCaptions ? selectedPlatforms : undefined,
          captionTone: generateCaptions ? captionTone : undefined,
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
  const activeFeatures = getActiveFeatures()

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
              Turn Your Video Instantly Shareable
            </h1>
            <p className="text-text-faded mt-6 text-lg leading-8">
              Transform AI videos into ready-to-post social content. Remove watermarks, enhance
              quality, add branding—all in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Upload Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
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
                  {selectedVideo && (
                    <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                      <div className="text-muted-foreground text-sm">Estimated Cost</div>
                      <div className="text-right">
                        <div className="text-primary font-bold">{formatCredits(estimatedCost)}</div>
                        <div className="text-muted-foreground text-xs">
                          {formatCreditsAsUSD(estimatedCost)}
                        </div>
                      </div>
                    </div>
                  )}
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
                  {userCredits !== undefined && (
                    <div className="border-border bg-muted flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="text-muted-foreground text-sm">Your Balance</div>
                        <div className="text-foreground text-2xl font-bold">
                          {formatCredits(userCredits)}
                        </div>
                      </div>
                      {!canAfford && (
                        <div className="text-right">
                          <div className="text-destructive text-sm font-semibold">
                            Insufficient credits
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Need {formatCredits(estimatedCost - userCredits)} more
                          </div>
                        </div>
                      )}
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
                        Start Processing ({formatCredits(estimatedCost)})
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
        removeWatermark={removeWatermark}
        setRemoveWatermark={setRemoveWatermark}
        enhanceQuality={enhanceQuality}
        setEnhanceQuality={setEnhanceQuality}
        targetResolution={targetResolution}
        setTargetResolution={setTargetResolution}
        addCustomWatermark={addCustomWatermark}
        setAddCustomWatermark={setAddCustomWatermark}
        generateCaptions={generateCaptions}
        setGenerateCaptions={setGenerateCaptions}
        selectedPlatforms={selectedPlatforms}
        togglePlatform={togglePlatform}
        captionTone={captionTone}
        setCaptionTone={setCaptionTone}
        disabled={isUploading}
      />
    </>
  )
}
