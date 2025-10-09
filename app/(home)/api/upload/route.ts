/**
 * Upload API Route
 *
 * POST /api/upload
 * Generates a signed upload URL for Supabase Storage
 *
 * IMPORTANT:
 * - Requires authentication
 * - Validates file size and type
 * - Creates database record
 * - Returns upload URL for client
 */

import { NextRequest } from 'next/server'
import { z, ZodError } from 'zod'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServerClient } from '@/lib/supabase/server'
import {
  uploadUrlRequestSchema,
  sanitizeFilename,
  validateMimeTypeMatchesExtension,
} from '@/lib/validations/video'
import { calculateCreditsRequired, validateVideoConstraints } from '@/lib/video/cost'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await requireAuth()

    // 2. Parse and validate request body
    const body = await request.json()
    const validated = uploadUrlRequestSchema.parse(body)

    // 3. Validate MIME type matches file extension
    const mimeValidation = validateMimeTypeMatchesExtension(
      validated.contentType,
      validated.filename
    )
    if (!mimeValidation.valid) {
      return errorResponse(mimeValidation.reason!, 400)
    }

    // 4. Sanitize filename
    const sanitized = sanitizeFilename(validated.filename)
    const timestamp = Date.now()
    const storageFilename = `${user.id}/${timestamp}-${sanitized}`

    // 5. Generate signed upload URL
    const supabase = await createServerClient()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .createSignedUploadUrl(storageFilename)

    if (uploadError || !uploadData) {
      console.error('Failed to create signed upload URL:', uploadError)
      return errorResponse('Failed to generate upload URL', 500)
    }

    // 6. Return upload URL and storage path
    return successResponse({
      uploadUrl: uploadData.signedUrl,
      storagePath: uploadData.path,
      token: uploadData.token,
      expiresIn: 3600, // 1 hour
    })
  } catch (error) {
    console.error('Upload API error:', error)

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return errorResponse('Invalid request data', 400, error.issues)
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    // Generic error
    return errorResponse('Internal server error', 500)
  }
}
