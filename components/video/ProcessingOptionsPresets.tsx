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
    badge: 'Fastest',
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
      removeWatermark: false,
      enhanceQuality: false,
      targetResolution: undefined,
      targetAspectRatio: undefined,
    },
  },
]

const RESOLUTIONS = [
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '1440p', label: '1440p (2K)' },
  { value: '4K', label: '4K (Ultra HD)' },
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
    removeWatermark: false,
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
    <div className="space-y-3">
      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              disabled={disabled}
              className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {/* Badge */}
              {preset.badge && (
                <div
                  className={`absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    preset.popular
                      ? 'bg-primary text-white'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100'
                  }`}
                >
                  {preset.badge}
                </div>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="bg-primary absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}

              {/* Icon */}
              <div className={`${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {preset.icon}
              </div>

              {/* Name */}
              <div className="text-center">
                <div className="text-foreground text-sm font-semibold">{preset.name}</div>
                <div className="text-muted-foreground mt-0.5 text-xs">{preset.description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Custom Options Panel (Expanded when Custom is selected) */}
      {showCustomOptions && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-foreground mb-4 text-sm font-semibold">Customize Your Processing</p>

          {/* Watermark & Quality Toggles */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-watermark" className="text-sm">
                Remove Watermark
              </Label>
              <Switch
                id="custom-watermark"
                checked={customOptions.removeWatermark}
                onCheckedChange={(checked) => updateCustomOptions({ removeWatermark: checked })}
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="custom-quality" className="text-sm">
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="custom-resolution" className="text-xs">
                Resolution
              </Label>
              <Select
                value={customOptions.targetResolution || 'none'}
                onValueChange={(value) =>
                  updateCustomOptions({
                    targetResolution:
                      value === 'none' ? undefined : (value as '1080p' | '1440p' | '4K'),
                  })
                }
                disabled={disabled}
              >
                <SelectTrigger id="custom-resolution" className="h-9">
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
              <Label htmlFor="custom-aspect" className="text-xs">
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
                <SelectTrigger id="custom-aspect" className="h-9">
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
        <div className="text-muted-foreground text-xs">
          <p className="text-center">
            ✓ Selected:{' '}
            <span className="text-foreground font-medium">
              {PRESETS.find((p) => p.id === selectedPreset)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
