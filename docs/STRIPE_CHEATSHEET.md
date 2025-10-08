# Stripe 集成速查表

> 一页纸快速参考

---

## 🚀 快速开始 (5 分钟)

```bash
# 1. 获取 Stripe 密钥
# https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# 2. 安装 Stripe CLI
brew install stripe/stripe-cli/stripe
stripe login

# 3. 启动 webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# 复制 whsec_... 到 .env.local 并重启 dev server

# 4. 测试支付
# 卡号: 4242 4242 4242 4242
# 日期: 12/25 | CVC: 123
```

---

## 💰 定价速查

| 套餐     | Credits | 价格   | 折扣 | 用途     |
| -------- | ------- | ------ | ---- | -------- |
| Trial    | 100     | $1.00  | 0%   | 试用     |
| Casual   | 500     | $4.50  | 10%  | 轻度用户 |
| Regular  | 2000    | $16.00 | 20%  | ⭐ 推荐  |
| Business | 10000   | $70.00 | 30%  | 商业用户 |

**公式:**

- 1 credit = $0.01
- 30秒视频 ≈ 240 credits ($2.40)

---

## 👥 Tier 速查

| Tier | 条件 | 速率    | 技术限制    |
| ---- | ---- | ------- | ----------- |
| free | 注册 | 3/day   | 120s, 500MB |
| paid | 首购 | 50/day  | 120s, 500MB |
| pro  | $50+ | 200/day | 120s, 500MB |

**升级逻辑:**

- total_earned > 100 → paid
- total_earned ≥ 5100 → pro

---

## 🔑 环境变量

```bash
# Stripe (测试)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
VIDEO_API_COST_PER_5_SECONDS=0.10

# Cron
CRON_SECRET=$(openssl rand -base64 32)
```

---

## 📂 关键文件

```
app/api/
├── checkout/route.ts          # 创建支付 session
└── webhooks/stripe/route.ts   # 处理 webhook

lib/video/cost.ts              # 价格计算

supabase/migrations/
├── 20251008000000_*.sql       # 表 + RPC
└── 20251009022856_*.sql       # Tier 升级
```

---

## 🧪 测试卡号

| 场景   | 卡号                |
| ------ | ------------------- |
| 成功   | 4242 4242 4242 4242 |
| 需验证 | 4000 0027 6000 3184 |
| 被拒   | 4000 0000 0000 0002 |

---

## 🐛 常见问题

### Webhook 不工作?

```bash
# 1. 确认 stripe listen 运行中
ps aux | grep stripe

# 2. 更新 secret
cat .env.local | grep STRIPE_WEBHOOK_SECRET

# 3. 重启 dev server
# Ctrl+C, 然后 pnpm dev
```

### Credits 没到账?

```sql
-- 查余额
SELECT balance, tier FROM user_credits WHERE user_id = '...';

-- 查交易
SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 5;
```

### Tier 没升级?

```sql
-- 检查函数
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'add_credits';

-- 重新 migration
-- supabase db reset
```

---

## 📊 SQL 速查

```sql
-- 查用户余额
SELECT user_id, balance, total_earned, tier FROM user_credits;

-- 查交易记录
SELECT type, amount, balance_after, stripe_payment_id, created_at
FROM credit_transactions ORDER BY created_at DESC;

-- 手动加 credits (测试)
SELECT add_credits('user-uuid', 100, 'pi_test', 'cs_test');

-- 手动改 tier (测试)
UPDATE user_credits SET tier = 'pro' WHERE user_id = '...';
```

---

## 🌐 API 端点

```bash
# 创建支付
POST /api/checkout
Headers: Authorization: Bearer <token>
Body: {"credits": 100}

# Webhook (Stripe 调用)
POST /api/webhooks/stripe
Headers: stripe-signature: ...
Body: Stripe Event JSON
```

---

## 📚 文档导航

| 场景       | 文档                                 |
| ---------- | ------------------------------------ |
| 第一次配置 | [QUICKSTART](./STRIPE_QUICKSTART.md) |
| 理解系统   | [OVERVIEW](./STRIPE_OVERVIEW.md)     |
| 完整指南   | [SETUP](./STRIPE_SETUP.md)           |
| 部署检查   | [CHECKLIST](./STRIPE_CHECKLIST.md)   |

---

## 🔗 有用链接

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Supabase Dashboard](https://supabase.com/dashboard/project/xncedgheyootaxipktai)

---

**版本:** 1.0.0
**打印友好 ✅**
