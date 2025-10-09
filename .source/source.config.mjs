// source.config.ts
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
var source_config_default = defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    rehypePlugins: [],
    remarkPlugins: []
  }
});
var blog = defineDocs({
  dir: "content/blog",
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
      canonicalUrl: z.string().optional()
    })
  }
});
var authors = defineDocs({
  dir: "data/authors",
  docs: {
    schema: frontmatterSchema.extend({
      name: z.string().optional(),
      avatar: z.string().optional(),
      occupation: z.string().optional(),
      company: z.string().optional(),
      email: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional()
    })
  }
});
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.string().optional(),
      lastmod: z.string().optional(),
      draft: z.boolean().optional(),
      toc: z.boolean().default(true),
      sidebarOrder: z.number().optional()
    })
  }
});
export {
  authors,
  blog,
  source_config_default as default,
  docs
};
