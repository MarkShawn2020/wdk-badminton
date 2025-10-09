'use client'

/**
 * Video processing options form component
 *
 * Features:
 * - Watermark removal toggle
 * - Resolution selection
 * - Aspect ratio selection
 * - Quality enhancement toggle
 */

import { useState, useCallback } from 'react'
import { ProcessingOptions as ProcessingOptionsType } from '@/lib/validations/video'
import { Label } from '@/components/components/ui/label'
import { Switch } from '@/components/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select'
import { Card } from '@/components/components/ui/card'

interface ProcessingOptionsProps {
  onChange: (options: ProcessingOptionsType) => void
  disabled?: boolean
}

const RESOLUTIONS = [
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '1440p', label: '1440p (2K)' },
  { value: '4K', label: '4K (Ultra HD)' },
] as const

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9 (Landscape)', description: 'YouTube, TV' },
  { value: '9:16', label: '9:16 (Portrait)', description: 'TikTok, Instagram Stories' },
  { value: '1:1', label: '1:1 (Square)', description: 'Instagram Feed' },
  { value: '4:5', label: '4:5 (Vertical)', description: 'Instagram Feed' },
] as const

export function ProcessingOptions({ onChange, disabled = false }: ProcessingOptionsProps) {
  const [options, setOptions] = useState<ProcessingOptionsType>({
    removeWatermark: false,
    targetResolution: undefined,
    targetAspectRatio: undefined,
    enhanceQuality: false,
  })

  /**
   * Update options and notify parent
   */
  const updateOptions = useCallback(
    (updates: Partial<ProcessingOptionsType>) => {
      const newOptions = { ...options, ...updates }
      setOptions(newOptions)
      onChange(newOptions)
    },
    [options, onChange]
  )

  return (
    <div className="space-y-6">
      {/* Watermark Removal */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <Label htmlFor="watermark" className="text-base font-semibold">
              Remove Watermark
            </Label>
            <p className="text-muted-foreground text-sm">
              Automatically detect and remove watermarks from your video
            </p>
          </div>
          <Switch
            id="watermark"
            checked={options.removeWatermark}
            onCheckedChange={(checked) => updateOptions({ removeWatermark: checked })}
            disabled={disabled}
          />
        </div>
      </Card>

      {/* Quality Enhancement */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <Label htmlFor="enhance" className="text-base font-semibold">
              Enhance Quality
            </Label>
            <p className="text-muted-foreground text-sm">
              AI-powered denoising and sharpening for better video quality
            </p>
          </div>
          <Switch
            id="enhance"
            checked={options.enhanceQuality}
            onCheckedChange={(checked) => updateOptions({ enhanceQuality: checked })}
            disabled={disabled}
          />
        </div>
      </Card>

      {/* Resolution Selection */}
      <Card className="p-6">
        <div className="space-y-3">
          <div>
            <Label htmlFor="resolution" className="text-base font-semibold">
              Target Resolution
            </Label>
            <p className="text-muted-foreground mt-1 text-sm">
              Upscale your video to higher resolution (optional)
            </p>
          </div>

          <Select
            value={options.targetResolution || 'none'}
            onValueChange={(value) =>
              updateOptions({
                targetResolution:
                  value === 'none' ? undefined : (value as '1080p' | '1440p' | '4K'),
              })
            }
            disabled={disabled}
          >
            <SelectTrigger id="resolution" className="w-full">
              <SelectValue placeholder="Keep original resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Keep original resolution</SelectItem>
              {RESOLUTIONS.map((res) => (
                <SelectItem key={res.value} value={res.value}>
                  {res.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Aspect Ratio Selection */}
      <Card className="p-6">
        <div className="space-y-3">
          <div>
            <Label htmlFor="aspect-ratio" className="text-base font-semibold">
              Aspect Ratio
            </Label>
            <p className="text-muted-foreground mt-1 text-sm">
              Change video aspect ratio for different platforms (optional)
            </p>
          </div>

          <Select
            value={options.targetAspectRatio || 'none'}
            onValueChange={(value) =>
              updateOptions({
                targetAspectRatio:
                  value === 'none' ? undefined : (value as '16:9' | '9:16' | '1:1' | '4:5'),
              })
            }
            disabled={disabled}
          >
            <SelectTrigger id="aspect-ratio" className="w-full">
              <SelectValue placeholder="Keep original aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Keep original aspect ratio</SelectItem>
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  <div className="flex flex-col">
                    <span>{ratio.label}</span>
                    <span className="text-xs text-gray-500">{ratio.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Summary */}
      <div className="rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-900">
        <p className="text-foreground font-semibold">Selected Options:</p>
        <ul className="text-muted-foreground mt-2 space-y-1">
          {options.removeWatermark && <li>• Remove watermark</li>}
          {options.enhanceQuality && <li>• Enhance quality</li>}
          {options.targetResolution && <li>• Upscale to {options.targetResolution}</li>}
          {options.targetAspectRatio && <li>• Convert to {options.targetAspectRatio}</li>}
          {!options.removeWatermark &&
            !options.enhanceQuality &&
            !options.targetResolution &&
            !options.targetAspectRatio && <li className="text-gray-400">No options selected</li>}
        </ul>
      </div>
    </div>
  )
}
