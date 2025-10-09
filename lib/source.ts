import { blog, authors } from '@/.source'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/blog',
  source: blog,
})

export const authorsSource = loader({
  baseUrl: '/authors',
  source: authors,
})
