import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { docs } from '@/lib/source'
import type { ReactNode } from 'react'
import Image from 'next/image'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{
        title: (
          <div className="flex items-center gap-2.5">
            <Image
              src="/static/images/logo.svg"
              alt="ReelVan Logo"
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="font-semibold">ReelVan</span>
          </div>
        ),
        url: '/',
      }}
      links={[]}
      tree={docs.pageTree}
    >
      {children}
    </DocsLayout>
  )
}
