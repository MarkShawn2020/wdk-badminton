'use client'

/**
 * Member Registration Page (API Version)
 * 会员注册页面 - 中心化服务器版本
 *
 * ✅ Production Version: Uses centralized API + Database
 * ❌ Demo Version: See page.tsx (localStorage)
 *
 * Usage: Rename this file to page.tsx to enable
 */

import { MemberRegistrationForm } from '@/components/forms/MemberRegistrationForm'
import { type MemberRegistrationInput } from '@/lib/validations/member'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPageAPI() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleRegister(data: MemberRegistrationInput) {
    console.log('📝 Submitting registration to API:', data)

    try {
      // Call centralized API
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ API error:', result)

        // Handle specific errors
        if (response.status === 409) {
          throw new Error('该手机号或邮箱已被注册')
        } else if (response.status === 400) {
          throw new Error('表单数据验证失败，请检查输入')
        } else {
          throw new Error(result.error || '注册失败，请重试')
        }
      }

      console.log('✅ Member registered successfully:', result.data)

      // Show success message
      setSuccessMessage(`注册成功！欢迎加入俱乐部，${data.name}！`)

      // Redirect to members page after 2 seconds
      setTimeout(() => {
        router.push('/members')
      }, 2000)
    } catch (error) {
      console.error('❌ Registration failed:', error)
      throw error // Re-throw for form to display error
    }
  }

  return (
    <div className="from-primary-50 min-h-screen bg-gradient-to-b to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-foreground text-3xl font-bold sm:text-4xl">加入俱乐部</h1>
          <p className="text-muted-foreground mt-2">填写以下信息，成为五道口AI羽毛球俱乐部的一员</p>
          <div className="mt-4">
            <Link href="/" className="text-primary-600 hover:text-primary-500 text-sm">
              ← 返回首页
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-center">
            <p className="text-lg font-semibold text-green-800">🎉 {successMessage}</p>
            <p className="mt-1 text-sm text-green-600">正在跳转到会员列表...</p>
          </div>
        )}

        {/* Registration Form */}
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <MemberRegistrationForm onSubmit={handleRegister} />
        </div>

        {/* Production Mode Notice */}
        <div className="mt-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            <strong>✅ 生产模式：</strong>
            数据保存在中心化数据库，所有用户共享。管理员可在后台统一管理。
          </p>
        </div>

        {/* Database Connection Status */}
        <details className="mt-4 rounded-lg bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            🔍 数据库连接状态
          </summary>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <p>• API 端点: POST /api/members</p>
            <p>• 数据存储: PostgreSQL (通过 Prisma ORM)</p>
            <p>• 数据持久化: ✅ 永久保存</p>
            <p>• 多设备访问: ✅ 支持</p>
            <p>• 数据共享: ✅ 所有用户可见</p>
          </div>
        </details>
      </div>
    </div>
  )
}
