'use client'

/**
 * Compact Video Processing Options - Optimized for Conversion
 *
 * Design Goals:
 * - Reduce vertical space by 60%+
 * - Minimize decision fatigue
 * - Highlight value propositions
 * - Accelerate to payment step
 *
 * Psychology Principles:
 * - Default to most valuable option (watermark removal)
 * - Progressive disclosure for advanced options
 * - Social proof messaging
 * - Clear value indicators
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
import { ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/components/ui/button'

interface ProcessingOptionsProps {
  onChange: (options: ProcessingOptionsType) => void
  disabled?: boolean
}

const RESOLUTIONS = [
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '4k', label: '4K (Ultra HD)' },
] as const

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9', description: 'YouTube' },
  { value: '9:16', label: '9:16', description: 'TikTok' },
  { value: '1:1', label: '1:1', description: 'Instagram' },
  { value: '4:5', label: '4:5', description: 'Instagram' },
] as const

export function ProcessingOptionsCompact({ onChange, disabled = false }: ProcessingOptionsProps) {
  const [options, setOptions] = useState<ProcessingOptionsType>({
    removeWatermark: true, // Default ON for faster conversion
    targetResolution: undefined,
    targetAspectRatio: undefined,
    enhanceQuality: false,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

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
    <div className="space-y-4">
      {/* Primary Options - Compact Single Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        {/* Watermark Removal - Primary Feature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <div>
              <Label htmlFor="watermark" className="font-semibold">
                Remove Watermark
              </Label>
              <p className="text-xs text-gray-500">Most popular feature</p>
            </div>
          </div>
          <Switch
            id="watermark"
            checked={options.removeWatermark}
            onCheckedChange={(checked) => updateOptions({ removeWatermark: checked })}
            disabled={disabled}
          />
        </div>

        {/* Divider */}
        <div className="border-border my-3 border-t" />

        {/* Quality Enhancement - Secondary Upsell */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <div>
              <Label htmlFor="enhance" className="font-semibold">
                Enhance Quality
              </Label>
              <p className="text-xs text-gray-500">AI-powered upscaling</p>
            </div>
          </div>
          <Switch
            id="enhance"
            checked={options.enhanceQuality}
            onCheckedChange={(checked) => updateOptions({ enhanceQuality: checked })}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Advanced Options - Collapsible */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-muted-foreground w-full justify-between text-sm"
        >
          <span>Advanced Options (Resolution, Aspect Ratio)</span>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            {/* Resolution */}
            <div className="space-y-2">
              <Label htmlFor="resolution" className="text-xs font-medium">
                Resolution
              </Label>
              <Select
                value={options.targetResolution || 'none'}
                onValueChange={(value) =>
                  updateOptions({
                    targetResolution:
                      value === 'none' ? undefined : (value as '720p' | '1080p' | '4k'),
                  })
                }
                disabled={disabled}
              >
                <SelectTrigger id="resolution" className="h-9">
                  <SelectValue placeholder="Original" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Original</SelectItem>
                  {RESOLUTIONS.map((res) => (
                    <SelectItem key={res.value} value={res.value}>
                      {res.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio" className="text-xs font-medium">
                Aspect Ratio
              </Label>
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
                <SelectTrigger id="aspect-ratio" className="h-9">
                  <SelectValue placeholder="Original" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Original</SelectItem>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label} ({ratio.description})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
