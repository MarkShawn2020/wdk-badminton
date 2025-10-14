/**
 * Discover Page
 *
 * Showcase user-created videos shared to the community
 * Route: /discover
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/components/ui/button'
import { Card } from '@/components/components/ui/card'
import { Badge } from '@/components/components/ui/badge'
import { Video, Sparkles, Upload, TrendingUp } from 'lucide-react'
import { generatePageMetadata, SITELINK_PAGES } from '@/lib/seo/generateMetadata'
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData'
import siteMetadata from '@/data/siteMetadata'

export const metadata: Metadata = generatePageMetadata(SITELINK_PAGES.discover)

// TODO: Replace with real data from database
// This will be populated when users start sharing their videos
interface PublicVideo {
  id: string
  // Add more fields as needed
}

const publicVideos: PublicVideo[] = []

export default function DiscoverPage() {
  const isEmpty = publicVideos.length === 0

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: siteMetadata.siteUrl },
          { name: 'Discover', url: `${siteMetadata.siteUrl}/discover` },
        ]}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="bg-primary-500/20 text-primary-700 dark:text-primary-300 mb-4">
            Community Showcase
          </Badge>
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Discover What Others Created
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Explore real AI videos enhanced with ReelVan. Remove watermarks, enhance quality, add
            branding, and generate captions—see what's possible.
          </p>
        </div>

        {/* Empty State */}
        {isEmpty && (
          <div className="mx-auto max-w-2xl">
            <Card className="p-12 text-center">
              <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <Video className="text-primary h-10 w-10" />
              </div>

              <h2 className="text-foreground mb-3 text-2xl font-bold">
                Community Gallery Coming Soon
              </h2>

              <p className="text-muted-foreground mb-8 text-lg">
                We're just getting started! Soon this page will showcase amazing videos created by
                our community. Be among the first to share your creations.
              </p>

              <div className="space-y-6">
                {/* How it works */}
                <div className="bg-secondary rounded-lg p-6 text-left">
                  <h3 className="text-foreground mb-4 font-semibold">How It Works</h3>
                  <ol className="text-muted-foreground space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">1.</span>
                      <span>
                        Process your video with ReelVan (remove watermarks, enhance quality)
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">2.</span>
                      <span>Choose to share your creation with the community</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">3.</span>
                      <span>Get featured and earn bonus credits</span>
                    </li>
                  </ol>
                </div>

                {/* Benefits */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-secondary rounded-lg p-4">
                    <Sparkles className="text-primary mb-2 h-6 w-6" />
                    <h4 className="text-foreground mb-1 font-semibold">Earn Credits</h4>
                    <p className="text-muted-foreground text-sm">
                      Get 10 free credits for every video you share
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <TrendingUp className="text-primary mb-2 h-6 w-6" />
                    <h4 className="text-foreground mb-1 font-semibold">Get Featured</h4>
                    <p className="text-muted-foreground text-sm">
                      Top creations get highlighted and promoted
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Link href="/transformer">
                    <Button size="lg" className="gap-2">
                      <Upload className="h-5 w-5" />
                      Create Your First Video
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Video Grid (will be populated later) */}
        {!isEmpty && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                {/* Video showcase card will be implemented here */}
                <div className="aspect-video bg-gray-100" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
