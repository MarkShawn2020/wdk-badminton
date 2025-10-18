'use client'

/**
 * Members List Page
 * 会员列表页面
 *
 * Displays all registered members
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sampleMembers } from '@/data/sample-members'

interface Member {
  id: string
  name: string
  nameEn?: string
  companyName?: string
  jobTitle?: string
  aiSector?: string
  skillLevel: string
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  bio?: string
  joinedAt: string
}

export default function MembersPage() {
  const [localMembers, setLocalMembers] = useState<Member[]>([])
  const [showSampleData, setShowSampleData] = useState(true)

  useEffect(() => {
    // Load members from localStorage
    const stored = localStorage.getItem('wdk-members')
    if (stored) {
      const parsed = JSON.parse(stored)
      setLocalMembers(parsed)
    }
  }, [])

  // Combine sample data and local data
  const allMembers = showSampleData ? [...localMembers, ...sampleMembers] : localMembers

  const skillLevelMap = {
    BEGINNER: { label: '初学', color: 'bg-gray-500' },
    INTERMEDIATE: { label: '进阶', color: 'bg-blue-500' },
    ADVANCED: { label: '高级', color: 'bg-purple-500' },
    EXPERT: { label: '专家', color: 'bg-orange-500' },
    beginner: { label: '初学', color: 'bg-gray-500' },
    intermediate: { label: '进阶', color: 'bg-blue-500' },
    advanced: { label: '高级', color: 'bg-purple-500' },
    expert: { label: '专家', color: 'bg-orange-500' },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">会员列表</h1>
              <p className="text-muted-foreground mt-2">
                共 {allMembers.length} 位会员
                {localMembers.length > 0 && (
                  <span className="ml-2 text-green-600">
                    （其中 {localMembers.length} 位新注册）
                  </span>
                )}
              </p>
            </div>
            <Link
              href="/register"
              className="bg-primary-600 hover:bg-primary-500 rounded-lg px-6 py-3 font-semibold text-white transition-colors"
            >
              + 注册新成员
            </Link>
          </div>

          {/* Filter Toggle */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowSampleData(!showSampleData)}
              className="border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors"
            >
              {showSampleData ? '只显示新注册会员' : '显示所有会员（含示例数据）'}
            </button>
          </div>
        </div>

        {/* New Members Notice */}
        {localMembers.length > 0 && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-800">
              🎉 发现 {localMembers.length} 位新注册的会员！ 数据保存在浏览器本地。
            </p>
          </div>
        )}

        {/* Members Grid */}
        {allMembers.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">还没有注册的会员</p>
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-500 mt-4 inline-block"
            >
              成为第一个注册的会员 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allMembers.map((member) => {
              const skill =
                skillLevelMap[member.skillLevel as keyof typeof skillLevelMap] ||
                skillLevelMap.BEGINNER
              const isNewMember = localMembers.some((m) => m.id === member.id)
              const winRate =
                member.matchesPlayed > 0
                  ? Math.round((member.matchesWon / member.matchesPlayed) * 100)
                  : 0

              return (
                <div
                  key={member.id}
                  className="relative flex flex-col rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
                >
                  {/* New Badge */}
                  {isNewMember && (
                    <div className="absolute top-2 right-2">
                      <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                        NEW
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="bg-primary-600 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white">
                      {member.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground text-lg font-bold">
                        {member.name}
                        {member.nameEn && (
                          <span className="text-muted-foreground ml-2 text-sm font-normal">
                            {member.nameEn}
                          </span>
                        )}
                      </h3>
                      {member.companyName && (
                        <p className="text-muted-foreground text-sm">
                          {member.companyName}
                          {member.jobTitle && ` · ${member.jobTitle}`}
                        </p>
                      )}
                      {member.aiSector && (
                        <p className="text-muted-foreground mt-1 text-xs">{member.aiSector}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`${skill.color} rounded-full px-3 py-1 text-xs font-semibold text-white`}
                    >
                      {skill.label}
                    </span>
                  </div>

                  {member.bio && (
                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{member.bio}</p>
                  )}

                  <div className="mt-auto flex gap-6 border-t pt-4 text-sm">
                    <div>
                      <span className="text-foreground font-semibold">{member.totalPoints}</span>
                      <span className="text-muted-foreground ml-1">积分</span>
                    </div>
                    <div>
                      <span className="text-foreground font-semibold">{member.matchesPlayed}</span>
                      <span className="text-muted-foreground ml-1">场次</span>
                    </div>
                    {member.matchesPlayed > 0 && (
                      <div>
                        <span className="text-foreground font-semibold">{winRate}%</span>
                        <span className="text-muted-foreground ml-1">胜率</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
