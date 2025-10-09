import { source } from '@/lib/source'
import Card from '@/components/Card'

export const metadata = {
  title: 'Blog - ReelVan',
  description: 'Guides, tutorials, and tips for enhancing your AI-generated videos with ReelVan.',
}

export default async function BlogListPage() {
  const posts = source
    .getPages()
    .sort((a, b) => new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime())

  return (
    <div className="divide-border divide-y">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Blog
        </h1>
        <p className="text-muted-foreground text-lg leading-7">
          Guides, tutorials, and tips for enhancing your AI-generated videos with ReelVan.
        </p>
      </div>
      <div className="container py-12">
        <div className="-m-4 flex flex-wrap">
          {posts.map((post) => {
            return (
              <Card
                key={post.url}
                title={post.data.title}
                description={post.data.description || ''}
                imgSrc={undefined}
                href={post.url}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
