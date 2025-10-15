import { Metadata } from 'next'
import { generatePageMetadata, SITELINK_PAGES } from '@/lib/seo/generateMetadata'
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData'
import siteMetadata from '@/data/siteMetadata'

export const metadata: Metadata = generatePageMetadata(SITELINK_PAGES.pricing)

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: siteMetadata.siteUrl },
          { name: 'Pricing', url: `${siteMetadata.siteUrl}/pricing` },
        ]}
      />
      {children}
    </>
  )
}
