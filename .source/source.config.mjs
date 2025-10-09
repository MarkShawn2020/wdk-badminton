// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var source_config_default = defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    rehypePlugins: [],
    remarkPlugins: []
  }
});
var blog = defineDocs({
  dir: "content/blog"
});
var authors = defineDocs({
  dir: "data/authors"
});
export {
  authors,
  blog,
  source_config_default as default
};
