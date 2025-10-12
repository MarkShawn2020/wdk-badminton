/**
 * Test RPC Functions
 *
 * Tests deduct_credits and refund_credits RPC functions
 *
 * Usage:
 *   node --env-file=.env.local scripts/test-rpc.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testRPC() {
  console.log('🔧 Testing RPC functions...\n')

  // 1. Get a test user
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError || !users.users.length) {
    console.error('❌ No users found')
    process.exit(1)
  }

  const testUser = users.users[0]
  console.log(`📋 Test user: ${testUser.email} (${testUser.id})\n`)

  // 2. Check current credits
  const { data: credits, error: creditsError } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', testUser.id)
    .single()

  if (creditsError) {
    console.error('❌ Failed to get credits:', creditsError)
    process.exit(1)
  }

  console.log(`💰 Current balance: ${credits.balance} credits\n`)

  // 3. Create a test video record first
  const testVideoId = crypto.randomUUID()
  console.log(`📹 Creating test video: ${testVideoId}\n`)

  const { error: videoError } = await supabase.from('videos').insert({
    id: testVideoId,
    user_id: testUser.id,
    original_filename: 'test.mp4',
    duration_seconds: 10,
    file_size_bytes: 1024 * 1024,
    mime_type: 'video/mp4',
    status: 'pending',
    estimated_cost_credits: 10,
  })

  if (videoError) {
    console.error('❌ Failed to create test video:', videoError)
    process.exit(1)
  }

  // 4. Test deduct_credits
  console.log('🔄 Testing deduct_credits (10 credits)...')

  const { data: deductResult, error: deductError } = await supabase.rpc('deduct_credits', {
    p_user_id: testUser.id,
    p_video_id: testVideoId,
    p_amount: 10,
  })

  if (deductError) {
    console.error('❌ Deduct failed:', deductError)
    console.error('   Message:', deductError.message)
    console.error('   Details:', deductError.details)
    console.error('   Hint:', deductError.hint)
  } else {
    console.log('✅ Deduct succeeded:', deductResult)
  }

  // 5. Check new balance
  const { data: newCredits } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', testUser.id)
    .single()

  console.log(`💰 New balance: ${newCredits?.balance} credits\n`)

  // 6. Test refund_credits
  console.log('🔄 Testing refund_credits (10 credits)...')

  const { data: refundResult, error: refundError } = await supabase.rpc('refund_credits', {
    p_user_id: testUser.id,
    p_video_id: testVideoId,
    p_amount: 10,
  })

  if (refundError) {
    console.error('❌ Refund failed:', refundError)
  } else {
    console.log('✅ Refund succeeded:', refundResult)
  }

  // 7. Final balance check
  const { data: finalCredits } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', testUser.id)
    .single()

  console.log(`💰 Final balance: ${finalCredits?.balance} credits\n`)

  // 8. Cleanup test video
  await supabase.from('videos').delete().eq('id', testVideoId)
  console.log('🗑️  Cleaned up test video\n')

  console.log('✨ RPC test complete!')
}

testRPC().catch(console.error)
