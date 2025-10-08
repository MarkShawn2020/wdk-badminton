# Storage Upload Test Guide

## Quick Test Steps

### 1. 配置 Supabase Storage Bucket

在 Supabase Dashboard 中：

1. 进入 **Storage** → **Buckets**
2. 如果还没有 `videos` bucket：
   - 点击 **New Bucket**
   - Name: `videos`
   - **Public bucket**: 开启 ✅
   - 点击 **Create**

3. 设置 Policies（如果还没设置）：

   ```sql
   -- 在 Supabase SQL Editor 中运行

   -- 允许公开读取
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'videos');

   -- 允许认证用户上传到自己的文件夹
   CREATE POLICY "Users can upload to own folder"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'videos' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

### 2. 测试上传流程

1. **启动开发服务器**（如果还没启动）：

   ```bash
   pnpm dev
   ```

2. **打开浏览器**：

   ```
   http://localhost:3000/enhance
   ```

3. **上传测试视频**：
   - 拖拽一个视频文件到上传区域
   - 或点击选择文件
   - 选择一个小视频（建议 <50MB 用于快速测试）

4. **配置处理选项**：
   - 选择任意预设（例如 "Premium"）
   - 或点击 "Custom" 自定义

5. **点击提交**：
   - 按钮会显示 "Processing..."
   - 上传进度条会显示

6. **查看控制台输出**：
   - 按 F12 打开浏览器开发者工具
   - 切换到 **Console** 标签
   - 你应该看到：

   ```
   ✅ Video uploaded successfully!
   📹 Storage Path: abc123-def456/1728384000000-test-video.mp4
   🔗 Public URL: https://xncedgheyootaxipktai.supabase.co/storage/v1/object/public/videos/abc123-def456/1728384000000-test-video.mp4
   📊 File Size: 12.45 MB
   ⏱️ Duration: 8.3 seconds
   ```

### 3. 验证公网链接

1. **复制控制台中的 Public URL**

2. **在新标签页中打开**：
   - 应该能直接播放视频
   - 或提示下载（取决于浏览器设置）

3. **测试跨域访问**：
   - 在任意网页的控制台运行：
   ```javascript
   fetch('YOUR_PUBLIC_URL').then((r) => console.log('Access:', r.ok ? 'OK' : 'DENIED'))
   ```

### 4. 验证 API 端点

**直接测试 Public URL API**：

```bash
# 替换为你的实际 token 和 storage path
curl -X POST http://localhost:3000/api/storage/public-url \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xncedgheyootaxipktai-auth-token=YOUR_TOKEN" \
  -d '{
    "storagePath": "USER_ID/TIMESTAMP-filename.mp4"
  }'
```

**预期响应**：

```json
{
  "success": true,
  "data": {
    "publicUrl": "https://[project].supabase.co/storage/v1/object/public/videos/...",
    "signedUrl": "https://[project].supabase.co/storage/v1/object/sign/videos/...?token=xxx",
    "storagePath": "user-id/timestamp-filename.mp4",
    "expiresIn": 3600,
    "expiresAt": "2025-10-08T12:00:00.000Z"
  }
}
```

---

## 预期输出示例

### 完整控制台日志示例

```
// VideoUploadFlow.tsx:167-171
✅ Video uploaded successfully!
📹 Storage Path: 550e8400-e29b-41d4-a716-446655440000/1728384567890-my-awesome-video.mp4
🔗 Public URL: https://xncedgheyootaxipktai.supabase.co/storage/v1/object/public/videos/550e8400-e29b-41d4-a716-446655440000/1728384567890-my-awesome-video.mp4
📊 File Size: 23.45 MB
⏱️ Duration: 12.3 seconds
```

### Public URL 结构解析

```
https://xncedgheyootaxipktai.supabase.co/storage/v1/object/public/videos/550e8400-e29b-41d4-a716-446655440000/1728384567890-my-awesome-video.mp4
│      │                         │        │  │      │      │       │                 │                                      │
│      └─ Project ID             │        │  │      │      │       │                 └─ User ID                              └─ Filename (timestamp + original)
│                                │        │  │      │      │       └─ Bucket Name
│                                │        │  │      │      └─ Path Type (public)
│                                │        │  │      └─ Object endpoint
│                                │        │  └─ API version
│                                │        └─ Storage service
│                                └─ Supabase domain
└─ Protocol
```

---

## 故障排查

### 问题 1: 控制台没有输出

**可能原因**：

- API 调用失败
- 权限问题
- Bucket 不存在

**检查步骤**：

1. 打开浏览器开发者工具 → Network 标签
2. 查找 `/api/storage/public-url` 请求
3. 检查响应状态码和错误信息

---

### 问题 2: Public URL 返回 404

**可能原因**：

- Bucket 未设置为 public
- RLS 策略阻止访问
- 文件路径错误

**解决方案**：

```sql
-- 确保 bucket 是 public
UPDATE storage.buckets
SET public = true
WHERE id = 'videos';

-- 添加公开读取策略
CREATE POLICY "Enable public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');
```

---

### 问题 3: "Access denied" 错误

**可能原因**：

- 尝试访问其他用户的文件
- 未认证

**检查**：

```typescript
// API 会自动验证：
if (!storagePath.startsWith(`${user.id}/`)) {
  // 返回 403 Forbidden
}
```

---

### 问题 4: 控制台显示 "Failed to fetch"

**可能原因**：

- CORS 问题
- API 路由不存在
- 网络问题

**检查**：

```bash
# 测试 API 是否可访问
curl http://localhost:3000/api/storage/public-url

# 应该返回 401 (认证错误) 而不是 404
```

---

## 高级测试

### 测试 Signed URL 过期

```javascript
// 在浏览器控制台运行

// 1. 获取 signed URL (1 秒过期)
const response = await fetch('/api/storage/public-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storagePath: 'YOUR_PATH',
    expiresIn: 1, // 1 秒
  }),
})
const { data } = await response.json()
console.log('Signed URL:', data.signedUrl)

// 2. 立即访问 (应该成功)
await fetch(data.signedUrl).then((r) => console.log('Immediate access:', r.ok ? 'OK' : 'DENIED'))

// 3. 等待 2 秒后访问 (应该失败)
setTimeout(async () => {
  await fetch(data.signedUrl).then((r) => console.log('After expiry:', r.ok ? 'OK' : 'DENIED'))
}, 2000)
```

---

### 批量上传测试

```javascript
// 测试多个文件上传
const files = document.querySelector('input[type="file"]').files

for (const file of files) {
  // 上传逻辑...
  console.log(`Uploading ${file.name}...`)
}
```

---

## 性能基准

**预期上传速度**：

- 10MB 视频：~5-10 秒（取决于网络）
- 50MB 视频：~20-40 秒
- 100MB 视频：~40-80 秒

**API 响应时间**：

- `/api/upload`：<500ms
- `/api/storage/public-url`：<200ms
- 实际上传到 Supabase：取决于文件大小和网络

---

## 成功标准

✅ **测试通过条件**：

1. 视频上传进度条显示 0% → 100%
2. 控制台输出完整的 5 行信息
3. Public URL 可以在新标签页打开
4. Public URL 可以被其他人访问（公开链接）
5. Signed URL 在过期前可访问，过期后失败
6. 不同用户无法访问彼此的文件

---

## 下一步

完成测试后：

1. **验证数据库记录**：

   ```sql
   SELECT * FROM videos
   ORDER BY created_at DESC
   LIMIT 5;
   ```

2. **检查 Storage 使用量**：
   - Supabase Dashboard → Storage → Usage

3. **监控成本**：
   - Supabase Dashboard → Settings → Billing

4. **配置 CDN**（可选）：
   - 为高流量场景配置 CDN
   - 提高全球访问速度

---

**测试完成！** 🎉

如果所有步骤都成功，说明视频上传和公网链接生成功能已正常工作。
