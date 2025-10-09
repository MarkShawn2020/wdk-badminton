/**
 * Cases Page
 *
 * Showcase user success stories and use cases
 * Route: /cases
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/components/ui/button'
import { Card } from '@/components/components/ui/card'
import { Badge } from '@/components/components/ui/badge'
import {
  TrendingUp,
  Users,
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Success Stories & Use Cases | ReelVan',
  description:
    'See how content creators, marketers, and businesses use ReelVan to transform AI videos into viral social media content. Real results, real impact.',
  keywords: [
    'AI video success stories',
    'Sora video examples',
    'AI video marketing cases',
    'content creator tools',
    'social media video cases',
  ],
  openGraph: {
    title: 'Success Stories & Use Cases | ReelVan',
    description:
      'Real creators, real results. See how ReelVan helps turn AI videos into shareable content.',
  },
}

// Sample use cases (replace with real data from database later)
const useCases = [
  {
    id: 1,
    category: 'Content Creator',
    name: 'Sarah Chen',
    avatar: '👩‍💼',
    platform: 'Instagram',
    platformIcon: Instagram,
    result: '127K views in 48 hours',
    challenge: 'Struggled to write engaging captions for Sora-generated travel videos',
    solution:
      'Used ReelVan to remove watermarks and generate platform-optimized captions with trending hashtags',
    impact: [
      '3x increase in engagement rate',
      'Saved 2 hours per video on caption writing',
      'Grew following by 15K in one month',
    ],
    videoType: 'Travel & Lifestyle',
    badge: 'Viral Hit',
    badgeColor: 'bg-pink-500/20 text-pink-700 dark:text-pink-300',
  },
  {
    id: 2,
    category: 'Marketing Agency',
    name: 'Pixel Perfect Studios',
    avatar: '🎨',
    platform: 'LinkedIn + YouTube',
    platformIcon: Youtube,
    result: '85% conversion rate on campaign',
    challenge: 'Needed professional AI videos for multiple clients across different platforms',
    solution:
      'Batch processed 50+ Veo videos, customized branding, generated platform-specific captions',
    impact: [
      'Reduced video production costs by 60%',
      'Delivered campaigns 3x faster',
      'Signed 8 new clients based on AI video work',
    ],
    videoType: 'Corporate & Product',
    badge: 'Enterprise',
    badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  {
    id: 3,
    category: 'Educator',
    name: 'Dr. Mike Thompson',
    avatar: '👨‍🏫',
    platform: 'TikTok + YouTube',
    platformIcon: Twitter,
    result: '500K+ students reached',
    challenge: 'Complex science concepts needed engaging video explanations',
    solution:
      'Used Kling AI for animations, ReelVan for watermark removal and educational captions',
    impact: [
      '10M+ total views across platforms',
      'Built library of 200+ educational videos',
      'Partnered with 3 major universities',
    ],
    videoType: 'Educational',
    badge: 'Top Educator',
    badgeColor: 'bg-green-500/20 text-green-700 dark:text-green-300',
  },
  {
    id: 4,
    category: 'E-commerce Brand',
    name: 'Urban Threads',
    avatar: '👕',
    platform: 'Instagram + TikTok',
    platformIcon: Instagram,
    result: '$47K in sales from one video',
    challenge: 'Needed product demos that stand out in crowded fashion market',
    solution:
      'Created AI product videos with JiMeng, enhanced quality, added brand watermark + compelling CTAs',
    impact: [
      '12% click-through rate (industry avg: 2%)',
      'ROI of 840% on video ad spend',
      'Reduced product photography costs by 70%',
    ],
    videoType: 'Product & Commerce',
    badge: 'Revenue Driver',
    badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  },
]

const stats = [
  {
    icon: Video,
    value: '100K+',
    label: 'Videos Published',
    color: 'bg-primary-500/20 text-primary-700 dark:text-primary-300',
  },
  {
    icon: Users,
    value: '12K+',
    label: 'Active Creators',
    color: 'bg-info/20 text-info',
  },
  {
    icon: TrendingUp,
    value: '450%',
    label: 'Avg. Engagement Boost',
    color: 'bg-success/20 text-success',
  },
  {
    icon: Sparkles,
    value: '4.8/5',
    label: 'User Rating',
    color: 'bg-warning/20 text-warning',
  },
]

export default function CasesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <Badge className="bg-primary-500/20 text-primary-700 dark:text-primary-300 mb-4">
          Success Stories
        </Badge>
        <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Real Creators, Real Results
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          See how content creators, marketers, and businesses use ReelVan to transform AI videos
          into viral social media content. Your success story could be next.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 text-center">
              <div className={`mx-auto mb-3 inline-flex rounded-xl p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-foreground mb-1 text-3xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Use Cases Grid */}
      <div className="mb-16 space-y-12">
        {useCases.map((useCase) => {
          const PlatformIcon = useCase.platformIcon
          return (
            <Card key={useCase.id} className="overflow-hidden">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Left: User Info */}
                <div className="bg-secondary p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="text-5xl">{useCase.avatar}</div>
                    <div>
                      <h3 className="text-foreground text-xl font-bold">{useCase.name}</h3>
                      <p className="text-muted-foreground text-sm">{useCase.category}</p>
                    </div>
                  </div>

                  <Badge className={`mb-4 ${useCase.badgeColor}`}>{useCase.badge}</Badge>

                  <div className="mb-4 flex items-center gap-2">
                    <PlatformIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">{useCase.platform}</span>
                  </div>

                  <div className="bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-lg p-4">
                    <p className="text-sm font-medium">Key Result</p>
                    <p className="mt-1 text-2xl font-bold">{useCase.result}</p>
                  </div>

                  <div className="text-muted-foreground mt-4 text-sm">
                    <span className="font-medium">Video Type:</span> {useCase.videoType}
                  </div>
                </div>

                {/* Right: Story */}
                <div className="p-8 lg:col-span-2">
                  <div className="mb-6">
                    <h4 className="text-foreground mb-2 font-semibold">The Challenge</h4>
                    <p className="text-muted-foreground">{useCase.challenge}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-foreground mb-2 font-semibold">The Solution</h4>
                    <p className="text-muted-foreground">{useCase.solution}</p>
                  </div>

                  <div>
                    <h4 className="text-foreground mb-3 font-semibold">The Impact</h4>
                    <ul className="space-y-2">
                      {useCase.impact.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="text-success mt-0.5 h-5 w-5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500/10 rounded-2xl p-12 text-center">
        <h2 className="text-foreground mb-4 text-3xl font-bold">
          Ready to Create Your Success Story?
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
          Join thousands of creators who transformed their AI videos into viral content. Start with
          100 free credits—no credit card required.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/publish">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Get Started Free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="gap-2">
              View Pricing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
