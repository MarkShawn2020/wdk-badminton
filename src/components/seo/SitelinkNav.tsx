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
    href: '/pricing',
    title: 'Pricing',
    description: 'Simple, transparent plans. Pay-as-you-go starting at $2.99',
    icon: '💳',
  },
  {
    href: '/blog',
    title: 'Blog',
    description: 'AI video tips, tutorials, and guides',
    icon: '📝',
  },
  {
    href: '/docs',
    title: 'Documentation',
    description: 'Learn how to use ReelVan effectively',
    icon: '📚',
  },
  {
    href: '/discover',
    title: 'Discover',
    description: 'Browse community video examples',
    icon: '🎬',
  },
]

export function SitelinkNav() {
  return (
    <nav aria-label="Core site navigation" className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-foreground mb-8 text-center text-2xl font-bold">Explore ReelVan</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {coreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-border bg-card hover:border-primary-500 group flex flex-col rounded-lg border p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{link.icon}</span>
                <h3 className="text-foreground group-hover:text-primary-600 text-lg font-semibold">
                  {link.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
