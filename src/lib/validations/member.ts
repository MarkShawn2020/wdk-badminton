/**
 * Member Form Validation Schemas
 * 会员表单验证规则
 */

import { z } from 'zod'

/**
 * Member Registration Schema
 * 会员注册表单验证
 */
export const memberRegistrationSchema = z.object({
  // 基本信息
  name: z.string().min(2, '姓名至少2个字符').max(100, '姓名不能超过100个字符'),
  nameEn: z.string().max(100, '英文名不能超过100个字符').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
    .optional()
    .or(z.literal('')),
  wechatId: z.string().max(50, '微信号不能超过50个字符').optional().or(z.literal('')),
  email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')),
  bio: z.string().max(500, '个人简介不能超过500字符').optional().or(z.literal('')),

  // AI创业信息
  companyName: z.string().max(200, '公司名称不能超过200个字符').optional().or(z.literal('')),
  companyNameEn: z.string().max(200, '公司英文名不能超过200个字符').optional().or(z.literal('')),
  jobTitle: z.string().max(100, '职位不能超过100个字符').optional().or(z.literal('')),
  aiSector: z.string().max(100, 'AI领域不能超过100个字符').optional().or(z.literal('')),
  companyStage: z.enum(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'GROWTH', 'MATURE']).optional(),

  // 羽毛球信息
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
    required_error: '请选择技能水平',
  }),
  preferredPosition: z.enum(['SINGLES', 'DOUBLES', 'BOTH']).optional(),
  playStyle: z.string().max(500, '打球风格描述不能超过500字符').optional().or(z.literal('')),
})

export type MemberRegistrationInput = z.infer<typeof memberRegistrationSchema>

/**
 * Member Profile Update Schema
 * 会员资料更新验证（允许部分更新）
 */
export const memberUpdateSchema = memberRegistrationSchema.partial()

export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>

/**
 * Quick Registration Schema (Simplified)
 * 快速注册表单（仅必填项）
 */
export const quickRegistrationSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  companyName: z.string().min(2, '请输入公司名称').optional(),
})

export type QuickRegistrationInput = z.infer<typeof quickRegistrationSchema>
