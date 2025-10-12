'use client'

/**
 * Processing Options Dialog
 *
 * Dialog for configuring video processing options
 * Features: Watermark removal, quality enhancement, custom watermark, AI captions
 * All options are persisted using jotai atoms
 */

import { useAtom } from 'jotai'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/components/ui/dialog'
import { Label } from '@/components/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select'
import { FeatureToggleCard } from './FeatureToggleCard'
import { BadgeCheck, Zap, ImagePlus, Sparkles } from 'lucide-react'
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

interface ProcessingOptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled?: boolean
}

export function ProcessingOptionsDialog({
  open,
  onOpenChange,
  disabled = false,
}: ProcessingOptionsDialogProps) {
  // Use jotai atoms for persistent state
  const [removeWatermark, setRemoveWatermark] = useAtom(removeWatermarkAtom)
  const [enhanceQuality, setEnhanceQuality] = useAtom(enhanceQualityAtom)
  const [targetResolution, setTargetResolution] = useAtom(targetResolutionAtom)
  const [targetFps, setTargetFps] = useAtom(targetFpsAtom)
  const [addCustomWatermark, setAddCustomWatermark] = useAtom(addCustomWatermarkAtom)
  const [generateCaptions, setGenerateCaptions] = useAtom(generateCaptionsAtom)
  const [selectedPlatforms, setSelectedPlatforms] = useAtom(selectedPlatformsAtom)
  const [captionTone, setCaptionTone] = useAtom(captionToneAtom)

  /**
   * Toggle platform selection for captions
   */
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Processing Options</DialogTitle>
          <DialogDescription>
            Choose enhancements for your video. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* F2: Watermark Removal */}
          <FeatureToggleCard
            icon={BadgeCheck}
            title="Remove Watermark"
            description="Remove AI platform watermarks from your video"
            enabled={removeWatermark}
            onToggle={setRemoveWatermark}
            disabled={disabled}
          />

          {/* F3: Quality Enhancement */}
          <FeatureToggleCard
            icon={Zap}
            title="Enhance Quality"
            description="Upscale, denoise, and improve video quality"
            badge="Popular"
            badgeVariant="popular"
            enabled={enhanceQuality}
            onToggle={setEnhanceQuality}
            disabled={disabled}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Target Resolution</Label>
                <div className="space-y-2">
                  {/* Original Resolution Option */}
                  <button
                    type="button"
                    onClick={() => setTargetResolution(undefined)}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetResolution === undefined
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetResolution === undefined
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetResolution === undefined && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">Original Quality</span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          Keep the original resolution without upscaling
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 720p Option */}
                  <button
                    type="button"
                    onClick={() => setTargetResolution('720p')}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetResolution === '720p'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetResolution === '720p'
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetResolution === '720p' && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">720p</span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            HD
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          1280×720 - Good for social media, smaller file sizes
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 1080p Option */}
                  <button
                    type="button"
                    onClick={() => setTargetResolution('1080p')}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetResolution === '1080p'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetResolution === '1080p'
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetResolution === '1080p' && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">1080p</span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Full HD
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          1920×1080 - Standard for YouTube, Instagram, most platforms
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 4K Option */}
                  <button
                    type="button"
                    onClick={() => setTargetResolution('4k')}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetResolution === '4k'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetResolution === '4k'
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetResolution === '4k' && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">4K</span>
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            Ultra HD
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          3840×2160 - Premium quality for professional use (higher cost & time)
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Target FPS</Label>
                <div className="space-y-2">
                  {/* Original FPS Option */}
                  <button
                    type="button"
                    onClick={() => setTargetFps(undefined)}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetFps === undefined
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetFps === undefined
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetFps === undefined && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">Original FPS</span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          Keep the original frame rate of your video
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 24 FPS Option */}
                  <button
                    type="button"
                    onClick={() => setTargetFps(24)}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetFps === 24
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetFps === 24
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetFps === 24 && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">24 FPS</span>
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                            Cinematic
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          Film-like motion blur, best for artistic/cinematic content
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 30 FPS Option */}
                  <button
                    type="button"
                    onClick={() => setTargetFps(30)}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetFps === 30
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetFps === 30
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetFps === 30 && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">30 FPS</span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Standard
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          Balanced quality and file size, ideal for most social media
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 60 FPS Option */}
                  <button
                    type="button"
                    onClick={() => setTargetFps(60)}
                    disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      targetFps === 60
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border-2 transition-all ${
                              targetFps === 60
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {targetFps === 60 && (
                              <div
                                className="h-full w-full rounded-full bg-white"
                                style={{ transform: 'scale(0.5)' }}
                              />
                            )}
                          </div>
                          <span className="font-medium">60 FPS</span>
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                            Smooth
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1 ml-6 text-xs">
                          Ultra-smooth motion, perfect for gaming/sports content (larger file size)
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </FeatureToggleCard>

          {/* F4: Custom Watermark Addition */}
          <FeatureToggleCard
            icon={ImagePlus}
            title="Add Custom Watermark"
            description="Add your logo or branding to the video"
            badge="Coming Soon"
            badgeVariant="coming-soon"
            enabled={addCustomWatermark}
            onToggle={setAddCustomWatermark}
            disabled={true}
          >
            <div className="text-muted-foreground text-sm">
              Watermark customization will be available soon. You'll be able to upload your logo,
              adjust position, opacity, and size.
            </div>
          </FeatureToggleCard>

          {/* F5: AI Caption Generation */}
          <FeatureToggleCard
            icon={Sparkles}
            title="AI Caption Generation"
            description="Get platform-optimized captions for your video"
            badge="NEW"
            badgeVariant="new"
            enabled={generateCaptions}
            onToggle={setGenerateCaptions}
            disabled={disabled}
          >
            <div className="space-y-4">
              {/* Platform Selection */}
              <div>
                <Label className="mb-2 text-sm font-medium">Target Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      disabled={disabled}
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        selectedPlatforms.includes(platform)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted text-muted-foreground hover:border-primary/60'
                      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      {platform}
                    </button>
                  ))}
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
                <Select value={captionTone} onValueChange={setCaptionTone} disabled={disabled}>
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
          </FeatureToggleCard>
        </div>
      </DialogContent>
    </Dialog>
  )
}
