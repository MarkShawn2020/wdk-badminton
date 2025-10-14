'use client'

/**
 * Feature Toggle Card Component
 *
 * Reusable card component for toggling features with expandable options
 * Used for: Watermark removal, quality enhancement, caption generation, etc.
 */

import { ReactNode } from 'react'
import { Switch } from '@/components/components/ui/switch'
import { Badge } from '@/components/components/ui/badge'
import { LucideIcon } from 'lucide-react'

interface FeatureToggleCardProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  badgeVariant?: 'new' | 'popular' | 'coming-soon'
  enabled: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
  children?: ReactNode
}

export function FeatureToggleCard({
  icon: Icon,
  title,
  description,
  badge,
  badgeVariant = 'new',
  enabled,
  onToggle,
  disabled = false,
  children,
}: FeatureToggleCardProps) {
  const badgeStyles = {
    new: 'bg-primary/10 text-primary',
    popular: 'bg-amber-500/10 text-amber-700 dark:text-amber-500',
    'coming-soon': 'bg-muted text-muted-foreground',
  }

  return (
    <div className="border-border bg-card rounded-2xl border p-6">
      {/* Toggle Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="text-primary h-5 w-5" />
          <div>
            <h3 className="text-foreground font-semibold">
              {title}
              {badge && (
                <Badge className={`ml-2 text-xs ${badgeStyles[badgeVariant]}`}>{badge}</Badge>
              )}
            </h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} disabled={disabled} />
      </div>

      {/* Expanded Options */}
      {enabled && children && (
        <div className="border-border space-y-4 border-t pt-4">{children}</div>
      )}
    </div>
  )
}
