# 🎬 ReelVan Video Processing Feature - Complete Implementation Guide

## 📖 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Components](#components)
6. [Cost Management](#cost-management)
7. [Setup Instructions](#setup-instructions)
8. [Testing Guide](#testing-guide)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This is a **complete video upload, processing, and enhancement system** for ReelVan. Users can:

- ✅ Upload videos via drag-and-drop (MP4, MOV, WebM, AVI)
- ✅ Configure processing options (watermark removal, resolution, aspect ratio)
- ✅ Track processing in real-time with Supabase Realtime
- ✅ Compare original vs processed videos side-by-side
- ✅ Manage credits with automatic deduction and refunds
- ✅ View processing history in dashboard

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Storage + Realtime)
- **Payments**: Stripe
- **Validation**: Zod
- **UI**: Tailwind CSS + shadcn/ui

---

## Architecture

### User Flow

```
┌──────────────┐
│   Homepage   │  CTA: "Enhance Your Video"
└──────┬───────┘
       ↓
┌──────────────┐
│  /enhance    │  1. Upload video
│              │  2. Configure options
│              │  3. Calculate cost
└──────┬───────┘
       ↓
┌──────────────┐
│  Upload to   │  Client-side XHR upload
│   Supabase   │  with progress tracking
│   Storage    │
└──────┬───────┘
       ↓
┌──────────────┐
│ POST /api/   │  1. Validate metadata
│   process    │  2. Check credits
│              │  3. Deduct credits
│              │  4. Submit to API
└──────┬───────┘
       ↓
┌──────────────┐
│ /processing/ │  Real-time status
│  [videoId]   │  updates via Realtime
└──────┬───────┘
       ↓
┌──────────────┐
│  Completed   │  Side-by-side
│  + Compare   │  video comparison
└──────────────┘
```

### System Components

```
┌─────────────────────────────────────────────┐
│              Frontend (Next.js)              │
├─────────────────────────────────────────────┤
│  Pages:                                      │
│  - /enhance         (upload interface)       │
│  - /processing/[id] (status + comparison)    │
│  - /dashboard       (history + stats)        │
│                                              │
│  Components:                                 │
│  - VideoUploader    (drag-drop)              │
│  - ProcessingOptions (form)                  │
│  - VideoUploadFlow  (orchestrator)           │
│  - ProcessingStatus (real-time)              │
│  - VideoComparison  (dual player)            │
│  - VideoList        (dashboard grid)         │
└─────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────┐
│            API Routes (Next.js)              │
├─────────────────────────────────────────────┤
│  - POST /api/upload       Generate URLs      │
│  - POST /api/process      Start processing   │
│  - GET  /api/videos       Fetch history      │
│  - POST /api/checkout     Buy credits        │
│                                              │
│  Webhooks:                                   │
│  - POST /api/webhooks/processing             │
│  - POST /api/webhooks/stripe                 │
└─────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────┐
│            Supabase Backend                  │
├─────────────────────────────────────────────┤
│  Storage:                                    │
│  - videos bucket (with RLS)                  │
│                                              │
│  Database:                                   │
│  - videos           (processing jobs)        │
│  - user_credits     (balances)               │
│  - credit_transactions (audit log)           │
│                                              │
│  Functions:                                  │
│  - deduct_credits()                          │
│  - refund_credits()                          │
│  - add_credits()                             │
│                                              │
│  Realtime:                                   │
│  - Video status updates                      │
└─────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────┐
│         External Services                    │
├─────────────────────────────────────────────┤
│  - Video Processing API (WaveSpeed/etc)      │
│  - Stripe (payments)                         │
└─────────────────────────────────────────────┘
```

---

## Database Schema

### Tables

#### `videos`

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Original video
  original_filename TEXT NOT NULL,
  original_url TEXT,
  original_storage_path TEXT,
  duration_seconds NUMERIC(10,2) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,

  -- Processing options
  remove_watermark BOOLEAN DEFAULT false,
  target_resolution TEXT, -- '1080p', '1440p', '4K'
  target_aspect_ratio TEXT, -- '16:9', '9:16', '1:1', '4:5'
  enhance_quality BOOLEAN DEFAULT false,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  error_message TEXT,

  -- Processed video
  processed_url TEXT,
  processed_storage_path TEXT,

  -- Cost tracking (CRITICAL)
  estimated_cost_credits INTEGER NOT NULL,
  actual_cost_credits INTEGER,
  api_cost_usd NUMERIC(10,4),

  -- External tracking
  external_job_id TEXT,
  external_provider TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_processing_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);
```

#### `user_credits`

```sql
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'paid', 'pro'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `credit_transactions`

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  video_id UUID REFERENCES videos(id),
  type TEXT NOT NULL, -- 'purchase', 'signup_bonus', 'refund', 'processing_debit'
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Functions

#### `deduct_credits(user_id, video_id, amount)`

- Atomically deducts credits with row locking
- Checks sufficient balance
- Records transaction
- Returns error if insufficient funds

#### `refund_credits(user_id, video_id, amount)`

- Refunds credits on processing failure
- Updates totals
- Records refund transaction

#### `add_credits(user_id, amount, payment_id, session_id)`

- Adds credits after payment
- Records purchase transaction
- Updates balance

---

## API Endpoints

### POST /api/upload

Generate signed Supabase Storage URL for video upload.

**Request:**

```json
{
  "filename": "video.mp4",
  "contentType": "video/mp4",
  "fileSize": 10485760
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://...",
    "storagePath": "user-id/timestamp-video.mp4",
    "token": "...",
    "expiresIn": 3600
  }
}
```

### POST /api/process

Start video processing job.

**Request:**

```json
{
  "filename": "video.mp4",
  "fileSize": 10485760,
  "duration": 30.5,
  "mimeType": "video/mp4",
  "storagePath": "user-id/timestamp-video.mp4",
  "removeWatermark": true,
  "targetResolution": "1080p",
  "targetAspectRatio": "16:9",
  "enhanceQuality": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "videoId": "uuid",
    "status": "processing",
    "estimatedTime": 61,
    "creditsDeducted": 240
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `402 Payment Required` - Insufficient credits
- `403 Forbidden` - Tier limits exceeded
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Processing failed

### GET /api/videos

Fetch user's video history with pagination.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `status` (optional filter: pending/processing/completed/failed)

**Response:**

```json
{
  "success": true,
  "data": {
    "videos": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    }
  }
}
```

### POST /api/checkout

Create Stripe checkout session for credit purchase.

**Request:**

```json
{
  "credits": 500
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/...",
    "sessionId": "cs_..."
  }
}
```

### POST /api/webhooks/processing

Receive updates from video processing API.

**Request:**

```json
{
  "video_id": "uuid",
  "status": "completed",
  "progress": 100,
  "processed_url": "https://...",
  "job_id": "external-job-id"
}
```

### POST /api/webhooks/stripe

Receive Stripe payment events.

**Events Handled:**

- `checkout.session.completed` - Add credits
- `payment_intent.succeeded` - Confirm payment
- `payment_intent.payment_failed` - Handle failure
- `charge.refunded` - Process refund

---

## Components

### VideoUploader

Drag-and-drop file upload with validation.

**Props:**

```typescript
interface VideoUploaderProps {
  onVideoSelected: (video: VideoFile) => void
  onVideoRemoved: () => void
  maxSize?: number
  maxDuration?: number
}
```

**Features:**

- Drag-and-drop support
- File type validation (MP4, MOV, WebM, AVI)
- Size and duration limits
- Real-time cost estimation
- Video preview with thumbnail

### ProcessingOptions

Form for configuring processing options.

**Props:**

```typescript
interface ProcessingOptionsProps {
  onChange: (options: ProcessingOptions) => void
  disabled?: boolean
}
```

**Options:**

- Remove watermark (toggle)
- Target resolution (1080p/1440p/4K)
- Aspect ratio (16:9/9:16/1:1/4:5)
- Enhance quality (toggle)

### VideoUploadFlow

Orchestrates complete upload workflow.

**Props:**

```typescript
interface UploadFlowProps {
  userCredits?: number
  onAuthRequired?: () => void
}
```

**Flow:**

1. Video selection
2. Options configuration
3. Cost display
4. Upload with progress
5. Submit to processing
6. Redirect to status page

### ProcessingStatus

Real-time status updates with Supabase Realtime.

**Props:**

```typescript
interface ProcessingStatusProps {
  videoId: string
  onComplete?: (processedUrl: string) => void
}
```

**Features:**

- Real-time status updates
- Progress bar
- Status indicators (pending/processing/completed/failed)
- Polling fallback
- Error handling

### VideoComparison

Side-by-side synchronized video playback.

**Props:**

```typescript
interface VideoComparisonProps {
  originalUrl: string
  processedUrl: string
  originalLabel?: string
  processedLabel?: string
}
```

**Features:**

- Synchronized playback
- Draggable timeline
- Volume control
- Fullscreen support
- Play/pause controls

### VideoList

Dashboard grid showing video history.

**Props:**

```typescript
interface VideoListProps {
  initialVideos: Video[]
  initialTotal: number
}
```

**Features:**

- Grid layout with cards
- Status badges
- Progress indicators
- Load more pagination
- Download buttons

---

## Cost Management

### Pricing Formula

```typescript
API Cost = ceil(duration_seconds / 5) × $0.10
User Cost = API Cost × 4 (markup)
Credits = User Cost × 100

Example: 30-second video
- Segments: ceil(30 / 5) = 6
- API Cost: 6 × $0.10 = $0.60
- User Cost: $0.60 × 4 = $2.40
- Credits: $2.40 × 100 = 240 credits
```

### Tier Limits

| Tier | Videos/Day | Max Duration | Max File Size | Signup Bonus |
| ---- | ---------- | ------------ | ------------- | ------------ |
| Free | 1          | 30s          | 100MB         | 100 credits  |
| Paid | 50         | 120s         | 500MB         | -            |
| Pro  | 200        | 120s         | 1GB           | -            |

### Credit Packages

| Credits | Price  | Discount | Per Credit |
| ------- | ------ | -------- | ---------- |
| 100     | $1.00  | 0%       | $0.01      |
| 500     | $4.50  | 10%      | $0.009     |
| 1,000   | $8.00  | 20%      | $0.008     |
| 5,000   | $35.00 | 30%      | $0.007     |

### Cost Protection

1. **Pre-flight validation**: Calculate cost before processing
2. **Credit check**: Verify sufficient balance
3. **Atomic deduction**: Use database locks to prevent race conditions
4. **Auto-refund**: Refund credits if processing fails
5. **Transaction log**: Audit trail for all credit movements

---

## Setup Instructions

See **SETUP.md** for detailed setup instructions.

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up Supabase
supabase start
supabase db reset

# 3. Create storage bucket
# Dashboard → Storage → Create "videos" bucket

# 4. Configure environment
cp .env.example .env.local
# Fill in all variables

# 5. Run development server
pnpm dev
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Video API
VIDEO_API_KEY=
VIDEO_API_URL=
VIDEO_API_COST_PER_5_SECONDS=0.10

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing Guide

### Manual Testing Checklist

#### Upload Flow

- [ ] Drag and drop video file
- [ ] Select video via file picker
- [ ] Validate file type restrictions
- [ ] Validate file size limits
- [ ] Validate duration limits
- [ ] See accurate cost estimation

#### Processing Flow

- [ ] Configure processing options
- [ ] Submit for processing
- [ ] See upload progress
- [ ] Redirect to processing page
- [ ] See real-time status updates
- [ ] See progress bar advance

#### Completion Flow

- [ ] See completion notification
- [ ] View side-by-side comparison
- [ ] Play/pause synchronized videos
- [ ] Scrub timeline
- [ ] Download processed video

#### Credit System

- [ ] See credit balance
- [ ] Credits deducted on submit
- [ ] Credits refunded on failure
- [ ] Purchase credits via Stripe
- [ ] See transaction history

#### Dashboard

- [ ] View video history
- [ ] See accurate statistics
- [ ] Filter by status
- [ ] Load more pagination
- [ ] Click to view details

### Automated Testing

```bash
# Run type check
pnpm type-check

# Run linter
pnpm lint

# Build for production
pnpm build
```

---

## Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase migrations applied
- [ ] Storage bucket created with RLS policies
- [ ] Stripe webhooks configured
- [ ] Video processing API integrated
- [ ] Domain configured for webhooks
- [ ] SSL certificate active
- [ ] CORS configured

### Deployment Steps

#### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### 2. Configure Supabase

```bash
# Push migrations to production
supabase db push

# Verify schema
supabase db pull
```

#### 3. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to environment variables

#### 4. Configure Processing API Webhooks

1. Set webhook URL: `https://yourdomain.com/api/webhooks/processing`
2. Configure authentication (API key or signature)
3. Test webhook delivery

---

## Troubleshooting

### Videos Stuck in "Pending"

**Cause**: Processing API not configured or webhook not working

**Solution**:

1. Check `app/api/process/route.ts:submitToProcessingAPI`
2. Verify webhook URL is reachable
3. Check external API logs

### Real-time Updates Not Working

**Cause**: Supabase Realtime not enabled or RLS blocking updates

**Solution**:

1. Enable Realtime in Supabase Dashboard → Database → Replication
2. Check RLS policies allow user to read their videos
3. Check browser console for connection errors
4. Component should fall back to polling automatically

### Credit Deduction Fails

**Cause**: Database function error or insufficient permissions

**Solution**:

1. Verify `user_credits` table exists
2. Check service role key is correct
3. Test function directly: `SELECT * FROM deduct_credits('user-id', 'video-id', 100)`
4. Check transaction logs

### Upload Fails

**Cause**: Storage bucket not configured or CORS issue

**Solution**:

1. Verify "videos" bucket exists in Supabase Storage
2. Check bucket is public or RLS policies allow upload
3. Configure CORS in Storage settings
4. Check file size doesn't exceed limits

### Webhook Not Receiving Events

**Cause**: URL not reachable or signature verification failing

**Solution**:

1. Test webhook URL with `curl`
2. Check webhook logs in provider dashboard
3. Temporarily disable signature verification for testing
4. Verify webhook secret is correct

---

## File Structure Reference

```
app/
├── api/
│   ├── upload/route.ts
│   ├── process/route.ts
│   ├── videos/route.ts
│   ├── checkout/route.ts
│   └── webhooks/
│       ├── processing/route.ts
│       └── stripe/route.ts
├── enhance/page.tsx
├── processing/[videoId]/page.tsx
├── dashboard/page.tsx
└── Main.tsx

components/video/
├── VideoUploader.tsx
├── ProcessingOptions.tsx
├── VideoUploadFlow.tsx
├── ProcessingStatus.tsx
├── VideoComparison.tsx
└── VideoList.tsx

lib/
├── supabase/
│   ├── server.ts
│   └── client.ts
├── video/cost.ts
├── validations/video.ts
└── api/
    ├── response.ts
    └── auth.ts

supabase/migrations/
└── 20251008000000_create_video_processing_tables.sql

types/database.ts
```

---

## Support & Resources

- **Setup Guide**: SETUP.md
- **Feature Summary**: VIDEO_FEATURE_SUMMARY.md
- **Development Guidelines**: CLAUDE.md
- **Product Requirements**: PRD.md

---

**Built with ❤️ for ReelVan**
