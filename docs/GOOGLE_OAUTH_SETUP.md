# Google OAuth Setup Guide

**Last Updated:** 2025-10-08

This guide walks you through setting up Google OAuth authentication for ReelVan using Supabase Auth.

---

## Overview

ReelVan uses **Google Sign-In with Supabase Auth** for user authentication. This provides:

- ✅ Secure OAuth 2.0 PKCE flow
- ✅ No password management needed
- ✅ Fast signup/login experience
- ✅ Access to Google profile data
- ✅ Optional: Access to Google APIs (Drive, Calendar, etc.)

---

## Prerequisites

Before starting, ensure you have:

1. **Google Cloud Project** - Create one at [Google Cloud Console](https://console.cloud.google.com/)
2. **Supabase Project** - Already created for ReelVan
3. **Admin access** to both platforms

---

## Part 1: Google Cloud Console Setup

### Step 1: Configure OAuth Consent Screen

1. Go to [Google Auth Platform Console](https://console.cloud.google.com/auth/overview)

2. Click **Branding** in the left sidebar

3. Fill in the consent screen details:

   ```
   App Name: ReelVan
   User Support Email: your-email@example.com
   App Logo: [Upload ReelVan logo]
   Application Homepage: https://reelvan.com
   Application Privacy Policy: https://reelvan.com/privacy
   Application Terms of Service: https://reelvan.com/terms
   ```

4. Click **Save**

### Step 2: Configure Scopes

1. Click **Data Access (Scopes)** in the left sidebar

2. Add the following scopes:
   - `openid` (add manually if not present)
   - `.../auth/userinfo.email` (should be added by default)
   - `.../auth/userinfo.profile` (should be added by default)

3. Click **Save**

**⚠️ Important:** Only add these basic scopes. Additional scopes (especially sensitive/restricted ones) require Google verification which can take weeks.

### Step 3: Create OAuth Client ID

1. Go to [OAuth Clients](https://console.cloud.google.com/auth/clients)

2. Click **Create OAuth Client ID**

3. Choose **Web application** as the application type

4. Fill in the details:

   ```
   Name: ReelVan Web Client
   ```

5. Under **Authorized JavaScript origins**, add:

   ```
   http://localhost:3000
   https://reelvan.com
   https://www.reelvan.com
   https://<your-custom-domain>.com
   ```

6. Under **Authorized redirect URIs**, add your Supabase callback URL:

   **For Production:**

   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

   **For Local Development:**

   ```
   http://localhost:54321/auth/v1/callback
   ```

   Get your production callback URL from:
   - Supabase Dashboard → Authentication → Providers → Google
   - Copy the **Callback URL (for OAuth)** shown there

7. Click **Create**

8. **IMPORTANT:** Copy and save these values:
   - Client ID (looks like: `123456789-abc.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPX-xyz123...`)

---

## Part 2: Supabase Configuration

### Step 1: Enable Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)

2. Select your ReelVan project

3. Navigate to **Authentication** → **Providers**

4. Find **Google** in the provider list

5. Toggle **Enable** to ON

6. Fill in the OAuth credentials:

   ```
   Client ID: [Paste from Google Cloud Console]
   Client Secret: [Paste from Google Cloud Console]
   ```

7. Click **Save**

### Step 2: Configure Redirect URLs

1. Navigate to **Authentication** → **URL Configuration**

2. Add your application URLs to the **Redirect URLs** allowlist:

   ```
   http://localhost:3000/*
   https://reelvan.com/*
   https://www.reelvan.com/*
   ```

3. Set **Site URL**:

   ```
   Production: https://reelvan.com
   Development: http://localhost:3000
   ```

4. Click **Save**

---

## Part 3: Environment Variables

### Development (.env.local)

Create or update `.env.local` in your project root:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://xncedgheyootaxipktai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# No additional Google OAuth variables needed!
# Supabase handles the OAuth credentials server-side
```

**✅ That's it!** No need to expose Google Client ID/Secret in environment variables.

### Production (Vercel)

Same environment variables as development. Supabase manages OAuth credentials securely.

---

## Part 4: Local Development Setup

### For Local Supabase (Optional)

If you're running Supabase locally with `supabase start`, configure OAuth in your `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "your-google-client-id.apps.googleusercontent.com"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"
skip_nonce_check = false
```

And add to `.env.local`:

```env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Note:** For production, use Supabase Dashboard instead of config.toml.

---

## Part 5: Testing the Integration

### Test Signup Flow

1. Start your development server:

   ```bash
   pnpm dev
   ```

2. Navigate to http://localhost:3000/signup

3. Click **Continue with Google**

4. You should:
   - Be redirected to Google's consent screen
   - See "ReelVan wants to access your Google Account"
   - Click **Allow**
   - Be redirected back to `/dashboard` (or configured redirect URL)

5. Check browser console for success log:
   ```
   ✅ Google Sign-In successful
   User ID: abc123-def456...
   Email: user@example.com
   ```

### Test Login Flow

1. Navigate to http://localhost:3000/login

2. Click **Continue with Google**

3. If already signed in to Google, should redirect instantly

4. Should land on `/dashboard`

### Test Error Handling

1. In Google Cloud Console, temporarily disable the OAuth client

2. Try signing in - should redirect to `/auth/error` with error message

3. Re-enable OAuth client

---

## Troubleshooting

### Issue 1: "redirect_uri_mismatch" error

**Cause:** Supabase callback URL not added to Google OAuth client

**Fix:**

1. Go to Google Cloud Console → OAuth Clients
2. Edit your OAuth client
3. Add exact Supabase callback URL under **Authorized redirect URIs**
4. Format: `https://<project-ref>.supabase.co/auth/v1/callback`

---

### Issue 2: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured or scopes missing

**Fix:**

1. Go to Google Auth Platform → Branding
2. Fill in all required fields
3. Go to Data Access (Scopes)
4. Ensure `openid`, `userinfo.email`, and `userinfo.profile` are added

---

### Issue 3: Users stuck on consent screen

**Cause:** Testing with personal Google account while app is in "Testing" mode

**Fix:**

1. Go to Google Auth Platform → Audience
2. Add your test email addresses to the **Test users** list
3. Or publish the app (only do this when ready for production)

---

### Issue 4: "Invalid client" error

**Cause:** Wrong Client ID or Secret in Supabase

**Fix:**

1. Double-check Client ID and Secret in Google Cloud Console
2. Copy them exactly (no extra spaces)
3. Paste into Supabase Dashboard → Authentication → Providers → Google
4. Save and try again

---

### Issue 5: No refresh token received

**Cause:** Google doesn't send refresh tokens by default

**Fix:** Our `GoogleSignInButton` component already requests it:

```typescript
queryParams: {
  access_type: 'offline',
  prompt: 'consent',
}
```

If you're building custom OAuth flows, ensure these params are included.

---

## Security Considerations

### 1. Custom Domain (Recommended)

Set up a custom domain for your Supabase project:

- Go to Supabase Dashboard → Settings → Custom Domains
- Add `auth.reelvan.com` or similar
- Update Google OAuth redirect URIs to use custom domain
- **Why:** Prevents phishing by showing your domain instead of `<project>.supabase.co`

### 2. PKCE Flow

Our implementation uses PKCE flow by default (more secure than implicit flow):

- Authorization code exchanged server-side
- No tokens exposed in browser URL
- Implements code challenge/verifier

### 3. Nonce Validation

For extra security, you can implement nonce validation (recommended for production):

```typescript
// Generate nonce
const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
const hashedNonce = await hashNonce(nonce)

// Pass to Google
signInWithOAuth({
  provider: 'google',
  options: {
    queryParams: {
      nonce: hashedNonce,
    },
  },
})
```

See [Google OAuth Docs](https://developers.google.com/identity/gsi/web/guides/use-one-tap-js-api) for details.

---

## Production Checklist

Before going live:

- [ ] Google OAuth client configured for production domain
- [ ] Production callback URL added to Google OAuth client
- [ ] Supabase redirect URLs include production domain
- [ ] OAuth consent screen branding configured
- [ ] Test with multiple Google accounts
- [ ] Test error flows (denied access, network errors)
- [ ] Verify email addresses are stored in Supabase `auth.users`
- [ ] Set up email notifications (optional)
- [ ] Configure custom domain in Supabase (recommended)
- [ ] Remove test redirect URLs from Google OAuth client

---

## Advanced: Accessing Google APIs

If you need to access Google APIs (Drive, Calendar, etc.) on behalf of users:

### 1. Request Additional Scopes

Update `GoogleSignInButton.tsx`:

```typescript
signInWithOAuth({
  provider: 'google',
  options: {
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
      scope: 'openid email profile https://www.googleapis.com/auth/drive.readonly',
    },
  },
})
```

### 2. Store Provider Tokens

In `/app/auth/callback/route.ts`, extract and store tokens:

```typescript
const { provider_token, provider_refresh_token } = data.session

// Store in database
await supabase.from('user_tokens').upsert({
  user_id: data.user.id,
  provider: 'google',
  access_token: provider_token,
  refresh_token: provider_refresh_token,
})
```

### 3. Use Google APIs

```typescript
import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2()
oauth2Client.setCredentials({
  access_token: userToken.access_token,
  refresh_token: userToken.refresh_token,
})

const drive = google.drive({ version: 'v3', auth: oauth2Client })
const files = await drive.files.list()
```

**⚠️ Important:** Additional scopes require Google App Verification (can take 4-6 weeks).

---

## Resources

- [Supabase Auth with Google Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Sign-In Web Guide](https://developers.google.com/identity/gsi/web/guides/overview)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [PKCE Flow Explained](https://oauth.net/2/pkce/)

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs → Authentication)
3. Check Google Cloud Console → APIs & Services → Credentials → Usage
4. Open an issue: https://github.com/markshawn2020/reelvan-web/issues

---

**Setup Complete!** 🎉

Users can now sign up and log in with their Google accounts.
