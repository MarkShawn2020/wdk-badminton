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
  type CaptionTone,
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

  /**
   * Handle enhance quality toggle with auto-defaults
   * Sets 1080p and 60fps when enabled (respects existing preferences)
   */
  const handleEnhanceQualityToggle = (enabled: boolean) => {
    setEnhanceQuality(enabled)
    if (enabled) {
      // Set defaults for first-time users (when undefined)
      if (targetResolution === undefined) {
        setTargetResolution('1080p')
      }
      if (targetFps === undefined) {
        setTargetFps(60)
      }
    }
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
            badge="Popular"
            badgeVariant="popular"
            enabled={removeWatermark}
            onToggle={setRemoveWatermark}
            disabled={disabled}
          />

          {/* F3: Quality Enhancement */}
          <FeatureToggleCard
            icon={Zap}
            title="Enhance Quality"
            description="Boost quality for perfect social sharing (1080p, 60fps)"
            badge="Recommend"
            badgeVariant="recommend"
            enabled={enhanceQuality}
            onToggle={handleEnhanceQualityToggle}
            disabled={disabled}
          />

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
            badge="Coming Soon"
            badgeVariant="coming-soon"
            enabled={generateCaptions}
            onToggle={setGenerateCaptions}
            disabled={true}
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
                <Select
                  value={captionTone}
                  onValueChange={(value) => setCaptionTone(value as CaptionTone)}
                  disabled={disabled}
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
          </FeatureToggleCard>
        </div>
      </DialogContent>
    </Dialog>
  )
}
