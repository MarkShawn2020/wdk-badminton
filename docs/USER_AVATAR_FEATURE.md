# User Avatar Feature Documentation

**Created:** 2025-10-08
**Component:** UserAvatar
**Status:** ✅ Complete

---

## Overview

The UserAvatar component displays the authenticated user's profile picture and name in the navigation header, with a dropdown menu for account management and navigation.

### Key Features

- ✅ **Google Profile Integration**: Shows user's Google avatar and name
- ✅ **Real-time Auth State**: Updates automatically on login/logout
- ✅ **Dropdown Menu**: Quick access to profile, settings, and videos
- ✅ **Fallback Initials**: Shows initials when no avatar available
- ✅ **Sign Out**: One-click logout functionality
- ✅ **Responsive Design**: Mobile and desktop optimized
- ✅ **Loading States**: Skeleton loader while checking auth
- ✅ **Unauthenticated State**: Shows "Sign In" button when not logged in

---

## Component Architecture

### File Structure

```
components/
├── auth/
│   ├── UserAvatar.tsx          # Main avatar component
│   └── GoogleSignInButton.tsx  # Login button
├── Header.tsx                   # Navigation header (integrated)
└── components/ui/
    ├── avatar.tsx              # Avatar UI primitives
    ├── dropdown-menu.tsx       # Dropdown UI primitives
    └── button.tsx              # Button UI primitives
```

### Component Hierarchy

```
Header (Server Component)
└── UserAvatar (Client Component)
    ├── Avatar
    │   ├── AvatarImage (Google profile picture)
    │   └── AvatarFallback (Initials)
    └── DropdownMenu
        ├── DropdownMenuTrigger (Avatar + Name)
        └── DropdownMenuContent
            ├── User Info (Name + Email)
            ├── My Videos → /dashboard
            ├── Upload Video → /enhance
            ├── Profile → /profile
            ├── Settings → /settings
            └── Sign Out (action)
```

---

## Implementation Details

### 1. Authentication State Management

```typescript
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)
const supabase = createClient()

useEffect(() => {
  // Initial session check
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
    setLoading(false)
  })

  // Real-time auth state listener
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}, [supabase.auth])
```

**Key Points:**

- Uses `getSession()` for initial state (SSR-friendly)
- `onAuthStateChange` for real-time updates
- Proper cleanup with subscription unsubscribe
- TypeScript typing with `User | null`

### 2. User Data Extraction

```typescript
const userMetadata = user.user_metadata
const displayName = userMetadata?.full_name || userMetadata?.name || user.email?.split('@')[0]
const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture
const email = user.email
```

**Google OAuth Returns:**

- `user_metadata.full_name` - Full name (e.g., "John Doe")
- `user_metadata.picture` - Google profile picture URL
- `user_metadata.avatar_url` - Alternative avatar URL
- `user.email` - Email address

**Fallback Chain:**

1. Try `full_name`
2. Try `name`
3. Use email username (part before @)

### 3. Initials Generation

```typescript
const getInitials = (name: string | undefined) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
```

**Examples:**

- "John Doe" → "JD"
- "Alice" → "AL"
- undefined → "?"

### 4. Sign Out Flow

```typescript
const handleSignOut = async () => {
  await supabase.auth.signOut()
  router.push('/')
  router.refresh()
}
```

**Steps:**

1. Call `supabase.auth.signOut()` - Clears session
2. Redirect to homepage
3. Refresh router to update server state

---

## UI States

### 1. Loading State

Shows skeleton loader while checking authentication:

```tsx
<div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
```

**When:** Initial page load, before session check completes

### 2. Unauthenticated State

Shows "Sign In" button:

```tsx
<Link href="/login">
  <Button variant="outline" size="sm" className="gap-2">
    <LogIn className="h-4 w-4" />
    <span className="hidden sm:inline">Sign In</span>
  </Button>
</Link>
```

**When:** No active session
**Behavior:** Redirects to `/login` page

### 3. Authenticated State

Shows avatar with dropdown menu:

```tsx
<Avatar className="h-8 w-8 cursor-pointer border-2 border-gray-200...">
  <AvatarImage src={avatarUrl} alt={displayName} />
  <AvatarFallback className="bg-primary-100 text-primary-700...">
    {getInitials(displayName)}
  </AvatarFallback>
</Avatar>
<span className="hidden text-sm font-medium... md:inline">
  {displayName}
</span>
```

**When:** User is signed in
**Behavior:** Clickable, opens dropdown menu

---

## Dropdown Menu Items

### User Info Section

```
┌──────────────────────────┐
│ John Doe                 │ ← Display name
│ john.doe@gmail.com       │ ← Email
├──────────────────────────┤
```

### Navigation Items

| Icon | Label        | Link       | Description          |
| ---- | ------------ | ---------- | -------------------- |
| 📹   | My Videos    | /dashboard | User's video history |
| 📹   | Upload Video | /enhance   | Upload new video     |
| 👤   | Profile      | /profile   | User profile page    |
| ⚙️   | Settings     | /settings  | Account settings     |

### Sign Out

| Icon | Label    | Action          | Style |
| ---- | -------- | --------------- | ----- |
| 🚪   | Sign Out | handleSignOut() | Red   |

---

## Responsive Behavior

### Desktop (md+)

```
[Avatar] [Display Name] ▼
```

- Shows avatar (32px)
- Shows display name next to avatar
- Dropdown aligns to right edge

### Mobile (<md)

```
[Avatar] ▼
```

- Shows avatar only (32px)
- Name hidden to save space
- Dropdown aligns to right edge

---

## Integration Guide

### Adding UserAvatar to a Page

```tsx
// components/YourHeader.tsx
import { UserAvatar } from '@/components/auth/UserAvatar'

export function YourHeader() {
  return (
    <header>
      <div>Logo</div>
      <div className="flex items-center gap-4">
        <UserAvatar /> {/* Add here */}
      </div>
    </header>
  )
}
```

**Requirements:**

- Must be in a Client Component or have 'use client' directive
- Supabase client must be properly configured
- UI components (Avatar, DropdownMenu, Button) must be available

### Customizing Menu Items

Edit `/components/auth/UserAvatar.tsx`:

```tsx
{
  /* Add new menu item */
}
;<DropdownMenuItem asChild>
  <Link href="/credits" className="flex cursor-pointer items-center">
    <CreditCard className="mr-2 h-4 w-4" />
    <span>Buy Credits</span>
  </Link>
</DropdownMenuItem>
```

### Styling the Avatar

```tsx
<Avatar className="border-4... h-10 w-10">
  {' '}
  {/* Larger avatar */}
  <AvatarImage src={avatarUrl} alt={displayName} />
  <AvatarFallback className="text-white... bg-blue-500">{getInitials(displayName)}</AvatarFallback>
</Avatar>
```

---

## Security Considerations

### 1. Client-Side Only

UserAvatar is a **Client Component** (`'use client'`):

- Can access browser APIs (localStorage, etc.)
- Can use React hooks (useState, useEffect)
- Real-time auth state updates

### 2. Session Validation

```typescript
supabase.auth.getSession() // Validates session on server
```

- Checks session validity
- Verifies JWT token
- Returns null if expired/invalid

### 3. Sign Out Cleanup

```typescript
await supabase.auth.signOut()
```

- Removes session from Supabase
- Clears cookies
- Invalidates refresh token
- Removes local storage entries

### 4. CSRF Protection

- Supabase Auth handles CSRF tokens automatically
- Session cookies have `SameSite` and `Secure` flags
- No manual CSRF protection needed

---

## Testing Guide

### Manual Testing

1. **Unauthenticated State:**

   ```
   1. Open http://localhost:3000
   2. Should see "Sign In" button in header
   3. Click → should redirect to /login
   ```

2. **Login Flow:**

   ```
   1. Click "Sign In"
   2. Click "Continue with Google"
   3. Authorize with Google
   4. Should redirect back to site
   5. Header should show avatar + name
   ```

3. **Avatar Display:**

   ```
   1. Avatar should show Google profile picture
   2. Hover → should show pointer cursor
   3. Click → dropdown menu opens
   ```

4. **Dropdown Menu:**

   ```
   1. Click avatar
   2. Menu shows user info (name, email)
   3. All navigation links work
   4. Sign Out is red/destructive color
   ```

5. **Sign Out:**

   ```
   1. Click "Sign Out" in dropdown
   2. Should redirect to homepage
   3. Avatar replaced with "Sign In" button
   ```

6. **Responsive:**

   ```
   Mobile:
   - Avatar only (no name)
   - Dropdown still works

   Desktop:
   - Avatar + name shown
   - Dropdown aligns right
   ```

### Browser Console Tests

```javascript
// Check if user is authenticated
const supabase = createClient()
const { data } = await supabase.auth.getSession()
console.log('User:', data.session?.user)

// Check user metadata
console.log('Display Name:', data.session?.user.user_metadata?.full_name)
console.log('Avatar URL:', data.session?.user.user_metadata?.picture)

// Test sign out
await supabase.auth.signOut()
console.log('Signed out')
```

---

## Troubleshooting

### Issue 1: Avatar not showing after login

**Symptoms:** Sign In button still visible after successful login

**Causes:**

- Auth state not updating
- Session cookie not set
- onAuthStateChange not firing

**Fix:**

```typescript
// Check session in browser console
const { data } = await supabase.auth.getSession()
console.log('Session:', data.session)

// If null, check Supabase config
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

---

### Issue 2: Avatar shows "?" instead of initials

**Symptoms:** Fallback shows question mark

**Cause:** displayName is undefined or empty

**Fix:**

```typescript
// Debug user metadata
const userMetadata = user.user_metadata
console.log('Metadata:', userMetadata)
console.log('Full Name:', userMetadata?.full_name)
console.log('Email:', user.email)
```

---

### Issue 3: Dropdown menu doesn't open

**Symptoms:** Clicking avatar does nothing

**Causes:**

- DropdownMenu component not imported
- Radix UI peer dependencies missing
- Z-index conflicts

**Fix:**

```bash
# Reinstall dependencies
pnpm install @radix-ui/react-dropdown-menu

# Check z-index in browser DevTools
# DropdownMenuContent should have z-50
```

---

### Issue 4: Avatar image not loading

**Symptoms:** Shows initials instead of Google profile picture

**Causes:**

- Invalid image URL
- CORS issues
- Image blocked by CSP

**Fix:**

```typescript
// Check avatar URL in console
console.log('Avatar URL:', userMetadata?.picture)

// Test URL directly in browser
// Should load without errors

// Check Next.js config for remote images
// next.config.js
module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Google avatars
  },
}
```

---

### Issue 5: Sign out doesn't work

**Symptoms:** User still authenticated after clicking Sign Out

**Cause:** Sign out function not awaited

**Fix:**

```typescript
const handleSignOut = async () => {
  await supabase.auth.signOut() // Must await!
  router.push('/')
  router.refresh() // Force server to re-check auth
}
```

---

## Performance Considerations

### 1. Singleton Supabase Client

```typescript
// lib/supabase/client.ts
let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (client) return client // Reuse existing client
  client = createBrowserClient(...)
  return client
}
```

**Why:** Prevents creating multiple Supabase instances

### 2. Auth State Listener

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  return () => subscription.unsubscribe() // Cleanup!
}, [supabase.auth])
```

**Why:** Prevents memory leaks from unsubscribed listeners

### 3. Image Optimization

```tsx
<AvatarImage src={avatarUrl} alt={displayName} />
```

**Note:** Radix UI's Avatar doesn't use Next.js Image optimization by default. For better performance, you can wrap it:

```tsx
import Image from 'next/image'

;<Avatar>
  <Image src={avatarUrl} alt={displayName} width={32} height={32} className="rounded-full" />
  <AvatarFallback>...</AvatarFallback>
</Avatar>
```

---

## Accessibility

### 1. Keyboard Navigation

- **Tab**: Focus on avatar button
- **Enter/Space**: Open dropdown menu
- **Arrow Keys**: Navigate menu items
- **Escape**: Close dropdown
- **Enter**: Activate menu item

### 2. Screen Reader Support

```tsx
<button aria-label="User menu">
  <Avatar>...</Avatar>
</button>

<DropdownMenuItem>
  <span className="sr-only">Navigate to dashboard</span>
  My Videos
</DropdownMenuItem>
```

### 3. Focus Management

- Dropdown menu traps focus when open
- Focus returns to trigger on close
- Focus visible ring on keyboard navigation

---

## Future Enhancements

### Planned Features

- [ ] User badge for premium/pro accounts
- [ ] Notification indicator on avatar
- [ ] Credits balance in dropdown header
- [ ] Recently viewed videos in dropdown
- [ ] Quick video upload from dropdown
- [ ] Avatar upload/customization
- [ ] User presence indicator (online/offline)

### Possible Improvements

- [ ] Avatar image caching
- [ ] Optimistic UI updates (immediate logout)
- [ ] Skeleton loader for dropdown menu items
- [ ] Keyboard shortcut for dropdown (Ctrl+K)
- [ ] Multi-account switching
- [ ] Dark mode avatar variant

---

## Related Documentation

- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)
- [Supabase Storage Setup](./SUPABASE_STORAGE_SETUP.md)
- [Quick Fix Guide](./GOOGLE_OAUTH_QUICK_FIX.md)

---

## Changelog

### 2025-10-08 - Initial Release

- ✅ Created UserAvatar component
- ✅ Integrated with Header
- ✅ Google profile picture support
- ✅ Dropdown menu with navigation
- ✅ Sign out functionality
- ✅ Responsive design
- ✅ Loading and error states

---

**Last Updated:** 2025-10-08
**Status:** Production Ready ✅
