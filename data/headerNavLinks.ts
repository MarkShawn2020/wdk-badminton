/**
 * Header Navigation Links - 五道口AI创业羽毛球俱乐部
 *
 * Phase 1: 静态页面导航
 * Phase 2: 添加会员中心（需要登录）
 */

const headerNavLinks = [
  { href: '/', title: '首页', icon: '🏠' },
  { href: '/members', title: '会员', icon: '👥' },
  { href: '/rankings', title: '排名', icon: '🏆' },
  { href: '/reservations', title: '预约', icon: '📅' },
  { href: '/about', title: '关于', icon: 'ℹ️' },
  // Phase 2: 会员中心（需要登录后显示）
  // { href: '/dashboard', title: '我的', icon: '👤', requireAuth: true },
]

export default headerNavLinks
