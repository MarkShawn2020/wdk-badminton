'use client'

import { ThemeProvider } from 'next-themes'
import { RootProvider } from 'fumadocs-ui/provider'
import siteMetadata from '@/data/siteMetadata'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
        {children}
      </ThemeProvider>
    </RootProvider>
  )
}
