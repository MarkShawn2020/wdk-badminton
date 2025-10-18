# 🔐 微信登录完整实现指南

**五道口AI创业羽毛球俱乐部 - 微信OAuth认证系统**

---

## 📋 目录

1. [准备工作](#准备工作)
2. [技术方案选择](#技术方案选择)
3. [公众号登录实现](#公众号登录实现)
4. [手机号验证备用方案](#手机号验证备用方案)
5. [JWT Token 管理](#jwt-token-管理)
6. [部署配置](#部署配置)
7. [测试](#测试)

---

## 1. 准备工作

### 1.1 注册微信公众号

**步骤**：

1. 访问 https://mp.weixin.qq.com/
2. 选择「服务号」或「订阅号」
   - **推荐服务号**：功能更强大，支持更多接口
   - 订阅号：功能有限，但认证费用相同
3. 完成注册流程

### 1.2 微信认证（必须）

**为什么必须认证**？

- ❌ 未认证：无法获取用户 `openid`，无法实现登录
- ✅ 已认证：完整OAuth权限，可获取用户信息

**费用**：¥300/年

**时间**：3-5个工作日

**步骤**：

1. 登录微信公众平台
2. 设置 → 微信认证
3. 提交资料（营业执照、法人身份证）
4. 支付认证费用
5. 等待审核

### 1.3 配置网页授权域名

**步骤**：

1. 登录微信公众平台
2. 设置与开发 → 公众号设置 → 功能设置
3. 网页授权域名 → 设置
4. 填入你的域名（如 `wdk-badminton.com`）
5. 下载验证文件，上传到网站根目录

**注意**：

- ⚠️ 域名必须**已备案**
- ⚠️ 必须是**一级域名**或**已备案的二级域名**
- ⚠️ 不能是 `localhost` 或 IP 地址

### 1.4 获取配置信息

**步骤**：

1. 登录微信公众平台
2. 开发 → 基本配置
3. 记录以下信息：
   - `AppID`（开发者ID）
   - `AppSecret`（开发者密码，点击「重置」获取）

**保存到环境变量**：

```env
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_app_secret_32_characters
```

---

## 2. 技术方案选择

### 方案对比

| 特性         | 公众号登录               | 开放平台网页登录      | 小程序登录               |
| ------------ | ------------------------ | --------------------- | ------------------------ |
| **适用场景** | H5网页（微信内）         | 网页（微信内外）      | 小程序                   |
| **门槛**     | 认证公众号（¥300）       | 企业资质              | 小程序账号               |
| **用户体验** | ⭐️⭐️⭐️⭐️⭐️ 一键授权 | ⭐️⭐️⭐️⭐️ 扫码登录 | ⭐️⭐️⭐️⭐️⭐️ 无感登录 |
| **实现难度** | ⭐️⭐️ 简单              | ⭐️⭐️⭐️ 中等        | ⭐️⭐️ 简单              |
| **开发周期** | 1-2天                    | 3-5天                 | 2-3天                    |

**推荐方案**：

- **MVP阶段**：**公众号登录**（最简单，1-2天完成）
- **未来扩展**：小程序 + 开放平台（覆盖更多场景）

---

## 3. 公众号登录实现

### 3.1 授权流程

```
用户点击「微信登录」
    ↓
跳转到微信授权页面
https://open.weixin.qq.com/connect/oauth2/authorize?
  appid=APPID
  &redirect_uri=REDIRECT_URI
  &response_type=code
  &scope=snsapi_userinfo
  &state=STATE#wechat_redirect
    ↓
用户同意授权
    ↓
微信回调到 REDIRECT_URI?code=CODE&state=STATE
    ↓
后端用 code 换取 access_token 和 openid
https://api.weixin.qq.com/sns/oauth2/access_token?
  appid=APPID
  &secret=SECRET
  &code=CODE
  &grant_type=authorization_code
    ↓
用 access_token 获取用户信息
https://api.weixin.qq.com/sns/userinfo?
  access_token=ACCESS_TOKEN
  &openid=OPENID
  &lang=zh_CN
    ↓
创建/登录账号，返回 JWT token
    ↓
前端保存 token，跳转到首页
```

### 3.2 安装依赖

```bash
pnpm add axios jsonwebtoken
pnpm add -D @types/jsonwebtoken
```

### 3.3 创建微信认证服务

```typescript
// src/lib/wechat/oauth.ts
import axios from 'axios'

interface WeChatAccessTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  openid: string
  scope: string
}

interface WeChatUserInfo {
  openid: string
  nickname: string
  sex: number // 1=男性，2=女性，0=未知
  province: string
  city: string
  country: string
  headimgurl: string
  privilege: string[]
  unionid?: string
}

export class WeChatOAuthService {
  private appId: string
  private appSecret: string
  private redirectUri: string

  constructor() {
    this.appId = process.env.WECHAT_APP_ID!
    this.appSecret = process.env.WECHAT_APP_SECRET!
    this.redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/wechat/callback`

    if (!this.appId || !this.appSecret) {
      throw new Error('WeChat credentials not configured')
    }
  }

  /**
   * 生成微信授权URL
   * @param state 自定义参数，用于防CSRF
   * @param scope snsapi_base（静默授权）或 snsapi_userinfo（需用户确认）
   */
  getAuthorizationUrl(
    state: string = 'STATE',
    scope: 'snsapi_base' | 'snsapi_userinfo' = 'snsapi_userinfo'
  ): string {
    const params = new URLSearchParams({
      appid: this.appId,
      redirect_uri: encodeURIComponent(this.redirectUri),
      response_type: 'code',
      scope,
      state,
    })

    return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`
  }

  /**
   * 用 code 换取 access_token
   */
  async getAccessToken(code: string): Promise<WeChatAccessTokenResponse> {
    const url = 'https://api.weixin.qq.com/sns/oauth2/access_token'
    const params = {
      appid: this.appId,
      secret: this.appSecret,
      code,
      grant_type: 'authorization_code',
    }

    try {
      const response = await axios.get<WeChatAccessTokenResponse>(url, { params })

      if ('errcode' in response.data) {
        throw new Error(`WeChat API Error: ${(response.data as any).errmsg}`)
      }

      return response.data
    } catch (error) {
      console.error('Failed to get WeChat access token:', error)
      throw new Error('微信授权失败，请重试')
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(accessToken: string, openid: string): Promise<WeChatUserInfo> {
    const url = 'https://api.weixin.qq.com/sns/userinfo'
    const params = {
      access_token: accessToken,
      openid,
      lang: 'zh_CN',
    }

    try {
      const response = await axios.get<WeChatUserInfo>(url, { params })

      if ('errcode' in response.data) {
        throw new Error(`WeChat API Error: ${(response.data as any).errmsg}`)
      }

      return response.data
    } catch (error) {
      console.error('Failed to get WeChat user info:', error)
      throw new Error('获取用户信息失败，请重试')
    }
  }

  /**
   * 刷新 access_token（可选）
   */
  async refreshAccessToken(refreshToken: string): Promise<WeChatAccessTokenResponse> {
    const url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token'
    const params = {
      appid: this.appId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }

    const response = await axios.get<WeChatAccessTokenResponse>(url, { params })

    if ('errcode' in response.data) {
      throw new Error(`WeChat API Error: ${(response.data as any).errmsg}`)
    }

    return response.data
  }
}

// 导出单例
export const wechatOAuth = new WeChatOAuthService()
```

### 3.4 创建 API 路由

#### 发起授权

```typescript
// src/app/api/auth/wechat/route.ts
import { NextRequest } from 'next/server'
import { wechatOAuth } from '@/lib/wechat/oauth'

export async function GET(request: NextRequest) {
  // 生成随机 state 防 CSRF
  const state = Math.random().toString(36).substring(7)

  // 可以将 state 保存到 session 或 Redis，用于回调验证
  // 这里简化处理

  // 获取授权 URL
  const authUrl = wechatOAuth.getAuthorizationUrl(state, 'snsapi_userinfo')

  // 重定向到微信授权页面
  return Response.redirect(authUrl)
}
```

#### 处理回调

```typescript
// src/app/api/auth/wechat/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { wechatOAuth } from '@/lib/wechat/oauth'
import { prisma } from '@/lib/db'
import { generateJWT } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?message=授权失败`)
  }

  try {
    // 1. 用 code 换取 access_token
    const tokenData = await wechatOAuth.getAccessToken(code)
    const { access_token, openid } = tokenData

    // 2. 获取用户信息
    const userInfo = await wechatOAuth.getUserInfo(access_token, openid)

    // 3. 查找或创建用户
    let member = await prisma.member.findFirst({
      where: { userId: `wechat:${openid}` },
    })

    if (!member) {
      // 新用户，创建账号
      member = await prisma.member.create({
        data: {
          userId: `wechat:${openid}`,
          name: userInfo.nickname,
          avatarUrl: userInfo.headimgurl,
          status: 'ACTIVE',
        },
      })
    } else {
      // 老用户，更新信息
      member = await prisma.member.update({
        where: { id: member.id },
        data: {
          name: userInfo.nickname,
          avatarUrl: userInfo.headimgurl,
          lastActiveAt: new Date(),
        },
      })
    }

    // 4. 生成 JWT token
    const token = generateJWT({
      memberId: member.id,
      userId: member.userId!,
      name: member.name,
    })

    // 5. 重定向到首页，并传递 token
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/success`)
    redirectUrl.searchParams.set('token', token)

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error('WeChat auth error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/error?message=${encodeURIComponent((error as Error).message)}`
    )
  }
}
```

### 3.5 JWT Token 管理

```typescript
// src/lib/auth/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d' // Token 有效期 7 天

export interface JWTPayload {
  memberId: string
  userId: string
  name: string
  iat?: number
  exp?: number
}

/**
 * 生成 JWT token
 */
export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * 验证 JWT token
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * 从请求中获取当前用户
 */
export function getCurrentUserFromRequest(request: Request): JWTPayload | null {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyJWT(token)
}

/**
 * 中间件：要求用户登录
 */
export function requireAuth(handler: (request: Request, user: JWTPayload) => Promise<Response>) {
  return async (request: Request) => {
    const user = getCurrentUserFromRequest(request)

    if (!user) {
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    return handler(request, user)
  }
}
```

### 3.6 前端登录组件

```typescript
// src/components/auth/WeChatLoginButton.tsx
'use client'

import { Button } from '@/components/ui/button'

export function WeChatLoginButton() {
  const handleLogin = () => {
    // 直接跳转到微信授权
    window.location.href = '/api/auth/wechat'
  }

  return (
    <Button
      onClick={handleLogin}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.5 3c-2.8 0-5.3 1.3-6.9 3.3-.5.6-.9 1.3-1.2 2-.3.7-.4 1.5-.4 2.3 0 1.7.6 3.3 1.6 4.6l-1.6 4.8 5-1.5c1 .4 2.1.6 3.2.6 2.8 0 5.3-1.3 6.9-3.3.5-.6.9-1.3 1.2-2 .3-.7.4-1.5.4-2.3 0-3.9-3.4-7.5-8.2-7.5zm-.4 10.8c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h1.4c.3 0 .5.2.5.5s-.2.5-.5.5H8.1zm3.5 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h1.4c.3 0 .5.2.5.5s-.2.5-.5.5h-1.4z" />
      </svg>
      微信登录
    </Button>
  )
}
```

#### 处理登录成功

```typescript
// src/app/auth/success/page.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AuthSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // 保存 token 到 localStorage
      localStorage.setItem('auth_token', token)

      // 跳转到首页
      router.push('/dashboard')
    } else {
      router.push('/auth/error')
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="text-2xl font-bold">登录成功</h1>
        <p className="mt-2 text-gray-600">正在跳转...</p>
      </div>
    </div>
  )
}
```

---

## 4. 手机号验证备用方案

如果不想用微信登录，可以使用手机号+验证码登录。

### 4.1 安装阿里云短信SDK

```bash
pnpm add @alicloud/pop-core
```

### 4.2 创建短信服务

```typescript
// src/lib/sms/aliyun.ts
import Core from '@alicloud/pop-core'

class AliyunSMSService {
  private client: any

  constructor() {
    this.client = new Core({
      accessKeyId: process.env.ALIYUN_SMS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.ALIYUN_SMS_ACCESS_KEY_SECRET!,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25',
    })
  }

  /**
   * 发送短信验证码
   */
  async sendCode(phone: string, code: string): Promise<boolean> {
    const params = {
      PhoneNumbers: phone,
      SignName: process.env.ALIYUN_SMS_SIGN_NAME!, // 短信签名
      TemplateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE!, // 短信模板
      TemplateParam: JSON.stringify({ code }),
    }

    try {
      const result = await this.client.request('SendSms', params, { method: 'POST' })

      if (result.Code === 'OK') {
        return true
      } else {
        console.error('SMS send failed:', result)
        return false
      }
    } catch (error) {
      console.error('SMS error:', error)
      return false
    }
  }
}

export const smsService = new AliyunSMSService()
```

### 4.3 创建验证码 API

```typescript
// src/app/api/auth/sms/send/route.ts
import { NextRequest } from 'next/server'
import { smsService } from '@/lib/sms/aliyun'
import { prisma } from '@/lib/db'

// 生成 6 位数字验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  const { phone } = await request.json()

  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return Response.json({ error: '手机号格式不正确' }, { status: 400 })
  }

  // 生成验证码
  const code = generateCode()

  // 发送短信
  const success = await smsService.sendCode(phone, code)

  if (!success) {
    return Response.json({ error: '发送失败，请稍后重试' }, { status: 500 })
  }

  // 保存验证码到数据库（5分钟有效期）
  // 这里简化处理，实际应该用 Redis
  await prisma.$executeRaw`
    INSERT INTO verification_codes (phone, code, expires_at)
    VALUES (${phone}, ${code}, NOW() + INTERVAL '5 minutes')
    ON CONFLICT (phone)
    DO UPDATE SET code = ${code}, expires_at = NOW() + INTERVAL '5 minutes', created_at = NOW()
  `

  return Response.json({ success: true, message: '验证码已发送' })
}
```

**注意**：需要先创建 `verification_codes` 表。

---

## 5. 测试

### 5.1 本地测试（需要内网穿透）

**问题**：微信回调必须是公网域名，`localhost` 无法测试。

**解决方案**：使用内网穿透工具

#### 使用 Ngrok

```bash
# 安装 ngrok
brew install ngrok

# 启动 Next.js
pnpm dev

# 另一个终端启动 ngrok
ngrok http 3000

# 输出类似：
# Forwarding https://abc123.ngrok.io -> http://localhost:3000
```

**配置**：

1. 复制 ngrok 提供的 HTTPS URL（如 `https://abc123.ngrok.io`）
2. 在微信公众平台配置该域名作为授权回调域名
3. 更新 `.env.local`：
   ```env
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
   ```

### 5.2 生产测试

**前提**：域名已备案，已配置到微信公众平台

**步骤**：

1. 部署到生产服务器
2. 访问 `https://your-domain.com`
3. 点击「微信登录」
4. 在微信内打开，授权登录

---

## 6. 常见问题

### Q1: 提示 `redirect_uri 参数错误`

**原因**：回调域名未在微信公众平台配置

**解决**：

1. 登录微信公众平台
2. 设置与开发 → 公众号设置 → 功能设置 → 网页授权域名
3. 添加你的域名（不带 `http://` 和路径）

### Q2: 用户授权后无法获取昵称头像

**原因**：使用了 `snsapi_base` 而不是 `snsapi_userinfo`

**解决**：使用 `snsapi_userinfo` 作为 scope

### Q3: Token 过期怎么办？

**方案 A**：短期 token + refresh token（推荐）

- Access token: 2小时
- Refresh token: 30天
- Token 过期时用 refresh token 换新 token

**方案 B**：长期 token

- Token 有效期 7-30 天
- 过期后重新登录

---

## 7. 安全建议

### 7.1 HTTPS 必须

**微信要求**：授权回调必须是 HTTPS

**配置**：见 `CHINA_DEPLOYMENT_ARCHITECTURE.md` 中的 SSL 配置

### 7.2 防 CSRF

**方法**：使用随机 `state` 参数

```typescript
// 生成授权 URL 时
const state = crypto.randomUUID()
// 保存到 session 或 Redis
await redis.set(`wechat_state:${state}`, '1', 'EX', 300) // 5分钟有效

// 回调验证
const state = searchParams.get('state')
const exists = await redis.get(`wechat_state:${state}`)
if (!exists) {
  throw new Error('Invalid state')
}
await redis.del(`wechat_state:${state}`)
```

### 7.3 敏感信息加密

**AppSecret 保护**：

- ❌ 不要提交到 Git
- ✅ 使用环境变量
- ✅ 生产环境使用密钥管理服务（如阿里云KMS）

---

## 8. 下一步

完成微信登录后，你可以：

1. **实现个人中心**：显示用户信息、积分、活动历史
2. **实现预约报名**：需要登录才能报名
3. **实现积分系统**：参与活动自动加积分
4. **添加消息推送**：活动提醒（微信模板消息）

---

**祝开发顺利！🚀**
