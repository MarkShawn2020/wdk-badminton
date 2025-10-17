import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Button } from '@/components/components/ui/button'
import { Badge } from '@/components/components/ui/badge'
import { Share2, Youtube, Instagram, Twitter, Sparkles } from 'lucide-react'

/**
 * Social Hub Page - Future feature for social media distribution
 *
 * Placeholder page showing coming soon state
 */

export default function SocialHubPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Social Hub</h1>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Coming Soon
        </Badge>
      </div>

      {/* Coming Soon Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <Share2 className="mx-auto mb-4 h-16 w-16" />
            <h2 className="mb-2 text-2xl font-bold">Social Media Distribution</h2>
            <p className="text-white/80">
              Share your enhanced videos directly to YouTube, TikTok, Instagram, and more with one
              click
            </p>
          </div>
        </div>
      </Card>

      {/* Planned Features */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              YouTube Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Direct upload to YouTube with automatic title, description, and tags generation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-600" />
              Instagram / TikTok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Optimized aspect ratios and formats for short-form video platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-500" />
              Twitter / X
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Share videos with AI-generated captions optimized for engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              AI Captions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Automatically generate engaging captions and hashtags for each platform
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="mb-2 text-xl font-semibold">Want Early Access?</h3>
          <p className="text-muted-foreground mb-6 text-center text-sm">
            Be the first to know when Social Hub launches
          </p>
          <Button size="lg">Notify Me When Available</Button>
        </CardContent>
      </Card>
    </div>
  )
}
