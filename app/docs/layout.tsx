import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { docs } from '@/lib/source'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{
        title: 'ReelVan',
        url: '/',
      }}
      links={[]}
      tree={docs.pageTree}
    >
      {children}
    </DocsLayout>
  )
}
