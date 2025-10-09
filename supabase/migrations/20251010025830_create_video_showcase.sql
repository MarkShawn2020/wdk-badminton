/**
 * Video Showcase System
 * 
 * Allows users to share their processed videos to the community
 * Features:
 * - Public video gallery
 * - Before/After comparison
 * - Credit rewards for sharing
 * - Featured content curation
 */

-- Video Showcase Table
CREATE TABLE IF NOT EXISTS video_showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Public status
  is_public BOOLEAN DEFAULT true,
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  
  -- Display information
  showcase_title TEXT,
  showcase_description TEXT,
  original_prompt TEXT, -- AI generation prompt if available
  
  -- Video URLs (cached for performance)
  before_url TEXT, -- Original video with watermark
  after_url TEXT,  -- Processed video
  thumbnail_url TEXT,
  
  -- Features used (stored as JSONB array)
  features_used JSONB DEFAULT '[]'::jsonb,
  -- Example: ["watermark_removal", "quality_enhance", "custom_watermark"]
  
  -- Target platform
  target_platform TEXT, -- instagram, tiktok, youtube, linkedin, etc.
  
  -- User preferences
  show_username BOOLEAN DEFAULT false,
  social_url TEXT, -- User's social media link
  
  -- Statistics
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Moderation
  reported BOOLEAN DEFAULT false,
  report_count INTEGER DEFAULT 0,
  
  -- Credit reward tracking
  reward_claimed BOOLEAN DEFAULT false,
  reward_amount INTEGER DEFAULT 10,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(video_id), -- One showcase entry per video
  CHECK (reward_amount >= 0),
  CHECK (view_count >= 0),
  CHECK (like_count >= 0),
  CHECK (share_count >= 0)
);

-- Indexes for performance
CREATE INDEX idx_showcase_public ON video_showcase(is_public, approved) WHERE is_public = true AND approved = true;
CREATE INDEX idx_showcase_featured ON video_showcase(featured, created_at DESC) WHERE featured = true;
CREATE INDEX idx_showcase_user ON video_showcase(user_id, created_at DESC);
CREATE INDEX idx_showcase_platform ON video_showcase(target_platform) WHERE target_platform IS NOT NULL;
CREATE INDEX idx_showcase_created ON video_showcase(created_at DESC);

-- User Likes Table (for tracking who liked what)
CREATE TABLE IF NOT EXISTS video_showcase_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL REFERENCES video_showcase(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(showcase_id, user_id) -- One like per user per video
);

CREATE INDEX idx_showcase_likes_user ON video_showcase_likes(user_id, created_at DESC);
CREATE INDEX idx_showcase_likes_showcase ON video_showcase_likes(showcase_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_showcase_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_showcase_updated_at
  BEFORE UPDATE ON video_showcase
  FOR EACH ROW
  EXECUTE FUNCTION update_showcase_updated_at();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_showcase_views(showcase_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE video_showcase
  SET view_count = view_count + 1
  WHERE id = showcase_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle like
CREATE OR REPLACE FUNCTION toggle_showcase_like(showcase_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM video_showcase_likes
    WHERE showcase_id = showcase_uuid AND user_id = user_uuid
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Unlike
    DELETE FROM video_showcase_likes
    WHERE showcase_id = showcase_uuid AND user_id = user_uuid;
    
    UPDATE video_showcase
    SET like_count = like_count - 1
    WHERE id = showcase_uuid;
    
    RETURN false;
  ELSE
    -- Like
    INSERT INTO video_showcase_likes (showcase_id, user_id)
    VALUES (showcase_uuid, user_uuid)
    ON CONFLICT (showcase_id, user_id) DO NOTHING;
    
    UPDATE video_showcase
    SET like_count = like_count + 1
    WHERE id = showcase_uuid;
    
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security (RLS)
ALTER TABLE video_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_showcase_likes ENABLE ROW LEVEL SECURITY;

-- Policies for video_showcase

-- Anyone can view approved public showcases
CREATE POLICY "Public showcases are viewable by everyone"
  ON video_showcase FOR SELECT
  USING (is_public = true AND approved = true);

-- Users can view their own showcases
CREATE POLICY "Users can view own showcases"
  ON video_showcase FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create showcases for their own videos
CREATE POLICY "Users can create own showcases"
  ON video_showcase FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own showcases
CREATE POLICY "Users can update own showcases"
  ON video_showcase FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own showcases
CREATE POLICY "Users can delete own showcases"
  ON video_showcase FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for video_showcase_likes

-- Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON video_showcase_likes FOR SELECT
  USING (true);

-- Users can create their own likes
CREATE POLICY "Users can create own likes"
  ON video_showcase_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON video_showcase_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments

COMMENT ON TABLE video_showcase IS 'User-shared videos for community showcase';
COMMENT ON TABLE video_showcase_likes IS 'User likes on showcase videos';
COMMENT ON COLUMN video_showcase.features_used IS 'Array of features used: ["watermark_removal", "quality_enhance", etc.]';
COMMENT ON COLUMN video_showcase.reward_claimed IS 'Whether user has received credits for sharing';
