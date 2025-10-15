import { source } from '@/lib/source'
import { createSearchAPI } from 'fumadocs-core/search/server'

export const { GET } = createSearchAPI('advanced', {
  // @ts-expect-error - Fumadocs PageData structuredData is compatible but not typed correctly
  indexes: source.getPages().map((page) => ({
    title: page.data.title as string,
    description: page.data.description as string | undefined,
    url: page.url,
    id: page.url,
    structuredData: (page.data as { structuredData?: unknown }).structuredData,
  })),
})
