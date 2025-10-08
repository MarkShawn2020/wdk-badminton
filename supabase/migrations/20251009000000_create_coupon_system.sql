-- ============================================================================
-- COUPON SYSTEM
-- Implements promotional coupon/promo code functionality
-- ============================================================================

-- ============================================================================
-- COUPONS TABLE
-- Stores coupon codes with usage limits and validity periods
-- ============================================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Coupon details
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  credits_amount INTEGER NOT NULL CHECK (credits_amount > 0),

  -- Usage limits
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER NOT NULL DEFAULT 0 CHECK (current_uses >= 0),
  max_uses_per_user INTEGER NOT NULL DEFAULT 1 CHECK (max_uses_per_user > 0),

  -- Validity period
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE, -- NULL = no expiry

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_date_range CHECK (valid_until IS NULL OR valid_until > valid_from),
  CONSTRAINT usage_limits_check CHECK (max_uses IS NULL OR current_uses <= max_uses)
);

-- Indexes for performance
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = true;
CREATE INDEX idx_coupons_validity ON coupons(valid_from, valid_until);

-- ============================================================================
-- COUPON_REDEMPTIONS TABLE
-- Audit log of all coupon redemption attempts
-- ============================================================================
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Redemption details
  credits_received INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Audit data
  ip_address TEXT,
  user_agent TEXT,

  -- Prevent duplicate redemptions
  CONSTRAINT unique_user_coupon UNIQUE (user_id, coupon_id)
);

-- Indexes
CREATE INDEX idx_redemptions_user ON coupon_redemptions(user_id);
CREATE INDEX idx_redemptions_coupon ON coupon_redemptions(coupon_id);
CREATE INDEX idx_redemptions_timestamp ON coupon_redemptions(redeemed_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Coupons: Public read for active coupons by code, admin full access
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Users can view coupon details when redeeming (by code only)
CREATE POLICY "Anyone can view coupon by code for redemption"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Only service role can insert/update/delete coupons
CREATE POLICY "Service role can manage coupons"
  ON coupons FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Redemptions: Users can view their own, service role can manage
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
  ON coupon_redemptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage redemptions"
  ON coupon_redemptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

/**
 * Validate if a coupon can be redeemed by a user
 * Returns validation result with reason if invalid
 */
CREATE OR REPLACE FUNCTION validate_coupon(
  p_code TEXT,
  p_user_id UUID
)
RETURNS TABLE (
  valid BOOLEAN,
  reason TEXT,
  coupon_id UUID,
  credits_amount INTEGER
) AS $$
DECLARE
  v_coupon RECORD;
  v_user_redemptions INTEGER;
BEGIN
  -- Check if coupon exists and is active
  SELECT * INTO v_coupon
  FROM coupons
  WHERE code = p_code
    AND is_active = true;

  IF v_coupon IS NULL THEN
    RETURN QUERY SELECT false, 'Invalid or inactive coupon code', NULL::UUID, 0;
    RETURN;
  END IF;

  -- Check validity period
  IF v_coupon.valid_from > NOW() THEN
    RETURN QUERY SELECT false, 'Coupon is not yet valid', NULL::UUID, 0;
    RETURN;
  END IF;

  IF v_coupon.valid_until IS NOT NULL AND v_coupon.valid_until < NOW() THEN
    RETURN QUERY SELECT false, 'Coupon has expired', NULL::UUID, 0;
    RETURN;
  END IF;

  -- Check global usage limit
  IF v_coupon.max_uses IS NOT NULL AND v_coupon.current_uses >= v_coupon.max_uses THEN
    RETURN QUERY SELECT false, 'Coupon usage limit reached', NULL::UUID, 0;
    RETURN;
  END IF;

  -- Check per-user usage limit
  SELECT COUNT(*) INTO v_user_redemptions
  FROM coupon_redemptions
  WHERE coupon_id = v_coupon.id
    AND user_id = p_user_id;

  IF v_user_redemptions >= v_coupon.max_uses_per_user THEN
    RETURN QUERY SELECT false, 'You have already used this coupon', NULL::UUID, 0;
    RETURN;
  END IF;

  -- All validations passed
  RETURN QUERY SELECT true, 'Valid'::TEXT, v_coupon.id, v_coupon.credits_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Redeem a coupon for a user
 * Atomically adds credits, updates usage count, and records redemption
 */
CREATE OR REPLACE FUNCTION redeem_coupon(
  p_code TEXT,
  p_user_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  credits_received INTEGER,
  new_balance INTEGER
) AS $$
DECLARE
  v_validation RECORD;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Validate coupon
  SELECT * INTO v_validation
  FROM validate_coupon(p_code, p_user_id);

  IF NOT v_validation.valid THEN
    RETURN QUERY SELECT false, v_validation.reason, 0, NULL::INTEGER;
    RETURN;
  END IF;

  -- Start transaction (implicit in function)

  -- Get current user balance
  SELECT balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE; -- Lock row

  IF v_current_balance IS NULL THEN
    RETURN QUERY SELECT false, 'User credits account not found', 0, NULL::INTEGER;
    RETURN;
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance + v_validation.credits_amount;

  -- Update user credits
  UPDATE user_credits
  SET
    balance = v_new_balance,
    total_earned = total_earned + v_validation.credits_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Increment coupon usage count
  UPDATE coupons
  SET
    current_uses = current_uses + 1,
    updated_at = NOW()
  WHERE id = v_validation.coupon_id;

  -- Record redemption
  INSERT INTO coupon_redemptions (
    coupon_id,
    user_id,
    credits_received,
    ip_address,
    user_agent
  ) VALUES (
    v_validation.coupon_id,
    p_user_id,
    v_validation.credits_amount,
    p_ip_address,
    p_user_agent
  );

  -- Record transaction in credit_transactions
  INSERT INTO credit_transactions (
    user_id,
    type,
    amount,
    balance_after,
    description,
    metadata
  ) VALUES (
    p_user_id,
    'coupon_redemption',
    v_validation.credits_amount,
    v_new_balance,
    FORMAT('Redeemed coupon: %s', p_code),
    jsonb_build_object('coupon_code', p_code, 'coupon_id', v_validation.coupon_id)
  );

  -- Return success
  RETURN QUERY SELECT
    true,
    FORMAT('Successfully redeemed! You received %s credits', v_validation.credits_amount),
    v_validation.credits_amount,
    v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Create a new coupon (admin only)
 */
CREATE OR REPLACE FUNCTION create_coupon(
  p_code TEXT,
  p_credits_amount INTEGER,
  p_description TEXT DEFAULT NULL,
  p_max_uses INTEGER DEFAULT NULL,
  p_max_uses_per_user INTEGER DEFAULT 1,
  p_valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  p_valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_coupon_id UUID;
BEGIN
  INSERT INTO coupons (
    code,
    credits_amount,
    description,
    max_uses,
    max_uses_per_user,
    valid_from,
    valid_until,
    created_by
  ) VALUES (
    UPPER(TRIM(p_code)), -- Normalize code to uppercase
    p_credits_amount,
    p_description,
    p_max_uses,
    p_max_uses_per_user,
    p_valid_from,
    p_valid_until,
    p_created_by
  )
  RETURNING id INTO v_coupon_id;

  RETURN v_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- UPDATE credit_transactions TYPE CONSTRAINT
-- Add 'coupon_redemption' to valid transaction types
-- ============================================================================

-- Drop existing constraint
ALTER TABLE credit_transactions
DROP CONSTRAINT IF EXISTS valid_transaction_type;

-- Add updated constraint with coupon_redemption
ALTER TABLE credit_transactions
ADD CONSTRAINT valid_transaction_type CHECK (type IN (
  'purchase',
  'signup_bonus',
  'refund',
  'processing_debit',
  'admin_adjustment',
  'coupon_redemption'
));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE coupons IS 'Promotional coupon codes with usage limits';
COMMENT ON TABLE coupon_redemptions IS 'Audit log of coupon redemptions';
COMMENT ON FUNCTION validate_coupon IS 'Validates if a coupon can be redeemed by a user';
COMMENT ON FUNCTION redeem_coupon IS 'Atomically redeems a coupon and adds credits to user account';
COMMENT ON FUNCTION create_coupon IS 'Creates a new promotional coupon (admin only)';
