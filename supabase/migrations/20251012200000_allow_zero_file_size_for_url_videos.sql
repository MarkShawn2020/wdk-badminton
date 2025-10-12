-- ============================================================================
-- Allow zero file_size_bytes for URL-based videos
-- ============================================================================
-- When videos are loaded from external URLs, we don't know the file size
-- This migration allows file_size_bytes to be 0 for such cases

-- Drop the old constraint
ALTER TABLE videos DROP CONSTRAINT IF EXISTS valid_file_size;

-- Add new constraint that allows 0 for URL videos
ALTER TABLE videos ADD CONSTRAINT valid_file_size
  CHECK (file_size_bytes >= 0 AND file_size_bytes <= 536870912); -- 0 or Max 500MB

COMMENT ON CONSTRAINT valid_file_size ON videos IS 'Allows file_size_bytes to be 0 for URL-based videos where size is unknown';
