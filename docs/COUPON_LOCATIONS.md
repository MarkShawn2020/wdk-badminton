# 🎯 优惠券输入位置说明

## 位置 1：Dashboard 页面的 Credits 卡片

### 如何访问：

1. 点击右上角 **用户头像**
2. 下拉菜单中选择 **"Dashboard"**
3. 在 Credits 卡片中点击 **"Redeem Coupon"** 按钮

### 界面结构：

```
┌─────────────────────────────────────┐
│  用户头像 ▼                         │
│  ┌───────────────────────────┐     │
│  │ 用户名                     │     │
│  │ email@example.com         │     │
│  ├───────────────────────────┤     │
│  │ ✓ Dashboard               │  ← 点击这里
│  │   Upload Video            │     │
│  │   Settings                │     │
│  ├───────────────────────────┤     │
│  │ Sign Out                  │     │
│  └───────────────────────────┘     │
└─────────────────────────────────────┘
```

### Dashboard 页面：

```
┌──────────────────────────────────────────────┐
│  Dashboard                                   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────────┐  ┌───────────┐    │
│  │ Credits             │  │ Videos    │    │
│  │ 1,000 credits       │  │ ...       │    │
│  │ ($10.00)            │  │           │    │
│  │                     │  └───────────┘    │
│  │ [Buy Credits]       │                   │
│  │ [🎁 Redeem Coupon ▼]│  ← 点击展开      │
│  │                     │                   │
│  │ ┌─────────────────┐ │                   │
│  │ │ 🎁 Enter code   │ │  ← 展开后显示    │
│  │ │ [Redeem]        │ │                   │
│  │ └─────────────────┘ │                   │
│  └─────────────────────┘                   │
└──────────────────────────────────────────────┘
```

**组件文件：** `components/dashboard/CreditsCard.tsx`

---

## 位置 2：Pricing 页面顶部

### 如何访问：

1. 导航栏点击 **"Pricing"**
2. 或直接访问 `/pricing`

### 界面结构：

```
┌──────────────────────────────────────────────┐
│  Pricing                                     │
├──────────────────────────────────────────────┤
│                                              │
│  ╔════════════════════════════════════════╗ │
│  ║  🎟️ Have a Coupon Code?              ║ │ ← 醒目的渐变卡片
│  ║                                        ║ │
│  ║  Redeem your coupon to get free       ║ │
│  ║  credits instantly                    ║ │
│  ║                                        ║ │
│  ║  ┌────────────────┐  ┌─────────┐    ║ │
│  ║  │ 🎁 Enter code  │  │ Redeem  │    ║ │
│  ║  └────────────────┘  └─────────┘    ║ │
│  ╚════════════════════════════════════════╝ │
│                                              │
│  [Free]  [Pay-as-you-go]  [Pro]            │
│  定价表格...                                │
└──────────────────────────────────────────────┘
```

**页面文件：** `app/pricing/page.tsx`

---

## 位置 3：任意自定义页面（开发者）

开发者可以在任何页面添加优惠券输入：

```tsx
import { CouponInput } from '@/components/coupon/CouponInput'

export function MyCustomPage() {
  return (
    <div>
      <h1>My Page</h1>

      <CouponInput
        onSuccess={(credits, balance) => {
          console.log(`Received ${credits} credits! New balance: ${balance}`)
          // 可以在这里添加自定义逻辑
        }}
      />
    </div>
  )
}
```

**组件文件：** `components/coupon/CouponInput.tsx`

---

## 关键文件列表

### 前端组件

- `components/auth/UserAvatar.tsx` - 用户头像下拉菜单
- `components/dashboard/CreditsCard.tsx` - Credits 卡片（含优惠券输入）
- `components/coupon/CouponInput.tsx` - 优惠券输入组件（可复用）

### 页面

- `app/dashboard/page.tsx` - Dashboard 页面
- `app/pricing/page.tsx` - Pricing 页面

### API

- `app/api/coupons/redeem/route.ts` - 优惠券兑换 API

### 数据库

- `supabase/migrations/20251009000000_create_coupon_system.sql` - 优惠券系统数据库

---

## 测试流程

### 1. 创建测试优惠码

在 Supabase SQL Editor 执行：

```sql
SELECT create_coupon('TEST100', 100, 'Test coupon', NULL, 999);
```

### 2. 测试 Dashboard 兑换

1. 登录账号
2. 点击头像 → Dashboard
3. 在 Credits 卡片点击 "Redeem Coupon"
4. 输入 `TEST100`
5. 点击 "Redeem"
6. 查看积分是否增加 100

### 3. 测试 Pricing 页面兑换

1. 前往 `/pricing`
2. 在顶部卡片输入 `TEST100`
3. 点击 "Redeem"
4. 查看积分是否增加

---

## 常见问题排查

### 问题：找不到优惠券输入

**解决方案：**

1. 确认已登录账号
2. Dashboard: 点击 "Redeem Coupon" 展开输入框
3. Pricing: 查看页面顶部的渐变卡片

### 问题：点击 Redeem 没有反应

**解决方案：**

1. 打开浏览器控制台查看错误
2. 检查网络请求是否成功
3. 确认 API `/api/coupons/redeem` 正常运行

### 问题：提示"优惠码不存在"

**解决方案：**

1. 检查优惠码拼写是否正确
2. 确认优惠码未过期
3. 在数据库中查询：`SELECT * FROM coupons WHERE code = 'YOUR_CODE'`

---

## 更新日志

- **2025-10-09**: 创建优惠券系统
  - ✅ Dashboard Credits 卡片集成
  - ✅ Pricing 页面顶部醒目展示
  - ✅ 可复用的 CouponInput 组件
  - ✅ 用户头像下拉菜单添加 Dashboard 链接
