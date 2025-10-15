/**
 * Sitelink Navigation Component
 *
 * Prominently features core pages to help Google identify important sitelinks.
 * Key SEO factors:
 * 1. Clear, descriptive anchor text (not "click here" or "learn more")
 * 2. Prominent placement (visible on homepage)
 * 3. Semantic HTML structure
 * 4. Consistent across pages
 */

import Link from 'next/link'

interface NavLink {
  href: string
  title: string
  description: string
  icon: string
}

const coreLinks: NavLink[] = [
  {
    href: '/transformer',
    title: 'Video Transformer',
    description: 'Remove watermarks & enhance quality instantly',
    icon: '✨',
  },
  {
    href: '/pricing',
    title: 'Pricing Plans',
    description: 'Simple, transparent pricing. Pay-as-you-go from $2.99',
    icon: '💳',
  },
  {
    href: '/blog',
    title: 'Blog & Tutorials',
    description: 'AI video tips, guides, and best practices',
    icon: '📝',
  },
  {
    href: '/docs',
    title: 'Documentation',
    description: 'Complete API docs and usage guides',
    icon: '📚',
  },
  {
    href: '/discover',
    title: 'Discover Gallery',
    description: 'Browse community AI video examples',
    icon: '🎬',
  },
  {
    href: '/dashboard',
    title: 'Dashboard',
    description: 'Manage your projects and credits',
    icon: '⚡',
  },
]

export function SitelinkNav() {
  return (
    <section aria-label="Quick navigation to key pages" className="bg-secondary py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Quick Access
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Everything you need to transform your AI videos
          </p>
        </div>
        <nav className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-border bg-card hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 group flex flex-col rounded-xl border p-5 transition-all hover:shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-3xl">{link.icon}</span>
                <h3 className="text-foreground group-hover:text-primary-600 text-base font-bold sm:text-lg">
                  {link.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
