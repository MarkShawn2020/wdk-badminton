/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper functions for fumadocs type conversions

export function getPageData(page: any) {
  return {
    date: page.data.date,
    tags: page.data.tags || [],
    draft: page.data.draft || false,
    images: page.data.images || [],
    authors: page.data.authors || ['default'],
  }
}

export function getAuthorData(author: any) {
  return {
    name: author.name,
    avatar: author.avatar,
    occupation: author.occupation,
    company: author.company,
    email: author.email,
    twitter: author.twitter,
    linkedin: author.linkedin,
    github: author.github,
    bluesky: author.bluesky,
  }
}
