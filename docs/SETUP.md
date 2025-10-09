# ReelVan Video Processing Setup Guide

## Overview

This guide will help you set up the complete video upload and processing system for ReelVan.

## Features Implemented

✅ Video upload with drag-and-drop
✅ Processing options (watermark removal, resolution, aspect ratio)
✅ Cost calculation and credit system
✅ Real-time processing status updates via Supabase Realtime
✅ Side-by-side video comparison with synchronized playback
✅ Database schema with RLS policies
✅ Complete API routes for upload and processing

---

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Stripe account (for payments)
- Video processing API (WaveSpeed, Replicate, or similar)

---

## Step 1: Database Setup

### 1.1 Initialize Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project (if not already done)
supabase init

# Start local Supabase instance
supabase start
```

### 1.2 Run Migrations

```bash
# Apply the migration
supabase db reset

# This will create:
# - videos table
# - user_credits table
# - credit_transactions table
# - Helper functions (deduct_credits, refund_credits, add_credits)
# - RLS policies
# - Triggers for auto-initialization
```

### 1.3 Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new **public** bucket named `videos`
3. Set up CORS policy:

```json
{
  "allowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
  "allowedMethods": ["GET", "POST", "PUT"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

4. Set up storage policies:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own videos
CREATE POLICY "Users can read own videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read for signed URLs
CREATE POLICY "Public read for videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');
```

### 1.4 Generate TypeScript Types

```bash
# Generate types from your Supabase schema
supabase gen types typescript --local > types/database.ts
```

---

## Step 2: Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Video Processing API
VIDEO_API_KEY=your_api_key
VIDEO_API_URL=https://api.example.com
VIDEO_API_COST_PER_5_SECONDS=0.10

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Supabase Credentials

1. Go to Supabase Dashboard → Project Settings → API
2. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

---

## Step 3: Install Dependencies

```bash
pnpm install
```

Dependencies added:

- `@supabase/ssr` - Supabase SSR support for Next.js
- `@supabase/supabase-js` - Supabase client library
- `zod` - Schema validation (already installed)

---

## Step 4: Configure Video Processing API

### Option A: Mock Implementation (for testing)

The system currently uses a mock implementation in `app/api/process/route.ts`. To test:

1. Videos will be marked as "processing"
2. You can manually update status in Supabase dashboard
3. Real-time updates will work

### Option B: Integrate Real API (WaveSpeed, Replicate, etc.)

Replace the `submitToProcessingAPI` function in `app/api/process/route.ts`:

```typescript
async function submitToProcessingAPI(
  videoId: string,
  videoUrl: string,
  options: ProcessingOptions
): Promise<void> {
  // Example for WaveSpeed API
  const response = await fetch(process.env.VIDEO_API_URL + '/process', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VIDEO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_url: videoUrl,
      remove_watermark: options.removeWatermark,
      target_resolution: options.targetResolution,
      target_aspect_ratio: options.targetAspectRatio,
      enhance_quality: options.enhanceQuality,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/processing`,
      metadata: { video_id: videoId },
    }),
  })

  if (!response.ok) {
    throw new Error('API request failed')
  }

  const data = await response.json()

  // Store external job ID for tracking
  const supabase = createServerClient()
  await supabase
    .from('videos')
    .update({
      external_job_id: data.job_id,
      external_provider: 'wavespeed',
    })
    .eq('id', videoId)
}
```

### Create Webhook Endpoint

Create `app/api/webhooks/processing/route.ts`:

```typescript
import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { video_id, status, progress, processed_url, error } = body

    const supabase = createServiceClient()

    // Update video status
    await supabase
      .from('videos')
      .update({
        status: status,
        progress: progress,
        processed_url: processed_url,
        error_message: error,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', video_id)

    // If failed, refund credits
    if (status === 'failed') {
      const { data: video } = await supabase
        .from('videos')
        .select('user_id, estimated_cost_credits')
        .eq('id', video_id)
        .single()

      if (video) {
        await supabase.rpc('refund_credits', {
          p_user_id: video.user_id,
          p_video_id: video_id,
          p_amount: video.estimated_cost_credits,
        })
      }
    }

    return successResponse({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return errorResponse('Webhook processing failed', 500)
  }
}
```

---

## Step 5: Configure Stripe (for payments)

### 5.1 Create Products and Prices

1. Go to Stripe Dashboard → Products
2. Create credit packages:
   - 100 credits - $1.00
   - 500 credits - $4.50 (10% discount)
   - 1000 credits - $8.00 (20% discount)
   - 5000 credits - $35.00 (30% discount)

### 5.2 Set Up Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.failed`
4. Copy webhook signing secret to `.env.local`

### 5.3 Create Webhook Handler

Create `app/api/webhooks/stripe/route.ts`:

```typescript
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

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

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, credits } = session.metadata!

      await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: parseInt(credits),
        p_stripe_payment_id: session.payment_intent as string,
        p_stripe_session_id: session.id,
      })
      break
  }

  return Response.json({ received: true })
}
```

---

## Step 6: Run the Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

---

## Testing the Flow

### 1. Test Video Upload

1. Visit `http://localhost:3000/enhance`
2. Drag and drop a video file (MP4, MOV, WebM)
3. Configure processing options
4. Click "Start Processing"
5. Should redirect to `/processing/[videoId]`

### 2. Test Real-time Updates

1. Open Supabase Dashboard → Table Editor → videos
2. Find your video record
3. Update `status` to `processing` and `progress` to `50`
4. The UI should update in real-time

### 3. Test Completion

1. In Supabase, update:
   - `status` to `completed`
   - `progress` to `100`
   - `processed_url` to a test video URL
2. The page should show the comparison view

---

## File Structure

```
app/
├── api/
│   ├── upload/route.ts          # Generate signed upload URL
│   ├── process/route.ts         # Start video processing
│   └── webhooks/
│       ├── processing/route.ts  # Video processing webhook
│       └── stripe/route.ts      # Stripe payment webhook
├── enhance/
│   └── page.tsx                 # Video upload page
├── processing/
│   └── [videoId]/
│       └── page.tsx             # Processing status page
└── Main.tsx                     # Homepage (updated CTA)

components/
└── video/
    ├── VideoUploader.tsx        # Drag-drop upload
    ├── ProcessingOptions.tsx    # Options form
    ├── VideoUploadFlow.tsx      # Complete upload flow
    ├── ProcessingStatus.tsx     # Real-time status
    └── VideoComparison.tsx      # Side-by-side comparison

lib/
├── supabase/
│   ├── server.ts                # Server-side client
│   └── client.ts                # Client-side client
├── video/
│   └── cost.ts                  # Cost calculations
├── validations/
│   └── video.ts                 # Zod schemas
└── api/
    ├── response.ts              # API response helpers
    └── auth.ts                  # Auth helpers

supabase/
└── migrations/
    └── 20251008000000_create_video_processing_tables.sql

types/
└── database.ts                  # Generated Supabase types
```

---

## Key Configuration Points

### Cost Structure

Current pricing (adjust in `lib/video/cost.ts`):

- API cost: **$0.10 per 5 seconds**
- User markup: **4x** (for profit)
- Example: 30s video = 6 segments × $0.10 = $0.60 API cost → $2.40 user cost (240 credits)

### Tier Limits

Defined in `lib/video/cost.ts`:

- **Free**: 1 video/day, 30s max, 100MB max
- **Paid**: 50 videos/day, 120s max, 500MB max
- **Pro**: 200 videos/day, 120s max, 1GB max

### Storage Limits

- Max file size: 500MB (configurable)
- Max duration: 120 seconds (2 minutes)
- Allowed formats: MP4, MOV, WebM, AVI

---

## Monitoring & Debugging

### Check Supabase Logs

```bash
# View real-time logs
supabase functions logs --follow
```

### Check Database

```bash
# Open Supabase Studio
supabase db studio
```

### Common Issues

**Issue**: Videos stuck in "pending"

- Check if processing API is configured
- Verify webhook URL is reachable
- Check Supabase logs for errors

**Issue**: Real-time updates not working

- Verify Supabase Realtime is enabled
- Check browser console for connection errors
- Ensure RLS policies allow user to read their videos

**Issue**: Credit deduction fails

- Check `user_credits` table exists
- Verify user has been initialized (should happen on signup)
- Check service role key is correct

---

## Production Deployment Checklist

- [ ] Update environment variables in Vercel/deployment platform
- [ ] Run Supabase migrations in production: `supabase db push`
- [ ] Configure Supabase Storage CORS for production domain
- [ ] Set up Stripe webhooks for production
- [ ] Configure video processing API webhooks
- [ ] Test complete flow in production
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure rate limiting (Upstash Redis recommended)
- [ ] Set up backup strategy for database
- [ ] Monitor API costs and set up alerts

---

## Next Steps

1. **Implement actual video processing API integration**
2. **Add user dashboard** to view processing history
3. **Add payment flow** for purchasing credits
4. **Add rate limiting** with Upstash Redis
5. **Add analytics** to track conversions
6. **Add email notifications** for completed videos
7. **Add video thumbnail generation**
8. **Add batch processing** support

---

## Support

For issues:

1. Check Supabase logs
2. Check browser console
3. Review this documentation
4. Check CLAUDE.md for development guidelines

---

**Built with:**

- Next.js 15 (App Router)
- Supabase (Database, Storage, Realtime)
- TypeScript (strict mode)
- Zod (validation)
- Tailwind CSS + shadcn/ui
