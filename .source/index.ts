// @ts-nocheck -- skip type checking
import * as blog_3 from '../content/blog/remove-veo-watermark.mdx?collection=blog&hash=1759996159275'
import * as blog_2 from '../content/blog/remove-sora-watermark.mdx?collection=blog&hash=1759996159275'
import * as blog_1 from '../content/blog/remove-kling-watermark.mdx?collection=blog&hash=1759996159275'
import * as blog_0 from '../content/blog/enhance-ai-video-quality.mdx?collection=blog&hash=1759996159275'
import * as authors_1 from '../data/authors/sparrowhawk.mdx?collection=authors&hash=1759996159275'
import * as authors_0 from '../data/authors/default.mdx?collection=authors&hash=1759996159275'
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
