import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'ReelVan',
      url: '/',
    },
    links: [
      {
        text: 'Pricing',
        url: '/pricing',
      },
      {
        text: 'Blog',
        url: '/blog',
        active: 'nested-url',
      },
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'About',
        url: '/about',
      },
    ],
  }
}
