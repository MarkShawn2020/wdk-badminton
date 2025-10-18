'use client'

import Link from '@/components/Link'

export default function Pricing() {
  return (
    <>
      <div className="divide-border divide-y">
        {/* Promotion Banner */}
        <div className="from-primary-600 to-primary-700 bg-gradient-to-r py-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white md:text-base">
            <span className="text-xl">🏸</span>
            <span>2025年会员招募中！早鸟价限时优惠</span>
            <span className="hidden sm:inline">· 热爱羽毛球，即可加入</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 pt-6 pb-8 md:space-y-6">
          <h1 className="text-foreground text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            会员权益
          </h1>
          <p className="text-muted-foreground text-xl leading-8">
            加入五道口AI创业羽毛球俱乐部，结识优秀的AI创业者，享受运动的乐趣。
          </p>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>参与所有俱乐部活动</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>积分排名展示</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>会员专属社群</span>
            </div>
          </div>
        </div>

        <div className="py-16">
          {/* Membership Info */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold">会员类型</h2>
              <p className="text-muted-foreground text-lg">
                Phase 1 MVP版本暂时免费开放，所有功能均可使用
              </p>
            </div>

            {/* Free Access Card */}
            <div className="bg-card border-primary-500 mb-12 overflow-hidden rounded-2xl border-2 shadow-xl">
              <div className="bg-primary-600 px-8 py-6 text-center">
                <h3 className="mb-2 text-2xl font-bold text-white">MVP测试会员</h3>
                <p className="text-white/90">Phase 1 期间完全免费</p>
              </div>
              <div className="p-8">
                <div className="mb-8 text-center">
                  <div className="mb-2 text-5xl font-extrabold text-gray-900 dark:text-white">
                    ¥0
                  </div>
                  <p className="text-muted-foreground">限时免费 · 无需付费</p>
                </div>

                <div className="mb-8 space-y-4">
                  <h4 className="text-foreground mb-4 font-semibold">包含功能：</h4>
                  {[
                    '浏览会员列表',
                    '查看积分排名',
                    '查看活动预约',
                    '参与所有活动（场馆费AA制）',
                    '加入会员社群',
                    '积分累积和展示',
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <svg
                        className="text-primary-600 mt-0.5 h-5 w-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/signup"
                  className="bg-primary-600 hover:bg-primary-500 block w-full rounded-lg py-3 text-center text-lg font-semibold text-white transition-colors"
                >
                  立即注册
                </Link>
              </div>
            </div>

            {/* Future Plans */}
            <div className="border-border rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-foreground mb-4 text-center text-2xl font-bold">Phase 2 计划</h3>
              <p className="text-muted-foreground mb-6 text-center">
                未来将推出付费会员体系，提供更多专属权益
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="mb-3 text-3xl">🎯</div>
                  <h4 className="text-foreground mb-2 font-semibold">高级会员</h4>
                  <p className="text-muted-foreground text-sm">
                    优先报名热门活动、专属装备折扣、免费技术指导
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="mb-3 text-3xl">🏆</div>
                  <h4 className="text-foreground mb-2 font-semibold">赛事会员</h4>
                  <p className="text-muted-foreground text-sm">
                    参加官方赛事、专业教练培训、赛事奖金池
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="mb-3 text-3xl">💼</div>
                  <h4 className="text-foreground mb-2 font-semibold">企业会员</h4>
                  <p className="text-muted-foreground text-sm">
                    团体活动定制、企业赛事策划、品牌曝光机会
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-foreground mb-12 text-center text-3xl font-bold">如何开始</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                {
                  step: 1,
                  title: '注册账号',
                  description: '使用微信或手机号快速注册',
                },
                {
                  step: 2,
                  title: '完善资料',
                  description: '填写公司、技能等级等信息',
                },
                {
                  step: 3,
                  title: '浏览活动',
                  description: '查看即将到来的羽毛球局',
                },
                {
                  step: 4,
                  title: '报名参加',
                  description: '一键报名，准时到场开打',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <span className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-foreground mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-foreground mb-8 text-center text-3xl font-bold">会员福利</h2>
            <div className="border-border overflow-hidden rounded-2xl border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">
                      福利项目
                    </th>
                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {[
                    {
                      benefit: '🏟️ 活动参与',
                      description: '参与所有俱乐部组织的羽毛球活动',
                    },
                    {
                      benefit: '🏆 积分排名',
                      description: '通过比赛和活动积累积分，榜单展示',
                    },
                    {
                      benefit: '💬 会员社群',
                      description: '加入微信群，认识志同道合的球友',
                    },
                    {
                      benefit: '🎯 优先预约',
                      description: '热门场次优先报名权',
                    },
                    {
                      benefit: '💰 费用透明',
                      description: '场馆费用AA制，无隐形消费',
                    },
                    {
                      benefit: '🎁 装备优惠',
                      description: '会员专享羽毛球装备团购价',
                    },
                  ].map((item) => (
                    <tr key={item.benefit} className="bg-card">
                      <td className="text-foreground px-6 py-4 text-sm font-medium">
                        {item.benefit}
                      </td>
                      <td className="text-muted-foreground px-6 py-4 text-sm">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tight">
              常见问题
            </h2>
            <dl className="space-y-8">
              <div>
                <dt className="text-foreground text-lg font-semibold">Q: 现在注册需要付费吗？</dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  A: Phase 1 MVP版本完全免费！所有功能都可以使用。未来Phase
                  2会推出付费会员，但现有会员会享受优惠政策。
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Q: 参加活动需要额外付费吗？
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  A:
                  场馆费用需要支付，采用AA制，费用透明。具体金额取决于场馆和时长，一般每人20-50元。
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">Q: 我是初学者可以加入吗？</dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  A:
                  当然可以！我们有不同技能等级的活动，初学者可以选择适合自己的场次。而且我们会不定期组织技术指导课程。
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Q: 我不在AI行业可以加入吗？
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  A: 俱乐部主要面向AI创业者，但如果你热爱羽毛球，对AI行业感兴趣，也欢迎加入！
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">
                  Q: 活动时间和地点如何安排？
                </dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  A:
                  活动主要安排在工作日晚上和周末，地点在五道口及周边的专业羽毛球馆。具体信息请查看"预约"页面。
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-lg font-semibold">Q: 如何联系俱乐部？</dt>
                <dd className="text-muted-foreground mt-2 text-base">
                  A: 可以通过邮箱 contact@wdk-badminton.com
                  联系我们，或查看"关于"页面了解更多联系方式。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
