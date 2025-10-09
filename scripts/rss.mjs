import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { blog } from '../.source/index.ts'
import { loader } from 'fumadocs-core/source'

// Create source from blog data
const source = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
})

// Read tag data from JSON file
const tagData = JSON.parse(readFileSync('./app/tag-data.json', 'utf-8'))

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, page = 'feed.xml') {
  // Get all blog posts from Fumadocs source
  const allPosts = source
    .getPages()
    .map((post) => ({
      slug: post.url.replace('/blog/', ''),
      date: post.data.date || new Date().toISOString(),
      title: post.data.title,
      summary: post.data.description,
      tags: post.data.tags || [],
      draft: false,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const publishPosts = allPosts.filter((post) => post.draft !== true)

  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, publishPosts)
    writeFileSync(`./${outputFolder}/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = allPosts.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
      const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
      const rssPath = path.join(outputFolder, 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata)
  console.log('RSS feed generated...')
}
export default rss
