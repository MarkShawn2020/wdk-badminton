import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
})

export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: frontmatterSchema.extend({
      date: z.string().optional(),
      lastmod: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      summary: z.string().optional(),
      images: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      layout: z.string().optional(),
      canonicalUrl: z.string().optional(),
    }),
  },
})

export const authors = defineDocs({
  dir: 'data/authors',
  docs: {
    schema: frontmatterSchema.extend({
      name: z.string().optional(),
      avatar: z.string().optional(),
      occupation: z.string().optional(),
      company: z.string().optional(),
      email: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
  },
})
