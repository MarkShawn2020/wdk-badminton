import { defineConfig, defineDocs } from 'fumadocs-mdx/config'

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
})

export const blog = defineDocs({
  dir: 'content/blog',
})

export const authors = defineDocs({
  dir: 'data/authors',
})
