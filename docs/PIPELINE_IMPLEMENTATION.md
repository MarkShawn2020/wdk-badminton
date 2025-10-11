# 多步骤视频处理流水线 - 实施指南

**版本**: 1.0.0
**日期**: 2025-10-11
**状态**: 已完成核心实现

---

## 📋 目录

1. [功能概述](#功能概述)
2. [架构设计](#架构设计)
3. [已实现的文件](#已实现的文件)
4. [部署步骤](#部署步骤)
5. [环境变量配置](#环境变量配置)
6. [数据库迁移](#数据库迁移)
7. [测试指南](#测试指南)
8. [故障排查](#故障排查)

---

## 功能概述

### 支持的处理选项

用户可以选择以下选项的任意组合：

1. ✅ **去水印**（WaveSpeed API）
   - 移除 AI 平台水印（Sora, Veo, Kling, JiMeng）
   - 成本：~240 credits/30s

2. ✅ **增强画质**（Replicate Topaz Labs）
   - 支持 1080p, 4K 分辨率
   - FPS 提升至 60
   - 成本：~68 credits/30s (1080p), ~200 credits/30s (4K)

3. ✅ **组合使用**（串行处理）
   - 先去水印 → 再增强画质
   - 自动传递中间结果
   - 总成本 = 各步骤成本之和

### 用户流程示例

```
用户操作：
  ☑ 去水印
  ☑ 增强画质 (4K)
      ↓
系统自动创建流水线：
  Step 1: Remove Watermark (WaveSpeed) - 240 credits
  Step 2: Enhance Quality (Replicate 4K) - 200 credits
  Total: 440 credits
      ↓
用户确认支付 440 credits
      ↓
Step 1 开始处理...
      ↓
Step 1 完成 ✅ (输出: watermark_removed.mp4)
      ↓
Step 2 自动开始 (输入: watermark_removed.mp4)
      ↓
Step 2 完成 ✅ (输出: enhanced_4k.mp4)
      ↓
用户获得最终视频
```

---

## 架构设计

### 核心组件

```
┌─────────────────────────────────────────────────┐
│           Client (React Components)             │
│  - VideoUploadFlow.tsx (用户选择选项)            │
│  - ProcessingStatus.tsx (显示进度)              │
└────────────┬────────────────────────────────────┘
             │ fetch('/api/process')
             ↓
┌─────────────────────────────────────────────────┐
│      API Routes (Next.js App Router)            │
│  - /api/process         (创建流水线)             │
│  - /api/poll-jobs       (轮询步骤状态)           │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│           Business Logic Layer                  │
│  - pipeline-orchestrator.ts (流水线编排)         │
│  - pipeline-step-handler.ts (步骤执行)          │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌────────────────────────┬────────────────────────┐
│   External APIs        │     Database           │
│  - WaveSpeed           │  - videos              │
│  - Replicate           │  - processing_pipeline │
└────────────────────────┴────────────────────────┘
```

### 数据流

```sql
-- 1. 创建视频记录
INSERT INTO videos (
  user_id,
  pipeline_enabled = true,
  total_pipeline_steps = 2
)

-- 2. 创建流水线步骤
INSERT INTO processing_pipeline (
  video_id,
  step_order = 1,
  step_type = 'remove_watermark',
  status = 'pending'
)
INSERT INTO processing_pipeline (
  video_id,
  step_order = 2,
  step_type = 'enhance_quality',
  status = 'pending'
)

-- 3. 启动第一步
UPDATE processing_pipeline
SET status = 'processing', external_job_id = 'abc123'
WHERE video_id = ... AND step_order = 1

-- 4. Cron Job 轮询
-- 检测 Step 1 完成
UPDATE processing_pipeline
SET status = 'completed', output_video_url = '...'
WHERE id = ...

-- 5. 自动启动 Step 2
UPDATE processing_pipeline
SET status = 'processing',
    input_video_url = <Step 1 的 output>,
    external_job_id = 'xyz789'
WHERE video_id = ... AND step_order = 2

-- 6. Step 2 完成
UPDATE videos
SET status = 'completed',
    processed_url = <Step 2 的 output>
WHERE id = ...
```

---

## 已实现的文件

### 新增文件

| 文件路径                                                            | 说明                 | 状态    |
| ------------------------------------------------------------------- | -------------------- | ------- |
| `supabase/migrations/20251011000000_create_processing_pipeline.sql` | 数据库迁移           | ✅ 完成 |
| `lib/video-api/replicate.ts`                                        | Replicate API 客户端 | ✅ 完成 |
| `lib/video/pipeline-orchestrator.ts`                                | 流水线编排器         | ✅ 完成 |
| `lib/video/pipeline-step-handler.ts`                                | 步骤处理器           | ✅ 完成 |
| `docs/PIPELINE_IMPLEMENTATION.md`                                   | 本文档               | ✅ 完成 |

### 修改的文件

| 文件路径                            | 修改内容       | 状态    |
| ----------------------------------- | -------------- | ------- |
| `app/(home)/api/process/route.ts`   | 支持多步骤处理 | ✅ 完成 |
| `app/(home)/api/poll-jobs/route.ts` | 支持流水线轮询 | ✅ 完成 |

### 待修改的文件（可选）

| 文件路径                                | 修改内容       | 优先级 |
| --------------------------------------- | -------------- | ------ |
| `components/video/ProcessingStatus.tsx` | 显示流水线进度 | 中     |
| `components/video/VideoUploadFlow.tsx`  | 显示成本预览   | 低     |

---

## 部署步骤

### 1. 环境准备

```bash
# 确保你有这些账号和 API Key:
# 1. WaveSpeed API Key (已有)
# 2. Replicate API Token (新需要)
# 3. Supabase Project (已有)
```

### 2. 安装依赖（如有需要）

```bash
pnpm install
```

### 3. 配置环境变量

在 `.env.local` 中添加：

```bash
# Existing
WAVESPEED_API_KEY=your_wavespeed_key

# New - Replicate API
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxx

# Optional - Cron Job Protection
CRON_SECRET=your_random_secret_string
```

获取 Replicate API Token:

1. 访问 https://replicate.com/account/api-tokens
2. 创建新 token
3. 复制到 `.env.local`

### 4. 数据库迁移

```bash
# 本地测试
pnpm supabase migration new create_processing_pipeline
pnpm supabase db reset

# 生产环境
pnpm supabase db push
```

验证迁移成功：

```sql
-- 在 Supabase Dashboard SQL Editor 执行
SELECT * FROM processing_pipeline LIMIT 1;
SELECT * FROM videos WHERE pipeline_enabled = true LIMIT 1;
```

### 5. 更新 TypeScript 类型

```bash
pnpm supabase gen types typescript --local > types/database.ts
```

### 6. 测试本地运行

```bash
pnpm dev

# 在另一个终端手动触发 poll-jobs
curl http://localhost:3000/api/poll-jobs \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

### 7. 部署到 Vercel

```bash
# 1. 提交代码
git add .
git commit -m "feat: implement multi-step video processing pipeline"
git push

# 2. 在 Vercel Dashboard 配置环境变量
# Settings → Environment Variables
# 添加 REPLICATE_API_TOKEN

# 3. 部署完成后验证 Cron Job
# Vercel Dashboard → Deployments → Logs
# 应该看到每 2 分钟执行一次 poll-jobs
```

---

## 环境变量配置

### 必需的环境变量

```bash
# Supabase (已有)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# WaveSpeed API (已有)
WAVESPEED_API_KEY=xxx

# Replicate API (新增)
REPLICATE_API_TOKEN=r8_xxx

# Cron Job Protection (推荐)
CRON_SECRET=$(openssl rand -base64 32)

# Cost Configuration (已有)
VIDEO_API_COST_PER_5_SECONDS=0.10
```

### Vercel 配置步骤

```bash
# 方式 1：通过 Dashboard
1. 访问 https://vercel.com/your-org/reelvan-web/settings/environment-variables
2. 添加变量: REPLICATE_API_TOKEN
3. Value: r8_xxxxxxxxxxxxx
4. Environment: Production, Preview, Development
5. Save

# 方式 2：通过 CLI
vercel env add REPLICATE_API_TOKEN
# 粘贴 token
# 选择环境: All (Production, Preview, Development)
```

---

## 数据库迁移

### 迁移内容

**新增表**：`processing_pipeline`

```sql
CREATE TABLE processing_pipeline (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL,
  external_job_id TEXT,
  input_video_url TEXT NOT NULL,
  output_video_url TEXT,
  estimated_cost_credits INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**新增字段**：`videos` 表

```sql
ALTER TABLE videos ADD COLUMN pipeline_enabled BOOLEAN DEFAULT false;
ALTER TABLE videos ADD COLUMN current_pipeline_step INTEGER DEFAULT 1;
ALTER TABLE videos ADD COLUMN total_pipeline_steps INTEGER DEFAULT 1;
```

**新增函数**：

- `get_next_pipeline_step(video_id)` - 获取下一个待执行步骤
- `is_pipeline_completed(video_id)` - 检查流水线是否完成
- `get_pipeline_progress(video_id)` - 计算总体进度

### 本地测试迁移

```bash
# 1. 应用迁移
pnpm supabase db reset

# 2. 验证表结构
psql postgresql://postgres:postgres@localhost:54322/postgres

\dt processing_pipeline
\d videos
```

### 生产环境迁移

```bash
# 推送到生产
pnpm supabase db push

# 验证
# 在 Supabase Dashboard → SQL Editor 执行：
SELECT
  table_name,
  column_name
FROM information_schema.columns
WHERE table_name IN ('videos', 'processing_pipeline')
ORDER BY table_name, ordinal_position;
```

---

## 测试指南

### 单元测试（当前未实现）

```typescript
// TODO: 添加单元测试
describe('Pipeline Orchestrator', () => {
  it('should build pipeline correctly', () => {
    // ...
  })
})
```

### 集成测试（手动）

#### 测试场景 1：仅去水印

```bash
# 1. 上传视频并选择：
#    ☑ 去水印
#    ☐ 增强画质

# 2. 检查数据库
SELECT * FROM processing_pipeline WHERE video_id = 'xxx';
-- 应该只有 1 行 (step_order = 1, step_type = 'remove_watermark')

# 3. 等待处理完成
curl http://localhost:3000/api/poll-jobs \
  -H "Authorization: Bearer ${CRON_SECRET}"

# 4. 验证结果
SELECT status, processed_url FROM videos WHERE id = 'xxx';
-- status = 'completed'
-- processed_url 应该是 WaveSpeed 的输出
```

#### 测试场景 2：去水印 + 增强画质

```bash
# 1. 上传视频并选择：
#    ☑ 去水印
#    ☑ 增强画质 (1080p)

# 2. 检查数据库
SELECT * FROM processing_pipeline WHERE video_id = 'xxx' ORDER BY step_order;
-- 应该有 2 行
-- step_order = 1: remove_watermark (status = 'processing')
-- step_order = 2: enhance_quality (status = 'pending')

# 3. 第一次轮询（Step 1 完成）
curl http://localhost:3000/api/poll-jobs

# 查看 Step 2 是否自动启动
SELECT * FROM processing_pipeline WHERE video_id = 'xxx' AND step_order = 2;
-- status 应该变成 'processing'
-- input_video_url 应该是 Step 1 的 output_video_url

# 4. 第二次轮询（Step 2 完成）
curl http://localhost:3000/api/poll-jobs

# 验证最终结果
SELECT status, processed_url FROM videos WHERE id = 'xxx';
-- status = 'completed'
-- processed_url 应该是 Step 2 (Replicate) 的输出
```

#### 测试场景 3：仅增强画质

```bash
# 1. 上传视频并选择：
#    ☐ 去水印
#    ☑ 增强画质 (4K)

# 2. 检查数据库
SELECT * FROM processing_pipeline WHERE video_id = 'xxx';
-- 应该只有 1 行 (step_order = 1, step_type = 'enhance_quality')

# 3. 等待处理
curl http://localhost:3000/api/poll-jobs

# 4. 验证
-- processed_url 应该是 Replicate 的 4K 输出
```

### 成本验证

```bash
# 查看每个视频的成本分解
SELECT
  v.id,
  v.estimated_cost_credits AS total_cost,
  STRING_AGG(
    pp.step_name || ': ' || pp.estimated_cost_credits::text,
    ' + '
  ) AS cost_breakdown
FROM videos v
LEFT JOIN processing_pipeline pp ON v.id = pp.video_id
WHERE v.id = 'xxx'
GROUP BY v.id, v.estimated_cost_credits;

-- 输出示例:
-- total_cost: 308
-- cost_breakdown: Remove Watermark: 240 + Enhance Quality (1080p): 68
```

---

## 故障排查

### 问题 1：Step 1 完成后，Step 2 未自动启动

**症状**：

```
Step 1: status = 'completed', output_video_url = 'https://...'
Step 2: status = 'pending' (没有变化)
```

**可能原因**：

1. Cron Job 未运行
2. `poll-jobs` 出错

**解决方法**：

```bash
# 1. 手动触发 poll-jobs
curl http://localhost:3000/api/poll-jobs -H "Authorization: Bearer ${CRON_SECRET}"

# 2. 检查日志
# Vercel Dashboard → Deployments → Functions → poll-jobs

# 3. 检查数据库
SELECT * FROM processing_pipeline WHERE video_id = 'xxx';

# 4. 手动启动下一步 (临时修复)
UPDATE processing_pipeline
SET
  status = 'processing',
  started_at = NOW(),
  input_video_url = (
    SELECT output_video_url
    FROM processing_pipeline
    WHERE video_id = 'xxx' AND step_order = 1
  )
WHERE video_id = 'xxx' AND step_order = 2;
```

### 问题 2：Replicate API 返回 401 Unauthorized

**症状**：

```
❌ Replicate API error (401): Unauthorized
```

**解决方法**：

```bash
# 1. 验证 API Token
echo $REPLICATE_API_TOKEN

# 2. 测试 API Token
curl https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN"

# 3. 重新生成 token
# 访问 https://replicate.com/account/api-tokens

# 4. 更新环境变量
# Vercel Dashboard → Settings → Environment Variables
# 或 .env.local
```

### 问题 3：成本计算不正确

**症状**：

```
用户看到的成本: 500 credits
实际扣除: 308 credits
```

**检查点**：

```typescript
// 检查 pipeline-orchestrator.ts 的 buildPipeline()
console.log(
  'Pipeline:',
  pipeline.map((s) => ({
    step: s.stepName,
    cost: s.estimatedCostCredits,
  }))
)

// 检查 /api/process 的 creditsRequired
console.log('Total credits:', creditsRequired)
```

### 问题 4：视频卡在 "processing" 状态

**可能原因**：

1. 外部 API 超时
2. Cron Job 停止
3. 步骤失败但未标记

**诊断步骤**：

```sql
-- 1. 检查步骤状态
SELECT
  pp.step_order,
  pp.step_type,
  pp.status,
  pp.error_message,
  pp.external_job_id,
  pp.started_at,
  NOW() - pp.started_at AS elapsed_time
FROM processing_pipeline pp
WHERE pp.video_id = 'xxx'
ORDER BY pp.step_order;

-- 2. 检查是否超时 (> 10 分钟)
SELECT * FROM processing_pipeline
WHERE status = 'processing'
  AND started_at < NOW() - INTERVAL '10 minutes';

-- 3. 手动标记为失败并退款
UPDATE processing_pipeline
SET status = 'failed', error_message = 'Timeout'
WHERE id = 'xxx';

UPDATE videos
SET status = 'failed'
WHERE id = 'xxx';

-- 退款 (需要通过 RPC)
SELECT refund_credits('user_id', 'video_id', amount);
```

---

## 性能优化建议

### 1. 缓存中间结果

```typescript
// 如果相同视频重复处理，缓存去水印后的结果
const cacheKey = `watermark_removed:${videoHash}`
const cached = await redis.get(cacheKey)
if (cached) {
  return cached // 跳过 Step 1
}
```

### 2. 批量轮询优化

```typescript
// 当前：串行轮询每个步骤
for (const step of steps) {
  await pollPipelineStep(step)
}

// 优化：并行轮询
await Promise.all(steps.map((step) => pollPipelineStep(step)))
```

### 3. Webhook 替代轮询

```typescript
// WaveSpeed 如果支持 webhook
// app/(home)/api/webhooks/wavespeed/route.ts
export async function POST(request: Request) {
  const { id, status, output } = await request.json()

  // 直接更新步骤状态，无需轮询
  await updatePipelineStep(id, status, output)

  // 自动启动下一步
  if (status === 'completed') {
    await startNextPipelineStep(videoId)
  }
}
```

---

## 待办事项

### 短期（必须）

- [ ] 添加 Replicate API Token 到环境变量
- [ ] 运行数据库迁移
- [ ] 测试去水印 + 增强画质流程

### 中期（重要）

- [ ] 更新前端 UI 显示流水线进度
- [ ] 添加成本预览（显示各步骤成本）
- [ ] 错误重试机制（Step 失败自动重试 2 次）

### 长期（优化）

- [ ] Webhook 替代轮询（减少 API 调用）
- [ ] 缓存中间结果（相同视频重复处理）
- [ ] 动态分辨率选择（根据原视频分辨率自动选择）
- [ ] 成本优化报告（分析用户最常用的选项组合）

---

## Git Commit 建议

```bash
feat: implement multi-step video processing pipeline

- Add database migration for processing_pipeline table
- Create Replicate API client for video upscaling
- Implement pipeline orchestrator and step handler
- Modify /api/process to support multi-step workflows
- Modify /api/poll-jobs to handle pipeline polling
- Support watermark removal + quality enhancement combination

BREAKING CHANGE: videos table now has pipeline_enabled field

🤖 Generated with Claude Code
https://claude.com/claude-code
```

---

## 联系支持

如有问题，请：

1. 查看本文档的"故障排查"部分
2. 检查 Vercel 部署日志
3. 联系技术团队

**祝部署顺利！** 🚀
