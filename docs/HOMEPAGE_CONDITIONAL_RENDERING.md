# Homepage Conditional Rendering Implementation

**Date:** 2025-10-17
**Feature:** Smart homepage that shows different content based on auth state while keeping URL at "/"

## Overview

The homepage (`/`) now conditionally renders different layouts based on user authentication status:

- **Authenticated users:** See workspace dashboard with full sidebar/header layout
- **Anonymous users:** See traditional landing page

**Key Point:** URL remains at `/` in both cases - no redirects!

## Implementation

### File: `src/app/(home)/page.tsx`

```typescript
export default async function Page() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Authenticated: Show workspace dashboard
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    const credits = profile?.credits || 0

    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <WorkspaceSidebar credits={credits} userEmail={user.email || ''} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <WorkspaceHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <DashboardPage />
          </main>
        </div>
        <WorkspaceMobileNav credits={credits} />
      </div>
    )
  }

  // Anonymous: Show landing page
  return <Main posts={sortedPosts} />
}
```

## User Experience Flows

### Flow 1: New User Visit

```
User visits reelvan.com (/)
  ↓
No auth session found
  ↓
Shows landing page at "/"
  ↓
User clicks "Sign In"
  ↓
Redirected to /login
  ↓
Successful login
  ↓
Redirected back to "/"
  ↓
Auth session detected
  ↓
Shows workspace dashboard at "/"
```

### Flow 2: Returning Authenticated User

```
User visits reelvan.com (/)
  ↓
Auth session found
  ↓
Shows workspace dashboard at "/"
  ↓
(No redirect, no URL change)
```

### Flow 3: User Signs Out

```
User clicks "Sign Out" in workspace
  ↓
Session cleared
  ↓
Redirected to "/"
  ↓
No auth session
  ↓
Shows landing page at "/"
```

## Advantages

### 1. **Clean URLs**

- URL stays at `/` for both logged in and logged out states
- No confusing `/workspace/dashboard` URLs for everyday use
- Better for bookmarks and sharing

### 2. **Better UX**

- No visible redirect after login
- Seamless transition between states
- Feels like a native app

### 3. **SEO Benefits**

- Landing page content indexed at root domain
- Authenticated content not crawled by search engines
- Clear separation of public vs private content

### 4. **Simpler Mental Model**

- One URL to remember: `reelvan.com`
- Login → Stay on same page, content changes
- Logout → Stay on same page, content changes

## Technical Details

### Server-Side Rendering

Both authenticated and anonymous views are server-rendered:

```typescript
// Server Component (runs on server)
export default async function Page() {
  const user = await supabase.auth.getUser()
  // Conditional rendering happens server-side
  if (user) return <WorkspaceView />
  return <LandingView />
}
```

**Benefits:**

- ✅ No loading spinners
- ✅ No flash of wrong content (FOUC)
- ✅ Fast initial render
- ✅ SEO-friendly

### Layout Composition

**Authenticated users see:**

```
┌─────────────────────────────────────────┐
│ Root Layout (global header/footer)     │
│ ┌─────────────────────────────────────┐ │
│ │ Workspace Layout (embedded in /)    │ │
│ │ ┌───────┬─────────────────────────┐ │ │
│ │ │Sidebar│ Dashboard Content       │ │ │
│ │ │       │                         │ │ │
│ │ └───────┴─────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Anonymous users see:**

```
┌─────────────────────────────────────────┐
│ Root Layout (global header/footer)     │
│ ┌─────────────────────────────────────┐ │
│ │ Landing Page                        │ │
│ │ Hero, Features, CTA, Pricing...     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Performance Considerations

**Data Fetching:**

```typescript
// Only fetch credits if user is authenticated
if (user) {
  const profile = await supabase.from('profiles').select('credits').eq('id', user.id).single()
}
```

**Parallel Component Rendering:**

- Sidebar, Header, and Dashboard render independently
- No waterfall requests
- Optimized for speed

## Navigation Updates

### UserAvatar Component

Updated dropdown menu links to use `/workspace/*` routes:

```typescript
<DropdownMenuItem asChild>
  <Link href="/workspace/dashboard">Workspace</Link>
</DropdownMenuItem>
<DropdownMenuItem asChild>
  <Link href="/workspace/upload">Upload Video</Link>
</DropdownMenuItem>
<DropdownMenuItem asChild>
  <Link href="/workspace/settings">Settings</Link>
</DropdownMenuItem>
```

### Logo Click Behavior

- Authenticated users: Click logo → Stay at `/` (shows workspace)
- Anonymous users: Click logo → Stay at `/` (shows landing)
- Consistent behavior in both states

## Route Structure

### Public Routes (Anonymous)

- `/` - Landing page
- `/blog` - Blog posts
- `/pricing` - Pricing page
- `/about` - About page
- `/login` - Login page
- `/signup` - Signup page

### Workspace Routes (Authenticated)

- `/` - Workspace dashboard (conditional render)
- `/workspace/dashboard` - Direct dashboard access
- `/workspace/upload` - Upload video
- `/workspace/videos` - Video library
- `/workspace/credits` - Credits management
- `/workspace/settings` - User settings

**Note:** Both `/` and `/workspace/dashboard` show the same content for authenticated users.

## Testing

### Manual Testing Checklist

**Anonymous User:**

- [ ] Visit `/` → See landing page
- [ ] URL bar shows just `/`
- [ ] Click "Sign In" → Go to `/login`
- [ ] Complete login → Return to `/`
- [ ] After login, see workspace dashboard

**Authenticated User:**

- [ ] Visit `/` → See workspace dashboard
- [ ] URL bar shows just `/`
- [ ] Sidebar visible (desktop)
- [ ] Bottom nav visible (mobile)
- [ ] Credit balance displays correctly
- [ ] Click logo → Stay at `/`

**Sign Out:**

- [ ] Click "Sign Out" in dropdown
- [ ] Redirected to `/`
- [ ] See landing page
- [ ] Header shows "Sign In" button

### Edge Cases

**Slow Network:**

- Server-side rendering ensures content loads correctly
- No flash of unauthenticated content

**Session Expiry:**

- User visits `/` with expired session
- Shows landing page (session invalid)
- User logs in again → See workspace

**Direct URL Access:**

- Authenticated user visits `/workspace/upload`
- Works as expected (route group layout)
- User clicks logo → Go to `/` (workspace view)

## Comparison: Before vs After

### Before (Redirect Approach)

```
User visits "/"
  ↓
Check auth
  ↓
If authenticated:
  redirect to "/workspace/dashboard"
  ↓
URL changes to "/workspace/dashboard"
```

**Issues:**

- ❌ URL changes on login
- ❌ Visible redirect
- ❌ Bookmarks break
- ❌ Confusing for users

### After (Conditional Rendering)

```
User visits "/"
  ↓
Check auth
  ↓
If authenticated:
  render workspace dashboard
  ↓
URL stays at "/"
```

**Benefits:**

- ✅ URL never changes
- ✅ No visible redirect
- ✅ Consistent bookmarks
- ✅ Clearer UX

## Future Enhancements

### Phase 2

- [ ] Animated transitions between states
- [ ] Preserve scroll position on login
- [ ] Welcome toast on first login

### Phase 3

- [ ] Personalized landing page for logged-in users
- [ ] Dashboard customization
- [ ] Quick actions in workspace view

## Known Limitations

1. **Duplicate Routes:**
   - Both `/` and `/workspace/dashboard` render dashboard for authenticated users
   - This is intentional for backwards compatibility
   - Consider redirecting `/workspace/dashboard` → `/` in future

2. **SEO Considerations:**
   - Search engines only see landing page content at `/`
   - Workspace content not indexed (requires auth)
   - This is correct behavior

3. **Browser History:**
   - No history entry for state change (landing → workspace)
   - This is expected with conditional rendering

## Code Quality

- ✅ TypeScript type-safe
- ✅ Server-side rendering
- ✅ No client-side redirects
- ✅ Lint passing
- ✅ Follows Next.js App Router best practices

---

**Status:** ✅ Complete
**Implementation Time:** 10 minutes
**Files Changed:** 2 files (`page.tsx`, `UserAvatar.tsx`)
