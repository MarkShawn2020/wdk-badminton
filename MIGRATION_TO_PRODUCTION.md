# 🚀 从演示版迁移到生产版 - 完整指南

## 📊 为什么需要迁移？

### 当前状态（localStorage 演示版）

```
❌ 数据孤岛 - 每个浏览器独立存储
❌ 易丢失 - 清除缓存即丢失
❌ 无法共享 - 管理员看不到数据
❌ 不可扩展 - 无法实现复杂查询
```

### 目标状态（中心化生产版）

```
✅ 统一数据源 - PostgreSQL 数据库
✅ 永久保存 - 数据库级别持久化
✅ 权限控制 - 管理员统一管理
✅ 复杂查询 - 支持排名、统计、关联
```

---

## ⚡ 快速迁移（10分钟）

### 步骤 1: 配置数据库（5分钟）

#### 选择一个数据库提供商：

**推荐：Supabase（免费额度充足，国内可访问）**

```bash
# 1. 访问 https://supabase.com 并创建项目
# 2. 获取数据库连接字符串
# 3. 配置环境变量

cp .env.example .env.local
# 编辑 .env.local，填入:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

**或者：使用本地 PostgreSQL**

```bash
# macOS (使用 Homebrew)
brew install postgresql@16
brew services start postgresql@16

# 创建数据库
createdb wdk_badminton

# 配置 .env.local
DATABASE_URL="postgresql://localhost:5432/wdk_badminton"
```

---

### 步骤 2: 运行数据库迁移（2分钟）

```bash
# 1. 生成数据库表结构
pnpm db:migrate

# 等待完成，你会看到:
# ✔ Database schema created
# ✔ Generated Prisma Client

# 2. (可选) 填充示例数据
pnpm db:seed

# 输出:
# 🌱 Starting database seed...
# 👥 Seeding members...
#   ✓ 张伟 (ADVANCED)
#   ✓ 李娜 (INTERMEDIATE)
#   ... (12 members total)
# 🏟️ Seeding reservations...
#   ✓ 五道口体育馆 (2025-10-20)
#   ... (10 reservations total)
# 🎉 Seed completed successfully!
```

---

### 步骤 3: 启用生产模式（3分钟）

#### 方式 A: 重命名文件（推荐）

```bash
# 进入项目目录
cd /Users/mark/projects/wdk-badminton

# 备份演示版本
mv src/app/\(auth\)/register/page.tsx src/app/\(auth\)/register/page-demo.tsx
mv src/app/members/page.tsx src/app/members/page-demo.tsx

# 启用生产版本
mv src/app/\(auth\)/register/page-api.tsx src/app/\(auth\)/register/page.tsx
mv src/app/members/page-api.tsx src/app/members/page.tsx

# 重启开发服务器（如果正在运行）
# Ctrl+C 停止，然后:
pnpm dev
```

#### 方式 B: Git 操作（更安全）

```bash
# 创建新分支
git checkout -b feature/centralized-database

# 重命名文件
git mv src/app/\(auth\)/register/page.tsx src/app/\(auth\)/register/page-demo.tsx
git mv src/app/\(auth\)/register/page-api.tsx src/app/\(auth\)/register/page.tsx

git mv src/app/members/page.tsx src/app/members/page-demo.tsx
git mv src/app/members/page-api.tsx src/app/members/page.tsx

# 提交
git add .
git commit -m "feat: migrate to centralized database

- Switch from localStorage to PostgreSQL
- Enable API-based member registration
- All users now share same data source

BREAKING CHANGE: localStorage data will no longer be used"
```

---

## ✅ 验证迁移成功

### 1. 测试注册新会员

```
1. 访问: http://localhost:3001/register
2. 填写表单（至少填写姓名和技能等级）
3. 点击提交
4. 检查浏览器控制台:
   ✅ 应该看到: POST /api/members 201
   ✅ 成功消息: Member registered successfully
5. 自动跳转到 /members 页面
```

### 2. 检查数据库

```bash
# 方法 1: Prisma Studio（推荐）
pnpm db:studio

# 浏览器会自动打开 http://localhost:5555
# 点击 "members" 表
# 应该能看到刚才注册的数据

# 方法 2: 命令行查询
npx prisma db execute --stdin <<< "SELECT name, skill_level FROM members ORDER BY created_at DESC LIMIT 5;"
```

### 3. 验证多设备访问

```
1. 在 Chrome 注册一个会员
2. 在 Firefox/Safari 访问 http://localhost:3001/members
3. 应该能看到刚才在 Chrome 注册的会员 ✅

（这是 localStorage 做不到的！）
```

---

## 📊 迁移前后对比

| 功能       | 演示版 (localStorage)   | 生产版 (PostgreSQL)        |
| ---------- | ----------------------- | -------------------------- |
| 注册页面   | `/register` (page.tsx)  | `/register` (page-api.tsx) |
| 数据存储   | 浏览器本地              | PostgreSQL 数据库          |
| 数据提示   | "💡 演示模式" (黄色)    | "✅ 生产模式" (绿色)       |
| 成功提示   | "数据保存在浏览器本地"  | "数据保存在中心化数据库"   |
| 多设备访问 | ❌ 不支持               | ✅ 支持                    |
| 管理员可见 | ❌ 不可见               | ✅ 可管理                  |
| 数据持久化 | ⚠️ 易丢失               | ✅ 永久保存                |
| API 调用   | localStorage.setItem()  | POST /api/members          |
| 开发工具   | "查看/清空localStorage" | Prisma Studio              |

---

## 🎯 迁移后的新功能

### 1. API 端点（已创建）

```typescript
// GET /api/members - 获取所有会员
fetch('/api/members')
fetch('/api/members?skillLevel=ADVANCED&limit=10')

// POST /api/members - 创建新会员
fetch('/api/members', {
  method: 'POST',
  body: JSON.stringify({ name: '张三', skillLevel: 'BEGINNER' }),
})
```

### 2. 数据库管理命令

```bash
# 查看数据
pnpm db:studio              # 打开可视化界面

# 数据库操作
pnpm db:migrate             # 运行迁移
pnpm db:seed                # 填充示例数据
pnpm db:generate            # 重新生成 Prisma Client
```

### 3. Prisma Studio 截图

访问 http://localhost:5555 后你会看到：

- 左侧：所有表（members, reservations, matches...）
- 中间：表数据（可编辑、删除、新增）
- 右侧：字段过滤器

---

## 🔧 常见问题

### Q1: 运行 `pnpm db:migrate` 报错 "Can't reach database server"

**原因:** DATABASE_URL 配置错误

**解决:**

```bash
# 1. 检查 .env.local 是否存在
cat .env.local | grep DATABASE_URL

# 2. 验证连接字符串格式
# 正确: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
# 错误: postgres://... (应该是 postgresql://)

# 3. 测试连接
npx prisma db pull
```

### Q2: 页面仍显示 "💡 演示模式"

**原因:** 还在使用 localStorage 版本的页面

**解决:**

```bash
# 检查当前使用的文件
head -5 src/app/\(auth\)/register/page.tsx

# 如果看到:
#   * Demo Version: Saves to localStorage
# 说明是演示版本，需要重命名文件

# 正确的文件应该显示:
#   * Production Version: Uses centralized API + Database
```

### Q3: 注册成功但会员列表看不到

**原因:** 会员列表页面还在使用演示版本

**解决:**

```bash
# 检查并替换会员列表页面
mv src/app/members/page.tsx src/app/members/page-demo.tsx
mv src/app/members/page-api.tsx src/app/members/page.tsx

# 重启服务器
pnpm dev
```

### Q4: 想回退到演示版本怎么办？

**解决:**

```bash
# 重命名回去即可
mv src/app/\(auth\)/register/page.tsx src/app/\(auth\)/register/page-api.tsx
mv src/app/\(auth\)/register/page-demo.tsx src/app/\(auth\)/register/page.tsx

mv src/app/members/page.tsx src/app/members/page-api.tsx
mv src/app/members/page-demo.tsx src/app/members/page.tsx
```

---

## 📁 文件结构说明

```
wdk-badminton/
├── src/
│   ├── app/
│   │   ├── (auth)/register/
│   │   │   ├── page.tsx           # 当前激活的版本
│   │   │   ├── page-demo.tsx      # localStorage 版本（备份）
│   │   │   └── page-api.tsx       # API 版本（备份）
│   │   │
│   │   ├── members/
│   │   │   ├── page.tsx           # 当前激活的版本
│   │   │   ├── page-demo.tsx      # localStorage 版本（备份）
│   │   │   └── page-api.tsx       # API 版本（备份）
│   │   │
│   │   └── api/
│   │       └── members/
│   │           └── route.ts       # ✅ 后端 API（已创建）
│   │
│   └── lib/
│       └── db/
│           ├── prisma.ts          # Prisma Client
│           ├── members.ts         # 会员数据库操作
│           └── reservations.ts    # 活动数据库操作
│
├── prisma/
│   ├── schema.prisma              # 数据库表结构
│   ├── seed.ts                    # 示例数据种子脚本
│   └── migrations/                # 迁移历史
│
├── .env.local                     # 环境变量（你需要创建）
├── .env.example                   # 环境变量模板
├── DATABASE_SETUP.md              # 详细设置指南
└── MIGRATION_TO_PRODUCTION.md     # 本文档
```

---

## 🎊 迁移完成标志

当你看到以下所有情况时，说明迁移成功：

- ✅ 注册页面显示 "✅ 生产模式" (绿色提示框)
- ✅ 会员列表显示 "来自中心化数据库"
- ✅ 提交表单后控制台显示 `POST /api/members 201`
- ✅ Prisma Studio 能看到新注册的会员
- ✅ 在不同浏览器能看到相同的数据
- ✅ 刷新页面后数据仍然存在

---

## 📝 Git Commit 建议

```bash
git add .
git commit -m "feat: migrate from localStorage to centralized PostgreSQL database

Migration Details:
- ✅ Created API endpoint: POST /api/members
- ✅ Updated registration page to use API
- ✅ Updated members list to fetch from API
- ✅ Added database seed script with 12 sample members
- ✅ Configured Prisma migrations
- ✅ All data now persists in PostgreSQL

Benefits:
- Multi-device access support
- Centralized admin management
- Data persistence guaranteed
- Complex queries enabled (rankings, stats, etc.)
- Production-ready architecture

Breaking Changes:
- localStorage data no longer used
- Requires DATABASE_URL environment variable
- Run 'pnpm db:migrate' before using

Files Changed:
- src/app/(auth)/register/page.tsx (now uses API)
- src/app/members/page.tsx (fetches from API)
- src/app/api/members/route.ts (new backend)
- prisma/seed.ts (new seed script)
- package.json (added db:* commands)

Next Steps:
- Add authentication (NextAuth.js)
- Build admin panel
- Deploy to production

🤖 Generated with Claude Code"
```

---

## 🚀 下一步

迁移完成后，你可以：

### 1. 添加认证系统

```bash
# 安装 NextAuth.js
pnpm add next-auth @next-auth/prisma-adapter

# 配置微信/手机号登录
# 保护 API 路由
```

### 2. 创建管理后台

```bash
# 访问: /admin/members
# 功能: 查看、编辑、删除会员
# 权限: 仅管理员可访问
```

### 3. 部署到生产环境

```bash
# Vercel 一键部署
vercel --prod

# 配置生产数据库
# 启用监控和日志
```

---

**准备好开始了吗？**

从 [步骤 1: 配置数据库](#步骤-1-配置数据库5分钟) 开始！ 🎯
