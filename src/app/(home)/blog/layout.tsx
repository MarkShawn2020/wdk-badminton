import type { ReactNode } from 'react'
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData'
import siteMetadata from '@/data/siteMetadata'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: siteMetadata.siteUrl },
          { name: 'Blog', url: `${siteMetadata.siteUrl}/blog` },
        ]}
      />
      {children}
    </>
  )
}
