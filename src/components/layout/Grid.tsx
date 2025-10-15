/**
 * Grid Component - Claude-style 12-column responsive grid
 *
 * Implements the u-grid-desktop pattern from Claude design system.
 * Collapses to single column on mobile, 12 columns on desktop.
 *
 * @example
 * ```tsx
 * <Grid>
 *   <div className="lg:col-span-6">Left Half</div>
 *   <div className="lg:col-span-6">Right Half</div>
 * </Grid>
 * ```
 */

import { cn } from '@/components/lib/utils'

interface GridProps {
  children: React.ReactNode
  /** Gap size between grid items */
  gap?: 's' | 'm' | 'l' | 'xl'
  className?: string
}

export function Grid({ children, gap = 'm', className }: GridProps) {
  const gaps = {
    s: 'gap-4', // 1rem
    m: 'gap-6 lg:gap-8', // 1.5rem → 2rem
    l: 'gap-8 lg:gap-12', // 2rem → 3rem
    xl: 'gap-12 lg:gap-16', // 3rem → 4rem
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-12', // Mobile: 1 col, Desktop: 12 cols
        gaps[gap],
        className
      )}
    >
      {children}
    </div>
  )
}
