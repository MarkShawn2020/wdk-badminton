import Link from '@/components/Link'
import { sampleMembers, getRankings } from '@/data/sample-members'
import { sampleReservations, getUpcomingReservations } from '@/data/sample-reservations'

export default function Home({ posts }) {
  // 获取前5名会员用于展示
  const featuredMembers = sampleMembers.slice(0, 6)

  // 获取排名前5
  const rankings = getRankings(sampleMembers).slice(0, 5)

  // 获取即将到来的3个活动
  const upcomingActivities = getUpcomingReservations(sampleReservations).slice(0, 3)

  // 统计数据
  const stats = {
    totalMembers: sampleMembers.length,
    monthlyActivities: 50,
    aiCompanies: 30,
  }

  return (
    <>
      {/* Hero Section - 英雄区 */}
      <section className="from-primary-50 dark:from-primary-950 dark:to-background relative overflow-hidden bg-gradient-to-b to-white pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* 主标题 */}
            <h1 className="text-foreground mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              🏸 五道口AI羽毛球俱乐部
            </h1>

            {/* 副标题 */}
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
              连接AI从业者，享受羽毛球乐趣。在这里，你能找到志同道合的球友，参加高质量活动，提升技术水平。
            </p>

            {/* 核心数据 */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm sm:gap-8 sm:text-base">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span className="text-foreground font-semibold">{stats.totalMembers}+</span>
                <span className="text-muted-foreground">活跃会员</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏟️</span>
                <span className="text-foreground font-semibold">{stats.monthlyActivities}+</span>
                <span className="text-muted-foreground">每月活动</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="text-foreground font-semibold">{stats.aiCompanies}+</span>
                <span className="text-muted-foreground">AI公司</span>
              </div>
            </div>

            {/* CTA 按钮 */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/register"
                className="bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 w-full rounded-lg px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
              >
                立即加入
              </Link>
              <Link
                href="/members"
                className="border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 w-full rounded-lg border-2 px-8 py-3.5 text-center text-base font-semibold transition-all sm:w-auto"
              >
                浏览会员
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us - 为什么加入我们 */}
      <section className="dark:bg-background bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-primary-600 mb-4 text-base font-semibold tracking-wide uppercase sm:text-lg">
              为什么加入我们
            </h2>
            <p className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              不仅仅是打球，更是连接与成长
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* 结识同行 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">结识同行</h3>
              <p className="text-muted-foreground leading-relaxed">
                与来自智谱AI、商汤科技、红杉资本、清华AIR等机构的AI从业者交流。工程师、产品经理、投资人、创始人齐聚球场，在运动中建立真实连接。
              </p>
            </div>

            {/* 健康运动 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <span className="text-4xl">💪</span>
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">健康运动</h3>
              <p className="text-muted-foreground leading-relaxed">
                工作之余放松身心，保持健康体魄。每周多场活动，随时约球。在五道口附近的优质场馆，方便快捷。
              </p>
            </div>

            {/* 竞技成长 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">竞技成长</h3>
              <p className="text-muted-foreground leading-relaxed">
                参与友谊赛，提升技术水平。积分排名系统激励进步，从初学者到高手，总有适合你的对手和伙伴。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Members - 会员展示 */}
      <section className="bg-secondary dark:bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-primary-600 mb-2 text-base font-semibold tracking-wide uppercase">
                会员风采
              </h2>
              <p className="text-foreground text-3xl font-bold">认识我们的球友</p>
            </div>
            <Link
              href="/members"
              className="text-primary-600 hover:text-primary-500 hidden text-base font-semibold sm:block"
            >
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMembers.map((member) => {
              const skillLevelMap = {
                beginner: { label: '初学', color: 'bg-gray-500' },
                intermediate: { label: '进阶', color: 'bg-blue-500' },
                advanced: { label: '高级', color: 'bg-purple-500' },
                expert: { label: '专家', color: 'bg-orange-500' },
              }
              const skill = skillLevelMap[member.skillLevel]

              return (
                <div
                  key={member.id}
                  className="bg-card flex flex-col rounded-xl p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start gap-4">
                    {/* 头像占位 */}
                    <div className="bg-primary-600 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white">
                      {member.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground mb-1 text-lg font-bold">
                        {member.name}
                        {member.nameEn && (
                          <span className="text-muted-foreground ml-2 text-sm font-normal">
                            {member.nameEn}
                          </span>
                        )}
                      </h3>
                      {member.companyName && (
                        <p className="text-muted-foreground text-sm">
                          {member.companyName} · {member.jobTitle}
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
                        <span className="text-foreground font-semibold">
                          {Math.round((member.matchesWon / member.matchesPlayed) * 100)}%
                        </span>
                        <span className="text-muted-foreground ml-1">胜率</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/members"
              className="text-primary-600 hover:text-primary-500 text-base font-semibold"
            >
              查看全部会员 →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Activities - 即将到来的活动 */}
      <section className="dark:bg-background bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-primary-600 mb-2 text-base font-semibold tracking-wide uppercase">
                近期活动
              </h2>
              <p className="text-foreground text-3xl font-bold">即将开始的羽毛球局</p>
            </div>
            <Link
              href="/reservations"
              className="text-primary-600 hover:text-primary-500 hidden text-base font-semibold sm:block"
            >
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingActivities.map((activity) => {
              const statusMap = {
                open: { label: '可报名', color: 'bg-green-500' },
                full: { label: '已满', color: 'bg-red-500' },
                confirmed: { label: '已确认', color: 'bg-blue-500' },
              }
              const status = statusMap[activity.status] || statusMap.open

              return (
                <div
                  key={activity.id}
                  className="bg-card flex flex-col rounded-xl p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2 text-lg font-bold">
                        {activity.venueName}
                      </h3>
                      <p className="text-muted-foreground text-sm">{activity.venueAddress}</p>
                    </div>
                    <span
                      className={`${status.color} ml-2 flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">日期</span>
                      <span className="text-foreground font-medium">{activity.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">时间</span>
                      <span className="text-foreground font-medium">
                        {activity.startTime} - {activity.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">组织者</span>
                      <span className="text-foreground font-medium">{activity.organizerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">人数</span>
                      <span className="text-foreground font-medium">
                        {activity.currentParticipants}/{activity.maxParticipants}
                      </span>
                    </div>
                    {activity.costPerPerson && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">费用</span>
                        <span className="text-foreground font-medium">
                          ¥{activity.costPerPerson}/人
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/reservations/${activity.id}`}
                      className="bg-primary-600 hover:bg-primary-500 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors"
                    >
                      {activity.status === 'open' ? '查看详情 & 报名' : '查看详情'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/reservations"
              className="text-primary-600 hover:text-primary-500 text-base font-semibold"
            >
              查看全部活动 →
            </Link>
          </div>
        </div>
      </section>

      {/* Ranking Preview - 排名预览 */}
      <section className="bg-secondary dark:bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-primary-600 mb-2 text-base font-semibold tracking-wide uppercase">
                积分排名
              </h2>
              <p className="text-foreground text-3xl font-bold">2025赛季排行榜</p>
            </div>
            <Link
              href="/rankings"
              className="text-primary-600 hover:text-primary-500 hidden text-base font-semibold sm:block"
            >
              查看完整榜单 →
            </Link>
          </div>

          <div className="bg-card overflow-hidden rounded-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">排名</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">会员</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">公司</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">积分</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">胜率</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rankings.map((ranking) => (
                    <tr key={ranking.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        {ranking.rank <= 3 ? (
                          <span className="text-2xl">
                            {ranking.rank === 1 && '🥇'}
                            {ranking.rank === 2 && '🥈'}
                            {ranking.rank === 3 && '🥉'}
                          </span>
                        ) : (
                          <span className="text-foreground font-semibold">{ranking.rank}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                            {ranking.name[0]}
                          </div>
                          <span className="text-foreground font-medium">{ranking.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-6 py-4 text-sm">
                        {ranking.companyName}
                      </td>
                      <td className="text-primary-600 px-6 py-4 text-right text-lg font-bold">
                        {ranking.totalPoints}
                      </td>
                      <td className="text-foreground px-6 py-4 text-right font-medium">
                        {ranking.winRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/rankings"
              className="text-primary-600 hover:text-primary-500 text-base font-semibold"
            >
              查看完整排行榜 →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - 如何参与 */}
      <section className="dark:bg-background bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-primary-600 mb-4 text-base font-semibold tracking-wide uppercase">
              如何参与
            </h2>
            <p className="text-foreground text-3xl font-bold">四步开始你的羽毛球之旅</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: 1,
                title: '注册账号',
                description: '使用微信或手机号快速注册',
                icon: '📱',
              },
              {
                step: 2,
                title: '完善资料',
                description: '填写公司、技能等级等信息',
                icon: '✏️',
              },
              {
                step: 3,
                title: '浏览活动',
                description: '查看即将到来的羽毛球局',
                icon: '🔍',
              },
              {
                step: 4,
                title: '报名参加',
                description: '一键报名，准时到场开打',
                icon: '✅',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="bg-primary-600 relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-xl ring-4 ring-white/20">
                    <span className="text-3xl font-bold text-white">{item.step}</span>
                  </div>
                </div>
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="text-foreground mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Wall - AI公司墙 */}
      <section className="bg-secondary dark:bg-background py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-primary-600 mb-2 text-base font-semibold tracking-wide uppercase">
              来自这些优秀公司
            </h2>
            <p className="text-foreground text-3xl font-bold">会员公司一览</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              '智谱AI',
              '商汤科技',
              '月之暗面',
              '百川智能',
              '零一万物',
              '面壁智能',
              'Minimax',
              '昆仑万维',
              '深度求索',
              'Stepfun',
              '星尘智能',
              'Recurrent AI',
            ].map((company) => (
              <div
                key={company}
                className="bg-card flex h-20 w-36 items-center justify-center rounded-lg px-4 text-center transition-all hover:shadow-md"
              >
                <span className="text-foreground text-sm font-semibold">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - 最终行动召唤 */}
      <section className="bg-primary-600 dark:bg-primary-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">准备好开始打球了吗？</h2>
            <p className="mb-10 text-lg text-white/90">
              加入五道口AI创业羽毛球俱乐部，结识优秀的AI创业者，享受运动的乐趣。
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/register"
                className="hover:bg-primary-700 text-primary-600 w-full rounded-lg bg-white px-8 py-3.5 text-base font-semibold shadow-lg transition-all hover:shadow-xl sm:w-auto"
              >
                立即加入
              </Link>
              <Link
                href="/members"
                className="w-full rounded-lg border-2 border-white px-8 py-3.5 text-center text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                浏览会员
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
