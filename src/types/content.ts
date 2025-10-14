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

// Extended PageData types for Fumadocs
// These extend the base PageData interface from fumadocs-core

export interface BlogPageData {
  title: string
  description?: string
  date: string
  lastmod?: string
  tags?: string[]
  authors?: string[]
  images?: string[]
  draft?: boolean
  summary?: string
  body: React.ComponentType
  structuredData?: unknown
}

export interface AuthorPageData {
  title?: string
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  body: React.ComponentType
}

export interface DocsPageData {
  title: string
  description?: string
  body: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>
  toc?: unknown
  full?: boolean
  structuredData?: unknown
}
