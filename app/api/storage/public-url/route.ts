/**
 * Storage Public URL API Route
 *
 * POST /api/storage/public-url
 * Returns the public URL for an uploaded file in Supabase Storage
 *
 * This endpoint provides two URL types:
 * 1. Public URL (permanent, if bucket is public)
 * 2. Signed URL (temporary, with expiration)
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServerClient } from '@/lib/supabase/server'

const publicUrlRequestSchema = z.object({
  storagePath: z.string().min(1, 'Storage path is required'),
  expiresIn: z.number().optional().default(3600), // 1 hour default for signed URLs
})

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await requireAuth()

    // 2. Parse and validate request
    const body = await request.json()
    const validated = publicUrlRequestSchema.parse(body)

    // 3. Verify the file belongs to the user (security check)
    if (!validated.storagePath.startsWith(`${user.id}/`)) {
      return errorResponse('Access denied: File does not belong to user', 403)
    }

    // 4. Get Supabase client
    const supabase = await createServerClient()

    // 5. Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(validated.storagePath)

    // 6. Generate signed URL (temporary, more secure)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('videos')
      .createSignedUrl(validated.storagePath, validated.expiresIn)

    if (signedUrlError) {
      console.error('Failed to create signed URL:', signedUrlError)
    }

    // 7. Return both URLs
    return successResponse({
      publicUrl: publicUrlData.publicUrl,
      signedUrl: signedUrlData?.signedUrl || null,
      storagePath: validated.storagePath,
      expiresIn: validated.expiresIn,
      expiresAt: signedUrlData?.signedUrl
        ? new Date(Date.now() + validated.expiresIn * 1000).toISOString()
        : null,
    })
  } catch (error) {
    console.error('Public URL API error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid request data', 400, error.issues)
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    // Generic error
    return errorResponse('Failed to generate public URL', 500)
  }
}
