import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/public/static/images/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { UserAvatar } from './auth/UserAvatar'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-background justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle} className="text-primary-500">
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo className="h-10 w-10" />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden items-center gap-x-4 overflow-x-auto sm:flex">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 text-foreground font-medium whitespace-nowrap"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <UserAvatar />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
