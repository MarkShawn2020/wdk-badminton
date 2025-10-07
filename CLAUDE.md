# ReelVan Development Guidelines for AI Assistants

**Version:** 1.0.0
**Project:** ReelVan - AI Video Enhancement Platform
**Last Updated:** 2025-10-07

This document provides project-specific development guidelines for AI assistants (Claude, GitHub Copilot, etc.) working on the ReelVan codebase. These guidelines complement the global standards defined in `~/.claude/CLAUDE.md`.

---

## 📋 Table of Contents

1. [Project Context](#1-project-context)
2. [Critical Principles](#2-critical-principles)
3. [Tech Stack Guidelines](#3-tech-stack-guidelines)
4. [Architecture Patterns](#4-architecture-patterns)
5. [Cost Optimization](#5-cost-optimization)
6. [SEO Best Practices](#6-seo-best-practices)
7. [Security Guidelines](#7-security-guidelines)
8. [Common Development Tasks](#8-common-development-tasks)
9. [Performance Optimization](#9-performance-optimization)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Project Context

### 1.1 Product Overview

ReelVan is a **video enhancement SaaS platform** specializing in AI-generated video content from platforms like Sora, Veo, Kling, and JiMeng.

**Core Features:**

- Watermark removal
- Quality enhancement (upscaling, denoising)
- Aspect ratio conversion
- Custom branding

**Business Model:**

- Third-party API costs: ~$0.10 per 5 seconds of video
- Revenue target: 3-5x markup on API costs
- Freemium + Pay-as-you-go + Subscription tiers
- Heavy reliance on SEO for organic user acquisition

### 1.2 Success Metrics

1. **Cost Control:** API costs must remain <30% of revenue
2. **SEO Traffic:** Target 1000+ organic visitors/month by Month 3
3. **Conversion:** 5-10% visitor → signup, 40%+ signup → first video
4. **Processing:** >95% success rate, <5 minute processing time
5. **Revenue:** Target $1,125 MRR by Month 3, $8,820 by Month 6

---

## 2. Critical Principles

### 2.1 Cost-First Mindset

**CRITICAL:** Every video processing operation costs real money. Code MUST:

- ✅ Validate video duration **before** API calls
- ✅ Implement strict rate limiting
- ✅ Cache processed videos aggressively
- ✅ Prevent duplicate processing jobs
- ✅ Log all API calls with cost tracking
- ❌ NEVER process without user authentication
- ❌ NEVER allow processing without sufficient credits

### 2.2 SEO-First Development

**CRITICAL:** Organic traffic = survival. All pages MUST:

- ✅ Use Server-Side Rendering (SSR) or Static Site Generation (SSG)
- ✅ Include semantic HTML with proper heading hierarchy
- ✅ Have optimized meta tags (title, description, OG tags)
- ✅ Load in <2 seconds (Core Web Vitals)
- ✅ Be mobile-responsive
- ❌ NEVER use client-only rendering for marketing pages
- ❌ NEVER forget to add structured data (Schema.org)

### 2.3 User Experience = Conversion

**CRITICAL:** Friction kills conversions. UX MUST:

- ✅ Minimize steps to first value (<5 minutes signup → processed video)
- ✅ Show pricing **before** users invest time
- ✅ Provide real-time progress updates
- ✅ Handle errors gracefully with clear next steps
- ✅ Support drag-and-drop for all uploads
- ❌ NEVER make users wait without feedback
- ❌ NEVER hide costs until after processing

---

## 3. Tech Stack Guidelines

### 3.1 Next.js (App Router)

#### File Organization

```typescript
// ✅ CORRECT: Use App Router conventions
app/
├── (marketing)/          // Route group without URL segment
│   ├── page.tsx          // Homepage
│   ├── layout.tsx        // Marketing layout
│   └── pricing/
│       └── page.tsx
├── (dashboard)/          // Protected routes
│   ├── dashboard/
│   └── layout.tsx        // Dashboard layout with auth check
└── api/
    ├── upload/
    │   └── route.ts      // POST /api/upload
    └── process/
        └── route.ts      // POST /api/process

// ❌ WRONG: Don't mix Pages Router patterns
pages/
└── index.tsx            // Don't use with App Router
```

#### Server vs. Client Components

```typescript
// ✅ CORRECT: Default to Server Components
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug) // Runs on server
  return <article>{post.content}</article>
}

// ✅ CORRECT: Use 'use client' only when needed
// components/VideoUploader.tsx
'use client'

import { useState } from 'react'

export function VideoUploader() {
  const [file, setFile] = useState<File | null>(null) // Needs client state
  // ... interactive logic
}

// ❌ WRONG: Don't add 'use client' unnecessarily
'use client' // Not needed if no client features used

export function StaticContent() {
  return <div>Static content</div>
}
```

#### Data Fetching

```typescript
// ✅ CORRECT: Server-side data fetching with caching
// app/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Dashboard() {
  const supabase = createServerClient()
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  return <VideoList videos={videos} />
}

// ❌ WRONG: Don't fetch data in client components without error handling
'use client'
export default function Dashboard() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    fetch('/api/videos').then(r => setVideos(r.json())) // No error handling!
  }, [])
}
```

### 3.2 TypeScript

#### Strict Type Safety

```typescript
// ✅ CORRECT: Strict types, no 'any'
interface VideoProcessingRequest {
  videoId: string
  userId: string
  enhancements: {
    removeWatermark: boolean
    enhanceQuality: boolean
    targetResolution?: '1080p' | '1440p' | '4K'
    aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5'
  }
}

async function processVideo(request: VideoProcessingRequest): Promise<ProcessingResult> {
  // Type-safe implementation
}

// ❌ WRONG: Using 'any' defeats TypeScript
async function processVideo(request: any): Promise<any> {
  // No type safety!
}
```

#### Zod Validation

```typescript
// ✅ CORRECT: Validate all API inputs with Zod
import { z } from 'zod'

const videoUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  fileSize: z.number().max(500 * 1024 * 1024), // 500MB max
  duration: z.number().max(120), // 2 minutes max
  mimeType: z.enum(['video/mp4', 'video/quicktime', 'video/webm']),
})

export type VideoUpload = z.infer<typeof videoUploadSchema>

// In API route
export async function POST(request: Request) {
  const body = await request.json()
  const validated = videoUploadSchema.parse(body) // Throws if invalid
  // ... process
}

// ❌ WRONG: No validation
export async function POST(request: Request) {
  const { filename, fileSize } = await request.json() // Trusting client data!
}
```

### 3.3 Supabase

#### Client Creation

```typescript
// ✅ CORRECT: Separate clients for server and client
// lib/supabase/server.ts
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// lib/supabase/client.ts (for client components)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ❌ WRONG: Using client in server components
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(...) // Wrong for SSR!
```

#### Database Queries

```typescript
// ✅ CORRECT: Type-safe queries with generated types
import { Database } from '@/types/database'

async function getUserVideos(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('videos')
    .select(
      `
      id,
      original_filename,
      status,
      created_at,
      cost_credits
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Failed to fetch videos:', error)
    throw new Error('Database query failed')
  }

  return data
}

// ❌ WRONG: Untyped, no error handling
async function getUserVideos(userId: string) {
  const { data } = await supabase.from('videos').select('*') // No error check!
  return data
}
```

#### Realtime Updates

```typescript
// ✅ CORRECT: Realtime processing status updates
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProcessingStatus({ videoId }: { videoId: string }) {
  const [status, setStatus] = useState<string>('processing')
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`video-${videoId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'videos',
          filter: `id=eq.${videoId}`,
        },
        (payload) => {
          setStatus(payload.new.status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [videoId, supabase])

  return <StatusIndicator status={status} />
}
```

### 3.4 Stripe

#### Payment Flow

```typescript
// ✅ CORRECT: Secure server-side Stripe operations
// app/api/checkout/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  const { credits } = await request.json()

  // Validate user is authenticated
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${credits} ReelVan Credits`,
          },
          unit_amount: credits * 1, // $0.01 per credit
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId: user.id,
      credits: credits.toString(),
    },
  })

  return Response.json({ url: session.url })
}

// ❌ WRONG: Client-side Stripe operations with secret key
// NEVER expose STRIPE_SECRET_KEY to client!
```

#### Webhook Handling

```typescript
// ✅ CORRECT: Verify webhook signature
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await handleSuccessfulPayment(session)
      break
    // ... other events
  }

  return Response.json({ received: true })
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { userId, credits } = session.metadata!

  const supabase = createServerClient()

  // Add credits to user account
  await supabase.rpc('add_credits', {
    user_id: userId,
    amount: parseInt(credits),
  })

  // Record transaction
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'purchase',
    amount_credits: parseInt(credits),
    stripe_payment_id: session.payment_intent as string,
  })
}

// ❌ WRONG: Not verifying webhook signature (security risk!)
```

---

## 4. Architecture Patterns

### 4.1 Component Structure

#### Smart vs. Dumb Components

```typescript
// ✅ CORRECT: Separate data fetching from presentation
// app/dashboard/page.tsx (Smart - Server Component)
export default async function DashboardPage() {
  const videos = await fetchUserVideos()
  return <VideoGrid videos={videos} />
}

// components/VideoGrid.tsx (Dumb - Presentational)
interface VideoGridProps {
  videos: Video[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

// ❌ WRONG: Mixing data and presentation
export function VideoGrid() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    fetch('/api/videos').then(...) // Fetching inside presentational component
  }, [])
  // ... render
}
```

#### Component File Structure

```
components/
├── ui/                    # Generic UI components (buttons, inputs)
│   ├── button.tsx
│   └── input.tsx
├── video/                 # Domain-specific components
│   ├── VideoCard.tsx
│   ├── VideoUploader.tsx
│   └── ProcessingStatus.tsx
└── layout/                # Layout components
    ├── Header.tsx
    └── Footer.tsx
```

### 4.2 API Route Patterns

```typescript
// ✅ CORRECT: Standardized API response format
// lib/api/response.ts
export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status })
}

// app/api/upload/route.ts
export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return errorResponse('Unauthorized', 401)

    // 2. Validate input
    const body = await request.json()
    const validated = videoUploadSchema.parse(body)

    // 3. Business logic
    const uploadUrl = await generateUploadUrl(user.id, validated)

    // 4. Return success
    return successResponse({ uploadUrl })
  } catch (error) {
    // 5. Error handling
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid input', 400)
    }
    console.error('Upload error:', error)
    return errorResponse('Internal server error', 500)
  }
}
```

### 4.3 State Management

```typescript
// ✅ CORRECT: Use React Context for global state
// app/providers.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface UserCredits {
  balance: number
  refresh: () => Promise<void>
}

const CreditsContext = createContext<UserCredits | null>(null)

export function CreditsProvider({ children, initialBalance }: {
  children: React.ReactNode
  initialBalance: number
}) {
  const [balance, setBalance] = useState(initialBalance)

  const refresh = async () => {
    const res = await fetch('/api/user/credits')
    const data = await res.json()
    setBalance(data.balance)
  }

  return (
    <CreditsContext.Provider value={{ balance, refresh }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (!context) throw new Error('useCredits must be used within CreditsProvider')
  return context
}

// Usage in component
export function CreditBalance() {
  const { balance } = useCredits()
  return <div>{balance} credits</div>
}

// ❌ WRONG: Prop drilling through many levels
// Don't pass credits through 5+ component levels
```

---

## 5. Cost Optimization

### 5.1 API Call Tracking

```typescript
// ✅ CORRECT: Track all API calls with cost
// lib/video-api/client.ts
interface ProcessingMetrics {
  videoId: string
  durationSeconds: number
  apiCost: number
  timestamp: Date
}

export async function processVideo(videoId: string, options: ProcessingOptions) {
  const startTime = Date.now()

  try {
    // Calculate cost BEFORE processing
    const duration = await getVideoDuration(videoId)
    const estimatedCost = calculateApiCost(duration)

    // Verify user has credits
    await deductCredits(userId, estimatedCost)

    // Make API call
    const result = await videoProcessingAPI.process(videoId, options)

    // Log metrics
    await logProcessingMetrics({
      videoId,
      durationSeconds: duration,
      apiCost: estimatedCost,
      timestamp: new Date(),
      processingTimeMs: Date.now() - startTime,
    })

    return result
  } catch (error) {
    // Refund credits on failure
    await refundCredits(userId, estimatedCost)
    throw error
  }
}

function calculateApiCost(durationSeconds: number): number {
  const COST_PER_5_SECONDS = parseFloat(process.env.VIDEO_API_COST_PER_5_SECONDS!)
  return Math.ceil(durationSeconds / 5) * COST_PER_5_SECONDS
}

// ❌ WRONG: Processing without cost tracking
async function processVideo(videoId: string) {
  await videoAPI.process(videoId) // No cost tracking!
}
```

### 5.2 Rate Limiting

```typescript
// ✅ CORRECT: Implement rate limiting
// lib/rate-limit.ts
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function rateLimit(userId: string, tier: 'free' | 'paid' | 'pro') {
  const key = `ratelimit:${userId}:${new Date().toISOString().slice(0, 10)}`

  const limits = {
    free: 1, // 1 video per day
    paid: 50, // 50 videos per day
    pro: 200, // 200 videos per day
  }

  const current = await redis.incr(key)
  await redis.expire(key, 86400) // 24 hours

  if (current > limits[tier]) {
    throw new Error(`Rate limit exceeded. Maximum ${limits[tier]} videos per day.`)
  }

  return {
    allowed: true,
    remaining: limits[tier] - current,
  }
}

// Usage in API route
export async function POST(request: Request) {
  const user = await authenticate(request)

  // Check rate limit before processing
  await rateLimit(user.id, user.tier)

  // ... continue with processing
}
```

### 5.3 Caching Strategy

```typescript
// ✅ CORRECT: Cache processed videos
// lib/cache.ts
export async function getCachedVideo(originalVideoHash: string): Promise<string | null> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('video_cache')
    .select('processed_url')
    .eq('original_hash', originalVideoHash)
    .single()

  return data?.processed_url || null
}

export async function cacheProcessedVideo(
  originalVideoHash: string,
  processedUrl: string
): Promise<void> {
  const supabase = createServerClient()

  await supabase.from('video_cache').upsert({
    original_hash: originalVideoHash,
    processed_url: processedUrl,
    created_at: new Date().toISOString(),
  })
}

// Usage
export async function processVideo(videoId: string, options: ProcessingOptions) {
  const hash = await calculateVideoHash(videoId, options)

  // Check cache first
  const cached = await getCachedVideo(hash)
  if (cached) {
    console.log('Cache hit, skipping API call')
    return { url: cached, cached: true }
  }

  // Process and cache
  const result = await videoAPI.process(videoId, options)
  await cacheProcessedVideo(hash, result.url)

  return { url: result.url, cached: false }
}
```

---

## 6. SEO Best Practices

### 6.1 Metadata Configuration

```typescript
// ✅ CORRECT: Comprehensive metadata
// app/page.tsx (Homepage)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReelVan - Remove Watermarks from AI Videos | Enhance Quality',
  description:
    'Transform AI-generated videos from Sora, Veo, Kling & JiMeng. Remove watermarks, enhance quality, change aspect ratios. Free trial available.',
  keywords: ['AI video', 'watermark removal', 'Sora', 'Veo', 'Kling', 'video enhancement'],
  openGraph: {
    title: 'ReelVan - Share Your AI Video',
    description: 'Professional video enhancement for AI-generated content',
    url: 'https://reelvan.com',
    siteName: 'ReelVan',
    images: [
      {
        url: 'https://reelvan.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReelVan - AI Video Enhancement',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReelVan - Share Your AI Video',
    description: 'Transform AI-generated videos into professional content',
    images: ['https://reelvan.com/twitter-card.png'],
  },
  alternates: {
    canonical: 'https://reelvan.com',
  },
}

// ❌ WRONG: Missing or generic metadata
export const metadata = {
  title: 'Home', // Not descriptive!
  // Missing description, OG tags, etc.
}
```

### 6.2 Structured Data

```typescript
// ✅ CORRECT: Add Schema.org structured data
// components/StructuredData.tsx
export function ProductStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ReelVan',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    description: 'Transform AI-generated videos with watermark removal and quality enhancement',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Add to layout
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ProductStructuredData />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 6.3 Content Strategy

```typescript
// ✅ CORRECT: Create keyword-optimized blog posts
// content/blog/remove-sora-watermark.mdx
---
title: 'How to Remove Sora Watermark from AI Videos (2025 Guide)'
date: '2025-10-07'
description: 'Learn how to remove watermarks from OpenAI Sora videos. Step-by-step guide with examples.'
keywords: ['sora watermark', 'remove sora watermark', 'sora video editing']
author: 'ReelVan Team'
---

# How to Remove Sora Watermark from AI Videos

[2000+ word comprehensive guide targeting high-intent keywords]

// Target keywords:
// - "remove sora watermark" (high intent)
// - "sora video watermark removal" (high intent)
// - "edit sora videos" (medium intent)
```

---

## 7. Security Guidelines

### 7.1 Authentication Checks

```typescript
// ✅ CORRECT: Always verify authentication in API routes
// lib/auth.ts
export async function requireAuth(request: Request): Promise<User> {
  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return user
}

// Usage
export async function POST(request: Request) {
  try {
    const user = await requireAuth(request)
    // ... protected logic
  } catch {
    return errorResponse('Unauthorized', 401)
  }
}

// ❌ WRONG: No authentication check
export async function POST(request: Request) {
  const { videoId } = await request.json()
  // Anyone can process any video!
  await processVideo(videoId)
}
```

### 7.2 Input Sanitization

```typescript
// ✅ CORRECT: Sanitize and validate all inputs
import DOMPurify from 'isomorphic-dompurify'

export async function POST(request: Request) {
  const body = await request.json()

  // Validate with Zod
  const validated = videoUploadSchema.parse(body)

  // Sanitize text inputs
  const sanitizedFilename = DOMPurify.sanitize(validated.filename)

  // Check file type
  const allowedMimeTypes = ['video/mp4', 'video/quicktime', 'video/webm']
  if (!allowedMimeTypes.includes(validated.mimeType)) {
    throw new Error('Invalid file type')
  }

  // ... continue
}

// ❌ WRONG: Trusting user input
export async function POST(request: Request) {
  const { filename } = await request.json()
  await saveFile(filename) // Potential path traversal!
}
```

### 7.3 Environment Variables

```typescript
// ✅ CORRECT: Validate environment variables at startup
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  VIDEO_API_KEY: z.string().min(1),
  VIDEO_API_COST_PER_5_SECONDS: z.string().regex(/^\d+(\.\d+)?$/),
})

export const env = envSchema.parse(process.env)

// Usage
import { env } from '@/lib/env'
const apiKey = env.VIDEO_API_KEY // Type-safe and validated

// ❌ WRONG: Direct process.env access without validation
const apiKey = process.env.VIDEO_API_KEY! // Might be undefined!
```

---

## 8. Common Development Tasks

### 8.1 Adding a New API Endpoint

```bash
# 1. Create route file
touch app/api/example/route.ts

# 2. Define Zod schema
# 3. Implement POST handler with auth
# 4. Add error handling
# 5. Test with curl or Postman
# 6. Update API documentation
```

```typescript
// app/api/example/route.ts
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api/response'

const requestSchema = z.object({
  // ... define schema
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const validated = requestSchema.parse(body)

    // Business logic here

    return successResponse({
      /* data */
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid input', 400)
    }
    console.error('API error:', error)
    return errorResponse('Internal server error', 500)
  }
}
```

### 8.2 Adding a New Database Table

```bash
# 1. Create migration file
pnpm supabase migration new add_table_name

# 2. Write SQL migration
# 3. Apply migration locally
pnpm supabase db reset

# 4. Generate TypeScript types
pnpm supabase gen types typescript --local > types/database.ts

# 5. Update production
pnpm supabase db push
```

```sql
-- supabase/migrations/20251007_add_video_cache.sql
CREATE TABLE video_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_hash TEXT NOT NULL UNIQUE,
  processed_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX idx_video_cache_hash ON video_cache(original_hash);
CREATE INDEX idx_video_cache_expires ON video_cache(expires_at);
```

### 8.3 Adding a New React Component

```bash
# 1. Create component file in appropriate directory
# components/video/VideoCard.tsx - domain-specific
# components/ui/button.tsx - generic UI

# 2. Define TypeScript interface for props
# 3. Implement component
# 4. Add to index.ts for easy imports
# 5. Use in parent component
```

```typescript
// components/video/VideoCard.tsx
interface VideoCardProps {
  video: {
    id: string
    filename: string
    status: string
    createdAt: string
  }
  onDelete?: (id: string) => void
}

export function VideoCard({ video, onDelete }: VideoCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{video.filename}</h3>
      <p className="text-sm text-gray-500">{video.status}</p>
      {onDelete && (
        <button onClick={() => onDelete(video.id)}>Delete</button>
      )}
    </div>
  )
}
```

### 8.4 Adding a New Blog Post

```bash
# 1. Create MDX file
touch content/blog/new-post.mdx

# 2. Add frontmatter
# 3. Write content (target 2000+ words for SEO)
# 4. Build content layer
pnpm contentlayer:build

# 5. Verify at /blog/new-post
```

```mdx
---
title: 'How to Enhance AI Video Quality in 2025'
date: '2025-10-07'
description: 'Complete guide to improving AI-generated video quality with upscaling and denoising techniques.'
keywords: ['AI video quality', 'enhance AI video', 'video upscaling']
author: 'ReelVan Team'
image: '/blog/enhance-quality.png'
---

# How to Enhance AI Video Quality

[Comprehensive 2000+ word article targeting "enhance AI video quality"]
```

---

## 9. Performance Optimization

### 9.1 Image Optimization

```typescript
// ✅ CORRECT: Use Next.js Image component
import Image from 'next/image'

export function VideoThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={320}
      height={180}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/png;base64,..." // Generated blur hash
    />
  )
}

// ❌ WRONG: Using raw <img> tag
export function VideoThumbnail({ src, alt }) {
  return <img src={src} alt={alt} /> // No optimization!
}
```

### 9.2 Code Splitting

```typescript
// ✅ CORRECT: Lazy load heavy components
import dynamic from 'next/dynamic'

const VideoEditor = dynamic(() => import('@/components/VideoEditor'), {
  loading: () => <p>Loading editor...</p>,
  ssr: false, // Don't render on server if client-only
})

export function EditorPage() {
  return <VideoEditor />
}

// ❌ WRONG: Importing everything upfront
import { VideoEditor } from '@/components/VideoEditor' // Heavy bundle!
```

### 9.3 Database Query Optimization

```typescript
// ✅ CORRECT: Select only needed fields
const { data } = await supabase
  .from('videos')
  .select('id, filename, status') // Only needed fields
  .eq('user_id', userId)
  .limit(20)

// ❌ WRONG: Selecting all fields
const { data } = await supabase
  .from('videos')
  .select('*') // Fetches everything including large fields!
  .eq('user_id', userId)
```

---

## 10. Testing Strategy

### 10.1 Unit Tests (Future)

```typescript
// ✅ CORRECT: Test pure functions
// lib/__tests__/cost.test.ts
import { describe, it, expect } from 'vitest'
import { calculateApiCost } from '../cost'

describe('calculateApiCost', () => {
  it('calculates cost for exact 5-second video', () => {
    expect(calculateApiCost(5)).toBe(0.1)
  })

  it('rounds up partial segments', () => {
    expect(calculateApiCost(6)).toBe(0.2) // Rounds to 2 segments
  })

  it('handles 2-minute max video', () => {
    expect(calculateApiCost(120)).toBe(2.4) // 24 segments
  })
})
```

### 10.2 Integration Tests (Future)

```typescript
// ✅ CORRECT: Test API endpoints
// app/api/upload/__tests__/route.test.ts
import { describe, it, expect } from 'vitest'
import { POST } from '../route'

describe('POST /api/upload', () => {
  it('returns 401 without authentication', async () => {
    const request = new Request('http://localhost/api/upload', {
      method: 'POST',
      body: JSON.stringify({ filename: 'test.mp4' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('validates file size', async () => {
    // Test with oversized file
    // ...
  })
})
```

### 10.3 Manual Testing Checklist

**Before Every PR:**

- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile (responsive design)
- [ ] Verify all forms validate correctly
- [ ] Check error handling (network errors, invalid inputs)
- [ ] Verify authentication flows
- [ ] Test payment flow in Stripe test mode
- [ ] Check video upload and processing
- [ ] Verify SEO metadata (view page source)
- [ ] Test with screen reader (accessibility)
- [ ] Check Lighthouse score (>90 performance, SEO, accessibility)

---

## 11. Deployment Checklist

### Before Production Deploy:

- [ ] All tests passing
- [ ] TypeScript compilation successful (`pnpm type-check`)
- [ ] Linting passing (`pnpm lint`)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] Stripe webhooks configured
- [ ] Supabase RLS policies enabled
- [ ] Content Security Policy headers configured
- [ ] Rate limiting enabled
- [ ] Error monitoring (Sentry) configured
- [ ] Analytics configured
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] SSL certificate active

### After Deploy:

- [ ] Verify homepage loads
- [ ] Test auth flow (signup, login, logout)
- [ ] Test video upload
- [ ] Test payment flow
- [ ] Check Stripe webhooks receiving events
- [ ] Verify SEO metadata in production
- [ ] Test API endpoints with curl
- [ ] Check logs for errors
- [ ] Monitor API costs
- [ ] Verify CDN caching working

---

## 12. Quick Reference

### Common Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Production build
pnpm type-check         # TypeScript check
pnpm lint               # ESLint

# Supabase
pnpm supabase start     # Start local Supabase
pnpm supabase migration new <name>  # New migration
pnpm supabase db reset  # Reset local DB
pnpm supabase gen types typescript --local > types/database.ts

# Content
pnpm contentlayer:build # Build MDX content

# Git
git checkout -b feature/name
git commit -m "feat: description"
```

### Important Files

- `PRD.md` - Product requirements
- `README.md` - Setup instructions
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config
- `.env.local` - Local environment variables
- `supabase/migrations/` - Database migrations
- `app/` - Pages and API routes
- `components/` - React components
- `lib/` - Utility libraries

### Key Principles Reminder

1. **Cost Control:** Track every API call
2. **SEO First:** SSR/SSG for all marketing pages
3. **Type Safety:** Strict TypeScript, Zod validation
4. **Error Handling:** Never fail silently
5. **Security:** Validate auth on every API route
6. **Performance:** Optimize images, lazy load components
7. **User Experience:** Fast, responsive, clear feedback

---

**End of ReelVan Development Guidelines**

For questions or updates, contact the dev team or update this document.
