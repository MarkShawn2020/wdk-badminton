'use client'

/**
 * Preset-Based Processing Options - Maximum Conversion Optimization
 *
 * Design Philosophy:
 * - One-click presets for 90% of users
 * - Custom option for power users
 * - Minimal cognitive load
 * - Fast path to payment
 *
 * Conversion Strategy:
 * - Default to highest-value preset
 * - Social proof through "Popular" badges
 * - Clear benefit communication
 * - Instant gratification through presets
 */

import { useState, useCallback, useEffect } from 'react'
import { ProcessingOptions as ProcessingOptionsType } from '@/lib/validations/video'
import { Sparkles, Zap, Smartphone, Settings2, Check } from 'lucide-react'
import { Label } from '@/components/components/ui/label'
import { Switch } from '@/components/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select'

interface PresetOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  badge?: string
  options: ProcessingOptionsType
  popular?: boolean
}

const PRESETS: PresetOption[] = [
  {
    id: 'watermark-only',
    name: 'Clean Video',
    description: 'Remove watermark only',
    icon: <Sparkles className="h-5 w-5" />,
    badge: 'Popular',
    popular: true,
    options: {
      removeWatermark: true,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
  {
    id: 'full-enhancement',
    name: 'Premium',
    description: 'Watermark + quality boost',
    icon: <Zap className="h-5 w-5" />,
    badge: 'Recommend',
    options: {
      removeWatermark: true,
      enhanceQuality: true,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
  {
    id: 'social-media',
    name: 'Social Ready',
    description: 'Optimized for 9:16 (TikTok/Stories)',
    icon: <Smartphone className="h-5 w-5" />,
    options: {
      removeWatermark: true,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: '9:16',
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Choose your options',
    icon: <Settings2 className="h-5 w-5" />,
    options: {
      removeWatermark: true,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
]

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

interface ProcessingOptionsPresetsProps {
  onChange: (options: ProcessingOptionsType) => void
  disabled?: boolean
  onCustomClick?: () => void
}

export function ProcessingOptionsPresets({
  onChange,
  disabled = false,
  onCustomClick,
}: ProcessingOptionsPresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('full-enhancement')
  const [showCustomOptions, setShowCustomOptions] = useState(false)
  const [customOptions, setCustomOptions] = useState<ProcessingOptionsType>({
    removeWatermark: true,
    enhanceQuality: false,
    targetResolution: undefined,
    targetAspectRatio: undefined,
  })

  // Initialize with popular preset
  useEffect(() => {
    const popularPreset = PRESETS.find((p) => p.id === 'full-enhancement')
    if (popularPreset) {
      onChange(popularPreset.options)
    }
  }, [onChange])

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      setSelectedPreset(presetId)
      const preset = PRESETS.find((p) => p.id === presetId)
      if (preset) {
        if (presetId === 'custom') {
          // Show custom options panel
          setShowCustomOptions(true)
          onChange(customOptions)
          if (onCustomClick) {
            onCustomClick()
          }
        } else {
          // Use preset options
          setShowCustomOptions(false)
          onChange(preset.options)
        }
      }
    },
    [onChange, onCustomClick, customOptions]
  )

  const updateCustomOptions = useCallback(
    (updates: Partial<ProcessingOptionsType>) => {
      const newOptions = { ...customOptions, ...updates }
      setCustomOptions(newOptions)
      onChange(newOptions)
    },
    [customOptions, onChange]
  )

  return (
    <div className="space-y-4">
      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              disabled={disabled}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/60 hover:shadow-sm'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                {preset.icon}
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

      {/* Custom Options Panel (Expanded when Custom is selected) */}
      {showCustomOptions && (
        <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
          <p className="text-foreground mb-5 text-base font-semibold">Customize Your Processing</p>

          {/* Watermark & Quality Toggles */}
          <div className="mb-5 space-y-4">
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <Label htmlFor="custom-watermark" className="text-sm font-medium">
                Remove Watermark
              </Label>
              <Switch
                id="custom-watermark"
                checked={customOptions.removeWatermark}
                onCheckedChange={(checked) => updateCustomOptions({ removeWatermark: checked })}
                disabled={disabled}
              />
            </div>

            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <Label htmlFor="custom-quality" className="text-sm font-medium">
                Enhance Quality
              </Label>
              <Switch
                id="custom-quality"
                checked={customOptions.enhanceQuality}
                onCheckedChange={(checked) => updateCustomOptions({ enhanceQuality: checked })}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Resolution & Aspect Ratio Selects */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="custom-resolution" className="text-sm font-medium">
                Resolution
              </Label>
              <Select
                value={customOptions.targetResolution || 'none'}
                onValueChange={(value) =>
                  updateCustomOptions({
                    targetResolution:
                      value === 'none' ? undefined : (value as '720p' | '1080p' | '4k'),
                  })
                }
                disabled={disabled}
              >
                <SelectTrigger id="custom-resolution" className="h-10">
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

            <div className="space-y-2">
              <Label htmlFor="custom-aspect" className="text-sm font-medium">
                Aspect Ratio
              </Label>
              <Select
                value={customOptions.targetAspectRatio || 'none'}
                onValueChange={(value) =>
                  updateCustomOptions({
                    targetAspectRatio:
                      value === 'none' ? undefined : (value as '16:9' | '9:16' | '1:1' | '4:5'),
                  })
                }
                disabled={disabled}
              >
                <SelectTrigger id="custom-aspect" className="h-10">
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
        </div>
      )}

      {/* Selected Options Summary (Collapsed) */}
      {!showCustomOptions && selectedPreset !== 'custom' && (
        <div className="text-center">
          <p className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Check className="h-4 w-4" />
            Selected: {PRESETS.find((p) => p.id === selectedPreset)?.name}
          </p>
        </div>
      )}
    </div>
  )
}
