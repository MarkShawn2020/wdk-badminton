/**
 * Setup Storage Buckets
 *
 * Run this script to ensure storage buckets exist
 * Usage:
 *   node --env-file=.env.local -r esbuild-register scripts/setup-storage.ts
 * Or:
 *   pnpm tsx --env-file=.env.local scripts/setup-storage.ts
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

async function setupStorage() {
  console.log('🔧 Setting up storage buckets...')

  // Check if 'videos' bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Failed to list buckets:', listError)
    process.exit(1)
  }

  const videosBucket = buckets.find((b) => b.id === 'videos')

  if (videosBucket) {
    console.log('✅ Bucket "videos" already exists')
    console.log('   Public:', videosBucket.public)
    console.log('   File size limit:', videosBucket.file_size_limit, 'bytes')
    console.log('   Allowed MIME types:', videosBucket.allowed_mime_types)
  } else {
    console.log('📦 Creating "videos" bucket...')

    const { data, error: createError } = await supabase.storage.createBucket('videos', {
      public: false,
      fileSizeLimit: 536870912, // 500MB
      allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'],
    })

    if (createError) {
      console.error('❌ Failed to create bucket:', createError)
      process.exit(1)
    }

    console.log('✅ Bucket "videos" created successfully')
    console.log('   Name:', data.name)
  }

  // List all buckets for verification
  const { data: allBuckets } = await supabase.storage.listBuckets()
  console.log('\n📋 All buckets:')
  allBuckets?.forEach((bucket) => {
    console.log(`   - ${bucket.id} (public: ${bucket.public})`)
  })

  console.log('\n✨ Storage setup complete!')
}

setupStorage().catch(console.error)
