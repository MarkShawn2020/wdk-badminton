'use client'

/**
 * Create Reservation Form (Admin)
 * 创建活动表单
 *
 * Features:
 * - Date/time pickers
 * - Cost calculator
 * - Venue autocomplete (future)
 * - Real-time validation
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { createReservationSchema, type CreateReservationInput } from '@/lib/validations/reservation'

interface CreateReservationFormProps {
  onSubmit: (data: CreateReservationInput) => Promise<void>
  organizerId: string
  defaultValues?: Partial<CreateReservationInput>
}

export function CreateReservationForm({
  onSubmit,
  organizerId,
  defaultValues,
}: CreateReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateReservationInput>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: defaultValues || {
      maxParticipants: 8,
      paymentMethod: 'AA',
      isCompetition: false,
    },
  })

  // Auto-calculate cost per person
  const totalCost = watch('totalCost')
  const maxParticipants = watch('maxParticipants')

  useEffect(() => {
    if (totalCost && maxParticipants && maxParticipants > 0) {
      const costPerPerson = totalCost / maxParticipants
      setValue('costPerPerson', Number(costPerPerson.toFixed(2)))
    }
  }, [totalCost, maxParticipants, setValue])

  const onSubmitHandler = async (data: CreateReservationInput) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit(data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '创建活动失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* 场地信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">场地信息</h3>

        <div>
          <label htmlFor="venueName" className="mb-1 block text-sm font-medium">
            场地名称 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('venueName')}
            type="text"
            id="venueName"
            className="w-full rounded-md border px-3 py-2"
            placeholder="五道口体育馆"
            list="venue-suggestions"
          />
          {/* Future: Add datalist for venue autocomplete */}
          <datalist id="venue-suggestions">
            <option value="五道口体育馆" />
            <option value="清华大学体育馆" />
            <option value="北大体育馆" />
            <option value="中关村体育中心" />
          </datalist>
          {errors.venueName && (
            <p className="mt-1 text-sm text-red-600">{errors.venueName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="venueAddress" className="mb-1 block text-sm font-medium">
            场地地址
          </label>
          <input
            {...register('venueAddress')}
            type="text"
            id="venueAddress"
            className="w-full rounded-md border px-3 py-2"
            placeholder="北京市海淀区成府路45号"
          />
          {errors.venueAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.venueAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="venueDistrict" className="mb-1 block text-sm font-medium">
              行政区
            </label>
            <select
              {...register('venueDistrict')}
              id="venueDistrict"
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">请选择</option>
              <option value="海淀区">海淀区</option>
              <option value="朝阳区">朝阳区</option>
              <option value="东城区">东城区</option>
              <option value="西城区">西城区</option>
            </select>
          </div>

          <div>
            <label htmlFor="courtNumber" className="mb-1 block text-sm font-medium">
              场地编号
            </label>
            <input
              {...register('courtNumber')}
              type="text"
              id="courtNumber"
              className="w-full rounded-md border px-3 py-2"
              placeholder="1号场"
            />
          </div>
        </div>
      </div>

      {/* 时间安排 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">时间安排</h3>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            活动日期 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('date')}
            type="date"
            id="date"
            min={today}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="mb-1 block text-sm font-medium">
              开始时间 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('startTime')}
              type="time"
              id="startTime"
              className="w-full rounded-md border px-3 py-2"
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endTime" className="mb-1 block text-sm font-medium">
              结束时间 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('endTime')}
              type="time"
              id="endTime"
              className="w-full rounded-md border px-3 py-2"
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 参与者设置 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">参与者设置</h3>

        <div>
          <label htmlFor="maxParticipants" className="mb-1 block text-sm font-medium">
            最大人数 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('maxParticipants', { valueAsNumber: true })}
            type="number"
            id="maxParticipants"
            min="2"
            max="50"
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="skillLevelRequirement" className="mb-1 block text-sm font-medium">
            技能要求
          </label>
          <select
            {...register('skillLevelRequirement')}
            id="skillLevelRequirement"
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">不限</option>
            <option value="BEGINNER">初学</option>
            <option value="INTERMEDIATE">进阶</option>
            <option value="ADVANCED">高级</option>
            <option value="EXPERT">专家</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register('isCompetition')}
            type="checkbox"
            id="isCompetition"
            className="rounded border-gray-300"
          />
          <label htmlFor="isCompetition" className="text-sm font-medium">
            这是一场比赛
          </label>
        </div>
      </div>

      {/* 费用设置 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">费用设置</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalCost" className="mb-1 block text-sm font-medium">
              总费用 (元)
            </label>
            <input
              {...register('totalCost', { valueAsNumber: true })}
              type="number"
              id="totalCost"
              step="0.01"
              min="0"
              className="w-full rounded-md border px-3 py-2"
              placeholder="360.00"
            />
            {errors.totalCost && (
              <p className="mt-1 text-sm text-red-600">{errors.totalCost.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="costPerPerson" className="mb-1 block text-sm font-medium">
              单人费用 (元)
            </label>
            <input
              {...register('costPerPerson', { valueAsNumber: true })}
              type="number"
              id="costPerPerson"
              step="0.01"
              min="0"
              className="w-full rounded-md border bg-gray-50 px-3 py-2"
              placeholder="自动计算"
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">自动根据总费用和人数计算</p>
          </div>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="mb-1 block text-sm font-medium">
            支付方式
          </label>
          <select
            {...register('paymentMethod')}
            id="paymentMethod"
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="AA">AA制</option>
            <option value="WECHAT">微信</option>
            <option value="ALIPAY">支付宝</option>
            <option value="CASH">现金</option>
          </select>
        </div>
      </div>

      {/* 备注 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">备注</h3>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium">
            活动备注
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={4}
            className="w-full rounded-md border px-3 py-2"
            placeholder="场地条件、交通指南、注意事项等..."
          />
          {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-600 hover:bg-primary-500 flex-1 rounded-md px-4 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '创建中...' : '创建活动'}
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
        >
          取消
        </button>
      </div>
    </form>
  )
}
