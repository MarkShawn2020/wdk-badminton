import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'

/**
 * Home Layout - 五道口AI创业羽毛球俱乐部
 *
 * Phase 1 MVP: 简洁的三段式布局
 * - Header: 固定顶部，快速导航
 * - Main Content: 动态内容区域
 * - Footer: 联系方式、社交链接
 *
 * Phase 2: 添加侧边栏、面包屑导航等
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
      {/* 全局搜索功能（Cmd+K 或 Ctrl+K） */}

      <div className="flex min-h-screen flex-col">
        {/* Header - 固定顶部 */}
        <Header />

        {/* Main Content - 自适应高度 */}
        <SectionContainer>
          <main className="mb-auto flex-1">{children}</main>
        </SectionContainer>

        {/* Footer - 底部 */}
        <Footer />
      </div>
    </SearchProvider>
  )
}
