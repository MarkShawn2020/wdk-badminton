-- Migration: Update Storage Policies for Processed Videos
-- Date: 2025-10-16
-- Purpose: Allow users to access processed videos in the 'processed/' folder
--
-- CONTEXT:
-- - Original videos are uploaded to {user_id}/ folder
-- - Processed videos are stored in processed/{step_type}/ folder
-- - Users need to read/download their processed videos
-- - Service role handles uploads to processed/ folder

-- ============================================================================
-- Drop existing restrictive policies (if needed for update)
-- ============================================================================

-- Note: We're adding new policies, not dropping existing ones
-- Existing policies for {user_id}/ folders remain unchanged

-- ============================================================================
-- Add policy for service role to upload processed videos
-- ============================================================================

-- Allow service role (backend) to upload processed videos
CREATE POLICY "Service role can upload processed videos"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = 'processed'
);

-- ============================================================================
-- Add policy for users to read processed videos
-- ============================================================================

-- Allow authenticated users to read processed videos
-- Note: We'll verify video ownership at the application level (videos table)
CREATE POLICY "Users can read processed videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = 'processed'
);

-- ============================================================================
-- Add policy for service role to read all videos (for transfer operations)
-- ============================================================================

-- Allow service role to read all videos (needed for video transfer operations)
CREATE POLICY "Service role can read all videos"
ON storage.objects FOR SELECT
TO service_role
USING (
  bucket_id = 'videos'
);

-- ============================================================================
-- Add policy for service role to delete processed videos
-- ============================================================================

-- Allow service role to delete processed videos (for cleanup operations)
CREATE POLICY "Service role can delete processed videos"
ON storage.objects FOR DELETE
TO service_role
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = 'processed'
);

-- ============================================================================
-- Security Notes
-- ============================================================================

-- 1. User ownership verification:
--    - Application layer verifies video ownership via videos.user_id
--    - Users can only download videos they own (checked in download API)
--    - Storage RLS only prevents anonymous access
--
-- 2. Service role permissions:
--    - Can read all videos (needed for transfer from original to processed)
--    - Can upload to processed/ folder
--    - Can delete from processed/ folder (for cleanup)
--
-- 3. User permissions:
--    - Can upload to {user_id}/ folder (original videos)
--    - Can read {user_id}/ folder (original videos)
--    - Can read processed/ folder (processed videos)
--    - Cannot delete processed/ folder (only service role)
