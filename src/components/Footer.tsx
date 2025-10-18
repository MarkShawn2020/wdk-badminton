import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="border-border bg-secondary border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Club Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              俱乐部
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-muted-foreground hover:text-foreground">
                  会员风采
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-muted-foreground hover:text-foreground">
                  积分排名
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-muted-foreground hover:text-foreground">
                  活动预约
                </Link>
              </li>
            </ul>
          </div>

          {/* Activities Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              活动
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/reservations" className="text-muted-foreground hover:text-foreground">
                  日常约球
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-muted-foreground hover:text-foreground">
                  月度友谊赛
                </Link>
              </li>
              <li>
                <Link
                  href="/about#training"
                  className="text-muted-foreground hover:text-foreground"
                >
                  技能提升
                </Link>
              </li>
              <li>
                <Link href="/about#social" className="text-muted-foreground hover:text-foreground">
                  社交活动
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              资源
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  会员权益
                </Link>
              </li>
              <li>
                <Link href="/pricing#faq" className="text-muted-foreground hover:text-foreground">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  俱乐部规则
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              联系我们
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  邮箱
                </a>
              </li>
              <li>
                <a
                  href={siteMetadata.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Twitter/X
                </a>
              </li>
              <li>
                <a
                  href={siteMetadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">📍 北京五道口</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-border mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright and Social Icons */}
            <div className="flex flex-col items-center gap-3 md:items-start">
              <div className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} {siteMetadata.author}. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
                <SocialIcon kind="x" href={siteMetadata.x} size={5} />
                <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/signup"
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white"
              >
                🏸 立即加入
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
