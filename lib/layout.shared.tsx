import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'ReelVan',
    },
    links: [
      {
        text: 'Blog',
        url: '/blog',
        active: 'nested-url',
      },
    ],
  }
}
