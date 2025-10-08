# Stripe 快速开始指南

> 5 分钟配置 Stripe 支付 (本地开发测试)

---

## 1️⃣ 获取 Stripe 密钥

1. 访问 https://dashboard.stripe.com/login
2. 登录 → 切换到 **Test mode** (右上角)
3. 进入 **Developers → API keys**
4. 复制:
   - `pk_test_...` (Publishable key)
   - `sk_test_...` (Secret key)

---

## 2️⃣ 配置环境变量

编辑 `.env.local`:

```bash
# 1. 粘贴 Stripe 密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_你刚复制的公钥
STRIPE_SECRET_KEY=sk_test_你刚复制的密钥

# 2. 生成 CRON_SECRET
# 运行: openssl rand -base64 32
CRON_SECRET=生成的随机字符串

# 3. 其他必需配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
VIDEO_API_COST_PER_5_SECONDS=0.10

# 4. STRIPE_WEBHOOK_SECRET 暂时留空
STRIPE_WEBHOOK_SECRET=
```

---

## 3️⃣ 安装 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 登录
stripe login
```

---

## 4️⃣ 启动服务

**终端 1: Next.js 开发服务器**

```bash
pnpm dev
```

**终端 2: Stripe Webhook 监听**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

复制输出的 `whsec_...` 密钥,更新到 `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_刚才复制的密钥
```

然后**重启终端 1 的开发服务器** (Ctrl+C 后重新 `pnpm dev`)

---

## 5️⃣ 测试支付

### 方式 A: 浏览器测试

1. 访问 http://localhost:3000
2. 注册并登录
3. 访问 `/pricing` 页面 (或创建一个简单的购买按钮)
4. 点击购买
5. 在 Stripe 支付页面输入:
   - **卡号:** `4242 4242 4242 4242`
   - **日期:** `12/25`
   - **CVC:** `123`
   - **邮编:** `12345`
6. 点击 Pay

### 方式 B: API 测试

```bash
# 1. 登录后获取 access_token
# 浏览器 F12 → Application → Local Storage → supabase.auth.token

# 2. 创建支付
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"credits": 100}'

# 3. 复制返回的 URL,在浏览器中打开,完成支付
```

---

## 6️⃣ 验证成功

### 检查日志

**终端 1 应显示:**

```
Stripe webhook received: checkout.session.completed
✅ Credits added successfully: { user_id: '...', amount: '100' }
```

**终端 2 应显示:**

```
--> checkout.session.completed [evt_test_...]
<--  [200] POST http://localhost:3000/api/webhooks/stripe
```

### 检查数据库

访问 [Supabase Dashboard](https://supabase.com/dashboard/project/xncedgheyootaxipktai)

**Table: user_credits**

- `balance`: 应从 100 变成 200
- `tier`: 应从 `free` 变成 `paid`

**Table: credit_transactions**

- 应有 2 条记录: `signup_bonus` 和 `purchase`

---

## ✅ 完成!

你已成功配置 Stripe 支付。

**下一步:**

- 创建前端购买页面 (`app/pricing/page.tsx`)
- 显示用户余额组件 (`components/CreditBalance.tsx`)
- 配置生产环境 (见 [STRIPE_SETUP.md](./STRIPE_SETUP.md))

---

## 🆘 遇到问题?

### Webhook 没收到事件?

1. 检查 `stripe listen` 是否在运行
2. 检查 `.env.local` 中的 `STRIPE_WEBHOOK_SECRET` 是否更新
3. 重启 Next.js 开发服务器

### Credits 没增加?

1. 查看 Supabase Dashboard → SQL Editor
2. 运行:
   ```sql
   SELECT * FROM user_credits WHERE user_id = '你的用户ID';
   SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 5;
   ```
3. 如果为空,检查 migrations 是否应用:
   ```bash
   supabase db reset
   ```

### 更多问题?

查看完整文档: [STRIPE_SETUP.md](./STRIPE_SETUP.md)

---

**文档版本:** 1.0.0
**最后更新:** 2025-10-09
