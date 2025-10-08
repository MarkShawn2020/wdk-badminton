# Supabase Storage Setup Guide

## Overview

This guide explains how to configure Supabase Storage for the ReelVan video processing platform.

---

## Storage Bucket Configuration

### 1. Create Storage Bucket

```sql
-- Run this in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);
```

Or via Supabase Dashboard:

1. Go to Storage → Buckets
2. Click "New Bucket"
3. Name: `videos`
4. **Public bucket**: Toggle ON ✅
5. Click "Create bucket"

### 2. Set Up Storage Policies

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload videos to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own videos
CREATE POLICY "Users can read own videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access (for public URLs to work)
CREATE POLICY "Public videos are readable by anyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own videos
CREATE POLICY "Users can update own videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Configure CORS (Optional)

If you need to access videos from different domains:

```sql
-- Enable CORS for the videos bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo'
],
file_size_limit = 524288000  -- 500MB in bytes
WHERE id = 'videos';
```

---

## Public URL vs Signed URL

### Public URL (Permanent)

```typescript
const { data } = supabase.storage.from('videos').getPublicUrl('user-id/video.mp4')

// Returns: https://[project].supabase.co/storage/v1/object/public/videos/user-id/video.mp4
```

**Pros**:

- Permanent URL (doesn't expire)
- Simple to use
- Works in CDN/cache

**Cons**:

- Anyone with URL can access
- Can't revoke access
- Not suitable for paid content

**Best for**:

- Public marketing videos
- Free tier content
- Shareable content

---

### Signed URL (Temporary)

```typescript
const { data, error } = await supabase.storage
  .from('videos')
  .createSignedUrl('user-id/video.mp4', 3600) // Expires in 1 hour

// Returns: https://[project].supabase.co/storage/v1/object/sign/videos/user-id/video.mp4?token=xxx
```

**Pros**:

- Time-limited access (secure)
- Can revoke by regenerating
- Suitable for paid content

**Cons**:

- URL expires (need to refresh)
- More complex to manage
- Can't use in some CDN scenarios

**Best for**:

- Paid content protection
- Temporary sharing
- Download links

---

## ReelVan Implementation

### Current Setup

The system uses **both URL types**:

1. **Public URL** for console output and debugging
2. **Signed URL** for secure temporary access

### API Endpoint

```bash
POST /api/storage/public-url
```

**Request**:

```json
{
  "storagePath": "user-id/timestamp-filename.mp4",
  "expiresIn": 3600 // Optional, defaults to 1 hour
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "publicUrl": "https://[project].supabase.co/storage/v1/object/public/videos/user-id/file.mp4",
    "signedUrl": "https://[project].supabase.co/storage/v1/object/sign/videos/user-id/file.mp4?token=xxx",
    "storagePath": "user-id/timestamp-filename.mp4",
    "expiresIn": 3600,
    "expiresAt": "2025-10-08T12:00:00.000Z"
  }
}
```

---

## Console Output Format

When a video is uploaded, you'll see:

```
✅ Video uploaded successfully!
📹 Storage Path: abc123-def456/1728384000000-my-video.mp4
🔗 Public URL: https://xncedgheyootaxipktai.supabase.co/storage/v1/object/public/videos/abc123-def456/1728384000000-my-video.mp4
📊 File Size: 45.32 MB
⏱️ Duration: 15.5 seconds
```

---

## Security Considerations

### 1. User Folder Isolation

Files are stored in user-specific folders:

```
videos/
├── user-id-1/
│   ├── timestamp-video1.mp4
│   └── timestamp-video2.mp4
└── user-id-2/
    └── timestamp-video3.mp4
```

### 2. RLS Policies

Row-Level Security ensures:

- Users can only upload to their own folder
- Users can only access their own files
- Public can read (if bucket is public)

### 3. File Size Limits

Configure in Supabase Dashboard:

- Max file size: 500MB (configurable)
- Allowed MIME types: video/mp4, video/quicktime, etc.

---

## Troubleshooting

### Issue: Public URL returns 404

**Cause**: Bucket is not public or RLS policies are too restrictive

**Solution**:

```sql
-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'videos';

-- Add public read policy
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');
```

---

### Issue: "Access denied" error

**Cause**: User trying to access another user's file

**Solution**: The API automatically checks:

```typescript
if (!storagePath.startsWith(`${user.id}/`)) {
  return errorResponse('Access denied', 403)
}
```

---

### Issue: Signed URL expired

**Cause**: Signed URLs expire after the specified time

**Solution**: Request a new signed URL:

```typescript
const { data } = await supabase.storage.from('videos').createSignedUrl(path, 3600) // New 1-hour URL
```

---

## Testing

### 1. Test Upload

```bash
# Upload a test video
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "filename": "test.mp4",
    "contentType": "video/mp4",
    "fileSize": 1048576
  }'
```

### 2. Test Public URL

```bash
# Get public URL
curl -X POST http://localhost:3000/api/storage/public-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "storagePath": "user-id/timestamp-test.mp4"
  }'
```

### 3. Verify Access

```bash
# Test public URL
curl -I https://[project].supabase.co/storage/v1/object/public/videos/user-id/file.mp4

# Should return: 200 OK
```

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Migration Checklist

- [ ] Create `videos` bucket in Supabase
- [ ] Enable public access on bucket
- [ ] Run RLS policy SQL scripts
- [ ] Configure file size limits
- [ ] Set allowed MIME types
- [ ] Test upload flow
- [ ] Test public URL generation
- [ ] Test signed URL generation
- [ ] Verify console output shows URLs
- [ ] Test cross-user access denial

---

## Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Signed URLs](https://supabase.com/docs/guides/storage/serving/downloads)

---

**Last Updated**: 2025-10-08
