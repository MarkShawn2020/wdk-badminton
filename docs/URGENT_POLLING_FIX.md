# 🚨 URGENT: Fix Video Processing Polling Issue

**Status**: Videos stuck at `{status: 'processing', progress: 0}` forever
**Root Cause**: Missing Vercel Cron Job configuration
**Severity**: CRITICAL - Production broken
**Est. Fix Time**: 15 minutes

---

## 📊 Problem Analysis

### What's Broken

```
User uploads video
    ↓
/api/process creates WaveSpeed job ✅
    ↓
external_job_id stored in database ✅
    ↓
❌ NO CRON JOB CONFIGURED ← THIS IS THE PROBLEM
    ↓
/api/poll-jobs NEVER executes
    ↓
Job status NEVER updates
    ↓
Video stuck at "processing" FOREVER
```

### Root Cause

**vercel.json was empty** - No cron job to poll WaveSpeed API for status updates

---

## ✅ Solution Implemented

### 1. Files Modified

#### `vercel.json` - Added Cron Configuration

```json
{
  "crons": [
    {
      "path": "/api/poll-jobs",
      "schedule": "*/2 * * * *"
    }
  ]
}
```

**What this does**: Calls `/api/poll-jobs` every 2 minutes to check video processing status

#### `.env.example` - Added REPLICATE_API_TOKEN

```bash
# Replicate API (Video Quality Enhancement)
# Get from: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=r8_your_token_here
```

#### Database Migration - Added config column

```sql
-- supabase/migrations/20251012000000_add_pipeline_config.sql
ALTER TABLE processing_pipeline ADD COLUMN IF NOT EXISTS config JSONB;
```

**Why needed**: Stores user-selected Replicate config (resolution, FPS) for multi-step pipelines

#### Code Fixes

1. **lib/video/pipeline-orchestrator.ts** - Store config when creating pipeline steps
2. **lib/video/pipeline-step-handler.ts** - Read config from database (not hardcoded)
3. **app/(home)/api/videos/[videoId]/status/route.ts** - Query pipeline table (not videos table)

---

## 🚀 Deployment Steps

### Step 1: Verify Local Environment

```bash
# Check if you have required API keys
cat .env.local | grep -E "WAVESPEED|REPLICATE|CRON"
```

**Expected**:

```
WAVESPEED_API_KEY=xxx
REPLICATE_API_TOKEN=r8_xxx  ← If missing, see Step 2
CRON_SECRET=xxx             ← If missing, see Step 3
```

### Step 2: Get Replicate API Token (if missing)

1. Visit https://replicate.com/account/api-tokens
2. Click "Create token"
3. Copy the token (starts with `r8_`)
4. Add to `.env.local`:
   ```bash
   REPLICATE_API_TOKEN=r8_your_actual_token_here
   ```

### Step 3: Generate CRON_SECRET (if missing)

```bash
# Generate random secret
openssl rand -base64 32

# Add to .env.local
echo "CRON_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Step 4: Run Database Migration

```bash
# Apply migration locally
pnpm supabase db reset

# Verify migration
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d processing_pipeline"
# Should see "config | jsonb" in output

# Update TypeScript types
pnpm supabase gen types typescript --local > types/database.ts
```

### Step 5: Test Locally

```bash
# Start dev server
pnpm dev

# In another terminal, manually trigger poll-jobs
curl http://localhost:3000/api/poll-jobs \
  -H "Authorization: Bearer $(grep CRON_SECRET .env.local | cut -d'=' -f2)"

# Expected output:
# {"success": true, "data": {"message": "Polling completed", ...}}
```

### Step 6: Deploy to Production

```bash
# 1. Commit and push
git add .
git commit -m "fix: add vercel cron job for video processing polling

- Configure vercel.json with */2 * * * * cron schedule
- Add REPLICATE_API_TOKEN to environment variables
- Add config JSONB column to processing_pipeline table
- Fix status route to query pipeline table instead of videos table
- Fix pipeline-step-handler to read config from database

Resolves: Videos stuck at 'processing' status forever
Critical: Production broken without this fix"

git push origin main

# 2. Push database migration to production
pnpm supabase db push

# 3. Add environment variables to Vercel
# Visit: https://vercel.com/your-org/reelvan-web/settings/environment-variables

# Add these variables:
# - REPLICATE_API_TOKEN = r8_xxx (from Step 2)
# - CRON_SECRET = xxx (from Step 3)

# 4. Redeploy (if auto-deploy didn't trigger)
vercel --prod
```

### Step 7: Verify Production

```bash
# Check cron job is running
# Visit: https://vercel.com/your-org/reelvan-web/deployments
# Click latest deployment → Functions → Check for "poll-jobs" logs

# Manually trigger poll-jobs (test)
curl https://your-domain.com/api/poll-jobs \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Upload a test video and check status
# Should see progress updates every 2 minutes
```

---

## 📝 How It Works Now

### Complete Flow

```
1. User uploads video
   ↓
2. /api/process
   ├─ Creates video record
   ├─ Creates pipeline steps
   ├─ Starts Step 1 (WaveSpeed)
   └─ Stores external_job_id in processing_pipeline table
   ↓
3. Vercel Cron (every 2 minutes) ✅ NEW!
   └─ Calls /api/poll-jobs with Bearer token
   ↓
4. /api/poll-jobs
   ├─ Queries all processing pipeline steps
   ├─ For each step:
   │  ├─ Calls WaveSpeed/Replicate API
   │  ├─ Updates step status
   │  ├─ If completed: starts next step
   │  └─ If all steps done: finalizes video
   └─ Returns summary
   ↓
5. Frontend polls /api/videos/{id}/status
   └─ Shows updated progress to user
```

### Timeline Example

```
00:00 - User uploads video
00:00 - Step 1 starts (WaveSpeed watermark removal)
00:02 - Cron checks status → still processing
00:04 - Cron checks status → still processing
00:06 - Cron checks status → Step 1 completed! ✅
00:06 - Step 2 starts automatically (Replicate upscaling)
00:08 - Cron checks status → Step 2 processing
00:10 - Cron checks status → Step 2 processing
00:12 - Cron checks status → Step 2 completed! ✅
00:12 - Video finalized, user downloads result
```

---

## 🧪 Testing Checklist

### Before Deploy

- [ ] vercel.json contains cron configuration
- [ ] .env.local has REPLICATE_API_TOKEN
- [ ] .env.local has CRON_SECRET
- [ ] Database migration applied locally
- [ ] TypeScript types regenerated
- [ ] `pnpm lint` passes
- [ ] Manual poll-jobs test works locally

### After Deploy

- [ ] Environment variables added to Vercel
- [ ] Database migration applied to production
- [ ] Cron job appears in Vercel Functions logs
- [ ] Test video upload completes successfully
- [ ] Status updates every ~2 minutes
- [ ] Multi-step pipeline (watermark + enhancement) works
- [ ] Error handling works (failed jobs refund credits)

---

## 🔧 Troubleshooting

### Issue 1: Cron job not running on Vercel

**Symptoms**: No logs in Functions tab

**Solutions**:

```bash
# 1. Check vercel.json is committed
git log --oneline --decorate | head -5

# 2. Check Vercel detected the cron
# Visit: Vercel Dashboard → Settings → Cron Jobs
# Should see: /api/poll-jobs (every 2 minutes)

# 3. Trigger manual deploy
vercel --prod --force
```

### Issue 2: Poll-jobs returns 401 Unauthorized

**Cause**: CRON_SECRET mismatch

**Solution**:

```bash
# Check local secret
grep CRON_SECRET .env.local

# Check production secret
# Vercel Dashboard → Settings → Environment Variables
# Ensure they match!

# Test with correct secret
curl https://your-domain.com/api/poll-jobs \
  -H "Authorization: Bearer $(grep CRON_SECRET .env.local | cut -d'=' -f2)"
```

### Issue 3: Video still stuck at "processing"

**Diagnosis**:

```sql
-- Check pipeline steps
SELECT
  pp.step_order,
  pp.status,
  pp.provider,
  pp.external_job_id,
  pp.started_at,
  NOW() - pp.started_at AS elapsed_time
FROM processing_pipeline pp
WHERE pp.video_id = 'your-video-id'
ORDER BY pp.step_order;
```

**Possible causes**:

1. Cron not running → Check Vercel logs
2. API key expired → Test WaveSpeed/Replicate APIs
3. Job failed → Check error_message column
4. Migration not applied → Check config column exists

### Issue 4: Replicate API returns 401

**Cause**: Missing or invalid REPLICATE_API_TOKEN

**Solution**:

```bash
# Test token
curl https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN"

# Should return 200 (even if empty list)
# If 401: regenerate token at https://replicate.com/account/api-tokens
```

---

## 📊 Monitoring

### Vercel Dashboard

1. **Deployments** → Latest → **Functions**
   - Look for `poll-jobs` calls every 2 minutes
   - Check for errors (red indicators)

2. **Settings** → **Cron Jobs**
   - Should show: `/api/poll-jobs` with schedule `*/2 * * * *`

### Database Queries

```sql
-- Active processing steps
SELECT
  v.id,
  v.original_filename,
  pp.step_order,
  pp.status,
  pp.provider,
  pp.started_at,
  NOW() - pp.started_at AS elapsed
FROM videos v
JOIN processing_pipeline pp ON v.id = pp.video_id
WHERE pp.status = 'processing'
ORDER BY pp.started_at DESC;

-- Steps completed in last hour
SELECT
  COUNT(*) AS completed_steps,
  provider,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) AS avg_seconds
FROM processing_pipeline
WHERE status = 'completed'
  AND completed_at > NOW() - INTERVAL '1 hour'
GROUP BY provider;

-- Failed steps
SELECT
  v.id,
  v.original_filename,
  pp.step_order,
  pp.error_message,
  pp.completed_at
FROM videos v
JOIN processing_pipeline pp ON v.id = pp.video_id
WHERE pp.status = 'failed'
ORDER BY pp.completed_at DESC
LIMIT 10;
```

---

## 🎯 Expected Outcomes

### Before Fix

- ❌ Videos stuck at "processing" forever
- ❌ Progress always shows 0%
- ❌ Users never receive processed videos
- ❌ No refunds on failures

### After Fix

- ✅ Videos process automatically
- ✅ Progress updates every 2 minutes
- ✅ Users receive processed videos
- ✅ Failed jobs auto-refund credits
- ✅ Multi-step pipelines work (watermark + enhancement)

---

## 📞 Support

If deployment fails:

1. Check this document's Troubleshooting section
2. Review Vercel deployment logs
3. Check Supabase database logs
4. Test API endpoints manually with curl
5. Contact dev team with logs

---

## ✅ Deployment Completion Checklist

Before marking this as complete:

- [ ] All code changes committed and pushed
- [ ] Database migration applied to production
- [ ] Environment variables configured in Vercel
- [ ] Cron job visible in Vercel Dashboard
- [ ] Test video upload completes successfully
- [ ] Monitoring queries return expected results
- [ ] Documentation updated

**Status**: 🔴 INCOMPLETE → Deploy to fix production

---

Generated with Claude Code
Last Updated: 2025-10-12
