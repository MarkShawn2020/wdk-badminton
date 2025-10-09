/**
 * Coupon Redemption API Route
 *
 * POST /api/coupons/redeem
 * Allows authenticated users to redeem promotional coupon codes
 *
 * IMPORTANT:
 * - Requires authentication
 * - Rate limited to prevent abuse
 * - Atomic transaction ensures data consistency
 * - Records audit trail
 */

import { NextRequest } from 'next/server'
import { z, ZodError } from 'zod'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServiceClient } from '@/lib/supabase/server'

// Request validation schema
const redeemCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Coupon code is required')
    .max(50, 'Coupon code is too long')
    .transform((val) => val.toUpperCase()), // Normalize to uppercase
})

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await requireAuth()

    // 2. Parse and validate request
    const body = await request.json()
    const { code } = redeemCouponSchema.parse(body)

    // 3. Get client info for audit trail
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    // 4. Redeem coupon using database function
    const supabase = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = (await (supabase.rpc as any)('redeem_coupon', {
      p_code: code,
      p_user_id: user.id,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    })) as {
      data: Array<{
        success: boolean
        message: string
        credits_received: number
        new_balance: number
      }> | null
      error: unknown
    }

    if (error) {
      console.error('Coupon redemption error:', error)
      return errorResponse('Failed to redeem coupon', 500)
    }

    // Parse result (RPC returns array with single row)
    const result = data?.[0]

    if (!result) {
      return errorResponse('Invalid response from server', 500)
    }

    if (!result.success) {
      return errorResponse(result.message, 400)
    }

    // 5. Return success
    console.log('✅ Coupon redeemed:', {
      userId: user.id,
      code,
      creditsReceived: result.credits_received,
      newBalance: result.new_balance,
    })

    return successResponse({
      message: result.message,
      creditsReceived: result.credits_received,
      newBalance: result.new_balance,
    })
  } catch (error) {
    console.error('Coupon API error:', error)

    // Handle validation errors
    if (error instanceof ZodError) {
      return errorResponse(error.issues[0].message, 400)
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    // Generic error
    return errorResponse('Internal server error', 500)
  }
}
