-- ============================================================================
-- VIDEOS TABLE
-- Stores video records with processing status and options
-- ============================================================================
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Original video metadata
  original_filename TEXT NOT NULL,
  original_url TEXT,
  original_storage_path TEXT,
  duration_seconds NUMERIC(10,2) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  video_hash TEXT, -- For caching identical videos

  -- Processing options
  remove_watermark BOOLEAN DEFAULT false,
  target_resolution TEXT, -- '1080p', '1440p', '4K'
  target_aspect_ratio TEXT, -- '16:9', '9:16', '1:1', '4:5'
  enhance_quality BOOLEAN DEFAULT false,

  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  error_message TEXT,

  -- Processed video
  processed_url TEXT,
  processed_storage_path TEXT,

  -- Cost tracking (CRITICAL for business)
  estimated_cost_credits INTEGER NOT NULL,
  actual_cost_credits INTEGER,
  api_cost_usd NUMERIC(10,4),

  -- External API tracking
  external_job_id TEXT, -- WaveSpeed/API job ID for tracking
  external_provider TEXT, -- 'wavespeed', 'replicate', etc.

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_processing_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'uploading', 'processing', 'completed', 'failed', 'cancelled')),
  CONSTRAINT valid_resolution CHECK (target_resolution IN ('1080p', '1440p', '4K') OR target_resolution IS NULL),
  CONSTRAINT valid_aspect_ratio CHECK (target_aspect_ratio IN ('16:9', '9:16', '1:1', '4:5') OR target_aspect_ratio IS NULL),
  CONSTRAINT valid_duration CHECK (duration_seconds > 0 AND duration_seconds <= 120), -- Max 2 minutes
  CONSTRAINT valid_file_size CHECK (file_size_bytes > 0 AND file_size_bytes <= 536870912) -- Max 500MB
);

-- Indexes for performance
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_video_hash ON videos(video_hash) WHERE video_hash IS NOT NULL;

-- Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own videos"
  ON videos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos"
  ON videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos"
  ON videos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- USER_CREDITS TABLE
-- Tracks credit balance for each user
-- ============================================================================
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_earned INTEGER NOT NULL DEFAULT 0 CHECK (total_earned >= 0),
  total_spent INTEGER NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'paid', 'pro'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_tier CHECK (tier IN ('free', 'paid', 'pro'))
);

-- Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert/update credits (via RPC functions)
CREATE POLICY "Service role can manage credits"
  ON user_credits FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- CREDIT_TRANSACTIONS TABLE
-- Audit log for all credit movements
-- ============================================================================
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,

  type TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Positive for credit, negative for debit
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),

  -- Payment tracking
  stripe_payment_id TEXT,
  stripe_session_id TEXT,

  description TEXT,
  metadata JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_transaction_type CHECK (type IN (
    'purchase',           -- User bought credits
    'signup_bonus',       -- Free credits on signup
    'refund',            -- Refund for failed processing
    'processing_debit',   -- Credits deducted for processing
    'admin_adjustment'    -- Manual admin adjustment
  ))
);

-- Indexes
CREATE INDEX idx_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_transactions_video_id ON credit_transactions(video_id) WHERE video_id IS NOT NULL;
CREATE INDEX idx_transactions_stripe_payment_id ON credit_transactions(stripe_payment_id) WHERE stripe_payment_id IS NOT NULL;

-- Row Level Security
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert transactions
CREATE POLICY "Service role can insert transactions"
  ON credit_transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to initialize user credits on signup
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, balance, total_earned, tier)
  VALUES (NEW.id, 100, 100, 'free'); -- 100 free credits on signup ($1 worth)

  -- Record signup bonus transaction
  INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'signup_bonus', 100, 100, 'Welcome bonus - 100 free credits');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create credits on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_credits();

-- Function to deduct credits (called before processing)
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_video_id UUID,
  p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if user exists
  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;

  -- Check sufficient balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits: have %, need %', v_current_balance, p_amount;
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount;

  -- Update user credits
  UPDATE user_credits
  SET
    balance = v_new_balance,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    video_id,
    type,
    amount,
    balance_after,
    description
  ) VALUES (
    p_user_id,
    p_video_id,
    'processing_debit',
    -p_amount,
    v_new_balance,
    'Credits deducted for video processing'
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refund credits (called on processing failure)
CREATE OR REPLACE FUNCTION refund_credits(
  p_user_id UUID,
  p_video_id UUID,
  p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance + p_amount;

  -- Update user credits
  UPDATE user_credits
  SET
    balance = v_new_balance,
    total_spent = total_spent - p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    video_id,
    type,
    amount,
    balance_after,
    description
  ) VALUES (
    p_user_id,
    p_video_id,
    'refund',
    p_amount,
    v_new_balance,
    'Credits refunded due to processing failure'
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (called after Stripe payment)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_stripe_payment_id TEXT DEFAULT NULL,
  p_stripe_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance + p_amount;

  -- Update user credits
  UPDATE user_credits
  SET
    balance = v_new_balance,
    total_earned = total_earned + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    type,
    amount,
    balance_after,
    stripe_payment_id,
    stripe_session_id,
    description
  ) VALUES (
    p_user_id,
    'purchase',
    p_amount,
    v_new_balance,
    p_stripe_payment_id,
    p_stripe_session_id,
    FORMAT('Purchased %s credits', p_amount)
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update video progress (for real-time updates)
CREATE OR REPLACE FUNCTION update_video_progress(
  p_video_id UUID,
  p_status TEXT,
  p_progress INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE videos
  SET
    status = p_status,
    progress = COALESCE(p_progress, progress),
    started_processing_at = CASE
      WHEN p_status = 'processing' AND started_processing_at IS NULL
      THEN NOW()
      ELSE started_processing_at
    END,
    completed_at = CASE
      WHEN p_status IN ('completed', 'failed', 'cancelled')
      THEN NOW()
      ELSE completed_at
    END
  WHERE id = p_video_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE videos IS 'Stores video processing jobs with status tracking';
COMMENT ON TABLE user_credits IS 'Tracks credit balance for each user';
COMMENT ON TABLE credit_transactions IS 'Audit log of all credit movements';
COMMENT ON FUNCTION deduct_credits IS 'Deducts credits from user account before processing';
COMMENT ON FUNCTION refund_credits IS 'Refunds credits to user on processing failure';
COMMENT ON FUNCTION add_credits IS 'Adds credits after Stripe payment';
COMMENT ON FUNCTION update_video_progress IS 'Updates video processing status and progress';
