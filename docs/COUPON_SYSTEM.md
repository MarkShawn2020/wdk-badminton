# 优惠券系统使用指南

## 📋 目录

1. [功能概述](#功能概述)
2. [快速开始](#快速开始)
3. [API 文档](#api-文档)
4. [前端集成](#前端集成)
5. [管理员操作](#管理员操作)
6. [安全措施](#安全措施)
7. [常见问题](#常见问题)

---

## 功能概述

优惠券系统允许用户通过输入优惠码来获得积分奖励。

### 核心功能

- ✅ 用户兑换优惠码获得积分
- ✅ 支持使用次数限制（全局和每用户）
- ✅ 支持有效期设置
- ✅ 自动防重复兑换
- ✅ 完整审计日志
- ✅ 管理员创建和管理优惠码

### 典型使用场景

1. **新用户欢迎礼包**: `WELCOME1000` - 新用户注册后获得 1000 积分
2. **节日促销**: `NEWYEAR2025` - 限时活动，每人限用1次
3. **合作伙伴推广**: `PARTNER-XYZ` - 特定合作伙伴分发的优惠码
4. **用户补偿**: `SORRY-500` - 服务中断补偿用户
5. **推荐奖励**: `REFER-ABC123` - 推荐人和被推荐人都获得积分

---

## 快速开始

### 1. 创建第一个优惠码（管理员）

使用 Supabase SQL Editor 或管理员 API:

```sql
SELECT create_coupon(
  'WELCOME1000',        -- 优惠码
  1000,                 -- 积分数量
  'New user welcome bonus',  -- 描述
  NULL,                 -- 最大使用次数（NULL = 无限制）
  1,                    -- 每用户最大使用次数
  NOW(),                -- 生效时间
  NOW() + INTERVAL '30 days',  -- 失效时间（30天后）
  NULL                  -- 创建者 ID
);
```

### 2. 前端集成优惠券输入组件

```tsx
import { CouponInput } from '@/components/coupon/CouponInput'

export function PricingPage() {
  const handleCouponSuccess = (creditsReceived: number, newBalance: number) => {
    console.log(`Received ${creditsReceived} credits, new balance: ${newBalance}`)
    // 刷新用户积分显示
    // 显示成功提示
  }

  return (
    <div>
      <h1>Purchase Credits</h1>

      {/* 优惠券输入 */}
      <CouponInput onSuccess={handleCouponSuccess} className="mb-6" />

      {/* 其他购买选项 */}
    </div>
  )
}
```

---

## API 文档

### 1. 兑换优惠码

**POST /api/coupons/redeem**

用户兑换优惠码获得积分。

**Headers:**

```
Authorization: Bearer {user_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "code": "WELCOME1000"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Successfully redeemed! You received 1000 credits",
    "creditsReceived": 1000,
    "newBalance": 1100
  }
}
```

**Error Responses:**

| 状态码 | 原因                     | 响应示例                                                           |
| ------ | ------------------------ | ------------------------------------------------------------------ |
| 400    | 优惠码无效/已过期/已用完 | `{ "success": false, "error": "Invalid or inactive coupon code" }` |
| 401    | 未登录                   | `{ "success": false, "error": "Authentication required" }`         |
| 500    | 服务器错误               | `{ "success": false, "error": "Internal server error" }`           |

### 2. 创建优惠码（管理员）

**POST /api/admin/coupons**

创建新的优惠码。

**Headers:**

```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "code": "SUMMER2025",
  "creditsAmount": 500,
  "description": "Summer promotion",
  "maxUses": 1000,
  "maxUsesPerUser": 1,
  "validFrom": "2025-06-01T00:00:00Z",
  "validUntil": "2025-08-31T23:59:59Z"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "coupon": {
      "id": "uuid",
      "code": "SUMMER2025",
      "credits_amount": 500,
      "max_uses": 1000,
      "current_uses": 0,
      ...
    },
    "message": "Coupon created successfully"
  }
}
```

### 3. 获取所有优惠码（管理员）

**GET /api/admin/coupons**

获取所有优惠码列表及使用统计。

**Response (200):**

```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": "uuid",
        "code": "WELCOME1000",
        "credits_amount": 1000,
        "current_uses": 450,
        "max_uses": null,
        "redemptionsCount": 450,
        "is_active": true,
        ...
      }
    ],
    "total": 10
  }
}
```

---

## 前端集成

### CouponInput 组件

`components/coupon/CouponInput.tsx` 提供了完整的UI和交互逻辑。

**Props:**

| 名称      | 类型                                                    | 必填 | 说明           |
| --------- | ------------------------------------------------------- | ---- | -------------- |
| onSuccess | `(creditsReceived: number, newBalance: number) => void` | 否   | 兑换成功回调   |
| className | `string`                                                | 否   | 自定义样式类名 |

**Features:**

- 输入验证（自动转大写）
- 加载状态
- 成功/失败反馈
- 回车提交
- 响应式设计

**使用示例:**

```tsx
// 基础使用
<CouponInput />

// 带回调
<CouponInput
  onSuccess={(credits, balance) => {
    alert(`You got ${credits} credits!`)
    refreshUserBalance()
  }}
/>

// 自定义样式
<CouponInput className="max-w-md mx-auto" />
```

### 集成到现有页面

推荐在以下页面添加优惠券输入：

1. **Pricing 页面** - 购买积分时
2. **Dashboard** - 用户中心
3. **Signup 完成页** - 新用户引导

示例：

```tsx
// app/pricing/page.tsx
import { CouponInput } from '@/components/coupon/CouponInput'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1>Get Credits</h1>

      {/* 优惠码部分 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Have a coupon code?</h2>
        <CouponInput />
      </section>

      {/* 购买选项 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Or purchase credits</h2>
        {/* Stripe payment options */}
      </section>
    </div>
  )
}
```

---

## 管理员操作

### 创建优惠码的最佳实践

#### 1. 优惠码命名规范

- **大写字母 + 数字**: `WELCOME1000`, `SUMMER2025`
- **用连字符分隔**: `NEW-USER-BONUS`, `PARTNER-ABC`
- **避免容易混淆的字符**: 不用 O和0, I和1
- **有意义的名称**: 让用户一看就知道用途

#### 2. 使用次数设置

| 场景       | max_uses    | max_uses_per_user |
| ---------- | ----------- | ----------------- |
| 新用户欢迎 | NULL (无限) | 1                 |
| 限量活动   | 1000        | 1                 |
| 合作伙伴   | 500         | 1                 |
| 补偿用户   | 1           | 1                 |
| 推荐奖励   | NULL        | 1                 |

#### 3. 有效期设置

```sql
-- 永久有效（不推荐）
valid_until = NULL

-- 限时活动（推荐）
valid_until = NOW() + INTERVAL '7 days'

-- 指定日期
valid_until = '2025-12-31 23:59:59+00'

-- 延迟生效
valid_from = '2025-06-01 00:00:00+00'
valid_until = '2025-06-30 23:59:59+00'
```

### 常用 SQL 操作

```sql
-- 查看所有优惠码
SELECT
  code,
  credits_amount,
  current_uses,
  max_uses,
  is_active,
  valid_until
FROM coupons
ORDER BY created_at DESC;

-- 查看特定优惠码的使用情况
SELECT
  c.code,
  c.current_uses,
  COUNT(cr.id) as actual_redemptions,
  SUM(cr.credits_received) as total_credits_given
FROM coupons c
LEFT JOIN coupon_redemptions cr ON c.id = cr.coupon_id
WHERE c.code = 'WELCOME1000'
GROUP BY c.id, c.code, c.current_uses;

-- 禁用优惠码
UPDATE coupons
SET is_active = false
WHERE code = 'OLD_CODE';

-- 延长优惠码有效期
UPDATE coupons
SET valid_until = valid_until + INTERVAL '30 days'
WHERE code = 'SUMMER2025';

-- 查看某用户的兑换历史
SELECT
  c.code,
  cr.credits_received,
  cr.redeemed_at
FROM coupon_redemptions cr
JOIN coupons c ON cr.coupon_id = c.id
WHERE cr.user_id = 'user-uuid'
ORDER BY cr.redeemed_at DESC;
```

---

## 安全措施

### 已实现的安全功能

1. **防重复兑换**
   - 数据库唯一约束 `UNIQUE (user_id, coupon_id)`
   - 事务保证原子性

2. **使用限制验证**
   - 全局使用次数检查
   - 每用户使用次数检查
   - 有效期验证

3. **审计日志**
   - 记录所有兑换（成功和失败）
   - IP 地址和 User Agent
   - 时间戳

4. **权限控制**
   - RLS 策略保护数据
   - 只有 service_role 可以修改优惠码
   - 用户只能查看自己的兑换记录

### 建议添加的安全措施

#### 1. Rate Limiting

限制用户兑换尝试频率：

```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis'

export async function checkCouponRateLimit(userId: string): Promise<boolean> {
  const redis = Redis.fromEnv()
  const key = `coupon_rate_limit:${userId}`
  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, 3600) // 1 hour
  }

  return count <= 5 // Max 5 attempts per hour
}
```

#### 2. 优惠码复杂度

生成随机优惠码：

```typescript
function generateCouponCode(prefix: string = ''): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 排除易混淆字符
  const length = 8
  let code = prefix

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return code
}

// 示例: PROMO-K7M9P4Q2
```

#### 3. 监控异常使用

```sql
-- 检测可疑活动
SELECT
  user_id,
  COUNT(*) as redemptions,
  COUNT(DISTINCT coupon_id) as unique_coupons,
  MIN(redeemed_at) as first_redemption,
  MAX(redeemed_at) as last_redemption
FROM coupon_redemptions
WHERE redeemed_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) > 5  -- 24小时内兑换超过5次
ORDER BY redemptions DESC;
```

---

## 常见问题

### Q1: 用户提示"已使用过此优惠码"，但实际没有？

**原因：** 可能是之前兑换成功但前端没有显示，或者用户忘记了。

**解决方案：**

```sql
-- 查询用户的兑换记录
SELECT * FROM coupon_redemptions
WHERE user_id = 'user-uuid'
  AND coupon_id = (SELECT id FROM coupons WHERE code = 'CODE');
```

### Q2: 如何批量创建优惠码？

**方案：** 使用循环 + `create_coupon()` 函数

```sql
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    PERFORM create_coupon(
      'BATCH' || LPAD(i::TEXT, 4, '0'),  -- BATCH0001, BATCH0002, ...
      100,                                -- 100 credits each
      'Batch coupon ' || i,
      1,                                  -- Single use
      1
    );
  END LOOP;
END $$;
```

### Q3: 如何导出所有优惠码？

```sql
-- 导出为 CSV（在 Supabase SQL Editor）
COPY (
  SELECT
    code,
    credits_amount,
    max_uses,
    current_uses,
    valid_from,
    valid_until,
    is_active
  FROM coupons
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER;
```

### Q4: 用户积分没有增加？

**检查步骤：**

1. 查看 `credit_transactions` 表

```sql
SELECT * FROM credit_transactions
WHERE user_id = 'user-uuid'
  AND type = 'coupon_redemption'
ORDER BY created_at DESC
LIMIT 5;
```

2. 查看 `user_credits` 表

```sql
SELECT * FROM user_credits WHERE user_id = 'user-uuid';
```

3. 查看数据库日志（Supabase Dashboard → Logs）

### Q5: 如何撤销用户的优惠码兑换？

```sql
-- 1. 查找兑换记录
SELECT * FROM coupon_redemptions
WHERE user_id = 'user-uuid'
  AND coupon_id = (SELECT id FROM coupons WHERE code = 'CODE');

-- 2. 手动扣除积分
UPDATE user_credits
SET
  balance = balance - 1000,
  total_earned = total_earned - 1000
WHERE user_id = 'user-uuid';

-- 3. 删除兑换记录（允许重新兑换）
DELETE FROM coupon_redemptions
WHERE user_id = 'user-uuid'
  AND coupon_id = (SELECT id FROM coupons WHERE code = 'CODE');

-- 4. 减少优惠码使用计数
UPDATE coupons
SET current_uses = current_uses - 1
WHERE code = 'CODE';
```

---

## 数据库Schema

### coupons 表

| 字段              | 类型      | 说明                      |
| ----------------- | --------- | ------------------------- |
| id                | UUID      | 主键                      |
| code              | TEXT      | 优惠码（唯一）            |
| description       | TEXT      | 描述                      |
| credits_amount    | INTEGER   | 积分数量                  |
| max_uses          | INTEGER   | 最大使用次数（NULL=无限） |
| current_uses      | INTEGER   | 当前使用次数              |
| max_uses_per_user | INTEGER   | 每用户最大使用次数        |
| valid_from        | TIMESTAMP | 生效时间                  |
| valid_until       | TIMESTAMP | 失效时间（NULL=永久）     |
| is_active         | BOOLEAN   | 是否激活                  |
| created_by        | UUID      | 创建者                    |
| created_at        | TIMESTAMP | 创建时间                  |
| updated_at        | TIMESTAMP | 更新时间                  |

### coupon_redemptions 表

| 字段             | 类型      | 说明       |
| ---------------- | --------- | ---------- |
| id               | UUID      | 主键       |
| coupon_id        | UUID      | 优惠码ID   |
| user_id          | UUID      | 用户ID     |
| credits_received | INTEGER   | 获得的积分 |
| redeemed_at      | TIMESTAMP | 兑换时间   |
| ip_address       | TEXT      | IP地址     |
| user_agent       | TEXT      | User Agent |

---

## 相关文件

- **数据库迁移**: `supabase/migrations/20251009000000_create_coupon_system.sql`
- **兑换 API**: `app/api/coupons/redeem/route.ts`
- **管理 API**: `app/api/admin/coupons/route.ts`
- **前端组件**: `components/coupon/CouponInput.tsx`

---

## 下一步

- [ ] 添加 Rate Limiting
- [ ] 实现管理员UI界面
- [ ] 添加优惠码使用统计图表
- [ ] 实现批量创建工具
- [ ] 添加优惠码过期提醒
- [ ] 实现推荐奖励系统
