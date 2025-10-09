// @ts-nocheck -- skip type checking
import * as docs_5 from '../content/docs/watermark-removal.mdx?collection=docs&hash=1759999677267'
import * as docs_4 from '../content/docs/quality-enhancement.mdx?collection=docs&hash=1759999677267'
import * as docs_3 from '../content/docs/pricing.mdx?collection=docs&hash=1759999677267'
import * as docs_2 from '../content/docs/index.mdx?collection=docs&hash=1759999677267'
import * as docs_1 from '../content/docs/getting-started.mdx?collection=docs&hash=1759999677267'
import * as docs_0 from '../content/docs/aspect-ratio.mdx?collection=docs&hash=1759999677267'
import * as blog_3 from '../content/blog/remove-veo-watermark.mdx?collection=blog&hash=1759999677267'
import * as blog_2 from '../content/blog/remove-sora-watermark.mdx?collection=blog&hash=1759999677267'
import * as blog_1 from '../content/blog/remove-kling-watermark.mdx?collection=blog&hash=1759999677267'
import * as blog_0 from '../content/blog/enhance-ai-video-quality.mdx?collection=blog&hash=1759999677267'
import * as authors_1 from '../data/authors/sparrowhawk.mdx?collection=authors&hash=1759999677267'
import * as authors_0 from '../data/authors/default.mdx?collection=authors&hash=1759999677267'
import { _runtime } from 'fumadocs-mdx/runtime/next'
import * as _source from '../source.config'
export const authors = _runtime.docs<typeof _source.authors>(
  [
    { info: { path: 'default.mdx', fullPath: 'data/authors/default.mdx' }, data: authors_0 },
    {
      info: { path: 'sparrowhawk.mdx', fullPath: 'data/authors/sparrowhawk.mdx' },
      data: authors_1,
    },
  ],
  []
)
export const blog = _runtime.docs<typeof _source.blog>(
  [
    {
      info: {
        path: 'enhance-ai-video-quality.mdx',
        fullPath: 'content/blog/enhance-ai-video-quality.mdx',
      },
      data: blog_0,
    },
    {
      info: {
        path: 'remove-kling-watermark.mdx',
        fullPath: 'content/blog/remove-kling-watermark.mdx',
      },
      data: blog_1,
    },
    {
      info: {
        path: 'remove-sora-watermark.mdx',
        fullPath: 'content/blog/remove-sora-watermark.mdx',
      },
      data: blog_2,
    },
    {
      info: { path: 'remove-veo-watermark.mdx', fullPath: 'content/blog/remove-veo-watermark.mdx' },
      data: blog_3,
    },
  ],
  []
)
export const docs = _runtime.docs<typeof _source.docs>(
  [
    { info: { path: 'aspect-ratio.mdx', fullPath: 'content/docs/aspect-ratio.mdx' }, data: docs_0 },
    {
      info: { path: 'getting-started.mdx', fullPath: 'content/docs/getting-started.mdx' },
      data: docs_1,
    },
    { info: { path: 'index.mdx', fullPath: 'content/docs/index.mdx' }, data: docs_2 },
    { info: { path: 'pricing.mdx', fullPath: 'content/docs/pricing.mdx' }, data: docs_3 },
    {
      info: { path: 'quality-enhancement.mdx', fullPath: 'content/docs/quality-enhancement.mdx' },
      data: docs_4,
    },
    {
      info: { path: 'watermark-removal.mdx', fullPath: 'content/docs/watermark-removal.mdx' },
      data: docs_5,
    },
  ],
  [
    {
      info: { path: 'meta.json', fullPath: 'content/docs/meta.json' },
      data: {
        title: 'Documentation',
        pages: [
          'index',
          'getting-started',
          '---Features',
          'watermark-removal',
          'quality-enhancement',
          'aspect-ratio',
          '---Resources',
          'pricing',
        ],
      },
    },
  ]
)
