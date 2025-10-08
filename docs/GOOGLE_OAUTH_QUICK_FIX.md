# Google OAuth 快速修复指南

**错误信息：** `"Unsupported provider: provider is not enabled"`

**原因：** Supabase 中 Google provider 未启用

---

## 解决方案（5分钟配置）

### 1. Google Cloud Console 配置

1. 访问：https://console.cloud.google.com/

2. 创建/选择项目

3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**

4. 配置：

   ```
   Application type: Web application
   Name: ReelVan Web
   Authorized redirect URIs:
     https://xncedgheyootaxipktai.supabase.co/auth/v1/callback
   ```

5. 保存 **Client ID** 和 **Client Secret**

### 2. Supabase Dashboard 配置

1. 访问：https://supabase.com/dashboard/project/xncedgheyootaxipktai/auth/providers

2. 找到 **Google**，点击启用

3. 填入：
   - Client ID: (从上一步复制)
   - Client Secret: (从上一步复制)

4. 点击 **Save**

5. 进入 **URL Configuration**，添加：
   ```
   Redirect URLs: http://localhost:3000/*
   Site URL: http://localhost:3000
   ```

### 3. 重新测试

访问 http://localhost:3000/signup，点击 "Continue with Google"

---

## 详细文档

完整配置指南：[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

## 常见问题

**Q: redirect_uri_mismatch 错误**

A: 确保 Google OAuth client 的 Authorized redirect URIs 包含：

```
https://xncedgheyootaxipktai.supabase.co/auth/v1/callback
```

**Q: 只有我的邮箱能登录**

A: Google OAuth consent screen 处于 "Testing" 模式，需要添加测试用户：

- Google Cloud Console → OAuth consent screen → Test users → Add users

**Q: 想用自定义域名**

A: 在 Supabase Dashboard → Settings → Custom Domains 配置后，更新 Google OAuth redirect URI
