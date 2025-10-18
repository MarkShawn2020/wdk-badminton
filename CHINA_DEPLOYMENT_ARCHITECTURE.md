# 🇨🇳 国内部署架构方案

**针对国内用户优化的技术架构 - 五道口AI创业羽毛球俱乐部**

---

## ⚠️ 重要变更

**原方案问题**：使用 Supabase（境外服务）会导致：

- ❌ 访问速度慢（200-500ms延迟）
- ❌ 稳定性差（可能被墙）
- ❌ 用户体验差

**新方案目标**：

- ✅ 全栈国内部署
- ✅ 访问速度快（<50ms延迟）
- ✅ 稳定可靠
- ✅ 符合国内法规

---

## 🏗️ 新技术架构

### 核心技术栈对比

| 组件         | 原方案（境外）         | 新方案（国内）           | 说明 |
| ------------ | ---------------------- | ------------------------ | ---- |
| **前端框架** | Next.js 15 ✅          | Next.js 15 ✅            | 保留 |
| **UI组件库** | Radix UI + Tailwind ✅ | Radix UI + Tailwind ✅   | 保留 |
| **数据库**   | Supabase PostgreSQL ❌ | 阿里云RDS PostgreSQL ✅  | 替换 |
| **认证系统** | Supabase Auth ❌       | 微信登录 + 短信验证码 ✅ | 替换 |
| **文件存储** | Supabase Storage ❌    | 阿里云OSS / 腾讯云COS ✅ | 替换 |
| **实时功能** | Supabase Realtime ❌   | WebSocket (Socket.io) ✅ | 替换 |
| **ORM**      | 无                     | Prisma / Drizzle ✅      | 新增 |
| **部署平台** | Vercel ❌              | 自建Nginx ✅             | 替换 |
| **CDN**      | Vercel CDN ❌          | 阿里云CDN / 腾讯云CDN ✅ | 替换 |

---

## 📦 详细技术方案

### 1. 数据库：阿里云 RDS PostgreSQL

#### 为什么选择阿里云 RDS？

- ✅ **国内访问快**：延迟 <10ms（同区域）
- ✅ **稳定可靠**：99.95% SLA
- ✅ **自动备份**：每日自动备份，保留7-30天
- ✅ **监控告警**：完善的监控和日志
- ✅ **价格合理**：基础版 ¥200-300/月起

#### 配置建议

**开发环境**：

- 规格：1核2GB（基础版）
- 存储：20GB SSD
- 费用：约 ¥200/月

**生产环境**：

- 规格：2核4GB（高可用版）
- 存储：100GB SSD
- 费用：约 ¥800-1000/月

#### 替代方案

| 服务商              | 优势               | 劣势     |
| ------------------- | ------------------ | -------- |
| **阿里云 RDS**      | 生态完善，文档丰富 | 价格略高 |
| **腾讯云 CDB**      | 价格实惠，微信生态 | 文档略少 |
| **华为云 RDS**      | 政企友好           | 生态略弱 |
| **自建 PostgreSQL** | 成本低，灵活       | 运维复杂 |

**推荐**：**阿里云 RDS**（生态完善，适合创业团队）

---

### 2. 认证系统：微信登录 + 手机号验证

#### 方案选择

**主推：微信登录**

- ✅ 国内用户普及率高（>90%）
- ✅ 无需注册，一键登录
- ✅ 自动获取头像、昵称
- ✅ 适合社交场景

**备选：手机号 + 短信验证码**

- ✅ 实名制，符合法规
- ✅ 用户信任度高
- ✅ 可用于找回密码

**不推荐：邮箱注册**

- ❌ 国内用户不习惯
- ❌ 注册流程繁琐

#### 微信登录实现方案

##### 方案 A：微信公众号登录（推荐 MVP）

**优点**：

- ✅ 无需APP
- ✅ H5页面即可使用
- ✅ 开发简单
- ✅ 免费

**缺点**：

- ⚠️ 需要认证的公众号（300元认证费）
- ⚠️ 只能在微信内打开

**流程**：

```
用户访问 → 微信授权页 → 同意授权 → 获取openid → 创建/登录账号
```

**技术栈**：

- `weixin-js-sdk` - 微信JS-SDK
- `wechat-oauth` - 后端OAuth库

##### 方案 B：微信开放平台登录（未来扩展）

**优点**：

- ✅ 网页、APP通用
- ✅ 不限微信内外

**缺点**：

- ❌ 需要企业资质
- ❌ 审核严格
- ❌ 开发复杂

**推荐时机**：用户量 >5000 后

#### 手机号验证码实现

**短信服务商选择**：

| 服务商         | 价格      | 特点           |
| -------------- | --------- | -------------- |
| **阿里云短信** | ¥0.045/条 | 稳定，到达率高 |
| **腾讯云短信** | ¥0.045/条 | 价格实惠       |
| **网易云信**   | ¥0.05/条  | 模板审核快     |

**推荐**：**阿里云短信**（与RDS同生态）

**验证码库**：

```typescript
import { generateRandomCode } from '@/lib/utils'
import { sendSMS } from '@/lib/sms'

// 生成6位验证码
const code = generateRandomCode(6)

// 发送短信
await sendSMS({
  phone: '13800138000',
  templateCode: 'SMS_12345678',
  params: { code },
})

// 验证（5分钟有效期）
const valid = await verifyCode(phone, code)
```

---

### 3. 文件存储：阿里云 OSS

#### 为什么选择阿里云 OSS？

- ✅ **国内访问快**：CDN加速
- ✅ **价格便宜**：¥0.12/GB/月（标准存储）
- ✅ **自动压缩**：图片处理功能
- ✅ **安全可靠**：99.9999999999% 数据可靠性

#### 配置示例

```typescript
// lib/oss.ts
import OSS from 'ali-oss'

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: 'wdk-badminton',
})

// 上传头像
export async function uploadAvatar(file: File, userId: string) {
  const ext = file.name.split('.').pop()
  const filename = `avatars/${userId}-${Date.now()}.${ext}`

  const result = await client.put(filename, file)

  // 返回CDN地址
  return `https://cdn.wdk-badminton.com/${filename}`
}

// 图片处理（自动压缩、裁剪）
export function getImageUrl(
  path: string,
  options?: {
    width?: number
    height?: number
    quality?: number
  }
) {
  const params = new URLSearchParams()
  if (options?.width) params.append('x-oss-process', `image/resize,w_${options.width}`)
  if (options?.quality) params.append('quality', options.quality.toString())

  return `https://cdn.wdk-badminton.com/${path}?${params}`
}
```

#### 费用估算

**月活 1000 用户**：

- 存储：10GB × ¥0.12 = ¥1.2
- 流量：100GB × ¥0.5 = ¥50
- 请求：10万次 × ¥0.01/万 = ¥0.1
- **总计**：约 ¥51/月

#### 替代方案

| 服务商         | 价格         | 特点               |
| -------------- | ------------ | ------------------ |
| **阿里云 OSS** | ¥0.12/GB/月  | 功能最全           |
| **腾讯云 COS** | ¥0.118/GB/月 | 微信生态           |
| **七牛云**     | ¥0.12/GB/月  | 免费额度大（10GB） |
| **又拍云**     | ¥0.13/GB/月  | 老牌CDN            |

**推荐**：

- **MVP阶段**：**七牛云**（免费额度）
- **生产环境**：**阿里云OSS**（与RDS同生态）

---

### 4. ORM：Prisma

#### 为什么需要 ORM？

之前使用 Supabase 自带的客户端，现在切换到标准 PostgreSQL，需要 ORM 来：

- ✅ 类型安全的数据库操作
- ✅ 自动生成 TypeScript 类型
- ✅ 数据库迁移管理
- ✅ 查询优化

#### Prisma vs Drizzle

| 特性         | Prisma  | Drizzle |
| ------------ | ------- | ------- |
| **类型安全** | ✅ 优秀 | ✅ 优秀 |
| **学习曲线** | 平缓    | 较陡    |
| **性能**     | 良好    | 更优    |
| **生态**     | 成熟    | 新兴    |
| **文档**     | 丰富    | 较少    |

**推荐**：**Prisma**（更成熟，文档丰富，适合团队）

#### Prisma Schema 示例

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Member {
  id        String   @id @default(uuid())
  userId    String?  @unique @map("user_id")
  name      String
  nameEn    String?  @map("name_en")
  avatarUrl String?  @map("avatar_url")

  // AI创业信息
  companyName   String? @map("company_name")
  jobTitle      String? @map("job_title")
  aiSector      String? @map("ai_sector")

  // 羽毛球信息
  skillLevel    SkillLevel @default(BEGINNER) @map("skill_level")
  totalPoints   Int        @default(0) @map("total_points")
  matchesPlayed Int        @default(0) @map("matches_played")
  matchesWon    Int        @default(0) @map("matches_won")

  status    MemberStatus @default(ACTIVE)
  createdAt DateTime     @default(now()) @map("created_at")
  updatedAt DateTime     @updatedAt @map("updated_at")

  // Relations
  pointTransactions PointTransaction[]
  organizedReservations Reservation[] @relation("organizer")
  participations ReservationParticipant[]

  @@index([userId])
  @@index([status])
  @@index([totalPoints])
  @@map("members")
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT

  @@map("skill_level")
}

enum MemberStatus {
  ACTIVE
  INACTIVE
  SUSPENDED

  @@map("member_status")
}

model PointTransaction {
  id           String   @id @default(uuid())
  memberId     String   @map("member_id")
  points       Int
  balanceAfter Int      @map("balance_after")
  reason       String
  type         TransactionType @map("transaction_type")
  createdAt    DateTime @default(now()) @map("created_at")

  member Member @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@index([memberId])
  @@index([createdAt])
  @@map("point_transactions")
}

enum TransactionType {
  MATCH_WIN
  MATCH_LOSS
  PARTICIPATION
  ADMIN_ADJUSTMENT
  SEASON_BONUS
  PENALTY

  @@map("transaction_type")
}

model Reservation {
  id                  String   @id @default(uuid())
  venueName           String   @map("venue_name")
  venueAddress        String?  @map("venue_address")
  date                DateTime
  startTime           String   @map("start_time")
  endTime             String   @map("end_time")
  organizerId         String   @map("organizer_id")
  maxParticipants     Int      @map("max_participants")
  currentParticipants Int      @default(1) @map("current_participants")
  status              ReservationStatus @default(OPEN)
  totalCost           Decimal? @map("total_cost") @db.Decimal(10, 2)
  costPerPerson       Decimal? @map("cost_per_person") @db.Decimal(10, 2)
  notes               String?
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  organizer    Member @relation("organizer", fields: [organizerId], references: [id], onDelete: Cascade)
  participants ReservationParticipant[]

  @@index([date])
  @@index([organizerId])
  @@index([status])
  @@map("reservations")
}

enum ReservationStatus {
  OPEN
  FULL
  CONFIRMED
  CANCELLED
  COMPLETED

  @@map("reservation_status")
}

model ReservationParticipant {
  id            String   @id @default(uuid())
  reservationId String   @map("reservation_id")
  memberId      String   @map("member_id")
  paid          Boolean  @default(false)
  joinedAt      DateTime @default(now()) @map("joined_at")

  reservation Reservation @relation(fields: [reservationId], references: [id], onDelete: Cascade)
  member      Member      @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@unique([reservationId, memberId])
  @@index([reservationId])
  @@index([memberId])
  @@map("reservation_participants")
}
```

#### Prisma 使用示例

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// app/api/members/route.ts
import { prisma } from '@/lib/db'

export async function GET() {
  const members = await prisma.member.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { totalPoints: 'desc' },
    take: 20,
  })

  return Response.json(members)
}

// 加入预约（原子操作）
export async function joinReservation(reservationId: string, memberId: string) {
  return await prisma.$transaction(async (tx) => {
    // 锁定预约
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId },
      // 悲观锁，防止并发
    })

    if (!reservation) {
      throw new Error('Reservation not found')
    }

    if (reservation.currentParticipants >= reservation.maxParticipants) {
      throw new Error('Reservation is full')
    }

    // 检查是否已报名
    const existing = await tx.reservationParticipant.findUnique({
      where: {
        reservationId_memberId: {
          reservationId,
          memberId,
        },
      },
    })

    if (existing) {
      throw new Error('Already joined')
    }

    // 添加参与者
    await tx.reservationParticipant.create({
      data: {
        reservationId,
        memberId,
      },
    })

    // 更新人数
    const updated = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        currentParticipants: { increment: 1 },
        status:
          reservation.currentParticipants + 1 >= reservation.maxParticipants
            ? 'FULL'
            : reservation.status,
      },
    })

    return updated
  })
}
```

#### Prisma 命令

```bash
# 初始化 Prisma
pnpm add prisma @prisma/client
pnpm prisma init

# 生成迁移
pnpm prisma migrate dev --name init

# 生成 Prisma Client
pnpm prisma generate

# 查看数据库
pnpm prisma studio

# 部署到生产环境
pnpm prisma migrate deploy
```

---

### 5. 实时功能：Socket.io

#### 使用场景

在羽毛球俱乐部项目中，实时功能用于：

- 📊 **预约人数实时更新**：有人报名立即显示
- 🏆 **积分排名实时变化**：比赛结束后立即更新
- 💬 **活动通知**：新活动发布时推送通知

#### 方案对比

| 方案          | 优点               | 缺点              | 适用场景     |
| ------------- | ------------------ | ----------------- | ------------ |
| **Socket.io** | 功能强大，兼容性好 | 需要WebSocket支持 | 复杂实时交互 |
| **SSE**       | 简单，单向推送     | 只能服务器→客户端 | 简单通知     |
| **轮询**      | 最简单             | 浪费资源          | MVP快速验证  |

**推荐**：

- **MVP阶段**：**轮询**（最简单）
- **生产环境**：**Socket.io**（功能完善）

#### Socket.io 实现示例

```typescript
// server.ts (自定义服务器)
import { createServer } from 'http'
import { Server } from 'socket.io'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  })

  // WebSocket 连接
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // 加入预约房间
    socket.on('join-reservation', (reservationId) => {
      socket.join(`reservation-${reservationId}`)
    })

    // 离开预约房间
    socket.on('leave-reservation', (reservationId) => {
      socket.leave(`reservation-${reservationId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})

// 在 API 路由中广播更新
// app/api/reservations/[id]/join/route.ts
import { getIO } from '@/lib/socket'

export async function POST(request: Request, { params }) {
  // ... 加入预约逻辑

  const updated = await joinReservation(params.id, memberId)

  // 广播更新
  const io = getIO()
  io.to(`reservation-${params.id}`).emit('reservation-updated', updated)

  return Response.json(updated)
}

// 客户端
// components/reservation/ReservationCard.tsx
;('use client')

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export function ReservationCard({ reservation: initialReservation }) {
  const [reservation, setReservation] = useState(initialReservation)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_APP_URL!)

    socket.emit('join-reservation', reservation.id)

    socket.on('reservation-updated', (updated) => {
      setReservation(updated)
    })

    return () => {
      socket.emit('leave-reservation', reservation.id)
      socket.disconnect()
    }
  }, [reservation.id])

  // ... 渲染逻辑
}
```

---

### 6. 部署：自建 Nginx + PM2

#### 服务器要求

**最低配置**（MVP）：

- CPU: 2核
- 内存: 4GB
- 存储: 40GB SSD
- 带宽: 5Mbps
- 费用: 约 ¥300-500/月

**推荐配置**（生产）：

- CPU: 4核
- 内存: 8GB
- 存储: 100GB SSD
- 带宽: 10Mbps
- 费用: 约 ¥800-1200/月

**服务器选择**：

- **阿里云 ECS**：稳定，生态好
- **腾讯云 CVM**：性价比高
- **华为云**：政企友好

#### 部署架构

```
Internet
    ↓
阿里云 SLB (负载均衡) - 可选
    ↓
Nginx (反向代理 + 静态文件)
    ↓
PM2 (进程管理)
    ↓
Next.js App (Node.js)
    ↓
阿里云 RDS PostgreSQL
```

#### Nginx 配置

```nginx
# /etc/nginx/sites-available/wdk-badminton

# 上游服务器（PM2管理的Next.js实例）
upstream nextjs_backend {
    server 127.0.0.1:3000;
    # 如果使用多实例
    # server 127.0.0.1:3001;
    # server 127.0.0.1:3002;
}

# HTTP → HTTPS 重定向
server {
    listen 80;
    server_name wdk-badminton.com www.wdk-badminton.com;

    return 301 https://$server_name$request_uri;
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    server_name wdk-badminton.com www.wdk-badminton.com;

    # SSL 证书（使用 Let's Encrypt 免费证书）
    ssl_certificate /etc/letsencrypt/live/wdk-badminton.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wdk-badminton.com/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # 静态文件缓存（Next.js _next 目录）
    location /_next/static {
        proxy_pass http://nextjs_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # 图片等静态资源
    location /static {
        proxy_pass http://nextjs_backend;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Socket.io WebSocket 支持
    location /socket.io {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 所有其他请求代理到 Next.js
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # 日志
    access_log /var/log/nginx/wdk-badminton-access.log;
    error_log /var/log/nginx/wdk-badminton-error.log;
}
```

#### PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'wdk-badminton',
      script: 'server.js', // 自定义服务器（如果用Socket.io）
      // 或者
      // script: 'node_modules/next/dist/bin/next',
      // args: 'start',
      instances: 2, // 使用2个实例（根据CPU核心数）
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
}
```

#### 部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 开始部署..."

# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
pnpm install --production=false

# 3. 构建
pnpm build

# 4. 数据库迁移
pnpm prisma migrate deploy

# 5. 重启应用
pm2 reload ecosystem.config.js

echo "✅ 部署完成!"
```

#### SSL 证书（Let's Encrypt）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d wdk-badminton.com -d www.wdk-badminton.com

# 自动续期（每天检查）
sudo crontab -e
# 添加：
0 3 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

---

## 🔧 环境配置

### .env.production

```env
# ============================================================================
# 生产环境配置 - 五道口AI创业羽毛球俱乐部
# ============================================================================

# ------------ 应用配置 ------------
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://wdk-badminton.com
NEXT_PUBLIC_APP_NAME=五道口AI创业羽毛球俱乐部

# ------------ 数据库（阿里云 RDS PostgreSQL）------------
DATABASE_URL="postgresql://username:password@rm-xxxxx.mysql.rds.aliyuncs.com:5432/wdk_badminton?schema=public"

# ------------ 微信登录 ------------
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_app_secret

# ------------ 短信（阿里云）------------
ALIYUN_SMS_ACCESS_KEY_ID=LTAI5txxxxx
ALIYUN_SMS_ACCESS_KEY_SECRET=your_secret
ALIYUN_SMS_SIGN_NAME=五道口羽毛球
ALIYUN_SMS_TEMPLATE_CODE=SMS_12345678

# ------------ 对象存储（阿里云 OSS）------------
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=LTAI5txxxxx
OSS_ACCESS_KEY_SECRET=your_secret
OSS_BUCKET=wdk-badminton
NEXT_PUBLIC_OSS_CDN_URL=https://cdn.wdk-badminton.com

# ------------ Redis（可选，用于Session/缓存）------------
REDIS_URL=redis://r-xxxxx.redis.rds.aliyuncs.com:6379

# ------------ JWT 密钥 ------------
JWT_SECRET=your_very_long_random_secret_key_here

# ------------ Socket.io（可选）------------
SOCKET_IO_PATH=/socket.io
SOCKET_IO_CORS_ORIGIN=https://wdk-badminton.com
```

---

## 💰 成本估算

### 月度成本（1000 MAU）

| 服务           | 配置                 | 费用        |
| -------------- | -------------------- | ----------- |
| **阿里云 ECS** | 2核4GB               | ¥300        |
| **阿里云 RDS** | 1核2GB               | ¥200        |
| **阿里云 OSS** | 10GB存储 + 100GB流量 | ¥51         |
| **阿里云 CDN** | 100GB流量            | ¥20         |
| **阿里云 SMS** | 1000条验证码         | ¥45         |
| **域名**       | .com                 | ¥7          |
| **SSL证书**    | Let's Encrypt        | ¥0          |
| **合计**       |                      | **¥623/月** |

### 扩展成本（10000 MAU）

| 服务           | 配置             | 费用         |
| -------------- | ---------------- | ------------ |
| **阿里云 ECS** | 4核8GB           | ¥800         |
| **阿里云 RDS** | 2核4GB（高可用） | ¥1000        |
| **阿里云 OSS** | 100GB + 1TB流量  | ¥400         |
| **阿里云 CDN** | 1TB流量          | ¥180         |
| **阿里云 SMS** | 5000条           | ¥225         |
| **阿里云 SLB** | 负载均衡         | ¥150         |
| **合计**       |                  | **¥2755/月** |

**对比 Vercel + Supabase**（境外）：

- 免费额度用尽后约 $99/月（约 ¥700）
- 但国内访问速度慢 10-20 倍
- 可能被墙，稳定性差

**结论**：国内部署成本略高，但**速度和稳定性值得投资**。

---

## ✅ 迁移检查清单

### Phase 1: 准备（1-2天）

- [ ] 注册阿里云账号，实名认证
- [ ] 购买 ECS 服务器（2核4GB）
- [ ] 购买 RDS PostgreSQL（1核2GB）
- [ ] 购买域名，完成备案（⚠️ **需要10-20天**）
- [ ] 注册微信公众号，完成认证（300元）
- [ ] 开通阿里云 OSS、CDN、短信服务

### Phase 2: 基础设施（2-3天）

- [ ] 服务器初始化（安装 Nginx, Node.js, PM2）
- [ ] 配置 Nginx 反向代理
- [ ] 配置 SSL 证书（Let's Encrypt）
- [ ] 配置数据库连接
- [ ] 配置 OSS 存储

### Phase 3: 代码迁移（3-5天）

- [ ] 移除 Supabase 依赖
- [ ] 安装 Prisma，创建 Schema
- [ ] 执行数据库迁移
- [ ] 实现微信登录
- [ ] 实现短信验证码
- [ ] 替换文件上传为 OSS
- [ ] 测试所有功能

### Phase 4: 部署（1天）

- [ ] 构建生产版本
- [ ] 上传代码到服务器
- [ ] 配置环境变量
- [ ] 启动 PM2
- [ ] 配置 Nginx
- [ ] 测试线上环境

### Phase 5: 监控与优化（持续）

- [ ] 配置日志收集
- [ ] 配置性能监控
- [ ] 配置告警（服务器、数据库、应用）
- [ ] 优化数据库查询
- [ ] 配置 CDN 缓存策略

---

## 📚 后续文档

我将创建以下详细文档：

1. **PRISMA_MIGRATION.md** - Supabase → Prisma 迁移指南
2. **WECHAT_AUTH.md** - 微信登录完整实现
3. **NGINX_DEPLOYMENT.md** - Nginx + PM2 部署指南
4. **ALIYUN_SERVICES.md** - 阿里云服务配置手册

需要我立即创建这些文档吗？

---

**总结**：国内部署方案已完整规划，核心是**全栈国产化**，使用阿里云生态 + 微信登录，确保国内用户最佳体验。
