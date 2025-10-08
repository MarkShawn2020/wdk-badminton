# Stripe 配置检查清单

## 📋 本地开发环境

### 环境变量配置

- [ ] `.env.local` 文件已创建
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 已配置 (pk*test*...)
- [ ] `STRIPE_SECRET_KEY` 已配置 (sk*test*...)
- [ ] `STRIPE_WEBHOOK_SECRET` 已配置 (whsec\_...)
- [ ] `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- [ ] `VIDEO_API_COST_PER_5_SECONDS=0.10`
- [ ] `CRON_SECRET` 已生成 (用 `openssl rand -base64 32`)

### Stripe CLI

- [ ] Stripe CLI 已安装 (`brew install stripe/stripe-cli/stripe`)
- [ ] 已登录 Stripe (`stripe login`)
- [ ] `stripe listen --forward-to localhost:3000/api/webhooks/stripe` 正在运行
- [ ] 复制了 webhook secret 并更新到 `.env.local`
- [ ] 重启了 Next.js 开发服务器

### 数据库

- [ ] Supabase migrations 已应用
  - `20251008000000_create_video_processing_tables.sql`
  - `20251009022856_update_tier_auto_upgrade.sql`
- [ ] `user_credits` 表存在
- [ ] `credit_transactions` 表存在
- [ ] RPC 函数 `add_credits` 存在且包含 tier 升级逻辑

### 测试

- [ ] 能成功创建 checkout session (调用 `/api/checkout`)
- [ ] Stripe 支付页面正常显示
- [ ] 测试卡 `4242 4242 4242 4242` 支付成功
- [ ] Webhook 接收到 `checkout.session.completed` 事件
- [ ] 用户 credits 正确增加
- [ ] Tier 正确升级 (free → paid)
- [ ] `credit_transactions` 表有记录

---

## 🚀 生产环境部署

### Stripe Dashboard 配置

- [ ] 已切换到 Live mode
- [ ] Live mode API keys 已获取
  - `pk_live_...`
  - `sk_live_...`
- [ ] 创建了生产环境 Webhook
  - Endpoint URL: `https://你的域名.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- [ ] 复制了 Webhook signing secret (whsec\_...)

### Vercel 环境变量

- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk*live*...)
- [ ] `STRIPE_SECRET_KEY` (sk*live*...)
- [ ] `STRIPE_WEBHOOK_SECRET` (whsec\_... from production webhook)
- [ ] `NEXT_PUBLIC_APP_URL` (https://你的域名.com)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `WAVESPEED_API_KEY`
- [ ] `VIDEO_API_COST_PER_5_SECONDS=0.10`
- [ ] `CRON_SECRET`

### 数据库

- [ ] Migrations 已应用到生产 Supabase
  ```bash
  supabase db push
  ```
- [ ] RLS (Row Level Security) 已启用
- [ ] 测试用户可以正确读写自己的数据

### 测试

- [ ] 生产环境支付测试 (小额真实支付)
- [ ] Webhook 事件正常接收 (检查 Stripe Dashboard → Webhooks 日志)
- [ ] Credits 正确充值
- [ ] Tier 正确升级
- [ ] 用户可以正常使用 credits 处理视频

---

## 🔒 安全检查

- [ ] ❌ Live mode 密钥**未**提交到 Git
- [ ] ✅ `.env.local` 在 `.gitignore` 中
- [ ] ✅ 所有 API 路由都有 `requireAuth()` 检查
- [ ] ✅ Webhook 签名验证已启用 (代码中已实现)
- [ ] ✅ Supabase RLS 策略正确配置
- [ ] ✅ 环境变量中无硬编码敏感信息
- [ ] ✅ Stripe Dashboard 限制了 API keys 权限 (如果支持)

---

## 📊 监控设置

- [ ] Stripe Dashboard → Developers → Webhooks → 查看事件日志
- [ ] Vercel → 你的项目 → Logs → 查看运行时日志
- [ ] Supabase → Logs → 查看数据库操作日志
- [ ] 设置 Stripe 邮件通知 (支付失败、争议等)

---

## 🧪 功能测试清单

### 购买流程

- [ ] 用户能访问 pricing 页面
- [ ] 点击购买跳转到 Stripe Checkout
- [ ] 支付成功后跳转回 dashboard
- [ ] 显示 "Payment successful" 提示
- [ ] 用户余额正确更新
- [ ] 交易记录正确保存

### Tier 升级

- [ ] 新注册用户 tier = `free`
- [ ] 首次购买后 tier = `paid`
- [ ] 累计购买 $50+ 后 tier = `pro`
- [ ] Tier 升级后速率限制生效

### 错误处理

- [ ] 余额不足时提示正确错误
- [ ] 支付失败时 credits 未扣减
- [ ] Webhook 失败时有日志记录
- [ ] 用户可以重试支付

---

## 📝 文档完整性

- [ ] `docs/STRIPE_SETUP.md` - 完整配置文档
- [ ] `docs/STRIPE_QUICKSTART.md` - 快速开始指南
- [ ] `docs/STRIPE_CHECKLIST.md` - 本检查清单
- [ ] `README.md` 中提到 Stripe 配置 (可选)
- [ ] `.env.example` 包含所有 Stripe 变量

---

## ✅ 完成确认

- [ ] 本地开发环境测试通过
- [ ] 生产环境配置完成
- [ ] 安全检查通过
- [ ] 监控设置完成
- [ ] 功能测试全部通过
- [ ] 文档齐全

---

**检查日期:** ******\_\_\_******
**检查人员:** ******\_\_\_******
**环境:** [ ] 本地开发 [ ] 生产环境
