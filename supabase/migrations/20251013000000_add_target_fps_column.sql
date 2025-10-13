-- Add target_fps column to videos table
-- This allows users to specify target FPS (15-60) for video quality enhancement

ALTER TABLE videos
ADD COLUMN target_fps INTEGER;

-- Add constraint to ensure FPS is within valid range (15-60fps)
ALTER TABLE videos
ADD CONSTRAINT valid_target_fps
CHECK (target_fps IS NULL OR (target_fps >= 15 AND target_fps <= 60));

-- Add comment
COMMENT ON COLUMN videos.target_fps IS 'Target frames per second for video upscaling (15-60fps). NULL means use default (60fps).';
