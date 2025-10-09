'use client'

/**
 * Processing Options Dialog
 *
 * Dialog for configuring video processing options
 * Features: Watermark removal, quality enhancement, custom watermark, AI captions
 */

import { Dispatch, SetStateAction } from 'react'
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

interface ProcessingOptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Feature toggles
  removeWatermark: boolean
  setRemoveWatermark: Dispatch<SetStateAction<boolean>>
  enhanceQuality: boolean
  setEnhanceQuality: Dispatch<SetStateAction<boolean>>
  targetResolution: '1080p' | '1440p' | '4K' | undefined
  setTargetResolution: Dispatch<SetStateAction<'1080p' | '1440p' | '4K' | undefined>>
  addCustomWatermark: boolean
  setAddCustomWatermark: Dispatch<SetStateAction<boolean>>
  generateCaptions: boolean
  setGenerateCaptions: Dispatch<SetStateAction<boolean>>
  selectedPlatforms: string[]
  togglePlatform: (platform: string) => void
  captionTone: string
  setCaptionTone: Dispatch<SetStateAction<string>>
  disabled?: boolean
}

export function ProcessingOptionsDialog({
  open,
  onOpenChange,
  removeWatermark,
  setRemoveWatermark,
  enhanceQuality,
  setEnhanceQuality,
  targetResolution,
  setTargetResolution,
  addCustomWatermark,
  setAddCustomWatermark,
  generateCaptions,
  setGenerateCaptions,
  selectedPlatforms,
  togglePlatform,
  captionTone,
  setCaptionTone,
  disabled = false,
}: ProcessingOptionsDialogProps) {
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
            <div className="space-y-2">
              <Label htmlFor="target-resolution" className="text-sm font-medium">
                Target Resolution
              </Label>
              <Select
                value={targetResolution || 'original'}
                onValueChange={(value) =>
                  setTargetResolution(
                    value === 'original' ? undefined : (value as '1080p' | '1440p' | '4K')
                  )
                }
                disabled={disabled}
              >
                <SelectTrigger id="target-resolution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original Quality</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  <SelectItem value="1440p">1440p (2K)</SelectItem>
                  <SelectItem value="4K">4K (Ultra HD)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Higher resolutions may increase processing time and cost
              </p>
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
