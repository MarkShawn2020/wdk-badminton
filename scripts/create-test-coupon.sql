-- ============================================================================
-- Create Test Coupons for Development
-- ============================================================================
-- Run this in Supabase SQL Editor to create test coupons

-- 1. Welcome bonus (unlimited uses, each user can use once)
SELECT create_coupon(
  'WELCOME1000',
  1000,
  'Welcome bonus for new users',
  NULL,  -- unlimited total uses
  1,     -- each user can use once
  NOW(),
  NOW() + INTERVAL '365 days'
);

-- 2. Limited time offer (100 total uses)
SELECT create_coupon(
  'NEWYEAR2025',
  500,
  'New Year 2025 promotion',
  100,   -- only 100 people can use
  1,
  NOW(),
  '2025-12-31 23:59:59+00'
);

-- 3. Partner code (50 uses)
SELECT create_coupon(
  'PARTNER-ABC',
  250,
  'Partner promotion code',
  50,
  1,
  NOW(),
  NOW() + INTERVAL '90 days'
);

-- 4. VIP code (each user can use 3 times)
SELECT create_coupon(
  'VIP-REWARDS',
  200,
  'VIP user rewards',
  NULL,
  3,     -- each user can use 3 times
  NOW(),
  NULL   -- never expires
);

-- 5. Test code for development (unlimited everything)
SELECT create_coupon(
  'TEST-DEV',
  100,
  'Development test code',
  NULL,
  999,   -- each user can use many times
  NOW(),
  NULL
);

-- Verify coupons were created
SELECT
  code,
  credits_amount,
  max_uses,
  max_uses_per_user,
  valid_until,
  is_active
FROM coupons
ORDER BY created_at DESC;
