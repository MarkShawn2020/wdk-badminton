/**
 * Container Component - Claude-inspired constrained width wrapper
 *
 * Provides consistent horizontal padding and max-width constraints
 * following Claude design system's container patterns.
 *
 * @example
 * ```tsx
 * <Container size="default">
 *   <h1>Centered Content</h1>
 * </Container>
 * ```
 */

import { cn } from '@/components/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  /** Width constraint preset */
  size?: 'narrow' | 'default' | 'wide' | 'full'
  className?: string
}

export function Container({ children, size = 'default', className }: ContainerProps) {
  const sizes = {
    narrow: 'max-w-4xl', // 896px - Optimal for reading (articles, blog posts)
    default: 'max-w-7xl', // 1280px - Standard content width
    wide: 'max-w-[1440px]', // 1440px - Wide layouts (dashboards, galleries)
    full: 'w-full', // 100% - No constraint
  }

  return (
    <div
      className={cn(
        'mx-auto px-6 lg:px-8', // Claude-style horizontal padding
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
