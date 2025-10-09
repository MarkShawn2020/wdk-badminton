/**
 * API Route: Share Video to Discover
 *
 * POST /api/showcase/share
 * Allows users to share their processed videos to the community showcase
 */

import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const shareSchema = z.object({
  videoId: z.string().uuid(),
  showcaseTitle: z.string().max(100).optional(),
  showcaseDescription: z.string().max(500).optional(),
  showUsername: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate input
    const body = await request.json()
    const validated = shareSchema.parse(body)

    // 3. Verify video ownership
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', validated.videoId)
      .eq('user_id', user.id)
      .single()

    if (videoError || !video) {
      return Response.json({ error: 'Video not found or access denied' }, { status: 404 })
    }

    // 4. Check if video is completed
    if (video.status !== 'completed' || !video.processed_url) {
      return Response.json({ error: 'Video processing not completed' }, { status: 400 })
    }

    // 5. Check if already shared
    const { data: existing } = await supabase
      .from('video_showcase')
      .select('id')
      .eq('video_id', validated.videoId)
      .single()

    if (existing) {
      return Response.json({ error: 'Video already shared to Discover' }, { status: 409 })
    }

    // 6. Extract features used from video metadata
    const featuresUsed: string[] = []
    if (video.remove_watermark) featuresUsed.push('watermark_removal')
    if (video.enhance_quality) featuresUsed.push('quality_enhance')
    if (video.target_resolution) featuresUsed.push('resolution_upscale')
    if (video.target_aspect_ratio) featuresUsed.push('aspect_ratio_change')

    // 7. Create showcase entry
    const { data: showcase, error: showcaseError } = await supabase
      .from('video_showcase')
      .insert({
        video_id: validated.videoId,
        user_id: user.id,
        showcase_title: validated.showcaseTitle,
        showcase_description: validated.showcaseDescription,
        show_username: validated.showUsername,
        before_url: video.original_url,
        after_url: video.processed_url,
        features_used: featuresUsed,
        target_platform: video.target_aspect_ratio // Infer platform from aspect ratio
          ? video.target_aspect_ratio === '9:16'
            ? 'tiktok'
            : video.target_aspect_ratio === '1:1'
              ? 'instagram'
              : 'youtube'
          : undefined,
        is_public: true,
        approved: false, // Requires manual approval
        reward_claimed: false,
        reward_amount: 10,
      })
      .select()
      .single()

    if (showcaseError) {
      console.error('Failed to create showcase:', showcaseError)
      return Response.json({ error: 'Failed to share video' }, { status: 500 })
    }

    // 8. Award credits (will be claimed after approval)
    // Credits are tracked in showcase entry, awarded when approved

    return Response.json({
      success: true,
      data: {
        showcaseId: showcase.id,
        message: 'Video submitted for review. You will receive 10 credits once approved!',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }

    console.error('Share to showcase error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
