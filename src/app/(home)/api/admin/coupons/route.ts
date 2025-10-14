/**
 * Admin Coupon Management API
 *
 * GET /api/admin/coupons - List all coupons
 * POST /api/admin/coupons - Create new coupon
 *
 * IMPORTANT: This endpoint requires admin authentication
 * In production, implement proper admin role checking
 */

import { NextRequest } from 'next/server'
import { z, ZodError } from 'zod'
import { requireAuth } from '@/lib/api/auth'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type Coupon = Database['public']['Tables']['coupons']['Row']

// Schema for creating a coupon
const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(50, 'Code is too long')
    .regex(
      /^[A-Z0-9-_]+$/,
      'Code must contain only uppercase letters, numbers, hyphens, and underscores'
    ),
  creditsAmount: z.number().int().positive('Credits must be positive'),
  description: z.string().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  maxUsesPerUser: z.number().int().positive().default(1),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().nullable().optional(),
})

/**
 * GET /api/admin/coupons
 * List all coupons with usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate admin
    const user = await requireAuth()

    // TODO: Add admin role check
    // if (!user.role || user.role !== 'admin') {
    //   return errorResponse('Insufficient permissions', 403)
    // }

    // 2. Fetch all coupons with redemption count
    const supabase = createServiceClient()

    const { data: coupons, error } = await supabase
      .from('coupons')
      .select(
        `
        id,
        code,
        description,
        credits_amount,
        max_uses,
        current_uses,
        max_uses_per_user,
        valid_from,
        valid_until,
        is_active,
        created_at,
        updated_at
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch coupons:', error)
      return errorResponse('Failed to fetch coupons', 500)
    }

    // 3. Get redemption count for each coupon
    const typedCoupons = (coupons || []) as Coupon[]
    const couponsWithStats = await Promise.all(
      typedCoupons.map(async (coupon) => {
        const { count } = await supabase
          .from('coupon_redemptions')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)

        return {
          ...coupon,
          redemptionsCount: count || 0,
        }
      })
    )

    return successResponse({
      coupons: couponsWithStats,
      total: couponsWithStats.length,
    })
  } catch (error) {
    console.error('Admin coupons GET error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/admin/coupons
 * Create a new coupon
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate admin
    const user = await requireAuth()

    // TODO: Add admin role check
    // if (!user.role || user.role !== 'admin') {
    //   return errorResponse('Insufficient permissions', 403)
    // }

    // 2. Parse and validate request
    const body = await request.json()
    const validated = createCouponSchema.parse(body)

    // 3. Create coupon using database function
    const supabase = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: couponId, error } = (await (supabase.rpc as any)('create_coupon', {
      p_code: validated.code,
      p_credits_amount: validated.creditsAmount,
      p_description: validated.description || null,
      p_max_uses: validated.maxUses || null,
      p_max_uses_per_user: validated.maxUsesPerUser,
      p_valid_from: validated.validFrom || new Date().toISOString(),
      p_valid_until: validated.validUntil || null,
      p_created_by: user.id,
    })) as { data: string | null; error: unknown }

    if (error) {
      console.error('Failed to create coupon:', error)

      // Check for duplicate code error
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        return errorResponse('Coupon code already exists', 400)
      }

      return errorResponse('Failed to create coupon', 500)
    }

    // 4. Fetch the created coupon
    const { data: newCoupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId || '')
      .single()

    console.log('✅ Coupon created:', {
      code: validated.code,
      creditsAmount: validated.creditsAmount,
      createdBy: user.id,
    })

    return successResponse({
      coupon: newCoupon,
      message: 'Coupon created successfully',
    })
  } catch (error) {
    console.error('Admin coupons POST error:', error)

    if (error instanceof ZodError) {
      return errorResponse(error.issues[0].message, 400)
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Authentication required', 401)
    }

    return errorResponse('Internal server error', 500)
  }
}
