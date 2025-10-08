# Stripe 集成配置文档

**项目:** ReelVan - AI Video Enhancement Platform
**版本:** 1.0.0
**更新日期:** 2025-10-09

---

## 📋 目录

1. [产品设计理念](#产品设计理念)
2. [技术架构](#技术架构)
3. [环境配置](#环境配置)
4. [本地开发测试](#本地开发测试)
5. [生产环境部署](#生产环境部署)
6. [常见问题](#常见问题)

---

## 产品设计理念

### 💰 流量包模式 (Pay-as-you-go)

ReelVan 采用**流量包**而非订阅模式:

```
✅ 用户购买 Credits (虚拟货币)
✅ 一次性付款,永久有效
✅ 多买多得,阶梯折扣
✅ 无月费,无自动续费
✅ 用完再买,灵活自由
```

**类比:**

- ✅ 正确理解: 像手机流量包 (100MB → 1GB → 10GB)
- ❌ 错误理解: 像 SaaS 订阅 (Starter Plan → Pro Plan)

---

### 📦 定价套餐

```typescript
// app/api/checkout/route.ts
const PRICING_TIERS = [
  { credits: 100, price: 100, discount: 0 }, // $1.00 - Trial Pack
  { credits: 500, price: 450, discount: 10 }, // $4.50 - Creator Pack (省 10%)
  { credits: 2000, price: 1600, discount: 20 }, // $16.00 - Pro Pack (省 20%) ⭐ 推荐
  { credits: 10000, price: 7000, discount: 30 }, // $70.00 - Business Pack (省 30%)
]
```

**说明:**

- 1 credit = $0.01
- 处理 1 个 30 秒视频 ≈ 240 credits ($2.40)
- 套餐名称 (Trial/Creator/Pro/Business) 仅为营销标签,本质都是买 credits

---

### 👥 Tier 系统 (反滥用机制)

**Tier 是永久升级,非订阅:**

| Tier   | 触发条件                      | 速率限制       | 其他功能 |
| ------ | ----------------------------- | -------------- | -------- |
| `free` | 注册赠送 100 credits          | 3 videos/day   | 无差异   |
| `paid` | 首次购买任意金额              | 50 videos/day  | 无差异   |
| `pro`  | 累计购买 ≥ $50 (5000 credits) | 200 videos/day | 无差异   |

**关键点:**

- ✅ **所有用户功能完全相同** (视频时长 120s, 文件大小 500MB, 支持 4K/水印移除等)
- ✅ **Tier 只影响每日处理数量** (防止免费用户滥用)
- ✅ **Tier 自动升级且永久有效** (购买后不会降级)
- ✅ **自动判定** (数据库 RPC 函数 `add_credits` 根据 `total_earned` 自动提升 tier)

**Tier 升级逻辑:**

```sql
-- supabase/migrations/20251009022856_update_tier_auto_upgrade.sql
IF v_new_total_earned >= 5100 THEN  -- 5000 购买 + 100 注册赠送
  v_new_tier := 'pro';
ELSIF v_new_total_earned > 100 THEN  -- 任意购买
  v_new_tier := 'paid';
ELSE
  v_new_tier := 'free';
END IF;
```

---

## 技术架构

### 🏗️ 核心组件

```
用户购买流程:
1. 用户访问 /pricing 页面
2. 点击购买 → 前端调用 POST /api/checkout
3. 后端创建 Stripe Checkout Session (动态定价)
4. 用户跳转到 Stripe 支付页面
5. 支付成功 → Stripe 发送 webhook 到 /api/webhooks/stripe
6. Webhook 调用 add_credits RPC 函数
7. add_credits 自动:
   - 增加用户余额
   - 记录交易日志
   - 根据累计购买自动升级 tier
8. 用户返回 Dashboard,看到新余额
```

### 📂 代码文件

| 文件                                       | 作用                           |
| ------------------------------------------ | ------------------------------ |
| `app/api/checkout/route.ts`                | 创建 Stripe Checkout Session   |
| `app/api/webhooks/stripe/route.ts`         | 处理 Stripe 支付事件 (webhook) |
| `lib/video/cost.ts`                        | 价格计算、Tier 逻辑            |
| `supabase/migrations/20251008000000_*.sql` | 数据库表和 RPC 函数            |
| `supabase/migrations/20251009022856_*.sql` | Tier 自动升级逻辑              |

### 🗄️ 数据库表

```sql
-- 用户积分余额
user_credits (
  user_id UUID PRIMARY KEY,
  balance INTEGER,           -- 当前余额
  total_earned INTEGER,      -- 累计获得 (用于判定 tier)
  total_spent INTEGER,       -- 累计消费
  tier TEXT,                 -- 'free', 'paid', 'pro'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- 积分交易日志
credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID,
  video_id UUID,
  type TEXT,                 -- 'purchase', 'processing_debit', 'refund', etc.
  amount INTEGER,            -- 正数为充值,负数为消费
  balance_after INTEGER,     -- 交易后余额
  stripe_payment_id TEXT,    -- Stripe Payment Intent ID
  stripe_session_id TEXT,    -- Stripe Checkout Session ID
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

---

## 环境配置

### 🔑 获取 Stripe 密钥

#### 测试模式 (开发环境)

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/login)
2. 登录你的 Stripe 账号 (香港账号)
3. 确保右上角切换到 **Test mode** (测试模式)
4. 进入 **Developers → API keys**
5. 复制以下密钥:
   ```
   Publishable key: pk_test_...
   Secret key: sk_test_... (点击 "Reveal test key" 查看)
   ```

#### 生产模式 (上线后)

1. 切换到 **Live mode** (右上角)
2. 复制:
   ```
   Publishable key: pk_live_...
   Secret key: sk_live_...
   ```

⚠️ **重要提示:**

- ❌ **永远不要将 Live mode 密钥提交到 Git**
- ✅ 在 Vercel/服务器环境变量中配置
- ✅ 本地开发使用 Test mode 密钥

---

### 📝 .env.local 配置

创建 `.env.local` 文件 (已在 `.gitignore` 中):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xncedgheyootaxipktai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# WaveSpeed API
WAVESPEED_API_KEY=你的_wavespeed_key
VIDEO_API_COST_PER_5_SECONDS=0.10

# Stripe Configuration (测试模式)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_你的测试公钥
STRIPE_SECRET_KEY=sk_test_你的测试密钥
STRIPE_WEBHOOK_SECRET=whsec_本地开发时用stripe_cli生成

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Job Secret (生成方法见下方)
CRON_SECRET=生成的随机密钥
```

#### 生成 CRON_SECRET

```bash
openssl rand -base64 32
# 输出示例: uXZH2Ud+2TPX1LAwwiNrORqa0ECgXCrD9nq/MY+tA7c=
```

---

## 本地开发测试

### 🛠️ 步骤 1: 安装 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 验证安装
stripe --version
```

### 🔗 步骤 2: 登录 Stripe

```bash
stripe login
```

浏览器会打开授权页面,授权后 CLI 连接到你的 Stripe 账号。

### 🎧 步骤 3: 启动 Webhook 监听

在**新的终端窗口**中运行:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

输出示例:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxx
```

**复制这个 `whsec_...` 密钥,更新到 `.env.local`:**

```bash
# .env.local
STRIPE_WEBHOOK_SECRET=whsec_刚才获取的密钥
```

⚠️ **注意:** 每次重新运行 `stripe listen` 都会生成新的 secret,需要更新 `.env.local` 并**重启 Next.js 开发服务器**。

### 🚀 步骤 4: 启动开发服务器

在**另一个终端窗口**中:

```bash
pnpm dev
```

访问 http://localhost:3000

### 🧪 步骤 5: 测试购买流程

#### 方式 A: API 测试 (推荐先测试后端)

```bash
# 1. 注册并登录,获取 access_token
# 打开浏览器 F12 → Application → Local Storage
# 找到 supabase.auth.token

# 2. 测试创建 checkout session
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "credits": 100
  }'
```

**预期响应:**

```json
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_...",
    "sessionId": "cs_test_..."
  }
}
```

#### 方式 B: 浏览器测试

1. 复制上面返回的 `url`
2. 在浏览器中打开
3. 使用 Stripe 测试卡号:
   - **卡号:** `4242 4242 4242 4242`
   - **过期日期:** 任意未来日期 (如 `12/25`)
   - **CVC:** 任意 3 位数 (如 `123`)
   - **邮编:** 任意邮编 (如 `12345`)
4. 点击 **Pay**
5. 支付成功后跳转到 `http://localhost:3000/dashboard?payment=success&session_id=cs_test_...`

### ✅ 步骤 6: 验证结果

#### 检查终端日志

**终端 1 (Next.js dev server):**

```
Stripe webhook received: checkout.session.completed
Checkout session completed: { session_id: 'cs_test_...', ... }
✅ Credits added successfully: { user_id: '...', amount: '100' }
```

**终端 2 (Stripe CLI):**

```
2025-10-09 02:30:45   --> checkout.session.completed [evt_test_...]
2025-10-09 02:30:45  <--  [200] POST http://localhost:3000/api/webhooks/stripe
```

#### 检查数据库

访问 [Supabase Dashboard](https://supabase.com/dashboard/project/xncedgheyootaxipktai)

**Table Editor → user_credits:**

| user_id    | balance | total_earned | tier | updated_at     |
| ---------- | ------- | ------------ | ---- | -------------- |
| 你的用户ID | 200     | 200          | paid | 2025-10-09 ... |

- `balance`: 100 (注册赠送) + 100 (购买) = 200
- `tier`: 从 `free` 自动升级到 `paid`

**Table Editor → credit_transactions:**

| type         | amount | balance_after | stripe_payment_id | description                      |
| ------------ | ------ | ------------- | ----------------- | -------------------------------- |
| signup_bonus | 100    | 100           | -                 | Welcome bonus - 100 free credits |
| purchase     | 100    | 200           | pi_xxx            | Purchased 100 credits            |

---

## 生产环境部署

### 🌐 步骤 1: 配置真实 Webhook

部署到 Vercel 后:

1. 访问 [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. 切换到 **Live mode**
3. 点击 **+ Add endpoint**
4. 配置:
   - **Endpoint URL:** `https://你的域名.com/api/webhooks/stripe`
   - **Events to send:** 选择以下事件:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
     - ✅ `charge.refunded`
5. 点击 **Add endpoint**
6. 复制 **Signing secret** (以 `whsec_` 开头)

### 🔐 步骤 2: 配置 Vercel 环境变量

在 Vercel Dashboard → 你的项目 → Settings → Environment Variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_你的生产公钥
STRIPE_SECRET_KEY = sk_live_你的生产密钥
STRIPE_WEBHOOK_SECRET = whsec_刚才获取的webhook密钥

NEXT_PUBLIC_APP_URL = https://你的域名.com
NEXT_PUBLIC_SUPABASE_URL = https://xncedgheyootaxipktai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的_anon_key
SUPABASE_SERVICE_ROLE_KEY = 你的_service_role_key

WAVESPEED_API_KEY = 你的_wavespeed_key
VIDEO_API_COST_PER_5_SECONDS = 0.10
CRON_SECRET = 你的_cron_secret
```

### 🚀 步骤 3: 应用数据库 Migration

```bash
# 推送所有 migrations 到远程 Supabase
supabase db push --db-url postgresql://postgres:密码@db.xncedgheyootaxipktai.supabase.co:5432/postgres
```

或者在 Supabase Dashboard → SQL Editor 中手动执行:

1. `20251008000000_create_video_processing_tables.sql`
2. `20251009022856_update_tier_auto_upgrade.sql`

### ✅ 步骤 4: 测试生产环境

1. 使用真实银行卡测试支付 (会真实扣款!)
2. 或者使用 Stripe 的 [测试模式](https://stripe.com/docs/testing) 先测试
3. 验证 Webhook 是否收到事件 (Stripe Dashboard → Webhooks → 查看日志)

---

## 常见问题

### ❓ Webhook 没收到事件怎么办?

**症状:** 支付成功,但 credits 没增加

**排查步骤:**

1. **检查 Stripe CLI 是否运行** (本地开发)

   ```bash
   # 确保这个命令在运行
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **检查 STRIPE_WEBHOOK_SECRET 是否更新**

   ```bash
   # .env.local 中的 STRIPE_WEBHOOK_SECRET 必须与 stripe listen 输出的一致
   cat .env.local | grep STRIPE_WEBHOOK_SECRET
   ```

3. **重启 Next.js 开发服务器**

   ```bash
   # 环境变量更新后必须重启
   # Ctrl+C 停止,然后:
   pnpm dev
   ```

4. **查看 Next.js 日志**

   ```
   # 应该看到:
   Stripe webhook received: checkout.session.completed
   ```

5. **查看 Stripe Dashboard 事件日志**
   - 访问 https://dashboard.stripe.com/test/events
   - 找到 `checkout.session.completed` 事件
   - 查看 webhook 响应状态 (应该是 200)

---

### ❓ 支付成功但 Tier 没升级?

**症状:** 用户购买了 credits,但 tier 依然是 `free`

**排查:**

1. **检查数据库 migration 是否应用**

   ```sql
   -- 在 Supabase SQL Editor 中运行
   SELECT routine_name, routine_definition
   FROM information_schema.routines
   WHERE routine_name = 'add_credits';
   ```

   确保函数定义中包含 tier 升级逻辑 (v_new_tier 相关代码)

2. **检查 total_earned 值**

   ```sql
   SELECT user_id, balance, total_earned, tier
   FROM user_credits
   WHERE user_id = '你的用户ID';
   ```

   - `total_earned = 100` → tier 应该是 `free`
   - `total_earned > 100` → tier 应该是 `paid`
   - `total_earned >= 5100` → tier 应该是 `pro`

3. **手动修复 (如果 migration 未生效)**
   ```bash
   # 重新应用 migration
   supabase db reset
   ```

---

### ❓ 测试卡支付失败?

**症状:** 使用 `4242 4242 4242 4242` 提示错误

**解决:**

1. **确保使用 Test mode 密钥**

   ```bash
   # .env.local 中应该是:
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

2. **检查 Stripe Dashboard 是否在 Test mode**
   - 右上角应显示 "Test mode" 开关

3. **尝试其他测试卡**
   - 成功: `4242 4242 4242 4242`
   - 需要 3D 验证: `4000 0027 6000 3184`
   - 被拒: `4000 0000 0000 0002`

   详见: https://stripe.com/docs/testing

---

### ❓ 生产环境 Webhook 签名验证失败?

**症状:** 生产环境 webhook 返回 400 "Invalid signature"

**解决:**

1. **检查环境变量**

   ```bash
   # Vercel Dashboard → Environment Variables
   # 确保 STRIPE_WEBHOOK_SECRET 使用的是生产环境的 whsec_...
   ```

2. **重新创建 Webhook**
   - Stripe Dashboard → Webhooks → 删除旧的
   - 创建新的,复制新的 signing secret
   - 更新 Vercel 环境变量

3. **检查 URL 是否正确**
   - Endpoint URL 必须是 HTTPS
   - 必须是 `https://你的域名.com/api/webhooks/stripe`
   - 不能有多余的 `/` 或查询参数

---

### ❓ 如何测试 Tier 升级?

```bash
# 方式 1: 购买多次 100 credits
# free → paid (第 1 次购买)
curl -X POST http://localhost:3000/api/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"credits": 100}'

# 方式 2: 直接购买 10000 credits
# free → pro (一次到位)
curl -X POST http://localhost:3000/api/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"credits": 10000}'

# 方式 3: 直接修改数据库测试
UPDATE user_credits
SET total_earned = 5100, tier = 'pro'
WHERE user_id = '你的用户ID';
```

---

### ❓ 如何退款?

1. **Stripe Dashboard → Payments**
2. 找到对应的 Payment Intent
3. 点击 **Refund**
4. ⚠️ **注意:** 目前代码未自动处理退款 (TODO)
   - 需要手动扣减用户 credits
   - 或者实现 `charge.refunded` webhook 处理逻辑

---

## 📚 参考资源

- **Stripe 文档:** https://stripe.com/docs
- **Stripe API 参考:** https://stripe.com/docs/api
- **Stripe 测试卡:** https://stripe.com/docs/testing
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Supabase 文档:** https://supabase.com/docs

---

## 🔒 安全检查清单

上线前确认:

- [ ] ✅ Live mode 密钥已配置在 Vercel (未提交到 Git)
- [ ] ✅ Webhook 签名验证已启用 (代码中已实现)
- [ ] ✅ 所有 API 路由都有 `requireAuth()` 认证
- [ ] ✅ Supabase RLS (Row Level Security) 已启用
- [ ] ✅ CORS 配置正确 (仅允许自己的域名)
- [ ] ✅ 环境变量中无敏感信息硬编码
- [ ] ✅ Stripe Dashboard 已设置正确的 webhook 事件
- [ ] ✅ 数据库 migrations 已应用到生产环境

---

**最后更新:** 2025-10-09
**维护者:** ReelVan Dev Team
