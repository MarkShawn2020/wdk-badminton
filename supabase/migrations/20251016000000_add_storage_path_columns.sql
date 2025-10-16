-- Migration: Add storage path columns for permanent video storage
-- Date: 2025-10-16
-- Purpose: Store Supabase Storage paths instead of temporary upstream provider URLs
--
-- CRITICAL RATIONALE:
-- - Replicate output URLs expire after 1 hour
-- - WaveSpeed URLs may be temporary and unreliable
-- - Storing in Supabase Storage ensures permanent access
-- - Hides upstream provider information from frontend
--
-- Affected tables:
-- - processing_pipeline: Add output_storage_path for each step
-- - videos: Add final_storage_path for the final processed video

-- ============================================================================
-- Add storage path column to processing_pipeline table
-- ============================================================================

ALTER TABLE processing_pipeline
ADD COLUMN IF NOT EXISTS output_storage_path TEXT;

COMMENT ON COLUMN processing_pipeline.output_storage_path IS
'Supabase Storage path for the processed video (permanent). Format: processed/{step_type}/{video_id}_{timestamp}.mp4. This replaces the temporary output_video_url from upstream providers.';

-- Create index for faster lookups when querying by storage path
CREATE INDEX IF NOT EXISTS idx_processing_pipeline_storage_path
ON processing_pipeline(output_storage_path)
WHERE output_storage_path IS NOT NULL;

-- ============================================================================
-- Add final storage path column to videos table
-- ============================================================================

ALTER TABLE videos
ADD COLUMN IF NOT EXISTS final_storage_path TEXT;

COMMENT ON COLUMN videos.final_storage_path IS
'Final Supabase Storage path after all pipeline steps complete. This is the permanent URL served to users, replacing the temporary processed_url from upstream providers.';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_videos_final_storage_path
ON videos(final_storage_path)
WHERE final_storage_path IS NOT NULL;

-- ============================================================================
-- Data migration note
-- ============================================================================

-- Note: Existing videos with processed_url pointing to temporary URLs
-- will need to be migrated separately. This can be done via a background job.
-- New videos will automatically use the storage path system.

-- To migrate existing videos:
-- 1. Query videos with processed_url but no final_storage_path
-- 2. Download from temporary URL (if not expired)
-- 3. Upload to Supabase Storage
-- 4. Update final_storage_path column
--
-- Migration script should be run within 1 hour of Replicate job completion
-- to avoid URL expiration.
