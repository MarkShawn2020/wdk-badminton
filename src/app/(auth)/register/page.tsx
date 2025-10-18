'use client'

/**
 * Member Registration Page
 * 会员注册页面
 *
 * Quick Demo Version: Saves to localStorage
 * Production Version: Will connect to API route + Prisma
 */

import { MemberRegistrationForm } from '@/components/forms/MemberRegistrationForm'
import { type MemberRegistrationInput } from '@/lib/validations/member'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleRegister(data: MemberRegistrationInput) {
    console.log('📝 Registration data:', data)

    // Quick Demo: Save to localStorage
    // Production: Replace with API call
    try {
      // Generate a simple ID
      const newMember = {
        id: `member-${Date.now()}`,
        ...data,
        totalPoints: 0,
        matchesPlayed: 0,
        matchesWon: 0,
        joinedAt: new Date().toISOString(),
        status: 'ACTIVE',
      }

      // Get existing members from localStorage
      const existingMembers = JSON.parse(localStorage.getItem('wdk-members') || '[]')

      // Add new member
      existingMembers.push(newMember)
      localStorage.setItem('wdk-members', JSON.stringify(existingMembers))

      console.log('✅ Member saved to localStorage:', newMember)

      // Show success message
      setSuccessMessage('注册成功！欢迎加入五道口AI创业羽毛球俱乐部！')

      // Redirect to members page after 2 seconds
      setTimeout(() => {
        router.push('/members')
      }, 2000)
    } catch (error) {
      console.error('❌ Registration failed:', error)
      throw new Error('注册失败，请重试')
    }
  }

  return (
    <div className="from-primary-50 min-h-screen bg-gradient-to-b to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-foreground text-3xl font-bold sm:text-4xl">加入俱乐部</h1>
          <p className="text-muted-foreground mt-2">
            填写以下信息，成为五道口AI创业羽毛球俱乐部的一员
          </p>
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

        {/* Demo Notice */}
        <div className="mt-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <strong>💡 演示模式：</strong>
            数据暂时保存在浏览器本地。要使用真实数据库，请参考{' '}
            <code className="rounded bg-yellow-100 px-1 py-0.5 font-mono text-xs">
              IMPLEMENTATION_GUIDE.md
            </code>{' '}
            完成 Phase 2（数据库连接）。
          </p>
        </div>

        {/* Debug Panel (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-lg bg-gray-50 p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              🔧 开发者工具
            </summary>
            <div className="mt-2 space-y-2">
              <button
                onClick={() => {
                  const members = JSON.parse(localStorage.getItem('wdk-members') || '[]')
                  console.log('Current members in localStorage:', members)
                  alert(`当前已注册 ${members.length} 位成员`)
                }}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              >
                查看 localStorage 数据
              </button>
              <button
                onClick={() => {
                  if (confirm('确定要清空所有本地数据吗？')) {
                    localStorage.removeItem('wdk-members')
                    alert('已清空')
                  }
                }}
                className="ml-2 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                清空 localStorage
              </button>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
