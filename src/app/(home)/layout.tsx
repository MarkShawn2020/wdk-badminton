import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'

/**
 * Home Layout - Phase 1 MVP
 *
 * Simple layout with Header + Footer for static landing pages.
 * Authentication and workspace features will be added in Phase 2.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  // Phase 1: No authentication, just static pages
  return (
    <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
      <Header />
      <SectionContainer>
        <main className="mb-auto">{children}</main>
      </SectionContainer>
      <Footer />
    </SearchProvider>
  )
}
