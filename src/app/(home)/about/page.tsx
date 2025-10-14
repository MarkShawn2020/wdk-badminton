import { authorsSource } from '@/lib/source'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from '@/app/seo'
import { notFound } from 'next/navigation'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = authorsSource.getPage(['default'])
  if (!author) notFound()

  const mainContent = {
    slug: 'default',
    name: author.data.name || '',
    avatar: author.data.avatar,
    occupation: author.data.occupation,
    company: author.data.company,
    email: author.data.email,
    twitter: author.data.twitter,
    linkedin: author.data.linkedin,
    github: author.data.github,
  }

  const MDX = author.data.body

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDX />
      </AuthorLayout>
    </>
  )
}
