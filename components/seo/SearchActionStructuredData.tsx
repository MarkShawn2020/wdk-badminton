/**
 * WebSite SearchAction Structured Data
 *
 * Enables Google to show a search box in search results (rare but powerful sitelink type)
 * See: https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */

interface SearchActionStructuredDataProps {
  siteUrl: string
}

export function SearchActionStructuredData({ siteUrl }: SearchActionStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ReelVan',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
