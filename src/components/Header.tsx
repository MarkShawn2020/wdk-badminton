import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

/**
 * Header Component - 五道口AI创业羽毛球俱乐部
 *
 * 设计理念：
 * - 简洁现代：去除多余元素，突出核心功能
 * - 视觉冲击：大胆的羽毛球emoji，活力橙色
 * - 快速导航：固定顶部，方便快速切换页面
 * - 移动友好：响应式设计，小屏幕自动切换汉堡菜单
 */

const Header = () => {
  // 固定顶部导航，背景模糊效果
  const headerClass = siteMetadata.stickyNav
    ? 'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    : 'w-full border-b border-border/40 bg-background'

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Site Name */}
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="group flex items-center gap-3 transition-all hover:scale-105"
        >
          {/* 羽毛球Icon - 大胆酷炫 */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-2xl shadow-md transition-all group-hover:shadow-lg">
            🏸
          </div>

          {/* Site Name - 简洁有力 */}
          <div className="hidden sm:block">
            <div className="text-foreground text-lg font-bold">{siteMetadata.headerTitle}</div>
            <div className="text-muted-foreground text-[10px] font-medium">AI创业者羽毛球社区</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group text-muted-foreground hover:bg-accent hover:text-foreground relative rounded-lg px-4 py-2 text-sm font-medium transition-all"
              >
                {/* Icon (可选，看起来更酷炫) */}
                {link.icon && <span className="mr-1.5">{link.icon}</span>}
                {link.title}

                {/* Hover Underline Effect */}
                <span className="absolute right-4 bottom-1 left-4 h-0.5 scale-x-0 rounded-full bg-orange-500 transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <SearchButton />

          {/* Theme Toggle */}
          <ThemeSwitch />

          {/* Phase 2: Login/Avatar will be added here */}
          {/* <UserAvatar /> */}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
