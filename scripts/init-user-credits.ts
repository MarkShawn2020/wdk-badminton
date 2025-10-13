/**
 * Initialize User Credits
 *
 * Creates user_credits records for existing users who don't have one
 * Run this script after deploying the user_credits migration
 *
 * Usage:
 *   pnpm tsx --env-file=.env.local scripts/init-user-credits.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function initUserCredits() {
  console.log('🔧 Initializing user credits...\n')

  // 1. Get all users
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError) {
    console.error('❌ Failed to list users:', usersError)
    process.exit(1)
  }

  console.log(`📋 Found ${users.users.length} users\n`)

  // 2. Get existing user_credits records
  const { data: existingCredits, error: creditsError } = await supabase
    .from('user_credits')
    .select('user_id')

  if (creditsError) {
    console.error('❌ Failed to query user_credits:', creditsError)
    process.exit(1)
  }

  const existingUserIds = new Set(existingCredits?.map((c) => c.user_id) || [])
  console.log(`📊 ${existingUserIds.size} users already have credits\n`)

  // 3. Create credits for users who don't have them
  const usersNeedingCredits = users.users.filter((u) => !existingUserIds.has(u.id))

  if (usersNeedingCredits.length === 0) {
    console.log('✅ All users already have credits!')
    return
  }

  console.log(`🔄 Creating credits for ${usersNeedingCredits.length} users...\n`)

  for (const user of usersNeedingCredits) {
    try {
      // Insert user_credits record
      const { error: insertError } = await supabase.from('user_credits').insert({
        user_id: user.id,
        balance: 15,
        total_earned: 15,
        tier: 'free',
      })

      if (insertError) {
        console.error(`❌ Failed to create credits for user ${user.email}:`, insertError)
        continue
      }

      // Insert signup bonus transaction
      const { error: txError } = await supabase.from('credit_transactions').insert({
        user_id: user.id,
        type: 'signup_bonus',
        amount: 15,
        balance_after: 15,
        description: 'Welcome bonus - 15 free credits (enough for 5s Full Bundle video)',
      })

      if (txError) {
        console.error(`❌ Failed to create transaction for user ${user.email}:`, txError)
        continue
      }

      console.log(`✅ Created credits for ${user.email}`)
    } catch (error) {
      console.error(`❌ Error processing user ${user.email}:`, error)
    }
  }

  console.log('\n✨ User credits initialization complete!')
}

initUserCredits().catch(console.error)
