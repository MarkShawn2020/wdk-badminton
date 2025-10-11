-- ============================================================================
-- PROCESSING PIPELINE TABLE
-- Enables multi-step video processing (watermark removal → quality enhancement)
-- ============================================================================

CREATE TABLE processing_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,

  -- Step information
  step_order INTEGER NOT NULL,  -- 1, 2, 3, ... (execution order)
  step_type TEXT NOT NULL,      -- 'remove_watermark', 'enhance_quality', etc.
  step_name TEXT NOT NULL,      -- Human-readable name

  -- Step status
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- API provider info
  provider TEXT NOT NULL,       -- 'wavespeed', 'replicate'
  external_job_id TEXT,         -- Job ID from external API

  -- Input/Output URLs
  input_video_url TEXT NOT NULL,
  output_video_url TEXT,

  -- Cost tracking
  estimated_cost_credits INTEGER NOT NULL,
  actual_cost_credits INTEGER,
  api_cost_usd NUMERIC(10,4),

  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 2,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_step_type CHECK (step_type IN (
    'remove_watermark',
    'enhance_quality',
    'aspect_ratio_conversion',
    'add_custom_watermark'
  )),
  CONSTRAINT valid_status CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'skipped'
  )),
  CONSTRAINT valid_provider CHECK (provider IN (
    'wavespeed', 'replicate', 'internal'
  )),
  CONSTRAINT unique_video_step_order UNIQUE (video_id, step_order)
);

-- Indexes for performance
CREATE INDEX idx_pipeline_video_id ON processing_pipeline(video_id);
CREATE INDEX idx_pipeline_status ON processing_pipeline(status);
CREATE INDEX idx_pipeline_step_order ON processing_pipeline(video_id, step_order);
CREATE INDEX idx_pipeline_external_job ON processing_pipeline(external_job_id) WHERE external_job_id IS NOT NULL;

-- Row Level Security
ALTER TABLE processing_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pipeline steps"
  ON processing_pipeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = processing_pipeline.video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Only service role can modify pipeline
CREATE POLICY "Service role can manage pipeline"
  ON processing_pipeline FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- ADD PIPELINE FIELDS TO VIDEOS TABLE
-- ============================================================================

ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS pipeline_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS current_pipeline_step INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_pipeline_steps INTEGER DEFAULT 1;

-- ============================================================================
-- HELPER FUNCTIONS FOR PIPELINE MANAGEMENT
-- ============================================================================

-- Get next pending pipeline step for a video
CREATE OR REPLACE FUNCTION get_next_pipeline_step(p_video_id UUID)
RETURNS processing_pipeline AS $$
DECLARE
  v_step processing_pipeline;
BEGIN
  SELECT * INTO v_step
  FROM processing_pipeline
  WHERE video_id = p_video_id
    AND status = 'pending'
  ORDER BY step_order ASC
  LIMIT 1;

  RETURN v_step;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if all pipeline steps are completed
CREATE OR REPLACE FUNCTION is_pipeline_completed(p_video_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_pending_count INTEGER;
  v_processing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_pending_count
  FROM processing_pipeline
  WHERE video_id = p_video_id
    AND status IN ('pending', 'processing');

  RETURN v_pending_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get pipeline progress percentage
CREATE OR REPLACE FUNCTION get_pipeline_progress(p_video_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total_steps INTEGER;
  v_completed_steps INTEGER;
  v_current_step_progress INTEGER;
BEGIN
  -- Get total steps
  SELECT COUNT(*) INTO v_total_steps
  FROM processing_pipeline
  WHERE video_id = p_video_id;

  IF v_total_steps = 0 THEN
    RETURN 0;
  END IF;

  -- Get completed steps
  SELECT COUNT(*) INTO v_completed_steps
  FROM processing_pipeline
  WHERE video_id = p_video_id
    AND status = 'completed';

  -- Get current step progress
  SELECT COALESCE(MAX(progress), 0) INTO v_current_step_progress
  FROM processing_pipeline
  WHERE video_id = p_video_id
    AND status = 'processing';

  -- Calculate overall progress
  -- Formula: (completed_steps / total_steps * 100) + (current_step_progress / total_steps)
  RETURN LEAST(100,
    (v_completed_steps * 100 / v_total_steps) +
    (v_current_step_progress / v_total_steps)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE processing_pipeline IS 'Multi-step video processing pipeline (watermark removal → quality enhancement)';
COMMENT ON FUNCTION get_next_pipeline_step IS 'Get the next pending step in the processing pipeline';
COMMENT ON FUNCTION is_pipeline_completed IS 'Check if all pipeline steps are completed';
COMMENT ON FUNCTION get_pipeline_progress IS 'Calculate overall pipeline progress percentage';
