# 🧹 项目清理计划 - 移除 ReelVan 残留

**发现问题**：项目中仍有 257+ 处 ReelVan 视频工具的引用未更新

---

## 📊 清理范围统计

```bash
# 搜索结果
总计: 257 处引用
├─ 文档文件 (.md): ~180 处
├─ 代码文件 (.ts/.tsx/.js): ~50 处
├─ 配置文件 (.json): ~15 处
└─ 其他: ~12 处
```

---

## 🎯 清理策略

### 策略 A：保守清理（推荐⭐️）

**原则**：

- ✅ 更新用户可见的内容（README、package.json、页面文本）
- ✅ 移除过时的文档（视频处理相关）
- ⚠️ 保留技术文档作为参考（移至 `archive/` 目录）
- ❌ 暂不删除代码（避免破坏现有功能）

**理由**：

- Phase 1 MVP 只需静态展示，不涉及后端
- 保留旧代码便于理解项目结构
- Phase 2 再逐步替换后端逻辑

### 策略 B：激进清理

**原则**：

- ✅ 删除所有 ReelVan 相关代码
- ✅ 删除所有视频处理相关功能
- ✅ 重新搭建羽毛球俱乐部功能

**风险**：

- ⚠️ 可能破坏现有代码结构
- ⚠️ 需要大量重构工作
- ⚠️ 开发服务器可能无法启动

**建议**：Phase 2 再考虑

---

## 📋 清理清单（策略 A - 保守清理）

### 第一优先级：用户可见内容 ✅

#### 1. 项目根目录文件

- [x] `package.json` - 更新项目名称和描述
- [ ] `README.md` - **完全重写**为羽毛球俱乐部介绍
- [ ] `.env.example` - 移除视频API相关配置
- [ ] `next.config.mjs` - 移除视频相关域名

#### 2. 公开页面内容

- [ ] `src/app/(home)/page.tsx` - 首页内容
- [ ] `src/app/(home)/about/page.tsx` - 关于页面
- [ ] `src/app/(home)/pricing/page.tsx` - 定价页（改为会费说明或删除）
- [ ] `public/static/images/` - 替换图片资源

### 第二优先级：文档清理 ⚠️

#### 3. 移动过时文档到 archive/

```bash
mkdir -p archive/reelvan-docs

# 视频处理相关文档
mv docs/PRD.md archive/reelvan-docs/
mv docs/VIDEO_PROCESSING_ARCHITECTURE.md archive/reelvan-docs/
mv docs/PIPELINE_IMPLEMENTATION.md archive/reelvan-docs/
mv docs/IMPLEMENTATION_COMPLETE.md archive/reelvan-docs/
mv docs/SETUP.md archive/reelvan-docs/
mv docs/README_VIDEO_FEATURE.md archive/reelvan-docs/

# Stripe 支付相关（暂时保留，Phase 2 可能用）
# mv docs/STRIPE_*.md archive/reelvan-docs/

# Google OAuth 相关（Phase 2 会用微信登录，暂时保留作参考）
# mv docs/GOOGLE_OAUTH_*.md archive/reelvan-docs/

# Supabase 相关（不用Supabase了，可以移除）
mv docs/SUPABASE_STORAGE_SETUP.md archive/reelvan-docs/
```

#### 4. 创建新的 README

```bash
# 备份旧 README
mv README.md archive/reelvan-docs/README_old.md

# 创建新 README（见下文）
```

### 第三优先级：代码清理 🔄

#### 5. API 路由（暂时保留，Phase 2 再删除）

```
src/app/(home)/api/
├── process/        # 视频处理 - Phase 2 删除
├── upload/         # 文件上传 - 改造为头像上传
├── videos/         # 视频管理 - Phase 2 删除
├── poll-jobs/      # 轮询任务 - Phase 2 删除
├── webhooks/       # Stripe webhooks - Phase 2 可能需要
├── checkout/       # Stripe checkout - Phase 2 可能需要
└── coupons/        # 优惠券 - Phase 2 删除
```

**建议**：

- ✅ Phase 1：不动这些文件（避免破坏编译）
- ✅ Phase 2：逐个替换为羽毛球俱乐部API

#### 6. 组件清理（暂时保留）

```
src/components/
├── video/          # 视频相关组件 - Phase 2 删除
├── pricing/        # 定价组件 - Phase 2 改造
└── workspace/      # 工作区组件 - Phase 2 改造为会员中心
```

---

## ✅ 立即执行的清理步骤

### Step 1: 更新 package.json

```json
{
  "name": "wdk-badminton-club",
  "version": "1.0.0",
  "description": "五道口AI创业羽毛球俱乐部管理平台",
  "author": "WDK Badminton Club",
  "repository": {
    "type": "git",
    "url": "https://github.com/markshawn2020/wdk-badminton"
  },
  "keywords": ["badminton", "club", "community", "ai-entrepreneurs", "wudaokou", "beijing"]
}
```

### Step 2: 创建新的 README.md

（见下一个文件）

### Step 3: 清理环境变量示例

```env
# .env.example

# ============================================================================
# 五道口AI创业羽毛球俱乐部 - 环境变量配置
# ============================================================================

# ------------ 应用配置 ------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=五道口AI创业羽毛球俱乐部

# ------------ 数据库（阿里云 RDS PostgreSQL）------------
DATABASE_URL="postgresql://username:password@localhost:5432/wdk_badminton?schema=public"

# ------------ 微信登录（Phase 2）------------
# WECHAT_APP_ID=
# WECHAT_APP_SECRET=

# ------------ 短信服务（阿里云，Phase 2）------------
# ALIYUN_SMS_ACCESS_KEY_ID=
# ALIYUN_SMS_ACCESS_KEY_SECRET=
# ALIYUN_SMS_SIGN_NAME=五道口羽毛球
# ALIYUN_SMS_TEMPLATE_CODE=

# ------------ 对象存储（阿里云 OSS，Phase 2）------------
# OSS_REGION=oss-cn-beijing
# OSS_ACCESS_KEY_ID=
# OSS_ACCESS_KEY_SECRET=
# OSS_BUCKET=wdk-badminton
# NEXT_PUBLIC_OSS_CDN_URL=

# ------------ JWT 密钥（Phase 2）------------
# JWT_SECRET=

# ------------ 以下为旧项目配置，Phase 1 不需要 ------------

# Stripe (暂时不需要)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=

# Video APIs (已废弃)
# WAVESPEED_API_KEY=
# REPLICATE_API_TOKEN=
# VIDEO_API_COST_PER_5_SECONDS=

# Supabase (不再使用)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
```

### Step 4: 移动过时文档

```bash
# 创建归档目录
mkdir -p archive/reelvan-docs

# 移动文档（保留作参考，不删除）
mv docs/PRD.md archive/reelvan-docs/
mv docs/VIDEO_PROCESSING_ARCHITECTURE.md archive/reelvan-docs/
mv docs/PIPELINE_IMPLEMENTATION.md archive/reelvan-docs/
mv docs/IMPLEMENTATION_COMPLETE.md archive/reelvan-docs/
mv docs/SETUP.md archive/reelvan-docs/
mv docs/README_VIDEO_FEATURE.md archive/reelvan-docs/
mv docs/SUPABASE_STORAGE_SETUP.md archive/reelvan-docs/
mv docs/HOMEPAGE_CONDITIONAL_RENDERING.md archive/reelvan-docs/
mv docs/DESIGN_SYSTEM.md archive/reelvan-docs/
mv docs/feishu/ archive/reelvan-docs/

# 备份旧 README
mv README.md archive/reelvan-docs/README_old.md

# 更新 .gitignore
echo "archive/" >> .gitignore
```

### Step 5: 清理图片资源（Phase 2）

```bash
# 替换以下图片（Phase 2 准备）
public/static/images/
├── logo.svg              # 羽毛球俱乐部 logo
├── og-badminton.png      # 社交分享卡片（1200x630）
├── favicon.ico           # 浏览器图标
└── avatars/              # 会员默认头像
    ├── default-male.jpg
    └── default-female.jpg
```

---

## 🚀 自动化清理脚本

```bash
#!/bin/bash
# cleanup.sh - 自动清理 ReelVan 残留

set -e

echo "🧹 开始清理 ReelVan 残留..."

# 1. 创建归档目录
echo "📁 创建归档目录..."
mkdir -p archive/reelvan-docs

# 2. 移动过时文档
echo "📄 移动过时文档..."
docs_to_archive=(
  "docs/PRD.md"
  "docs/VIDEO_PROCESSING_ARCHITECTURE.md"
  "docs/PIPELINE_IMPLEMENTATION.md"
  "docs/IMPLEMENTATION_COMPLETE.md"
  "docs/SETUP.md"
  "docs/README_VIDEO_FEATURE.md"
  "docs/SUPABASE_STORAGE_SETUP.md"
  "docs/HOMEPAGE_CONDITIONAL_RENDERING.md"
  "docs/DESIGN_SYSTEM.md"
  "docs/COMMIT_SUMMARY.md"
)

for doc in "${docs_to_archive[@]}"; do
  if [ -f "$doc" ]; then
    mv "$doc" archive/reelvan-docs/
    echo "  ✅ 已移动: $doc"
  fi
done

# 移动整个 feishu 目录
if [ -d "docs/feishu" ]; then
  mv docs/feishu archive/reelvan-docs/
  echo "  ✅ 已移动: docs/feishu/"
fi

# 3. 备份旧 README
echo "📝 备份旧 README..."
if [ -f "README.md" ]; then
  mv README.md archive/reelvan-docs/README_old.md
  echo "  ✅ 已备份: README.md"
fi

# 4. 更新 .gitignore
echo "📌 更新 .gitignore..."
if ! grep -q "^archive/" .gitignore 2>/dev/null; then
  echo "archive/" >> .gitignore
  echo "  ✅ 已添加 archive/ 到 .gitignore"
fi

# 5. 清理完成
echo ""
echo "✅ 清理完成！"
echo ""
echo "📊 清理统计："
echo "  - 已移动文档: ${#docs_to_archive[@]} 个"
echo "  - 归档目录: archive/reelvan-docs/"
echo ""
echo "⚠️  注意："
echo "  - 旧代码和API路由已保留（Phase 1不影响）"
echo "  - Phase 2 再逐步替换后端逻辑"
echo ""
echo "📝 下一步："
echo "  1. 创建新的 README.md"
echo "  2. 更新 package.json"
echo "  3. 清理 .env.example"
echo ""
```

---

## ⚠️ 风险提示

### 不要删除的内容

1. **所有代码文件**（`.ts`, `.tsx`, `.js`）
   - 原因：Phase 1 需要保持编译通过
   - 时机：Phase 2 再逐步替换

2. **API 路由**（`src/app/(home)/api/`）
   - 原因：删除会导致编译错误
   - 时机：Phase 2 替换为羽毛球俱乐部API

3. **组件库**（`src/components/`）
   - 原因：Header、Footer等仍在使用
   - 时机：Phase 2 逐个改造

4. **Stripe 相关**（`docs/STRIPE_*.md`）
   - 原因：Phase 2 可能用于场地费支付
   - 时机：确定不需要时再删除

### 可以安全删除的内容

1. **过时文档**：移至 `archive/`（不删除，保留作参考）
2. **示例图片**：`public/static/images/`中的视频相关图片
3. **环境变量**：`.env.example` 中的视频API配置

---

## ✅ 验证清理效果

### 清理后验证

```bash
# 1. 搜索 ReelVan 引用（应该大幅减少）
grep -r "ReelVan" --include="*.md" . | grep -v archive | wc -l

# 2. 检查开发服务器
pnpm dev
# 应该正常启动，无报错

# 3. 检查页面
open http://localhost:3001
# 首页应该正常显示（虽然还是旧内容）

# 4. 检查 git 状态
git status
# 应该看到被移动的文档和新增的 archive/ 目录
```

---

## 📚 清理后的项目结构

```
wdk-badminton/
├── archive/                    # 归档目录（新增）
│   └── reelvan-docs/          # ReelVan 旧文档
│       ├── README_old.md
│       ├── PRD.md
│       └── ...
│
├── docs/                       # 保留的文档
│   ├── GOOGLE_OAUTH_SETUP.md  # Phase 2 参考
│   ├── STRIPE_SETUP.md        # Phase 2 可能需要
│   └── README.md              # 索引文档
│
├── src/                        # 代码（暂时保留）
│   ├── app/
│   ├── components/
│   └── lib/
│
├── CHINA_DEPLOYMENT_ARCHITECTURE.md  # 新文档
├── MVP_IMPLEMENTATION_PLAN.md        # 新文档
├── MIGRATION_GUIDE.md                # 新文档
├── PROJECT_TRANSFORMATION_SUMMARY.md # 新文档
├── LAYOUT_UPDATE_SUMMARY.md          # 新文档
├── CLEANUP_PLAN.md                   # 本文档
│
├── README.md                   # 新的 README（待创建）
├── package.json                # 已更新
├── .env.example                # 待更新
└── ...
```

---

## 🎯 总结

**已完成**：

- ✅ 创建清理计划
- ✅ 定义清理策略
- ✅ 准备自动化脚本

**下一步**：

1. 执行 `cleanup.sh` 脚本
2. 创建新的 `README.md`
3. 更新 `package.json`
4. 更新 `.env.example`
5. 验证清理效果

**Phase 2 继续清理**：

- 删除视频相关API路由
- 删除视频相关组件
- 删除视频处理代码
- 实现羽毛球俱乐部功能

---

**准备好执行清理了吗？** 🚀
