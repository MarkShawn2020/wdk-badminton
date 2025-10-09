/**
 * Section Component - Claude-inspired layout wrapper
 *
 * Provides consistent full-width sections with themed backgrounds
 * and standardized vertical spacing following Claude design system.
 *
 * @example
 * ```tsx
 * <Section theme="ivory" spacing="large">
 *   <Container>
 *     <h2>Feature Section</h2>
 *   </Container>
 * </Section>
 * ```
 */

import { cn } from '@/components/lib/utils'

interface SectionProps {
  children: React.ReactNode
  /** Visual theme - controls background color */
  theme?: 'light' | 'dark' | 'ivory' | 'oat'
  /** Vertical spacing preset */
  spacing?: 'default' | 'large' | 'hero'
  className?: string
  id?: string
}

export function Section({
  children,
  theme = 'light',
  spacing = 'default',
  className,
  id,
}: SectionProps) {
  const themes = {
    light: 'bg-background',
    dark: 'bg-bg-dark text-text-inverse',
    ivory: 'bg-bg-ivory',
    oat: 'bg-bg-oat',
  }

  const spacings = {
    default: 'py-16 lg:py-24', // Standard section spacing
    large: 'py-24 lg:py-32', // Emphasized sections
    hero: 'py-32 lg:py-48', // Hero/landing sections
  }

  return (
    <section id={id} className={cn('w-full', themes[theme], spacings[spacing], className)}>
      {children}
    </section>
  )
}
