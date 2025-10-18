# 🗄️ 数据库设置指南 - 从 localStorage 迁移到中心化服务器

## 📊 为什么需要中心化数据库？

### localStorage 的局限性

```
❌ 数据孤岛 - 每个浏览器独立存储
❌ 易丢失 - 清除浏览器缓存即丢失
❌ 无法共享 - 管理员看不到会员数据
❌ 不可扩展 - 无法实现复杂查询
❌ 不安全 - 客户端可任意篡改
```

### 中心化数据库的优势

```
✅ 统一数据源 - 所有用户访问同一份数据
✅ 永久保存 - 数据库级别的持久化
✅ 权限控制 - 管理员统一管理
✅ 复杂查询 - 支持排名、统计、关联查询
✅ 数据安全 - 服务端验证 + 加密存储
```

---

## 🚀 快速开始（3步完成）

### 步骤 1: 选择并配置数据库（5分钟）

#### **选项 A: Supabase（推荐 - 适合国内部署）**

1. **注册账号**

   ```
   访问: https://supabase.com
   使用 GitHub 账号登录
   ```

2. **创建项目**

   ```
   Project Name: wdk-badminton
   Database Password: [设置强密码]
   Region: Singapore (最近的区域)
   ```

3. **获取连接字符串**

   ```
   进入 Settings → Database
   复制 Connection string (URI)

   示例:
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

4. **配置环境变量**

   ```bash
   # 复制环境变量模板
   cp .env.example .env.local

   # 编辑 .env.local
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

#### **选项 B: Neon（无服务器 PostgreSQL）**

1. 访问 https://neon.tech
2. 创建项目 → 获取连接字符串
3. 复制到 `.env.local`

#### **选项 C: Vercel Postgres**

1. Vercel 项目设置 → Storage → Create Database
2. 选择 Postgres
3. 自动添加环境变量

---

### 步骤 2: 运行数据库迁移（2分钟）

```bash
# 1. 安装 Prisma CLI（如果还没有）
npm install -D prisma

# 2. 运行迁移（创建所有表）
npx prisma migrate dev --name init

# 你会看到:
# ✔ 正在连接数据库...
# ✔ 创建 5 个表 (members, reservations, point_transactions, matches...)
# ✔ 生成 Prisma Client

# 3. 验证数据库结构
npx prisma studio

# 这会打开一个网页界面，你可以看到所有表
```

---

### 步骤 3: 启用生产模式（1分钟）

#### 方法 1: 重命名文件（推荐）

```bash
# 备份演示版本
mv src/app/(auth)/register/page.tsx src/app/(auth)/register/page-demo.tsx
mv src/app/members/page.tsx src/app/members/page-demo.tsx

# 启用生产版本
mv src/app/(auth)/register/page-api.tsx src/app/(auth)/register/page.tsx
mv src/app/members/page-api.tsx src/app/members/page.tsx

# 重启开发服务器
pnpm dev
```

#### 方法 2: 手动替换（精细控制）

编辑 `src/app/(auth)/register/page.tsx`:

```typescript
// 找到 localStorage 相关代码
localStorage.setItem('wdk-members', ...)

// 替换为 API 调用
const response = await fetch('/api/members', {
  method: 'POST',
  body: JSON.stringify(data),
})
```

---

## ✅ 验证设置成功

### 1. 测试 API 端点

```bash
# 在浏览器或 Postman 测试
curl -X POST http://localhost:3001/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "skillLevel": "BEGINNER"
  }'

# 成功响应:
# {
#   "success": true,
#   "data": { "id": "...", "name": "测试用户", ... },
#   "message": "会员注册成功"
# }
```

### 2. 在页面注册新会员

```
1. 访问: http://localhost:3001/register
2. 填写表单（至少填写姓名和技能水平）
3. 提交
4. 检查浏览器控制台:
   ✅ POST /api/members 201
   ✅ Member registered successfully
5. 访问: http://localhost:3001/members
6. 应该能看到刚注册的会员
```

### 3. 在 Prisma Studio 查看数据

```bash
npx prisma studio

# 打开 http://localhost:5555
# 点击 "members" 表
# 应该能看到刚才注册的数据
```

---

## 📁 文件结构对比

### 演示版本（localStorage）

```
src/app/(auth)/register/page.tsx       # localStorage 版本
src/app/members/page.tsx               # 显示 localStorage 数据
```

### 生产版本（中心化数据库）

```
src/app/(auth)/register/page-api.tsx   # API 版本
src/app/members/page-api.tsx           # 从 API 获取数据
src/app/api/members/route.ts           # 后端 API（已创建）
```

---

## 🔄 数据迁移（可选）

如果你在 localStorage 中已经有测试数据，想迁移到数据库：

### 方法 1: 手动在 Prisma Studio 添加

```bash
npx prisma studio
# 点击 "members" → "Add record"
# 手动填写字段
```

### 方法 2: 使用种子脚本

创建 `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 从 localStorage 导出的数据
  const localMembers = [
    { name: '张三', skillLevel: 'BEGINNER', ... },
    // ... 更多数据
  ]

  for (const member of localMembers) {
    await prisma.member.create({ data: member })
  }

  console.log(`✅ Imported ${localMembers.length} members`)
}

main()
```

运行：

```bash
npx prisma db seed
```

---

## 🎛️ 环境变量配置

### 开发环境 (.env.local)

```bash
# 数据库
DATABASE_URL="postgresql://..."

# 应用配置
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NODE_ENV="development"

# JWT (未来用于认证)
JWT_SECRET="your-secret-key-change-in-production"
```

### 生产环境 (Vercel/部署平台)

在 Vercel Dashboard 添加相同的环境变量。

---

## 🐛 常见问题

### Q1: 运行 `prisma migrate dev` 报错 "Can't reach database server"

**原因:** DATABASE_URL 配置错误或数据库未启动

**解决:**

```bash
# 1. 检查 .env.local 是否存在
cat .env.local

# 2. 验证连接字符串格式
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# 3. 测试连接
npx prisma db pull
```

### Q2: API 返回 500 错误 "PrismaClient is unable to run"

**原因:** 未运行 `prisma generate`

**解决:**

```bash
npx prisma generate
pnpm dev  # 重启服务器
```

### Q3: 数据保存成功但 `/members` 看不到

**原因:** 还在使用 localStorage 版本的页面

**解决:**

```bash
# 检查当前使用的文件
cat src/app/members/page.tsx | head -10

# 如果看到 localStorage，说明是演示版本
# 按照"步骤 3"重命名文件
```

### Q4: Prisma Studio 打不开

**原因:** 端口 5555 被占用

**解决:**

```bash
# 指定其他端口
npx prisma studio --port 5556
```

---

## 📊 数据库结构

### 核心表

```sql
-- 会员表
members (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  skillLevel ENUM NOT NULL,
  totalPoints INT DEFAULT 0,
  matchesPlayed INT DEFAULT 0,
  ...
)

-- 活动预约表
reservations (
  id UUID PRIMARY KEY,
  venueName VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  maxParticipants INT,
  organizerId UUID REFERENCES members(id),
  ...
)

-- 预约参与表（多对多）
reservation_participants (
  reservationId UUID REFERENCES reservations(id),
  memberId UUID REFERENCES members(id),
  PRIMARY KEY (reservationId, memberId)
)

-- 积分交易记录
point_transactions (
  id UUID PRIMARY KEY,
  memberId UUID REFERENCES members(id),
  points INT,
  transactionType ENUM,
  ...
)

-- 比赛记录
matches (
  id UUID PRIMARY KEY,
  matchType ENUM,
  teamAScore INT,
  teamBScore INT,
  ...
)
```

---

## 🎯 下一步

### 完成基础设置后，你可以:

1. **添加认证**
   - 安装 NextAuth.js
   - 配置微信/手机号登录
   - 保护 API 路由

2. **创建管理后台**
   - `/admin/members` - 会员管理
   - `/admin/activities` - 活动管理
   - `/admin/matches` - 比赛记录

3. **优化用户体验**
   - 添加 loading 状态
   - 实现乐观更新
   - 添加错误重试机制

4. **部署到生产环境**
   - Vercel 一键部署
   - 配置生产数据库
   - 启用监控和日志

---

## 📝 切换检查清单

### 从演示版切换到生产版

- [ ] 配置数据库连接字符串（.env.local）
- [ ] 运行 `npx prisma migrate dev`
- [ ] 验证 Prisma Studio 能看到表
- [ ] 重命名页面文件（page.tsx ↔ page-api.tsx）
- [ ] 重启开发服务器
- [ ] 测试注册新会员
- [ ] 测试会员列表显示
- [ ] 检查 API 日志（控制台）
- [ ] 验证数据在数据库中存在
- [ ] 更新 README.md 文档

---

## 🎊 成功标志

当你看到以下所有情况时，说明迁移成功：

✅ 注册页面显示 "✅ 生产模式" 提示
✅ 提交表单后控制台显示 "POST /api/members 201"
✅ 会员列表显示 "来自中心化数据库"
✅ Prisma Studio 中能看到新增的会员
✅ 刷新页面后数据仍然存在
✅ 在不同浏览器能看到相同的数据

---

**准备好了吗？** 开始 [步骤 1: 配置数据库](#步骤-1-选择并配置数据库5分钟) 🚀
