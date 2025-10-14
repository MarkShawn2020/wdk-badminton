import { authorsSource } from '@/lib/source'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from '@/app/seo'
import { notFound } from 'next/navigation'
import type { AuthorPageData } from '@/types/content'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = authorsSource.getPage(['default'])
  if (!author) notFound()

  const authorData = author.data as unknown as AuthorPageData
  const mainContent = {
    slug: 'default',
    name: authorData.name || '',
    avatar: authorData.avatar,
    occupation: authorData.occupation,
    company: authorData.company,
    email: authorData.email,
    twitter: authorData.twitter,
    linkedin: authorData.linkedin,
    github: authorData.github,
  }

  const MDX = authorData.body

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDX />
      </AuthorLayout>
    </>
  )
}
