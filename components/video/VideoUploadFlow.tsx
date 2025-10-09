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
import { Button } from '@/components/components/ui/button'
import { Switch } from '@/components/components/ui/switch'
import { Label } from '@/components/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select'
import { Badge } from '@/components/components/ui/badge'
import {
  AlertCircle,
  Loader2,
  Sparkles,
  Upload,
  Sliders,
  Zap,
  Check,
  Smartphone,
  Settings2,
  BadgeCheck,
} from 'lucide-react'
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

// Processing presets aligned with PRD
const PROCESSING_PRESETS = [
  {
    id: 'watermark-only',
    name: 'Clean Video',
    description: 'Remove watermark only',
    icon: Sparkles,
    badge: 'Fastest',
    options: {
      removeWatermark: true,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Watermark + quality boost',
    icon: Zap,
    badge: 'Popular',
    popular: true,
    options: {
      removeWatermark: true,
      enhanceQuality: true,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
  {
    id: 'social-ready',
    name: 'Social Ready',
    description: '9:16 for TikTok/Stories',
    icon: Smartphone,
    options: {
      removeWatermark: true,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: '9:16' as const,
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Choose your options',
    icon: Settings2,
    options: {
      removeWatermark: false,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
] as const

export function VideoUploadFlow({ userCredits }: UploadFlowProps) {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string>('premium')
  const [showCustomOptions, setShowCustomOptions] = useState(false)
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptionsType>({
    removeWatermark: true,
    enhanceQuality: true,
  })
  const [captionEnabled, setCaptionEnabled] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram'])
  const [captionTone, setCaptionTone] = useState<string>('professional')
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
   * Handle preset selection
   */
  const handlePresetSelect = useCallback((presetId: string) => {
    setSelectedPreset(presetId)
    const preset = PROCESSING_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      if (presetId === 'custom') {
        setShowCustomOptions(true)
      } else {
        setShowCustomOptions(false)
        setProcessingOptions(preset.options)
      }
    }
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

      {/* Main Processing Dashboard */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Upload Section */}
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <Upload className="text-primary-foreground h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-card-foreground text-xl font-semibold">Upload Video</h2>
                  <p className="text-muted-foreground text-sm">
                    Drag and drop your AI-generated video
                  </p>
                </div>
              </div>
              <VideoUploader
                onVideoSelected={handleVideoSelected}
                onVideoRemoved={handleVideoRemoved}
              />
            </div>

            {/* Processing Options Section */}
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <Sliders className="text-primary-foreground h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-card-foreground text-xl font-semibold">Processing Options</h2>
                  <p className="text-muted-foreground text-sm">
                    Choose enhancements for your video
                  </p>
                </div>
              </div>

              {/* Video Enhancement Presets */}
              <div className="space-y-6">
                {/* Preset Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {PROCESSING_PRESETS.map((preset) => {
                    const isSelected = selectedPreset === preset.id
                    const Icon = preset.icon
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.id)}
                        disabled={isUploading}
                        className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border bg-card hover:border-primary/60 hover:shadow-sm'
                        } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {/* Badge */}
                        {preset.badge && (
                          <div
                            className={`absolute -top-2 -right-2 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
                              preset.popular
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-amber-500 text-white dark:bg-amber-600'
                            }`}
                          >
                            {preset.badge}
                          </div>
                        )}

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="bg-primary absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full shadow-md">
                            <Check className="text-primary-foreground h-4 w-4" />
                          </div>
                        )}

                        {/* Icon */}
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Name */}
                        <div className="text-center">
                          <div className="text-foreground text-sm leading-tight font-semibold">
                            {preset.name}
                          </div>
                          <div className="text-muted-foreground mt-1 text-xs leading-tight">
                            {preset.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Custom Options Panel */}
                {showCustomOptions && (
                  <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
                    <p className="text-foreground mb-5 text-base font-semibold">
                      Customize Your Processing
                    </p>

                    <div className="mb-5 space-y-4">
                      <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                        <Label htmlFor="custom-watermark" className="text-sm font-medium">
                          Remove Watermark
                        </Label>
                        <Switch
                          id="custom-watermark"
                          checked={processingOptions.removeWatermark}
                          onCheckedChange={(checked) =>
                            setProcessingOptions({ ...processingOptions, removeWatermark: checked })
                          }
                          disabled={isUploading}
                        />
                      </div>

                      <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                        <Label htmlFor="custom-quality" className="text-sm font-medium">
                          Enhance Quality
                        </Label>
                        <Switch
                          id="custom-quality"
                          checked={processingOptions.enhanceQuality}
                          onCheckedChange={(checked) =>
                            setProcessingOptions({ ...processingOptions, enhanceQuality: checked })
                          }
                          disabled={isUploading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="custom-resolution" className="text-sm font-medium">
                          Resolution
                        </Label>
                        <Select
                          value={processingOptions.targetResolution || 'none'}
                          onValueChange={(value) =>
                            setProcessingOptions({
                              ...processingOptions,
                              targetResolution:
                                value === 'none' ? undefined : (value as '1080p' | '1440p' | '4K'),
                            })
                          }
                          disabled={isUploading}
                        >
                          <SelectTrigger id="custom-resolution" className="h-10">
                            <SelectValue placeholder="Original" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Original</SelectItem>
                            <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                            <SelectItem value="1440p">1440p (2K)</SelectItem>
                            <SelectItem value="4K">4K (Ultra HD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="custom-aspect" className="text-sm font-medium">
                          Aspect Ratio
                        </Label>
                        <Select
                          value={processingOptions.targetAspectRatio || 'none'}
                          onValueChange={(value) =>
                            setProcessingOptions({
                              ...processingOptions,
                              targetAspectRatio:
                                value === 'none'
                                  ? undefined
                                  : (value as '16:9' | '9:16' | '1:1' | '4:5'),
                            })
                          }
                          disabled={isUploading}
                        >
                          <SelectTrigger id="custom-aspect" className="h-10">
                            <SelectValue placeholder="Original" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Original</SelectItem>
                            <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
                            <SelectItem value="9:16">9:16 (TikTok)</SelectItem>
                            <SelectItem value="1:1">1:1 (Instagram)</SelectItem>
                            <SelectItem value="4:5">4:5 (Instagram)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Caption Generation Section */}
                <div className="border-border bg-card rounded-2xl border p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-primary h-5 w-5" />
                      <div>
                        <h3 className="text-foreground font-semibold">
                          AI Caption Generation
                          <Badge className="bg-primary/10 text-primary ml-2 text-xs">NEW</Badge>
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Get platform-optimized captions for your video
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={captionEnabled}
                      onCheckedChange={setCaptionEnabled}
                      disabled={isUploading}
                    />
                  </div>

                  {captionEnabled && (
                    <div className="border-border space-y-4 border-t pt-4">
                      {/* Platform Selection */}
                      <div>
                        <Label className="mb-2 text-sm font-medium">Target Platforms</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'].map(
                            (platform) => (
                              <button
                                key={platform}
                                onClick={() => togglePlatform(platform)}
                                disabled={isUploading}
                                className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                                  selectedPlatforms.includes(platform)
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-muted text-muted-foreground hover:border-primary/60'
                                } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                              >
                                {platform}
                              </button>
                            )
                          )}
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs">
                          Get 3-5 caption variants per platform
                        </p>
                      </div>

                      {/* Tone Selection */}
                      <div>
                        <Label htmlFor="caption-tone" className="mb-2 text-sm font-medium">
                          Tone & Style
                        </Label>
                        <Select
                          value={captionTone}
                          onValueChange={setCaptionTone}
                          disabled={isUploading}
                        >
                          <SelectTrigger id="caption-tone">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                            <SelectItem value="inspirational">Inspirational</SelectItem>
                            <SelectItem value="educational">Educational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cost & Submit Section */}
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <Zap className="text-primary-foreground h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-card-foreground text-xl font-semibold">Process & Download</h2>
                  <p className="text-muted-foreground text-sm">Review cost and start processing</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Cost Summary */}
                <div className="border-border bg-muted grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Estimated Cost</p>
                    <p className="text-foreground mt-1 text-2xl font-bold">
                      {formatCredits(estimatedCost)}
                    </p>
                    <p className="text-text-faded text-sm">{formatCreditsAsUSD(estimatedCost)}</p>
                  </div>
                  {userCredits !== undefined && (
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Your Balance</p>
                      <p className="text-foreground mt-1 text-2xl font-bold">
                        {formatCredits(userCredits)}
                      </p>
                      {!canAfford && (
                        <p className="text-destructive mt-1 text-sm font-semibold">
                          Insufficient credits
                        </p>
                      )}
                    </div>
                  )}
                </div>

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
                        {uploadProgress < 100 ? 'Uploading video...' : 'Starting AI processing...'}
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
                  disabled={!hasVideo || isUploading || (userCredits !== undefined && !canAfford)}
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
                    <a href="/signup" className="text-primary hover:text-primary/90 font-semibold">
                      sign in
                    </a>{' '}
                    to continue
                  </p>
                )}

                {!hasVideo && (
                  <p className="text-muted-foreground text-center text-sm">
                    Upload a video to get started
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
