-- ============================================================================
-- TIER AUTO-UPGRADE SYSTEM
-- ============================================================================
-- This migration updates the add_credits function to automatically upgrade
-- user tiers based on their total purchased credits.
--
-- Tier rules (permanent, non-subscription):
-- - free: 0 credits purchased (signup bonus only)
-- - paid: 1+ credits purchased (any purchase)
-- - pro: 5000+ credits purchased ($50+)
--
-- Tiers only affect rate limits (videos per day), NOT functionality
-- ============================================================================

-- Update add_credits function to include tier auto-upgrade
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
  v_new_total_earned INTEGER;
  v_new_tier TEXT;
BEGIN
  -- Get current state with row lock
  SELECT balance, total_earned INTO v_current_balance, v_new_total_earned
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;

  -- Calculate new values
  v_new_balance := v_current_balance + p_amount;
  v_new_total_earned := v_new_total_earned + p_amount;

  -- Determine tier based on total earned credits
  -- Note: We exclude the initial FREE_SIGNUP_CREDITS (100) from tier calculation
  -- So only PURCHASED credits count toward tier upgrades
  IF v_new_total_earned >= 5100 THEN  -- 5000 purchased + 100 signup bonus
    v_new_tier := 'pro';
  ELSIF v_new_total_earned > 100 THEN  -- Any purchase beyond signup bonus
    v_new_tier := 'paid';
  ELSE
    v_new_tier := 'free';
  END IF;

  -- Update user credits and tier
  UPDATE user_credits
  SET
    balance = v_new_balance,
    total_earned = v_new_total_earned,
    tier = v_new_tier,
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
    description,
    metadata
  ) VALUES (
    p_user_id,
    'purchase',
    p_amount,
    v_new_balance,
    p_stripe_payment_id,
    p_stripe_session_id,
    FORMAT('Purchased %s credits', p_amount),
    jsonb_build_object(
      'tier_after_purchase', v_new_tier,
      'total_earned', v_new_total_earned
    )
  );

  -- Log tier upgrade if applicable
  IF v_new_tier != 'free' THEN
    RAISE NOTICE 'User % upgraded to tier: %', p_user_id, v_new_tier;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION add_credits IS 'Adds credits after Stripe payment and auto-upgrades tier based on total purchases';
