# 🏸 五道口AI创业羽毛球俱乐部

**连接AI创业者，享受羽毛球乐趣**

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0+-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[网站](https://wdk-badminton.com) • [文档](./docs) • [部署指南](./CHINA_DEPLOYMENT_QUICK_START.md)

</div>

---

## 📖 项目简介

五道口AI创业羽毛球俱乐部是一个专为**五道口附近AI创业者**打造的羽毛球社区管理平台。

我们致力于：

- 🤝 **连接同行**：结识来自智谱、商汤、月之暗面等公司的AI创业者
- 💪 **健康运动**：工作之余放松身心，保持健康体魄
- 🏆 **竞技成长**：参与友谊赛，提升技术水平，挑战积分榜

---

## ✨ 核心功能

### Phase 1: 静态展示 MVP（当前）

- ✅ **首页**：俱乐部介绍、数据统计、特色展示
- ✅ **会员列表**：浏览所有活跃会员，按技能筛选
- ✅ **积分排名**：实时积分排行榜，展示胜率和场次
- ✅ **场地预约**：查看即将到来的活动，了解时间地点
- ✅ **关于页面**：俱乐部规则、历史、联系方式

### Phase 2: 交互增强（规划中）

- 🔄 **用户认证**：微信登录 + 手机号验证
- 🔄 **个人资料**：编辑基本信息、羽毛球技能、公司信息
- 🔄 **预约报名**：一键报名参加活动，实时更新人数
- 🔄 **积分历史**：查看个人积分变动记录

### Phase 3: 高级功能（未来）

- 📅 **比赛记录**：录入比赛结果，自动计算积分
- 💰 **在线支付**：场地费AA分摊，微信/支付宝支付
- 💬 **社交功能**：活动评论、照片分享、成就展示
- 📊 **数据分析**：个人/俱乐部数据统计、趋势图表

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+（本地开发或云数据库）

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/markshawn2020/wdk-badminton.git
cd wdk-badminton

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入数据库连接等配置

# 4. 初始化数据库（使用 Prisma）
pnpm prisma generate
pnpm prisma migrate dev --name init

# 5. 启动开发服务器
pnpm dev

# 6. 访问
open http://localhost:3000
```

### Docker 快速启动（可选）

```bash
# 使用 Docker Compose 一键启动
docker-compose up -d

# 访问
open http://localhost:3000
```

---

## 📦 技术栈

### 前端

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript 5+
- **样式**：Tailwind CSS 4.0 + Radix UI
- **状态管理**：Jotai
- **表单**：React Hook Form + Zod

### 后端

- **数据库**：PostgreSQL（阿里云 RDS）
- **ORM**：Prisma
- **认证**：微信登录 + JWT
- **存储**：阿里云 OSS（头像、照片）
- **短信**：阿里云短信服务

### 部署

- **服务器**：自建 Nginx + PM2
- **CDN**：阿里云 CDN
- **域名**：需备案

详见：[国内部署架构](./CHINA_DEPLOYMENT_ARCHITECTURE.md)

---

## 📂 项目结构

```
wdk-badminton/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (home)/           # 公开页面
│   │   │   ├── page.tsx      # 首页
│   │   │   ├── members/      # 会员列表
│   │   │   ├── rankings/     # 积分排名
│   │   │   ├── reservations/ # 场地预约
│   │   │   └── about/        # 关于页面
│   │   ├── (member)/         # 会员专区（需登录）
│   │   └── api/              # API 路由
│   ├── components/           # React 组件
│   │   ├── layout/          # 布局组件（Header, Footer）
│   │   ├── member/          # 会员相关组件
│   │   ├── ranking/         # 排名相关组件
│   │   └── reservation/     # 预约相关组件
│   ├── lib/                 # 工具库
│   │   ├── db.ts           # Prisma Client
│   │   └── utils.ts        # 通用工具函数
│   └── data/                # 示例数据（Phase 1）
│       ├── sample-members.ts
│       └── sample-reservations.ts
│
├── prisma/
│   └── schema.prisma        # 数据库 Schema
│
├── public/
│   └── static/
│       ├── images/          # 图片资源
│       └── favicons/        # 网站图标
│
├── docs/                    # 文档
│   ├── CHINA_DEPLOYMENT_ARCHITECTURE.md
│   ├── MVP_IMPLEMENTATION_PLAN.md
│   └── ...
│
├── MIGRATION_GUIDE.md       # 迁移指南
├── README.md                # 本文档
├── package.json
└── ...
```

---

## 📚 文档索引

### 快速上手

- **[快速开始指南](./CHINA_DEPLOYMENT_QUICK_START.md)** - 5分钟快速部署
- **[MVP实施计划](./MVP_IMPLEMENTATION_PLAN.md)** - Phase 1-3 详细计划

### 技术文档

- **[国内部署架构](./CHINA_DEPLOYMENT_ARCHITECTURE.md)** - 完整技术方案
- **[数据库迁移](./supabase/migrations/)** - Prisma Schema
- **[项目转型总结](./PROJECT_TRANSFORMATION_SUMMARY.md)** - 从视频工具到羽毛球俱乐部

### 开发指南

- **[贡献指南](./CONTRIBUTING.md)** - 如何参与开发
- **[代码规范](./CLAUDE.md)** - TypeScript/React 最佳实践

---

## 🛠️ 常用命令

```bash
# 开发
pnpm dev                 # 启动开发服务器
pnpm build              # 生产构建
pnpm start              # 启动生产服务器

# 数据库
pnpm prisma generate    # 生成 Prisma Client
pnpm prisma migrate dev # 创建/应用迁移
pnpm prisma studio      # 打开数据库管理界面

# 代码质量
pnpm lint               # ESLint 检查
pnpm check-type         # TypeScript 类型检查
pnpm test               # 运行测试

# 清理
pnpm clean              # 清理构建缓存
```

---

## 🤝 贡献指南

欢迎贡献代码、提出建议、报告问题！

### 开发流程

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具配置
```

---

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

---

## 💬 联系我们

- **GitHub**: https://github.com/markshawn2020/wdk-badminton
- **Email**: contact@wdk-badminton.com
- **微信公众号**: WDK_Badminton（规划中）

---

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Prisma](https://www.prisma.io/) - 现代化 ORM
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 组件

---

<div align="center">

**用代码连接创业者，用羽毛球连接生活** 🏸

Made with ❤️ by WDK Badminton Club

</div>
