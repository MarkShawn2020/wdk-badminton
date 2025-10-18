/**
 * Reservation Form Validation Schemas
 * 活动预约表单验证规则
 */

import { z } from 'zod'

/**
 * Create Reservation Schema (Admin)
 * 创建活动表单验证
 */
export const createReservationSchema = z
  .object({
    // 场地信息
    venueName: z.string().min(2, '场地名称至少2个字符').max(200, '场地名称不能超过200个字符'),
    venueAddress: z.string().max(500, '场地地址不能超过500个字符').optional().or(z.literal('')),
    venueDistrict: z.string().max(50, '行政区不能超过50个字符').optional().or(z.literal('')),
    courtNumber: z.string().max(20, '场地编号不能超过20个字符').optional().or(z.literal('')),

    // 时间安排
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '请输入有效的日期格式 (YYYY-MM-DD)'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, '请输入有效的时间格式 (HH:mm)'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, '请输入有效的时间格式 (HH:mm)'),

    // 参与者限制
    maxParticipants: z.number().int('参与人数必须是整数').min(2, '至少需要2人').max(50, '最多50人'),

    // 费用
    totalCost: z.number().nonnegative('费用不能为负').optional(),
    costPerPerson: z.number().nonnegative('单人费用不能为负').optional(),
    paymentMethod: z.enum(['WECHAT', 'ALIPAY', 'CASH', 'AA']).optional(),

    // 要求与备注
    notes: z.string().max(1000, '备注不能超过1000字符').optional().or(z.literal('')),
    skillLevelRequirement: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
    isCompetition: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Validate that endTime is after startTime
      const [startHour, startMin] = data.startTime.split(':').map(Number)
      const [endHour, endMin] = data.endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return endMinutes > startMinutes
    },
    {
      message: '结束时间必须晚于开始时间',
      path: ['endTime'],
    }
  )
  .refine(
    (data) => {
      // Validate date is not in the past
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const reservationDate = new Date(data.date)
      return reservationDate >= today
    },
    {
      message: '活动日期不能早于今天',
      path: ['date'],
    }
  )

export type CreateReservationInput = z.infer<typeof createReservationSchema>

/**
 * Join Reservation Schema
 * 报名活动验证
 */
export const joinReservationSchema = z.object({
  reservationId: z.string().uuid('无效的活动ID'),
  memberId: z.string().uuid('无效的会员ID'),
})

export type JoinReservationInput = z.infer<typeof joinReservationSchema>

/**
 * Leave Reservation Schema
 * 取消报名验证
 */
export const leaveReservationSchema = z.object({
  reservationId: z.string().uuid('无效的活动ID'),
  memberId: z.string().uuid('无效的会员ID'),
})

export type LeaveReservationInput = z.infer<typeof leaveReservationSchema>

/**
 * Update Reservation Schema
 * 更新活动信息验证
 */
export const updateReservationSchema = createReservationSchema.partial().extend({
  id: z.string().uuid('无效的活动ID'),
  status: z.enum(['OPEN', 'FULL', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
})

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
