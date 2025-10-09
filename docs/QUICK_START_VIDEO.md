# 🚀 Quick Start Guide - Video Processing Feature

This is a **5-minute quick start** to get the video processing feature running locally.

---

## Prerequisites

- [x] Node.js 18+ installed
- [x] pnpm installed (`npm i -g pnpm`)
- [x] Supabase CLI installed (`npm i -g supabase`)
- [x] Git repository cloned

---

## Step 1: Install Dependencies (1 min)

```bash
pnpm install
```

---

## Step 2: Start Supabase (2 min)

```bash
# Start local Supabase (Docker required)
supabase start

# Apply migrations
supabase db reset

# This creates:
# - videos table
# - user_credits table
# - credit_transactions table
# - Helper functions
# - 100 free credits on signup
```

**Output**: Note the API URL and anon key for next step.

---

## Step 3: Configure Environment (1 min)

Create `.env.local`:

```bash
# From Supabase CLI output
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Mock Stripe (for testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock
STRIPE_SECRET_KEY=sk_test_mock
STRIPE_WEBHOOK_SECRET=whsec_mock

# Video API (mock mode)
VIDEO_API_KEY=mock
VIDEO_API_URL=https://mock.api
VIDEO_API_COST_PER_5_SECONDS=0.10

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 4: Create Storage Bucket (1 min)

```bash
# Open Supabase Studio
supabase db studio

# In browser:
# 1. Click "Storage" in left sidebar
# 2. Click "New bucket"
# 3. Name: "videos"
# 4. Check "Public bucket"
# 5. Click "Create bucket"
```

**Or via SQL:**

```sql
-- Run in Supabase Studio SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);
```

---

## Step 5: Run Development Server (<1 min)

```bash
pnpm dev
```

**Open**: http://localhost:3000

---

## ✅ Test the Flow (2 min)

### 1. Create Test User

Visit: http://localhost:3000/signup

- Email: test@example.com
- Password: test123456

**Result**: User created with 100 free credits

### 2. Upload Video

Visit: http://localhost:3000/enhance

1. Drag and drop a video file (MP4, MOV, WebM)
2. Configure options (watermark removal, etc.)
3. Click "Start Processing"

**Result**: Redirects to /processing/[videoId]

### 3. Check Processing Status

The processing page shows:

- Status: "Processing" (mock mode)
- Progress: 0%

### 4. Simulate Completion (Manual)

Open Supabase Studio → Table Editor → videos

Find your video and update:

- `status` → `completed`
- `progress` → `100`
- `processed_url` → Use same as `original_url` for testing

**Result**: Page updates in real-time, shows comparison view

### 5. View Dashboard

Visit: http://localhost:3000/dashboard

**Result**: See video history and credit balance (100 - cost)

---

## 🎉 Success!

You've successfully tested:

- ✅ Video upload
- ✅ Cost calculation
- ✅ Credit deduction
- ✅ Database integration
- ✅ Real-time updates
- ✅ Video comparison

---

## Next Steps

### 1. Integrate Real Video Processing API

Edit `app/api/process/route.ts`:

```typescript
async function submitToProcessingAPI(
  videoId: string,
  videoUrl: string,
  options: ProcessingOptions
): Promise<void> {
  // Replace mock with real API
  const response = await fetch(process.env.VIDEO_API_URL + '/process', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VIDEO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_url: videoUrl,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/processing`,
      metadata: { video_id: videoId },
      ...options,
    }),
  })

  if (!response.ok) throw new Error('API failed')
}
```

### 2. Set Up Webhook Handler

The webhook handler is already created at:

- `app/api/webhooks/processing/route.ts`

Configure your video processing API to call:

- `http://localhost:3000/api/webhooks/processing`

### 3. Set Up Stripe (for payments)

1. Get Stripe keys from https://dashboard.stripe.com
2. Update `.env.local` with real keys
3. Configure webhook: `http://localhost:3000/api/webhooks/stripe`
4. Test credit purchase at http://localhost:3000/pricing

---

## Common Issues

### Issue: "Supabase not found"

**Solution:**

```bash
docker ps  # Check Docker is running
supabase stop
supabase start
```

### Issue: "Storage bucket not found"

**Solution:**

```bash
# Recreate bucket
supabase db studio
# Manually create "videos" bucket
```

### Issue: "Credits not deducted"

**Solution:**

```bash
# Check function exists
supabase db studio
# SQL Editor: SELECT * FROM deduct_credits('user-id', 'video-id', 100)
```

### Issue: "Real-time not updating"

**Solution:**

- Check browser console for WebSocket errors
- Enable Realtime in Supabase Studio → Database → Replication
- The app should fall back to polling automatically

---

## Useful Commands

```bash
# View Supabase logs
supabase functions logs --follow

# Reset database (WARNING: deletes data)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > types/database.ts

# Check database status
supabase status

# Stop Supabase
supabase stop
```

---

## Development Workflow

### Making Changes

1. **Database changes**:

   ```bash
   supabase migration new your_change_name
   # Edit migration file
   supabase db reset
   supabase gen types typescript --local > types/database.ts
   ```

2. **Code changes**:
   - Hot reload is enabled
   - Changes reflect immediately

3. **API testing**:
   ```bash
   # Test upload endpoint
   curl -X POST http://localhost:3000/api/upload \
     -H "Content-Type: application/json" \
     -d '{"filename": "test.mp4", "contentType": "video/mp4", "fileSize": 1024}'
   ```

---

## File Structure Quick Reference

```
Key files to modify:

app/api/process/route.ts
  ↳ Submit to video processing API

app/api/webhooks/processing/route.ts
  ↳ Receive completion notifications

lib/video/cost.ts
  ↳ Adjust pricing and limits

supabase/migrations/*.sql
  ↳ Database schema changes
```

---

## Testing Checklist

- [ ] Upload video (drag-drop)
- [ ] See cost estimation
- [ ] Submit for processing
- [ ] Credits deducted correctly
- [ ] Processing page shows status
- [ ] Real-time updates work
- [ ] Completion shows comparison
- [ ] Dashboard shows history
- [ ] Download button works

---

## Production Deployment

See **SETUP.md** for full production deployment guide.

Quick checklist:

- [ ] Supabase production project created
- [ ] Migrations applied to production
- [ ] Storage bucket configured
- [ ] Environment variables set in Vercel
- [ ] Webhooks configured for production domain
- [ ] Stripe production mode enabled

---

## Resources

- **Full Setup Guide**: SETUP.md
- **Feature Documentation**: README_VIDEO_FEATURE.md
- **API Reference**: VIDEO_FEATURE_SUMMARY.md
- **Development Guidelines**: CLAUDE.md

---

**Questions?**
Check the troubleshooting section in SETUP.md or README_VIDEO_FEATURE.md

**Happy coding! 🎬**
