'use client'

/**
 * Member Registration Form
 * 会员注册表单
 *
 * Features:
 * - Type-safe with Zod validation
 * - Real-time validation feedback
 * - Multi-step form (optional)
 * - Accessibility-first design
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { memberRegistrationSchema, type MemberRegistrationInput } from '@/lib/validations/member'

interface MemberRegistrationFormProps {
  onSubmit: (data: MemberRegistrationInput) => Promise<void>
  defaultValues?: Partial<MemberRegistrationInput>
}

export function MemberRegistrationForm({ onSubmit, defaultValues }: MemberRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MemberRegistrationInput>({
    resolver: zodResolver(memberRegistrationSchema),
    defaultValues: defaultValues || {
      skillLevel: 'BEGINNER',
    },
  })

  const onSubmitHandler = async (data: MemberRegistrationInput) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit(data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '注册失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">基本信息</h3>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full rounded-md border px-3 py-2"
            placeholder="张三"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="nameEn" className="mb-1 block text-sm font-medium">
            英文名 (可选)
          </label>
          <input
            {...register('nameEn')}
            type="text"
            id="nameEn"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Zhang San"
          />
          {errors.nameEn && <p className="mt-1 text-sm text-red-600">{errors.nameEn.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            手机号
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full rounded-md border px-3 py-2"
            placeholder="13800138000"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="wechatId" className="mb-1 block text-sm font-medium">
            微信号
          </label>
          <input
            {...register('wechatId')}
            type="text"
            id="wechatId"
            className="w-full rounded-md border px-3 py-2"
            placeholder="your-wechat-id"
          />
          {errors.wechatId && (
            <p className="mt-1 text-sm text-red-600">{errors.wechatId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            邮箱
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full rounded-md border px-3 py-2"
            placeholder="zhang@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium">
            个人简介
          </label>
          <textarea
            {...register('bio')}
            id="bio"
            rows={3}
            className="w-full rounded-md border px-3 py-2"
            placeholder="简单介绍一下自己..."
          />
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
        </div>
      </div>

      {/* AI创业信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI创业信息</h3>

        <div>
          <label htmlFor="companyName" className="mb-1 block text-sm font-medium">
            公司名称
          </label>
          <input
            {...register('companyName')}
            type="text"
            id="companyName"
            className="w-full rounded-md border px-3 py-2"
            placeholder="智谱AI"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyNameEn" className="mb-1 block text-sm font-medium">
            公司英文名
          </label>
          <input
            {...register('companyNameEn')}
            type="text"
            id="companyNameEn"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Zhipu AI"
          />
          {errors.companyNameEn && (
            <p className="mt-1 text-sm text-red-600">{errors.companyNameEn.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium">
            职位
          </label>
          <input
            {...register('jobTitle')}
            type="text"
            id="jobTitle"
            className="w-full rounded-md border px-3 py-2"
            placeholder="算法工程师"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="aiSector" className="mb-1 block text-sm font-medium">
            AI领域
          </label>
          <input
            {...register('aiSector')}
            type="text"
            id="aiSector"
            className="w-full rounded-md border px-3 py-2"
            placeholder="大语言模型 / 计算机视觉 / NLP"
          />
          {errors.aiSector && (
            <p className="mt-1 text-sm text-red-600">{errors.aiSector.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyStage" className="mb-1 block text-sm font-medium">
            公司阶段
          </label>
          <select
            {...register('companyStage')}
            id="companyStage"
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">请选择</option>
            <option value="SEED">种子轮</option>
            <option value="SERIES_A">A轮</option>
            <option value="SERIES_B">B轮</option>
            <option value="SERIES_C">C轮及以后</option>
            <option value="GROWTH">成长期</option>
            <option value="MATURE">成熟期</option>
          </select>
          {errors.companyStage && (
            <p className="mt-1 text-sm text-red-600">{errors.companyStage.message}</p>
          )}
        </div>
      </div>

      {/* 羽毛球信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">羽毛球信息</h3>

        <div>
          <label htmlFor="skillLevel" className="mb-1 block text-sm font-medium">
            技能水平 <span className="text-red-500">*</span>
          </label>
          <select
            {...register('skillLevel')}
            id="skillLevel"
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="BEGINNER">初学 - 刚接触羽毛球</option>
            <option value="INTERMEDIATE">进阶 - 有一定基础</option>
            <option value="ADVANCED">高级 - 经常打球，技术不错</option>
            <option value="EXPERT">专家 - 专业或校队水平</option>
          </select>
          {errors.skillLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.skillLevel.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="preferredPosition" className="mb-1 block text-sm font-medium">
            偏好位置
          </label>
          <select
            {...register('preferredPosition')}
            id="preferredPosition"
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">请选择</option>
            <option value="SINGLES">单打</option>
            <option value="DOUBLES">双打</option>
            <option value="BOTH">都可以</option>
          </select>
          {errors.preferredPosition && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredPosition.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="playStyle" className="mb-1 block text-sm font-medium">
            打球风格
          </label>
          <textarea
            {...register('playStyle')}
            id="playStyle"
            rows={2}
            className="w-full rounded-md border px-3 py-2"
            placeholder="进攻型 / 防守反击 / 网前技术好 / 力量型..."
          />
          {errors.playStyle && (
            <p className="mt-1 text-sm text-red-600">{errors.playStyle.message}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-600 hover:bg-primary-500 w-full rounded-md px-4 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? '提交中...' : '完成注册'}
      </button>
    </form>
  )
}
