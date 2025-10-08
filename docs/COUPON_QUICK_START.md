# 🎟️ 优惠券快速使用指南

## 用户在哪里输入优惠券？

用户现在可以在 **3 个地方** 输入优惠券：

### 1. 📊 Dashboard 页面（推荐）

**路径：** `/dashboard`

**位置：** Credits 卡片中

**步骤：**

1. 登录后前往 Dashboard
2. 在 Credits 卡片中点击 "Redeem Coupon" 按钮
3. 输入优惠码（如 `WELCOME1000`）
4. 点击 "Redeem" 或按回车
5. 成功后会看到新的积分余额

**特点：**

- ✅ 可折叠设计，不占空间
- ✅ 显示总收入和总支出统计
- ✅ 实时更新积分余额
- ✅ 成功后自动折叠

---

### 2. 💰 Pricing 页面

**路径：** `/pricing`

**位置：** 页面顶部（定价表格之前）

**步骤：**

1. 前往 Pricing 页面
2. 看到醒目的渐变卡片 "Have a Coupon Code?"
3. 输入优惠码
4. 点击 "Redeem"

**特点：**

- ✅ 醒目的渐变背景
- ✅ 在定价信息之前，提醒用户先试试优惠码
- ✅ 适合新用户

---

### 3. 🎨 任何自定义页面

开发者可以在任何页面添加：

```tsx
import { CouponInput } from '@/components/coupon/CouponInput'

;<CouponInput
  onSuccess={(credits, balance) => {
    alert(`You got ${credits} credits!`)
  }}
/>
```

---

## 管理员：如何创建优惠码？

### 最简单的方式

在 Supabase SQL Editor 执行：

```sql
SELECT create_coupon('WELCOME1000', 1000);
```

就这样！用户就可以使用 `WELCOME1000` 获得 1000 积分了。

### 完整参数

```sql
SELECT create_coupon(
  'NEWYEAR2025',              -- 优惠码
  500,                        -- 积分数量
  'New Year 2025 promotion',  -- 描述
  100,                        -- 最多100人能用（NULL=无限）
  1,                          -- 每人限用1次
  NOW(),                      -- 开始时间
  '2025-12-31 23:59:59+00'   -- 结束时间（NULL=永久）
);
```

---

## 测试流程

### 1. 创建测试优惠码

```sql
SELECT create_coupon('TEST100', 100, 'Test coupon', NULL, 999);
```

### 2. 测试兑换

1. 登录用户账号
2. 前往 `/dashboard`
3. 点击 "Redeem Coupon"
4. 输入 `TEST100`
5. 点击 "Redeem"
6. 查看积分是否增加

### 3. 验证数据

```sql
-- 查看优惠码
SELECT * FROM coupons WHERE code = 'TEST100';

-- 查看兑换记录
SELECT * FROM coupon_redemptions ORDER BY redeemed_at DESC LIMIT 5;

-- 查看用户积分
SELECT * FROM user_credits WHERE user_id = 'your-user-id';
```

---

## 常见场景

### 新用户欢迎

```sql
SELECT create_coupon('WELCOME1000', 1000, 'Welcome bonus', NULL, 1);
```

用户注册后在 Dashboard 输入 `WELCOME1000` 获得 1000 积分。

### 限时活动

```sql
SELECT create_coupon(
  'FLASH500',
  500,
  'Flash sale - 24 hours only',
  100,  -- 只有100人能用
  1,
  NOW(),
  NOW() + INTERVAL '24 hours'
);
```

在 Pricing 页面宣传这个优惠码。

### 合作伙伴推广

```sql
SELECT create_coupon('PARTNER-ABC', 250, 'Partner ABC promotion', 500, 1);
```

给合作伙伴分发 `PARTNER-ABC` 优惠码。

---

## UI 截图位置

### Dashboard 页面

```
┌─────────────────────────────────┐
│  Dashboard                      │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Credits                     │ │
│ │ 1,000 credits ($10.00)     │ │
│ │                             │ │
│ │ [Buy Credits]               │ │
│ │ [▼ Redeem Coupon]          │ │  ← 点这里
│ │                             │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │ [优惠码输入框]          │ │ │  ← 展开后显示
│ │ │ [Redeem]                │ │ │
│ │ └─────────────────────────┘ │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Pricing 页面

```
┌─────────────────────────────────┐
│  Pricing                        │
├─────────────────────────────────┤
│                                 │
│  ╔═══════════════════════════╗  │
│  ║ Have a Coupon Code?       ║  │  ← 醒目的渐变卡片
│  ║                           ║  │
│  ║ [优惠码输入框]  [Redeem] ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│  [Free]  [Pay-as-you-go]  [Pro] │
└─────────────────────────────────┘
```

---

## 下一步

1. ✅ 创建一些真实的优惠码
2. ✅ 在营销材料中宣传优惠码
3. ✅ 监控优惠码使用情况
4. ✅ 根据数据优化优惠策略

完整文档：`docs/COUPON_SYSTEM.md`
