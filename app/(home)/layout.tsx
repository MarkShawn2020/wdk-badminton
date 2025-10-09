import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
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
