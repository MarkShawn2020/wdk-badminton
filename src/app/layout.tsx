import 'fumadocs-ui/style.css'
import '@/styles/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Noto_Sans_SC, Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'

// 中文字体：思源黑体（Noto Sans SC）
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
})

// 英文字体：Space Grotesk（保留，用于英文和数字）
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | 五道口羽毛球`,
  },
  description: siteMetadata.description,
  keywords: [
    '五道口羽毛球',
    'AI创业',
    '羽毛球俱乐部',
    'badminton club',
    '北京羽毛球',
    '海淀羽毛球',
    '清华羽毛球',
    '北大羽毛球',
    'AI entrepreneurs',
    'startup community',
    '创业者社区',
    '羽毛球活动',
  ],
  authors: [{ name: 'WDK Badminton Club' }],
  creator: '五道口AI创业羽毛球俱乐部',
  publisher: '五道口AI创业羽毛球俱乐部',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteMetadata.siteUrl,
    title: '五道口AI创业羽毛球俱乐部 - 连接创业者，享受羽毛球',
    description: siteMetadata.description,
    siteName: '五道口羽毛球',
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1200,
        height: 630,
        alt: '五道口AI创业羽毛球俱乐部',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '五道口AI创业羽毛球俱乐部',
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang="zh-CN"
      className={`${notoSansSC.variable} ${spaceGrotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />

        {/* Theme Colors - 羽毛球主题色（橙色/绿色） */}
        <meta name="msapplication-TileColor" content="#FF6B35" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FF6B35" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1A1A1A" />

        {/* Organization Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsOrganization',
              name: '五道口AI创业羽毛球俱乐部',
              alternateName: 'Wudaokou AI Badminton Club',
              url: siteMetadata.siteUrl,
              logo: `${siteMetadata.siteUrl}/static/images/logo.png`,
              description: siteMetadata.description,
              email: siteMetadata.email,
              areaServed: {
                '@type': 'City',
                name: '北京',
                alternateName: 'Beijing',
              },
              sport: 'Badminton',
              memberOf: {
                '@type': 'Organization',
                name: 'AI创业者社区',
              },
              knowsAbout: [
                'Badminton',
                'AI Entrepreneurship',
                'Community Building',
                'Sports & Networking',
              ],
            }),
          }}
        />

        {/* LocalBusiness Schema for Location-based SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: '五道口AI创业羽毛球俱乐部',
              image: `${siteMetadata.siteUrl}/static/images/og-badminton.png`,
              '@id': siteMetadata.siteUrl,
              url: siteMetadata.siteUrl,
              telephone: '', // 可选：添加联系电话
              priceRange: '¥',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '五道口',
                addressLocality: '北京市海淀区',
                addressRegion: '北京',
                postalCode: '100084',
                addressCountry: 'CN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 39.9925,
                longitude: 116.3387,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '18:00',
                  closes: '22:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday', 'Sunday'],
                  opens: '09:00',
                  closes: '22:00',
                },
              ],
            }),
          }}
        />

        {/* WebSite Schema with Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '五道口AI创业羽毛球俱乐部',
              url: siteMetadata.siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteMetadata.siteUrl}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Navigation Pages for Sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: '五道口羽毛球俱乐部主要页面',
              description: '俱乐部核心功能导航',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: '首页',
                  url: siteMetadata.siteUrl,
                  description: '五道口AI创业羽毛球俱乐部主页',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: '会员列表',
                  url: `${siteMetadata.siteUrl}/members`,
                  description: '浏览所有活跃会员',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: '积分排名',
                  url: `${siteMetadata.siteUrl}/rankings`,
                  description: '查看会员积分排行榜',
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: '场地预约',
                  url: `${siteMetadata.siteUrl}/reservations`,
                  description: '查看和报名羽毛球活动',
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: '关于我们',
                  url: `${siteMetadata.siteUrl}/about`,
                  description: '了解俱乐部历史和规则',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground pl-[calc(100vw-100%)] font-sans antialiased">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          {children}
        </ThemeProviders>
      </body>
    </html>
  )
}
