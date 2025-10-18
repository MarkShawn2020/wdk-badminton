import Link from '@/components/Link'
import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({
  title: '加入我们 - 五道口AI创业羽毛球俱乐部',
  description:
    '加入五道口AI创业羽毛球俱乐部，结识优秀的AI创业者，享受羽毛球运动的乐趣。Phase 1 MVP版本免费开放。',
})

export default function SignUp() {
  return (
    <>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-primary-100 dark:bg-primary-900 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl">
            🏸
          </div>
          <h2 className="text-foreground mt-6 text-center text-3xl font-bold tracking-tight">
            加入五道口AI创业羽毛球俱乐部
          </h2>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Phase 1 MVP版本完全免费，无需注册即可浏览内容
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-gray-900">
            <div className="space-y-6">
              <div className="bg-info/10 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="text-info h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div>
                      <p className="text-info-foreground text-sm">
                        <strong>Phase 1 MVP - 当前功能：</strong>
                      </p>
                      <ul className="text-info-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                        <li>浏览会员列表</li>
                        <li>查看积分排名</li>
                        <li>查看活动预约</li>
                        <li>了解俱乐部信息</li>
                        <li>完全免费，无需注册</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:from-orange-950 dark:to-red-950">
                <h3 className="text-foreground text-sm font-medium">Phase 2 计划 - 用户认证功能</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Phase 2将推出完整的用户系统：微信登录、手机验证、会员权限管理等功能。
                </p>
                <div className="text-muted-foreground mt-3 space-y-1 text-xs">
                  <p>✅ 微信快捷登录</p>
                  <p>✅ 手机号验证</p>
                  <p>✅ 个人资料管理</p>
                  <p>✅ 活动报名系统</p>
                  <p>✅ 积分自动累积</p>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="text-foreground text-sm font-medium">现在开始探索</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  无需等待，立即浏览俱乐部内容，了解会员风采和活动信息。
                </p>
                <div className="mt-4 flex gap-4">
                  <Link
                    href="/"
                    className="bg-primary-600 hover:bg-primary-500 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    🏠 返回首页
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
                  >
                    ℹ️ 关于我们
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="text-foreground mb-4 text-sm font-medium">立即探索：</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/members"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="text-2xl">👥</span>
                    <span className="text-foreground mt-2 text-sm font-medium">会员风采</span>
                  </Link>
                  <Link
                    href="/rankings"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="text-2xl">🏆</span>
                    <span className="text-foreground mt-2 text-sm font-medium">积分排名</span>
                  </Link>
                  <Link
                    href="/reservations"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="text-2xl">📅</span>
                    <span className="text-foreground mt-2 text-sm font-medium">活动预约</span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="text-2xl">💰</span>
                    <span className="text-foreground mt-2 text-sm font-medium">会员权益</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            🏸 五道口AI创业羽毛球俱乐部
            <br />
            Phase 1 MVP - 浏览模式 | Phase 2 - 完整用户系统 (开发中)
          </p>
        </div>
      </div>
    </>
  )
}
