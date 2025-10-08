# Video Processing Architecture

## 概述

ReelVan 使用 WaveSpeed API 进行视频水印去除。处理流程采用**异步轮询**模式，因为视频处理是一个耗时的操作。

## 处理流程

### 1. 用户提交视频

```
用户 → /api/process → WaveSpeed API (创建任务) → 返回 request_id
```

**关键步骤：**

1. 验证用户积分
2. 扣除积分
3. 调用 `WaveSpeed.createPrediction(videoUrl)`
4. 在数据库中记录 `external_job_id` (WaveSpeed 返回的 request_id)
5. 设置视频状态为 `processing`

**代码位置：** `app/api/process/route.ts`

### 2. 后台轮询任务

```
Vercel Cron Job (每 2 分钟) → /api/poll-jobs → 查询所有 processing 视频
```

**关键步骤：**

1. 从数据库获取所有 `status='processing'` 的视频
2. 对每个视频调用 `WaveSpeed.getPredictionResult(external_job_id)`
3. 根据返回的状态更新数据库：
   - `completed` → 保存 processed_url，设置 status='completed'
   - `failed` → 退款积分，设置 status='failed'
   - `processing` → 继续等待

**代码位置：** `app/api/poll-jobs/route.ts`

**Cron 配置：** `vercel.json`

### 3. 前端轮询显示

```
ProcessingStatus 组件 (每 5 秒) → Supabase 查询视频状态 → 更新 UI
```

**代码位置：** `components/video/ProcessingStatus.tsx`

## WaveSpeed API 接口

### 创建任务

```bash
POST https://api.wavespeed.ai/api/v3/wavespeed-ai/video-watermark-remover
Authorization: Bearer ${WAVESPEED_API_KEY}
Content-Type: application/json

{
  "video": "https://example.com/video.mp4"
}
```

**响应（信封格式）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "ee9946d8b9434ff4bc8c3e3f9a0db2f9",
    "model": "wavespeed-ai/video-watermark-remover",
    "status": "created",
    "outputs": [],
    "urls": {
      "get": "https://api.wavespeed.ai/api/v3/predictions/{id}/result"
    },
    "created_at": "2025-10-08T16:49:38.648Z"
  }
}
```

### 查询结果

```bash
GET https://api.wavespeed.ai/api/v3/predictions/${requestId}/result
Authorization: Bearer ${WAVESPEED_API_KEY}
```

**响应（信封格式）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "ee9946d8b9434ff4bc8c3e3f9a0db2f9",
    "status": "completed", // or "processing", "failed"
    "outputs": ["https://output-url.mp4"],
    "created_at": "2025-10-08T16:49:38.648Z"
  }
}
```

**状态值：**

- `created` - 任务已创建
- `processing` - 正在处理
- `completed` - 处理完成
- `failed` - 处理失败

## 当前实现状态

### ✅ 已实现

1. **视频提交** (`/api/process`)
   - ✅ 积分验证和扣除
   - ✅ WaveSpeed API 集成
   - ✅ 信封格式解包
   - ✅ 数据库记录创建

2. **轮询端点** (`/api/poll-jobs`)
   - ✅ 批量查询处理中的视频
   - ✅ 调用 WaveSpeed 查询结果
   - ✅ 更新数据库状态
   - ✅ 失败时退款积分
   - ✅ 错误日志记录

3. **前端状态显示** (`ProcessingStatus.tsx`)
   - ✅ 实时轮询数据库
   - ✅ 状态可视化
   - ✅ 进度条显示
   - ✅ 错误处理

### 🔧 需要配置

1. **Vercel Cron Job**
   - ✅ 已创建 `vercel.json` 配置文件
   - ⚠️ 需要部署到 Vercel 才能生效
   - ⚠️ 本地开发需要手动调用 `/api/poll-jobs`

2. **环境变量**
   - ✅ `WAVESPEED_API_KEY` - WaveSpeed API 密钥
   - ⚠️ `CRON_SECRET` - 保护 poll-jobs 端点的密钥
   - ✅ `VIDEO_API_COST_PER_5_SECONDS` - 成本计算

## 本地开发测试

### 1. 提交视频

正常通过前端提交视频，会看到：

```
✅ WaveSpeed prediction created: ee9946d8b9434ff4bc8c3e3f9a0db2f9
```

### 2. 手动触发轮询

因为本地没有 cron job，需要手动调用：

```bash
# 每隔 10 秒手动调用一次
while true; do
  curl -s http://localhost:3000/api/poll-jobs \
    -H "Authorization: Bearer ${CRON_SECRET}" | jq .
  sleep 10
done
```

或者使用 watch 命令：

```bash
watch -n 10 'curl -s http://localhost:3000/api/poll-jobs -H "Authorization: Bearer ${CRON_SECRET}" | jq .'
```

### 3. 查看处理进度

访问：`http://localhost:3000/processing/{videoId}`

控制台应该显示：

```
🎬 Initializing video status monitoring for: {videoId}
📥 Fetching initial video status...
⏰ Starting polling (every 5 seconds)...
🔄 [HH:MM:SS] Polling video status...
📊 Video status: { status: "processing", progress: 0, ... }
```

## 生产环境部署

### 1. 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 添加：

```bash
WAVESPEED_API_KEY=your_api_key
CRON_SECRET=your_random_secret_string  # 使用: openssl rand -base64 32
VIDEO_API_COST_PER_5_SECONDS=0.10
```

### 2. 部署

```bash
git add vercel.json
git commit -m "feat: add cron job for video processing"
git push
```

### 3. 验证 Cron Job

在 Vercel Dashboard → Deployments → 选择部署 → Logs 中可以看到 cron job 的执行日志。

## 故障排查

### 问题：视频一直显示 "processing"

**检查步骤：**

1. **检查 Cron Job 是否运行**

   ```bash
   # 查看 Vercel Logs
   # 应该每 2 分钟看到一次 poll-jobs 调用
   ```

2. **手动触发轮询**

   ```bash
   curl -X GET https://your-domain.com/api/poll-jobs \
     -H "Authorization: Bearer ${CRON_SECRET}"
   ```

3. **查看数据库**

   ```sql
   SELECT id, status, external_job_id, error_message
   FROM videos
   WHERE status = 'processing'
   ORDER BY created_at DESC;
   ```

4. **直接测试 WaveSpeed API**
   ```bash
   curl -X GET "https://api.wavespeed.ai/api/v3/predictions/${REQUEST_ID}/result" \
     -H "Authorization: Bearer ${WAVESPEED_API_KEY}" | jq .
   ```

### 问题：Poll-jobs 返回错误

**查看详细日志：**

```bash
# 查看 Vercel Function Logs
# 或本地 dev server 终端输出
```

**常见错误：**

1. `WaveSpeed API response missing data field`
   - WaveSpeed API 返回格式改变
   - 检查实际返回的 JSON

2. `Unauthorized`
   - CRON_SECRET 配置错误
   - 检查 Authorization header

3. `Database query failed`
   - Supabase 连接问题
   - 检查 SUPABASE_SERVICE_ROLE_KEY

## 性能优化

### 当前配置

- **Cron 频率：** 每 2 分钟
- **前端轮询：** 每 5 秒
- **预计处理时间：** 视频时长的 2-5 倍

### 优化建议

1. **动态轮询频率**
   - 前 1 分钟：每 5 秒
   - 1-5 分钟：每 10 秒
   - 5 分钟后：每 30 秒

2. **Webhook 替代**
   - 如果 WaveSpeed 支持 webhook
   - 实现 `/api/webhooks/wavespeed`
   - 更快的响应，减少轮询开销

3. **批处理优化**
   - 一次 poll-jobs 调用可以处理多个视频
   - 当前已实现批量处理

## 成本分析

### API 调用成本

- **提交任务：** 1 次 WaveSpeed API 调用
- **轮询查询：** N 次查询（N = 处理时间 / cron 间隔）
- **示例：** 30秒视频，处理 2 分钟，每 2 分钟轮询 1 次 = 1 次查询

### 优化方向

1. 减少无效轮询（视频已完成后停止）
2. 使用 Webhook 替代轮询
3. 合理设置 cron 间隔

## 相关文件

- **API Routes:**
  - `app/api/process/route.ts` - 提交视频处理
  - `app/api/poll-jobs/route.ts` - 轮询任务状态
  - `app/api/videos/[videoId]/status/route.ts` - 查询单个视频状态

- **Client:**
  - `lib/video-api/wavespeed.ts` - WaveSpeed API 客户端
  - `components/video/ProcessingStatus.tsx` - 前端状态组件

- **Database:**
  - `supabase/migrations/20251008000000_create_video_processing_tables.sql`

- **Configuration:**
  - `vercel.json` - Cron job 配置
  - `.env.local` / `.env.example` - 环境变量

## 下一步

1. [ ] 设置 `CRON_SECRET` 环境变量
2. [ ] 本地测试：手动触发 poll-jobs
3. [ ] 部署到 Vercel
4. [ ] 验证 Cron Job 运行
5. [ ] 监控处理成功率
