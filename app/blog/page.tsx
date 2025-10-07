import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import Card from '@/components/Card'

export const metadata = genPageMetadata({
  title: 'Blog - ReelVan',
  description:
    'Learn how to enhance AI-generated videos, remove watermarks, optimize quality, and master video processing with our comprehensive guides and tutorials.',
})

export default async function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Blog
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Guides, tutorials, and tips for enhancing your AI-generated videos with ReelVan.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {posts.map((post) => {
              const { slug, date, title, summary, tags, images } = post
              return (
                <Card
                  key={slug}
                  title={title}
                  description={summary || ''}
                  imgSrc={images && images.length > 0 ? images[0] : undefined}
                  href={`/blog/${slug}`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
