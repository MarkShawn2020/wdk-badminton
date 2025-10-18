# 🏸 MVP 实施计划 - 五道口AI创业羽毛球俱乐部

## 📅 总体时间规划

```
Phase 1: 静态展示 MVP         → Week 1-2  (10-14天)
Phase 2: 交互增强              → Week 3-4  (10-14天)
Phase 3: 高级功能（未来）     → Month 2+
```

---

## 🎯 Phase 1: 静态展示 MVP（推荐优先实施）

**目标**：快速验证设计和产品方向，无需复杂后端逻辑

### Day 1-2: 基础设施

#### 1. 数据库迁移

```bash
# 执行迁移
pnpm supabase db reset

# 生成类型
pnpm supabase gen types typescript --local > src/types/database.types.ts
```

#### 2. 创建示例数据文件

```typescript
// src/data/sample-members.ts
export const sampleMembers = [
  {
    id: '1',
    name: '张伟',
    nameEn: 'Wei Zhang',
    avatarUrl: '/avatars/zhang-wei.jpg',
    companyName: '智谱AI',
    jobTitle: 'Senior Engineer',
    aiSector: 'NLP',
    skillLevel: 'advanced',
    totalPoints: 1250,
    matchesPlayed: 45,
    matchesWon: 28,
    bio: '热爱羽毛球，擅长双打配合',
  },
  // ... 更多会员
]

// src/data/sample-reservations.ts
export const sampleReservations = [
  {
    id: '1',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路xxx号',
    date: '2025-10-20',
    startTime: '19:00',
    endTime: '21:00',
    organizerName: '张伟',
    maxParticipants: 8,
    currentParticipants: 5,
    status: 'open',
    costPerPerson: 30,
  },
  // ... 更多预约
]
```

#### 3. 创建类型定义

```typescript
// src/types/index.ts
export interface Member {
  id: string
  name: string
  nameEn?: string
  avatarUrl?: string
  companyName?: string
  jobTitle?: string
  aiSector?: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  bio?: string
}

export interface Reservation {
  id: string
  venueName: string
  venueAddress?: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  organizerName: string
  maxParticipants: number
  currentParticipants: number
  status: 'open' | 'full' | 'confirmed' | 'cancelled' | 'completed'
  costPerPerson?: number
  notes?: string
}

export interface Ranking extends Member {
  rank: number
  winRate: number
}
```

### Day 3-5: 页面结构与路由

#### 1. 新路由结构

```
src/app/
├── (home)/
│   ├── page.tsx                      # 首页：俱乐部介绍
│   ├── about/page.tsx                # 关于：规则、历史
│   ├── members/                      # 会员相关
│   │   ├── page.tsx                  # 会员列表
│   │   └── [id]/page.tsx             # 会员详情
│   ├── rankings/page.tsx             # 积分排名
│   ├── reservations/                 # 预约相关
│   │   ├── page.tsx                  # 预约列表/日历
│   │   └── [id]/page.tsx             # 预约详情
│   └── contact/page.tsx              # 联系方式
├── (member)/                         # 会员专区（需登录）
│   ├── dashboard/page.tsx            # 个人中心
│   ├── profile/page.tsx              # 个人资料
│   └── history/page.tsx              # 活动历史
└── layout.tsx                        # 根布局
```

#### 2. 创建基础布局组件

```typescript
// src/components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏸</span>
          <span className="font-bold">五道口羽毛球俱乐部</span>
        </Link>

        <nav className="hidden space-x-6 md:flex">
          <Link href="/members" className="hover:text-primary">
            会员
          </Link>
          <Link href="/rankings" className="hover:text-primary">
            排名
          </Link>
          <Link href="/reservations" className="hover:text-primary">
            预约
          </Link>
          <Link href="/about" className="hover:text-primary">
            关于
          </Link>
        </nav>

        <Button asChild>
          <Link href="/signin">登录</Link>
        </Button>
      </div>
    </header>
  )
}

// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>© 2025 五道口AI创业羽毛球俱乐部. All rights reserved.</p>
        <p className="mt-2">
          联系我们: wechat@wdk-badminton.com
        </p>
      </div>
    </footer>
  )
}
```

### Day 6-8: 核心页面实现

#### 1. 首页

```typescript
// src/app/(home)/page.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="mb-4 text-5xl font-bold">
          🏸 五道口AI创业羽毛球俱乐部
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          连接AI创业者，享受羽毛球乐趣
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" asChild>
            <Link href="/members">浏览会员</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/reservations">查看活动</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-primary">120+</div>
          <div className="mt-2 text-gray-600">活跃会员</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-primary">50+</div>
          <div className="mt-2 text-gray-600">每月活动</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-bold text-primary">30+</div>
          <div className="mt-2 text-gray-600">AI公司</div>
        </Card>
      </section>

      {/* Features */}
      <section className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-bold">为什么加入我们</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="text-5xl">🤝</div>
            <h3 className="mt-4 text-xl font-bold">结识同行</h3>
            <p className="mt-2 text-gray-600">
              与来自智谱、商汤、月之暗面等公司的AI创业者交流
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl">💪</div>
            <h3 className="mt-4 text-xl font-bold">健康运动</h3>
            <p className="mt-2 text-gray-600">
              工作之余放松身心，保持健康体魄
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl">🏆</div>
            <h3 className="mt-4 text-xl font-bold">竞技成长</h3>
            <p className="mt-2 text-gray-600">
              参与友谊赛，提升技术水平，挑战积分榜
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
```

#### 2. 会员列表页

```typescript
// src/app/(home)/members/page.tsx
import { MemberCard } from '@/components/member/MemberCard'
import { MemberFilters } from '@/components/member/MemberFilters'
import { sampleMembers } from '@/data/sample-members'

export default function MembersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">俱乐部会员</h1>
        <p className="mt-2 text-gray-600">
          {sampleMembers.length} 位活跃会员
        </p>
      </div>

      {/* Filters */}
      <MemberFilters />

      {/* Member Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}

// src/components/member/MemberCard.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Member } from '@/types'

interface MemberCardProps {
  member: Member
}

export function MemberCard({ member }: MemberCardProps) {
  const skillLevelMap = {
    beginner: { label: '初学', color: 'bg-gray-500' },
    intermediate: { label: '进阶', color: 'bg-blue-500' },
    advanced: { label: '高级', color: 'bg-purple-500' },
    expert: { label: '专家', color: 'bg-orange-500' },
  }

  const skill = skillLevelMap[member.skillLevel]

  return (
    <Link href={`/members/${member.id}`}>
      <Card className="p-6 transition-shadow hover:shadow-lg">
        <div className="flex items-start space-x-4">
          <Avatar
            src={member.avatarUrl}
            alt={member.name}
            fallback={member.name[0]}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{member.name}</h3>
              <Badge className={skill.color}>{skill.label}</Badge>
            </div>
            {member.companyName && (
              <p className="mt-1 text-sm text-gray-600">
                {member.companyName} · {member.jobTitle}
              </p>
            )}
            {member.aiSector && (
              <p className="mt-1 text-xs text-gray-500">{member.aiSector}</p>
            )}
            <div className="mt-3 flex space-x-4 text-sm">
              <div>
                <span className="font-semibold">{member.totalPoints}</span>
                <span className="text-gray-600"> 积分</span>
              </div>
              <div>
                <span className="font-semibold">{member.matchesPlayed}</span>
                <span className="text-gray-600"> 场次</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
```

#### 3. 排名页

```typescript
// src/app/(home)/rankings/page.tsx
import { RankingTable } from '@/components/ranking/RankingTable'
import { sampleMembers } from '@/data/sample-members'

export default function RankingsPage() {
  // 计算排名
  const rankings = sampleMembers
    .map((member) => ({
      ...member,
      winRate:
        member.matchesPlayed > 0
          ? Math.round((member.matchesWon / member.matchesPlayed) * 100)
          : 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((member, index) => ({
      ...member,
      rank: index + 1,
    }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">积分排名</h1>
        <p className="mt-2 text-gray-600">2025赛季积分榜</p>
      </div>

      <RankingTable rankings={rankings} />
    </div>
  )
}

// src/components/ranking/RankingTable.tsx
import { Avatar } from '@/components/ui/avatar'
import type { Ranking } from '@/types'

interface RankingTableProps {
  rankings: Ranking[]
}

export function RankingTable({ rankings }: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b">
          <tr className="text-left">
            <th className="p-4">排名</th>
            <th className="p-4">会员</th>
            <th className="p-4">公司</th>
            <th className="p-4 text-right">积分</th>
            <th className="p-4 text-right">场次</th>
            <th className="p-4 text-right">胜率</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking) => (
            <tr key={ranking.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center justify-center">
                  {ranking.rank <= 3 ? (
                    <span className="text-2xl">
                      {ranking.rank === 1 && '🥇'}
                      {ranking.rank === 2 && '🥈'}
                      {ranking.rank === 3 && '🥉'}
                    </span>
                  ) : (
                    <span className="font-semibold">{ranking.rank}</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={ranking.avatarUrl}
                    alt={ranking.name}
                    fallback={ranking.name[0]}
                    size="sm"
                  />
                  <span className="font-medium">{ranking.name}</span>
                </div>
              </td>
              <td className="p-4 text-gray-600">{ranking.companyName}</td>
              <td className="p-4 text-right font-bold text-primary">
                {ranking.totalPoints}
              </td>
              <td className="p-4 text-right">{ranking.matchesPlayed}</td>
              <td className="p-4 text-right">{ranking.winRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

#### 4. 预约页面

```typescript
// src/app/(home)/reservations/page.tsx
import { ReservationCard } from '@/components/reservation/ReservationCard'
import { ReservationCalendar } from '@/components/reservation/ReservationCalendar'
import { sampleReservations } from '@/data/sample-reservations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ReservationsPage() {
  // 按日期排序
  const upcomingReservations = sampleReservations
    .filter((r) => new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">场地预约</h1>
        <p className="mt-2 text-gray-600">查看即将到来的活动</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">列表视图</TabsTrigger>
          <TabsTrigger value="calendar">日历视图</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {upcomingReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ReservationCalendar reservations={upcomingReservations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// src/components/reservation/ReservationCard.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Reservation } from '@/types'

interface ReservationCardProps {
  reservation: Reservation
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const statusMap = {
    open: { label: '可报名', color: 'bg-green-500' },
    full: { label: '已满', color: 'bg-red-500' },
    confirmed: { label: '已确认', color: 'bg-blue-500' },
    cancelled: { label: '已取消', color: 'bg-gray-500' },
    completed: { label: '已完成', color: 'bg-gray-400' },
  }

  const status = statusMap[reservation.status]

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold">{reservation.venueName}</h3>
            <Badge className={status.color}>{status.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {reservation.venueAddress}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">日期</span>
          <span className="font-medium">{reservation.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">时间</span>
          <span className="font-medium">
            {reservation.startTime} - {reservation.endTime}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">组织者</span>
          <span className="font-medium">{reservation.organizerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">人数</span>
          <span className="font-medium">
            {reservation.currentParticipants}/{reservation.maxParticipants}
          </span>
        </div>
        {reservation.costPerPerson && (
          <div className="flex justify-between">
            <span className="text-gray-600">费用</span>
            <span className="font-medium">¥{reservation.costPerPerson}/人</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-2">
        <Button asChild className="flex-1">
          <Link href={`/reservations/${reservation.id}`}>查看详情</Link>
        </Button>
        {reservation.status === 'open' && (
          <Button variant="outline" disabled>
            报名参加
          </Button>
        )}
      </div>
    </Card>
  )
}
```

### Day 9-10: 样式优化与测试

#### 1. 响应式设计

- 确保所有页面在移动端正常显示
- 测试不同屏幕尺寸
- 优化触摸交互

#### 2. 性能优化

- 图片优化（使用 Next.js Image 组件）
- 代码分割
- 字体优化

#### 3. SEO 优化

```typescript
// src/app/(home)/members/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '会员列表 - 五道口AI创业羽毛球俱乐部',
  description: '浏览五道口AI创业羽毛球俱乐部的所有活跃会员',
  openGraph: {
    title: '会员列表 - 五道口AI创业羽毛球俱乐部',
    description: '连接AI创业者，享受羽毛球乐趣',
  },
}
```

### Day 11-14: 部署与反馈

#### 1. 部署到 Vercel

```bash
# 推送代码
git add .
git commit -m "feat: implement badminton club MVP phase 1"
git push origin feature/badminton-club-mvp

# 在 Vercel 中部署
# 或使用命令行
vercel deploy
```

#### 2. 收集反馈

- 邀请10-20位潜在会员试用
- 收集 UI/UX 反馈
- 确认功能需求优先级

---

## 🚀 Phase 2: 交互增强（Week 3-4）

### 功能列表

1. **会员认证**
   - Supabase Auth 登录/注册
   - Google OAuth（已有）
   - 微信登录（可选）

2. **个人资料管理**
   - 创建/编辑个人资料
   - 上传头像
   - 编辑羽毛球技能信息

3. **预约报名**
   - 报名参加预约
   - 取消报名
   - 实时更新参与人数

4. **积分历史**
   - 查看个人积分变动
   - 积分获取原因
   - 积分趋势图表

### 技术实现

#### 1. API 路由

```typescript
// src/app/api/members/route.ts
export async function GET(request: Request) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'active')
    .order('total_points', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

// src/app/api/reservations/[id]/join/route.ts
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 获取 member_id
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return Response.json({ error: 'Member not found' }, { status: 404 })
  }

  // 调用数据库函数
  const { data, error } = await supabase.rpc('join_reservation', {
    p_reservation_id: params.id,
    p_member_id: member.id,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json(data)
}
```

#### 2. 实时更新

```typescript
// src/components/reservation/ReservationCard.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ReservationCard({ reservation: initialReservation }) {
  const [reservation, setReservation] = useState(initialReservation)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`reservation-${reservation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reservations',
          filter: `id=eq.${reservation.id}`,
        },
        (payload) => {
          setReservation(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [reservation.id])

  // ... 渲染逻辑
}
```

---

## ✅ 验证清单

### Phase 1 验证

- [ ] 首页显示正常，介绍清晰
- [ ] 会员列表显示所有示例会员
- [ ] 会员卡片显示完整信息（头像、公司、积分）
- [ ] 排名页面正确排序，前三名显示奖牌
- [ ] 预约页面显示所有即将到来的活动
- [ ] 预约卡片显示完整信息
- [ ] 所有页面响应式设计正常
- [ ] 移动端显示友好
- [ ] 类型检查通过：`pnpm check-type`
- [ ] Lint 通过：`pnpm lint`
- [ ] 页面加载速度 <2 秒

### Phase 2 验证

- [ ] 用户可以登录/注册
- [ ] 登录后可以查看个人中心
- [ ] 用户可以编辑个人资料
- [ ] 用户可以上传头像
- [ ] 用户可以报名参加预约
- [ ] 报名后实时更新人数
- [ ] 用户可以取消报名
- [ ] 用户可以查看积分历史
- [ ] 所有 API 路由有错误处理
- [ ] RLS 策略正常工作

---

## 📊 成功指标

### Phase 1（静态展示）

- ✅ 页面完整度：100%
- ✅ 响应式设计：100%
- ✅ 加载速度：<2 秒
- ✅ 用户反馈：获得 10+ 用户反馈

### Phase 2（交互增强）

- ✅ 注册转化率：>50%（访客→注册）
- ✅ 预约报名率：>30%（会员参与）
- ✅ 功能完成度：100%
- ✅ Bug 率：<5%

---

## 🎉 下一步

完成 Phase 2 后，可以考虑：

1. **比赛记录系统**：录入比赛结果，自动计算积分
2. **微信集成**：微信登录、分享、通知
3. **支付功能**：在线支付场地费
4. **社交功能**：评论、点赞、照片分享
5. **数据分析**：会员活跃度、场地使用率、积分趋势

---

**祝开发顺利！🚀**
