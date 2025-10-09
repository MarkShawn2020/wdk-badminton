// Content types to replace Contentlayer generated types

export interface Blog {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  images: string[]
  draft: boolean
  path: string
  lastmod?: string
  language?: string
}

export interface Authors {
  slug: string
  title?: string
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  bluesky?: string
  layout?: string
}

// CoreContent type helper
export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id' | 'filePath'>
