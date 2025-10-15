'use client'

/**
 * ClientOnly Component
 *
 * Prevents hydration mismatches by only rendering children after client-side hydration.
 * Essential for components using localStorage/sessionStorage with atomWithStorage.
 *
 * Reference: https://www.joshwcomeau.com/react/the-perils-of-rehydration/#abstractions
 */

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  /**
   * Optional fallback to show during SSR and initial hydration
   */
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
