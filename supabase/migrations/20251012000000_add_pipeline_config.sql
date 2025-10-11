-- ============================================================================
-- ADD CONFIG COLUMN TO PROCESSING_PIPELINE
-- Stores step-specific configuration (e.g., Replicate resolution/FPS)
-- ============================================================================

ALTER TABLE processing_pipeline
  ADD COLUMN IF NOT EXISTS config JSONB;

-- Add comment
COMMENT ON COLUMN processing_pipeline.config IS 'Step configuration (e.g., {"targetResolution": "4k", "targetFps": 60})';

-- Example usage:
-- INSERT INTO processing_pipeline (video_id, step_type, provider, config, ...)
-- VALUES (uuid, 'enhance_quality', 'replicate', '{"targetResolution": "4k", "targetFps": 60}', ...);
