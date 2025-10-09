import { blog, authors, docs as docsSource } from '@/.source'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
})

export const authorsSource = loader({
  baseUrl: '/authors',
  source: authors.toFumadocsSource(),
})

export const docs = loader({
  baseUrl: '/docs',
  source: docsSource.toFumadocsSource(),
})
