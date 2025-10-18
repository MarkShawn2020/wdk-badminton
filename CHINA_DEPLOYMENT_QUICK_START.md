# 🚀 国内部署快速开始指南

**针对国内用户优化 - 五道口AI创业羽毛球俱乐部**

---

## ⚡️ TL;DR（太长不看版）

**核心变化**：

- ❌ 不用 Supabase（境外，慢）
- ✅ 用阿里云 RDS PostgreSQL（国内，快）
- ✅ 用微信登录（国内用户习惯）
- ✅ 用阿里云 OSS（图片存储）
- ✅ 部署到自己的 Nginx 服务器

**成本**：约 ¥600/月（1000用户）

---

## 📋 准备清单（开始前必须完成）

### 1. 阿里云账号与服务

- [ ] 注册阿里云账号，完成实名认证
- [ ] 购买 **ECS 服务器**（2核4GB，约¥300/月）
- [ ] 购买 **RDS PostgreSQL**（1核2GB，约¥200/月）
- [ ] 开通 **OSS 对象存储**（按量付费）
- [ ] 开通 **短信服务**（按量付费，¥0.045/条）
- [ ] 购买 **域名**，提交**备案**（⚠️ 需要10-20天）

**预算**：首月约 ¥800-1000（包含服务器、数据库、域名）

### 2. 微信公众平台

- [ ] 注册**微信公众号**（订阅号或服务号）
- [ ] 完成**微信认证**（¥300，必须）
- [ ] 获取 `AppID` 和 `AppSecret`

**文档**：https://mp.weixin.qq.com/

### 3. 本地开发环境

- [ ] 安装 Node.js 18+
- [ ] 安装 pnpm（`npm install -g pnpm`）
- [ ] 安装 PostgreSQL 客户端工具（可选）

---

## 🚀 快速开始（5步）

### Step 1: 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/wdk-badminton.git
cd wdk-badminton

# 安装依赖
pnpm install

# 安装 Prisma CLI
pnpm add -D prisma
pnpm add @prisma/client
```

### Step 2: 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local
vim .env.local
```

**最小配置**（本地开发）：

```env
# 数据库（使用本地 PostgreSQL 或阿里云RDS测试实例）
DATABASE_URL="postgresql://username:password@localhost:5432/wdk_badminton?schema=public"

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=五道口AI创业羽毛球俱乐部

# 微信登录（暂时可以不配置，Phase 2 再说）
WECHAT_APP_ID=
WECHAT_APP_SECRET=

# JWT 密钥（随机生成）
JWT_SECRET=your_random_secret_key_change_me_in_production

# OSS（暂时可以不配置，Phase 1 用本地存储）
OSS_REGION=
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
```

### Step 3: 初始化数据库

```bash
# 生成 Prisma Client
pnpm prisma generate

# 创建数据库迁移（首次）
pnpm prisma migrate dev --name init

# 查看数据库（可选，打开可视化界面）
pnpm prisma studio
```

**验证**：访问 http://localhost:5555，应该能看到所有表。

### Step 4: 启动开发服务器

```bash
# 启动 Next.js 开发服务器
pnpm dev

# 访问
open http://localhost:3000
```

**预期**：首页正常显示，会员列表显示示例数据。

### Step 5: 测试功能（Phase 1 静态MVP）

- [ ] 访问首页 `/` - 显示俱乐部介绍
- [ ] 访问会员列表 `/members` - 显示示例会员
- [ ] 访问排名页 `/rankings` - 显示积分排名
- [ ] 访问预约页 `/reservations` - 显示示例预约

**如果一切正常，恭喜！本地环境搭建完成。🎉**

---

## 🏗️ Phase 1: 静态MVP开发（Week 1-2）

**目标**：快速搭建可演示的静态网站，不涉及后端逻辑。

### 任务清单

- [ ] **Day 1-2**: 创建布局组件（Header, Footer）
- [ ] **Day 3-4**: 实现首页
- [ ] **Day 5-6**: 实现会员列表页 + 会员卡片组件
- [ ] **Day 7-8**: 实现排名页 + 排名表格组件
- [ ] **Day 9-10**: 实现预约页 + 预约卡片组件
- [ ] **Day 11-12**: 样式优化、响应式调整
- [ ] **Day 13-14**: 测试、部署到服务器、收集反馈

**数据来源**：使用 `src/data/sample-members.ts` 和 `src/data/sample-reservations.ts`

**参考文档**：`MVP_IMPLEMENTATION_PLAN.md`

---

## 🔐 Phase 2: 后端集成（Week 3-4）

**目标**：实现用户认证、数据库CRUD、实时更新。

### 2.1 微信登录集成

```bash
# 安装微信SDK
pnpm add weixin-js-sdk

# 创建微信登录API
touch src/app/api/auth/wechat/route.ts
```

**流程**：

1. 用户点击「微信登录」按钮
2. 跳转到微信授权页面
3. 用户同意授权
4. 微信回调，获取 `code`
5. 后端用 `code` 换取 `access_token` 和 `openid`
6. 创建/登录账号，返回 JWT token
7. 前端保存 token，跳转到首页

**参考文档**：（需要创建）`WECHAT_AUTH.md`

### 2.2 数据库 API 路由

```typescript
// src/app/api/members/route.ts
import { prisma } from '@/lib/db'

export async function GET() {
  const members = await prisma.member.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { totalPoints: 'desc' },
    take: 50,
  })

  return Response.json(members)
}

// src/app/api/reservations/[id]/join/route.ts
import { joinReservation } from '@/lib/reservations'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // 验证用户登录
  const user = await getCurrentUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 调用业务逻辑
  const result = await joinReservation(params.id, user.memberId)

  return Response.json(result)
}
```

### 2.3 实时更新（可选）

**方案 A：轮询（最简单，推荐MVP）**

```typescript
// 客户端每5秒刷新一次
useEffect(() => {
  const interval = setInterval(() => {
    fetchReservationDetails()
  }, 5000)

  return () => clearInterval(interval)
}, [])
```

**方案 B：Socket.io（生产环境推荐）**

参考：`CHINA_DEPLOYMENT_ARCHITECTURE.md` 中的 Socket.io 章节

---

## 🚀 生产部署（Nginx + PM2）

### 3.1 服务器准备

```bash
# SSH 登录到阿里云 ECS
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2
npm install -g pm2

# 安装 Nginx
apt install -y nginx

# 安装 PostgreSQL 客户端工具（可选）
apt install -y postgresql-client
```

### 3.2 部署代码

```bash
# 在服务器上克隆代码
cd /var/www
git clone https://github.com/your-username/wdk-badminton.git
cd wdk-badminton

# 安装依赖
pnpm install --production=false

# 配置环境变量
cp .env.example .env.production
vim .env.production
# 填入生产环境的数据库URL、OSS配置等

# 数据库迁移
pnpm prisma migrate deploy

# 构建
pnpm build

# 启动 PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3.3 配置 Nginx

```bash
# 创建 Nginx 配置
vim /etc/nginx/sites-available/wdk-badminton

# 粘贴配置（见 CHINA_DEPLOYMENT_ARCHITECTURE.md）

# 启用站点
ln -s /etc/nginx/sites-available/wdk-badminton /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

### 3.4 配置 SSL（Let's Encrypt）

```bash
# 安装 certbot
apt install -y certbot python3-certbot-nginx

# 获取证书（⚠️ 域名必须已备案并解析到服务器IP）
certbot --nginx -d wdk-badminton.com -d www.wdk-badminton.com

# 测试自动续期
certbot renew --dry-run
```

### 3.5 验证部署

- [ ] 访问 `https://wdk-badminton.com` - HTTPS 正常
- [ ] 首页加载速度 <2秒
- [ ] 所有页面正常显示
- [ ] API 接口正常响应
- [ ] 数据库连接正常

**完成！网站已上线。🎉**

---

## 📊 监控与维护

### 日常运维命令

```bash
# 查看 PM2 状态
pm2 status

# 查看日志
pm2 logs wdk-badminton

# 重启应用
pm2 restart wdk-badminton

# 更新代码
cd /var/www/wdk-badminton
git pull origin main
pnpm install
pnpm build
pm2 reload wdk-badminton

# 查看 Nginx 日志
tail -f /var/log/nginx/wdk-badminton-access.log
tail -f /var/log/nginx/wdk-badminton-error.log

# 数据库备份
pg_dump -h rm-xxxxx.mysql.rds.aliyuncs.com -U username -d wdk_badminton > backup_$(date +%Y%m%d).sql
```

### 性能监控

**推荐工具**：

- **阿里云云监控**：免费，监控 ECS、RDS、OSS
- **New Relic**：应用性能监控（APM）
- **Sentry**：错误追踪

---

## 💰 成本总结

### 月度成本（1000 MAU）

| 项目                     | 费用        |
| ------------------------ | ----------- |
| ECS 服务器（2核4GB）     | ¥300        |
| RDS PostgreSQL（1核2GB） | ¥200        |
| OSS 存储 + 流量          | ¥51         |
| 短信验证码（1000条）     | ¥45         |
| 域名                     | ¥7          |
| **总计**                 | **¥603/月** |

**对比 Vercel + Supabase**：

- 免费额度后约 $99/月（¥700）
- 但国内访问延迟 10-20 倍
- 成本相当，但体验天壤之别

---

## 🆘 常见问题

### Q1: 域名备案要多久？

**A**: 10-20天，具体看各地管局。建议提前准备。

### Q2: 一定要微信公众号认证吗？

**A**:

- **MVP阶段**：可以先用手机号+验证码登录，跳过微信
- **生产环境**：强烈推荐微信登录，用户体验好

### Q3: 可以用腾讯云吗？

**A**: 可以！技术栈一样，只是：

- 腾讯云 CDB（数据库）替代阿里云 RDS
- 腾讯云 COS（存储）替代阿里云 OSS
- 腾讯云 SMS（短信）替代阿里云短信

### Q4: PostgreSQL 可以用 MySQL 替代吗？

**A**: 可以，但需要修改 Prisma Schema：

- `datasource db { provider = "mysql" }`
- 部分数据类型需要调整（如 `uuid` → `varchar(36)`）

### Q5: 服务器配置够用吗？

**A**:

- **1000 MAU**：2核4GB 足够
- **5000 MAU**：建议升级到 4核8GB
- **10000+ MAU**：建议使用负载均衡 + 多台服务器

---

## 📚 相关文档

| 文档                                  | 说明                 |
| ------------------------------------- | -------------------- |
| **CHINA_DEPLOYMENT_ARCHITECTURE.md**  | 完整技术架构（必读） |
| **MIGRATION_GUIDE.md**                | 数据库迁移指南       |
| **MVP_IMPLEMENTATION_PLAN.md**        | MVP开发计划          |
| **PROJECT_TRANSFORMATION_SUMMARY.md** | 项目转型总结         |

---

## ✅ 检查清单

### 开发环境

- [ ] Node.js 18+ 已安装
- [ ] pnpm 已安装
- [ ] PostgreSQL 已安装（或使用云数据库）
- [ ] 依赖安装成功：`pnpm install`
- [ ] 数据库迁移成功：`pnpm prisma migrate dev`
- [ ] 开发服务器启动：`pnpm dev`
- [ ] 页面正常显示

### 生产部署

- [ ] 阿里云账号已注册，实名认证
- [ ] ECS 服务器已购买
- [ ] RDS PostgreSQL 已购买
- [ ] 域名已购买，备案完成
- [ ] 微信公众号已注册，认证完成
- [ ] 代码已部署到服务器
- [ ] Nginx 配置完成
- [ ] SSL 证书配置完成
- [ ] PM2 启动成功
- [ ] 网站可访问，功能正常

---

**祝部署顺利！有问题随时查阅相关文档或提issue。🚀**
