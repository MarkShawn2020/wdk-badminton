# 🏸 项目转型迁移指南

**从 ReelVan 视频工具 → 五道口AI创业羽毛球俱乐部**

## ⚠️ 重要提醒

**在执行任何迁移操作之前，请务必完成以下步骤：**

1. ✅ 备份所有数据
2. ✅ 在本地环境测试
3. ✅ 创建新的 git 分支
4. ✅ 通知所有相关人员

---

## 📋 迁移检查清单

### Phase 0: 准备阶段（Day 0）

- [ ] **备份现有数据库**

  ```bash
  # 备份 Supabase 数据库
  pnpm supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql

  # 验证备份文件
  ls -lh backup_*.sql
  ```

- [ ] **备份环境变量**

  ```bash
  cp .env.local .env.local.backup_$(date +%Y%m%d)
  ```

- [ ] **创建新分支**

  ```bash
  git checkout -b feature/badminton-club-mvp
  git push -u origin feature/badminton-club-mvp
  ```

- [ ] **文档备份**
  ```bash
  mkdir -p archive/old_reelvan
  cp README.md archive/old_reelvan/
  cp PRD.md archive/old_reelvan/
  cp CLAUDE.md archive/old_reelvan/
  ```

### Phase 1: 数据库迁移（Day 1）

#### 1.1 本地 Supabase 迁移

```bash
# 1. 确保本地 Supabase 正在运行
pnpm supabase start

# 2. 应用新的迁移
pnpm supabase migration up

# 或者重置整个数据库（更干净，但会清空所有数据）
pnpm supabase db reset

# 3. 验证表结构
pnpm supabase db diff
```

#### 1.2 生成新的 TypeScript 类型

```bash
# 从新数据库生成类型
pnpm supabase gen types typescript --local > src/types/database.types.ts

# 或者如果使用远程数据库
pnpm supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
```

#### 1.3 验证数据库

在 Supabase Studio 中验证（http://localhost:54323）：

- [ ] 表已创建：`members`, `point_transactions`, `reservations`, `reservation_participants`, `matches`, `match_participants`
- [ ] 视图已创建：`rankings`
- [ ] 函数已创建：`add_points`, `join_reservation`
- [ ] RLS 策略已启用
- [ ] 索引已创建

### Phase 2: 环境配置（Day 1）

#### 2.1 更新 `.env.local`

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，保留以下配置：
```

```env
# ============================================================================
# 🏸 五道口AI创业羽毛球俱乐部 - 环境配置
# ============================================================================

# ------------ Supabase（保留）------------
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ------------ 应用配置 ------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=五道口AI创业羽毛球俱乐部
NEXT_PUBLIC_CLUB_NAME=五道口AI创业羽毛球俱乐部
NEXT_PUBLIC_CLUB_NAME_EN=Wudaokou AI Badminton Club

# ------------ 暂时移除（注释掉）------------
# Stripe (后续可能需要)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=

# Video APIs (不再需要)
# WAVESPEED_API_KEY=
# REPLICATE_API_TOKEN=
# VIDEO_API_COST_PER_5_SECONDS=

# Cron Secret (不再需要)
# CRON_SECRET=

# ------------ 可选：未来功能 ------------
# 微信集成（未来）
# WECHAT_APP_ID=
# WECHAT_APP_SECRET=

# 地图服务（未来）
# NEXT_PUBLIC_MAP_API_KEY=

# 短信服务（未来）
# SMS_API_KEY=
```

#### 2.2 更新 `next.config.mjs`

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 其他配置

  // 更新项目名称
  env: {
    APP_NAME: '五道口AI创业羽毛球俱乐部',
  },

  // 如果需要外部图片（会员头像）
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      // 其他图片域名
    ],
  },
}

export default nextConfig
```

### Phase 3: 项目元数据更新（Day 1）

#### 3.1 更新 `package.json`

```json
{
  "name": "wdk-badminton-club",
  "version": "1.0.0",
  "description": "五道口AI创业羽毛球俱乐部管理平台",
  "author": "Your Team",
  "repository": {
    "type": "git",
    "url": "https://github.com/markshawn2020/wdk-badminton"
  }
}
```

#### 3.2 更新 `README.md`

```bash
# 创建新的 README
cat > README.md << 'EOF'
# 🏸 五道口AI创业羽毛球俱乐部

**为AI创业者打造的羽毛球社区平台**

## 🚀 快速开始

\`\`\`bash
# 安装依赖
pnpm install

# 启动本地 Supabase
pnpm supabase start

# 启动开发服务器
pnpm dev
\`\`\`

访问 http://localhost:3000

## 📚 文档

- [迁移指南](./MIGRATION_GUIDE.md)
- [数据库架构](./docs/DATABASE_SCHEMA.md)
- [API 文档](./docs/API_DOCS.md)

## 🏗️ 技术栈

- Next.js 15 + React 19
- TypeScript
- Supabase (Auth + Database + Realtime + Storage)
- Tailwind CSS 4.0
- Radix UI

## 📝 License

MIT
EOF
```

#### 3.3 创建新的 PRD

```bash
# 备份旧的 PRD
mv PRD.md archive/old_reelvan/PRD_old.md

# 创建新的 PRD（简化版）
cat > PRD.md << 'EOF'
# 产品需求文档 (PRD) - 五道口AI创业羽毛球俱乐部

## 1. 产品概述

为在五道口附近的AI创业者建立一个羽毛球社区管理平台。

## 2. 核心功能

### MVP v1.0（Week 1-2）
- 会员展示页面
- 积分排名榜
- 场地预约日历
- 个人资料页

### v1.1（Week 3-4）
- 会员注册/登录
- 个人资料编辑
- 预约报名功能
- 积分历史查看

### v2.0（未来）
- 比赛记录
- 自动积分计算
- 微信集成
- 场地费支付

## 3. 技术架构

见 [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)
EOF
```

#### 3.4 更新 `CLAUDE.md`

```bash
# 追加羽毛球俱乐部相关指导
cat >> CLAUDE.md << 'EOF'

---

## 🏸 羽毛球俱乐部项目特定指南

### 项目背景
- **从**：ReelVan 视频处理工具
- **到**：五道口AI创业羽毛球俱乐部管理平台
- **目标用户**：五道口附近的AI创业者、工程师、产品经理
- **核心价值**：社区连接、活动组织、技能提升

### 数据库表说明
- `members`: 会员信息（包含AI创业信息 + 羽毛球信息）
- `point_transactions`: 积分变动记录
- `reservations`: 场地预约
- `reservation_participants`: 预约参与者（多对多）
- `matches`: 比赛记录（MVP暂不实现）
- `match_participants`: 比赛参与者（MVP暂不实现）
- `rankings`: 排名视图（自动计算）

### 开发原则
1. **简单优先**：MVP 只做核心功能，避免过度设计
2. **数据安全**：会员隐私信息（手机号、微信）需要权限控制
3. **社区氛围**：界面设计友好、亲切，鼓励参与
4. **移动优先**：大部分用户通过手机访问

### 常用命令
\`\`\`bash
# 重置数据库并应用迁移
pnpm supabase db reset

# 生成类型
pnpm supabase gen types typescript --local > src/types/database.types.ts

# 本地开发
pnpm dev

# 类型检查
pnpm check-type

# 代码检查
pnpm lint
\`\`\`
EOF
```

### Phase 4: 代码重构（Day 2-3）

#### 4.1 创建新的类型定义

```bash
# 创建类型目录
mkdir -p src/types

# 生成数据库类型
pnpm supabase gen types typescript --local > src/types/database.types.ts
```

```typescript
// src/types/member.types.ts
export interface Member {
  id: string
  userId: string | null
  name: string
  nameEn?: string
  avatarUrl?: string
  bio?: string
  companyName?: string
  jobTitle?: string
  aiSector?: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  status: 'active' | 'inactive' | 'suspended'
  joinedAt: string
}

export interface Reservation {
  id: string
  venueName: string
  venueAddress?: string
  date: string
  startTime: string
  endTime: string
  organizerId: string
  maxParticipants: number
  currentParticipants: number
  status: 'open' | 'full' | 'confirmed' | 'cancelled' | 'completed'
  totalCost?: number
  costPerPerson?: number
  notes?: string
}

export interface Ranking {
  id: string
  name: string
  avatarUrl?: string
  companyName?: string
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  winRate: number
  rank: number
}
```

#### 4.2 移除不需要的代码

```bash
# 备份需要移除的文件
mkdir -p archive/removed_code

# 移除视频处理相关代码
mv src/lib/video-api archive/removed_code/
mv src/lib/video archive/removed_code/
mv src/lib/validations/video.ts archive/removed_code/

# 移除视频相关页面
mv src/app/\(workspace\)/workspace/videos archive/removed_code/
mv src/app/\(workspace\)/workspace/upload archive/removed_code/

# 移除不需要的 API 路由
mv src/app/\(home\)/api/process archive/removed_code/
mv src/app/\(home\)/api/poll-jobs archive/removed_code/
mv src/app/\(home\)/api/webhooks archive/removed_code/

# 保留可能有用的
# - src/app/(home)/api/checkout (未来可能需要支付)
# - src/app/(workspace)/workspace/dashboard (改为会员中心)
# - src/app/(workspace)/workspace/credits (改为积分系统)
```

### Phase 5: 实现核心功能（Day 3-7）

详见下一节《实施计划》

---

## 🚨 风险与回滚计划

### 如果出现问题

#### 回滚数据库

```bash
# 使用备份文件恢复
pnpm supabase db reset
psql -h localhost -p 54322 -U postgres -d postgres < backup_YYYYMMDD_HHMMSS.sql
```

#### 回滚代码

```bash
# 切换回主分支
git checkout main

# 或恢复特定文件
git checkout main -- <file_path>
```

#### 回滚环境变量

```bash
cp .env.local.backup_YYYYMMDD .env.local
```

---

## ✅ 验证清单

### 数据库验证

```sql
-- 检查所有表是否创建
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 检查 RLS 是否启用
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 检查函数
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- 检查视图
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public';
```

### 功能验证

- [ ] 访问首页无报错
- [ ] 会员列表页面显示正常
- [ ] 排名页面显示正常
- [ ] 预约页面显示正常
- [ ] 用户可以登录/注册
- [ ] 类型检查通过：`pnpm check-type`
- [ ] Lint 检查通过：`pnpm lint`
- [ ] 本地开发服务器运行正常：`pnpm dev`

---

## 📞 遇到问题？

如遇到问题，请检查：

1. **数据库连接**：确保 Supabase 正在运行 (`pnpm supabase status`)
2. **环境变量**：检查 `.env.local` 配置
3. **类型错误**：重新生成类型 (`pnpm supabase gen types...`)
4. **端口冲突**：确保 3000 端口未被占用

---

**祝迁移顺利！🎉**
