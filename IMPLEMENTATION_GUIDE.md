# 🏸 WDK Badminton Club - Complete Implementation Guide

## Professional Data Storage & Form System

**Version:** 1.0.0
**Date:** 2025-10-18
**Status:** ✅ Phase 1 Complete - Sample Data & Forms Ready

---

## 📊 I. Executive Summary

### What Was Accomplished

✅ **Created missing data layer**

- `/src/data/sample-members.ts` - 12 realistic member profiles
- `/src/data/sample-reservations.ts` - 10 upcoming activities
- Utility functions for filtering, sorting, and searching

✅ **Built complete form system**

- React Hook Form + Zod validation (type-safe)
- Member registration form with multi-section layout
- Activity creation form with auto-calculations
- Comprehensive validation schemas

✅ **Established architecture foundation**

- Analyzed Prisma schema (5 models, production-ready)
- Mapped data flow from sample → database
- Defined migration strategy

### Current State

```
Your app is running on: http://localhost:3001
✓ Dev server compiling successfully
✓ All files pass ESLint
✓ TypeScript types are correct
✓ Sample data populating homepage
```

---

## 🏗️ II. Architecture Overview

### Technology Stack

```yaml
Frontend:
  - Framework: Next.js 15.5.4 (App Router)
  - UI: shadcn/ui + Radix UI primitives
  - Forms: React Hook Form 7.64 + Zod 4.1.12
  - Styling: Tailwind CSS 4.0.5

Backend:
  - ORM: Prisma (type-safe)
  - Database: PostgreSQL (via Prisma)
  - Auth: Ready for NextAuth.js or Supabase Auth

DevOps:
  - Hosting: Vercel (recommended)
  - Database: Supabase/Neon/Vercel Postgres
  - CI/CD: Vercel automatic deploys
```

### Data Flow Architecture

```mermaid
┌─────────────────────────────────────────┐
│         User Interface (Next.js)        │
│  - Homepage (Main.tsx)                  │
│  - Member Registration Form             │
│  - Activity Creation Form (Admin)       │
└──────────────┬──────────────────────────┘
               │
       Current │  Future
               ▼
   ┌──────────────────┐    ┌──────────────┐
   │  Sample Data     │───→│  Prisma ORM  │
   │  (TypeScript)    │    │              │
   └──────────────────┘    └──────┬───────┘
                                  │
                           ┌──────▼────────┐
                           │  PostgreSQL   │
                           │   Database    │
                           └───────────────┘
```

---

## 📁 III. File Structure

### What Was Created

```
wdk-badminton/
├── src/
│   ├── data/                           ← NEW! Sample data layer
│   │   ├── sample-members.ts           ✅ 12 member profiles
│   │   └── sample-reservations.ts      ✅ 10 activities
│   │
│   ├── lib/
│   │   ├── validations/                ← NEW! Zod schemas
│   │   │   ├── member.ts               ✅ Member form validation
│   │   │   └── reservation.ts          ✅ Activity form validation
│   │   │
│   │   └── db/                         ← Already exists (Prisma)
│   │       ├── members.ts              ✅ Member database ops
│   │       ├── reservations.ts         ✅ Reservation database ops
│   │       └── prisma.ts               ✅ Prisma client
│   │
│   └── components/
│       └── forms/                      ← NEW! Form components
│           ├── MemberRegistrationForm.tsx      ✅
│           └── CreateReservationForm.tsx       ✅
│
├── prisma/
│   └── schema.prisma                   ✅ Complete schema (5 models)
│
└── IMPLEMENTATION_GUIDE.md             ✅ This file
```

---

## 🎯 IV. Migration Roadmap: Sample Data → Real Database

### Phase 1: ✅ COMPLETED (Today)

**Goal:** Make app functional with sample data

- [x] Create sample data files
- [x] Build form validation schemas
- [x] Implement form components
- [x] Verify app compiles and runs

**Result:** App running on http://localhost:3001 with sample data

---

### Phase 2: Database Connection (Week 1)

**Goal:** Connect to real PostgreSQL database

#### Step 2.1: Setup Database

**Option A: Supabase (Recommended for China deployment)**

```bash
# 1. Create Supabase project at supabase.com
# 2. Get connection string

# 3. Add to .env.local
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For migrations

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate
```

**Option B: Neon (Serverless PostgreSQL)**

```bash
# 1. Create Neon project at neon.tech
# 2. Copy connection string to .env.local
# 3. Run prisma migrate dev
```

#### Step 2.2: Migrate Sample Data to Database

Create a seed script to populate database with sample data:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { sampleMembers } from '../src/data/sample-members'
import { sampleReservations } from '../src/data/sample-reservations'

const prisma = new PrismaClient()

async function main() {
  // Create members
  for (const member of sampleMembers) {
    await prisma.member.create({
      data: {
        name: member.name,
        nameEn: member.nameEn,
        companyName: member.companyName,
        companyNameEn: member.companyNameEn,
        jobTitle: member.jobTitle,
        aiSector: member.aiSector,
        skillLevel: member.skillLevel.toUpperCase(),
        totalPoints: member.totalPoints,
        matchesPlayed: member.matchesPlayed,
        matchesWon: member.matchesWon,
        bio: member.bio,
      },
    })
  }

  console.log('✅ Seeded members')

  // Create reservations
  // ... similar logic
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run seed:

```bash
npx prisma db seed
```

#### Step 2.3: Update Main.tsx to Use Prisma

```typescript
// src/app/(home)/page.tsx
import { getActiveMembers, getRankings } from '@/lib/db/members'
import { getUpcomingReservations } from '@/lib/db/reservations'

export default async function HomePage() {
  // Fetch from database instead of sample data
  const featuredMembers = await getActiveMembers({ limit: 6 })
  const rankings = await getRankings(5)
  const upcomingActivities = await getUpcomingReservations(7, 3)

  const stats = {
    totalMembers: featuredMembers.length,
    monthlyActivities: 50,  // Calculate from DB later
    aiCompanies: 30,
  }

  return <Main posts={[]} /> // Pass real data as props
}
```

**Checklist:**

- [ ] Setup PostgreSQL database
- [ ] Run Prisma migrations
- [ ] Create seed script
- [ ] Seed database with sample data
- [ ] Update Main.tsx to fetch from database
- [ ] Test homepage loads correctly

---

### Phase 3: Authentication (Week 2)

**Goal:** Add user authentication and protected routes

#### Option A: NextAuth.js (Recommended)

```bash
npm install next-auth @next-auth/prisma-adapter
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Phone',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        // Verify SMS code
        // Return user object
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

#### Create Auth Pages

```typescript
// app/(auth)/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  // Phone + SMS code login form
}

// app/(auth)/register/page.tsx
import { MemberRegistrationForm } from '@/components/forms/MemberRegistrationForm'

export default function RegisterPage() {
  async function handleRegister(data) {
    // 1. Create user account
    // 2. Create member profile
    // 3. Redirect to dashboard
  }

  return <MemberRegistrationForm onSubmit={handleRegister} />
}
```

**Checklist:**

- [ ] Install NextAuth.js
- [ ] Configure auth providers (phone + SMS)
- [ ] Create login/register pages
- [ ] Add protected route middleware
- [ ] Test auth flow

---

### Phase 4: API Routes & Forms Integration (Week 2-3)

**Goal:** Connect forms to database

#### Create API Routes

```typescript
// app/api/members/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createMember } from '@/lib/db/members'
import { memberRegistrationSchema } from '@/lib/validations/member'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Validate with Zod
  const validated = memberRegistrationSchema.parse(body)

  // Create member in database
  const member = await createMember({
    ...validated,
    userId: session.user.id,
  })

  return NextResponse.json({ success: true, member })
}

// app/api/reservations/route.ts
// Similar pattern for creating activities
export async function POST(request: Request) {
  // Validate admin permission
  // Validate with Zod
  // Create reservation
}

// app/api/reservations/[id]/join/route.ts
export async function POST(request: Request, { params }) {
  // Join reservation
}
```

#### Connect Forms to API

```typescript
// app/(dashboard)/profile/edit/page.tsx
'use client'

import { MemberRegistrationForm } from '@/components/forms/MemberRegistrationForm'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const router = useRouter()

  async function handleUpdate(data) {
    const response = await fetch('/api/members', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/dashboard')
    }
  }

  return <MemberRegistrationForm onSubmit={handleUpdate} />
}
```

**Checklist:**

- [ ] Create API route for member registration
- [ ] Create API route for activity creation
- [ ] Create API route for joining activities
- [ ] Connect forms to API routes
- [ ] Add error handling and loading states
- [ ] Test full user flow

---

### Phase 5: Admin Panel (Week 3-4)

**Goal:** Build admin interface for managing club

#### Admin Dashboard Structure

```
app/
├── (admin)/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── page.tsx             # Dashboard with stats
│   │   ├── members/
│   │   │   ├── page.tsx         # Members list
│   │   │   └── [id]/page.tsx    # Member detail/edit
│   │   ├── activities/
│   │   │   ├── page.tsx         # Activities list
│   │   │   ├── new/page.tsx     # Create activity (uses CreateReservationForm)
│   │   │   └── [id]/page.tsx    # Activity detail/edit
│   │   ├── matches/
│   │   │   └── page.tsx         # Record match results
│   │   └── settings/
│   │       └── page.tsx         # Club settings
```

#### Admin Middleware

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getServerSession()

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || !session.user.isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
```

#### Dashboard Components

```typescript
// components/admin/StatCard.tsx
export function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-primary-600">{icon}</div>
      </div>
    </div>
  )
}

// app/(admin)/admin/page.tsx
export default async function AdminDashboard() {
  const stats = {
    totalMembers: await prisma.member.count(),
    activeMembers: await prisma.member.count({ where: { status: 'ACTIVE' } }),
    upcomingActivities: await prisma.reservation.count({
      where: { date: { gte: new Date() } }
    }),
    thisMonthActivities: ...,
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard title="Total Members" value={stats.totalMembers} />
      <StatCard title="Active Members" value={stats.activeMembers} />
      <StatCard title="Upcoming Activities" value={stats.upcomingActivities} />
      <StatCard title="This Month" value={stats.thisMonthActivities} />
    </div>
  )
}
```

**Checklist:**

- [ ] Create admin route structure
- [ ] Add admin authentication middleware
- [ ] Build dashboard with stats
- [ ] Create members management page
- [ ] Create activities management page
- [ ] Add match result recording
- [ ] Test admin workflows

---

## 🔐 V. Security Checklist

### Authentication

- [ ] Implement session management
- [ ] Add CSRF protection
- [ ] Secure password/phone verification
- [ ] Add rate limiting on auth endpoints

### Authorization

- [ ] Implement role-based access (member, admin)
- [ ] Protect admin routes
- [ ] Validate user can only edit own profile
- [ ] Check permissions before database writes

### Data Validation

- [ ] Always validate with Zod on server-side
- [ ] Sanitize user inputs
- [ ] Prevent SQL injection (Prisma handles this)
- [ ] Add XSS protection

### API Security

- [ ] Use NextAuth session for API routes
- [ ] Validate request origin
- [ ] Add rate limiting with Vercel KV or Upstash
- [ ] Log all database mutations

---

## 📊 VI. Database Schema Reference

### Core Models

```prisma
Member
├── id: UUID (PK)
├── userId: String (unique, auth link)
├── Basic Info: name, nameEn, phone, wechatId, email, bio
├── Company Info: companyName, jobTitle, aiSector, companyStage
├── Badminton: skillLevel, preferredPosition, playStyle
├── Stats: totalPoints, matchesPlayed, matchesWon
└── Relations: → PointTransaction[], → Reservation[], → Match[]

Reservation (Activity)
├── id: UUID (PK)
├── Venue: venueName, venueAddress, courtNumber
├── Time: date, startTime, endTime
├── Organizer: organizerId → Member
├── Capacity: maxParticipants, currentParticipants
├── Cost: totalCost, costPerPerson, paymentMethod
├── Status: OPEN | FULL | CONFIRMED | CANCELLED | COMPLETED
└── Relations: → ReservationParticipant[] → Match[]

ReservationParticipant (Join Table)
├── id: UUID (PK)
├── reservationId → Reservation
├── memberId → Member
├── paid: Boolean
└── joinedAt: DateTime

PointTransaction
├── id: UUID (PK)
├── memberId → Member
├── points: Int (positive or negative)
├── transactionType: MATCH_WIN | MATCH_LOSS | PARTICIPATION | ...
├── matchId → Match (optional)
└── adminId → Member (optional, for manual adjustments)

Match
├── id: UUID (PK)
├── matchType: SINGLES | DOUBLES | MIXED_DOUBLES
├── teamAScore, teamBScore, winner
├── reservationId → Reservation (optional)
└── Relations: → MatchParticipant[], → PointTransaction[]
```

### Database Views

```sql
-- Created in migrations
CREATE VIEW rankings AS
SELECT
  m.id,
  m.name,
  m.name_en,
  m.avatar_url,
  m.company_name,
  m.skill_level,
  m.total_points,
  m.matches_played,
  m.matches_won,
  CASE
    WHEN m.matches_played > 0
    THEN ROUND((m.matches_won::DECIMAL / m.matches_played) * 100, 2)
    ELSE 0
  END as win_rate,
  ROW_NUMBER() OVER (ORDER BY m.total_points DESC) as rank
FROM members m
WHERE m.status = 'ACTIVE' AND m.matches_played > 0
ORDER BY m.total_points DESC;
```

---

## 🚀 VII. Deployment Guide

### Environment Variables

```bash
# .env.local (Development)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# SMS Service (for phone auth)
SMS_API_KEY="..."
SMS_API_SECRET="..."

# Optional: Uploadthing for avatar uploads
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Add environment variables in Vercel dashboard
# Settings → Environment Variables

# 4. Deploy
vercel --prod

# 5. Run migrations on production database
npx prisma migrate deploy
```

---

## 📈 VIII. Performance Optimization

### Database

- [ ] Add indexes on frequently queried fields (already in schema)
- [ ] Use database connection pooling (Prisma handles this)
- [ ] Implement caching for rankings view (Redis/Vercel KV)
- [ ] Use pagination for large lists (members, activities)

### Frontend

- [ ] Implement React.lazy() for code splitting
- [ ] Use Next.js Image component for avatars
- [ ] Add loading skeletons for better UX
- [ ] Implement optimistic updates for instant feedback

### API

- [ ] Add response caching headers
- [ ] Implement rate limiting
- [ ] Use edge functions for auth routes
- [ ] Monitor with Vercel Analytics

---

## 🐛 IX. Testing Strategy

### Unit Tests (Vitest)

```typescript
// lib/validations/__tests__/member.test.ts
import { describe, it, expect } from 'vitest'
import { memberRegistrationSchema } from '../member'

describe('memberRegistrationSchema', () => {
  it('validates correct member data', () => {
    const validData = {
      name: '张三',
      phone: '13800138000',
      skillLevel: 'BEGINNER',
    }

    expect(() => memberRegistrationSchema.parse(validData)).not.toThrow()
  })

  it('rejects invalid phone number', () => {
    const invalidData = {
      name: '张三',
      phone: '123', // Invalid
      skillLevel: 'BEGINNER',
    }

    expect(() => memberRegistrationSchema.parse(invalidData)).toThrow()
  })
})
```

### Integration Tests (Playwright)

```typescript
// e2e/registration.spec.ts
import { test, expect } from '@playwright/test'

test('user can register as new member', async ({ page }) => {
  await page.goto('/register')

  await page.fill('[name="name"]', '测试用户')
  await page.fill('[name="phone"]', '13800138000')
  await page.selectOption('[name="skillLevel"]', 'BEGINNER')

  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
})
```

---

## 📚 X. API Reference

### Member Endpoints

```typescript
GET    /api/members                # List all members (paginated)
POST   /api/members                # Create new member
GET    /api/members/:id            # Get member by ID
PATCH  /api/members/:id            # Update member
DELETE /api/members/:id            # Delete member (admin only)
GET    /api/members/search?q=...   # Search members
```

### Reservation Endpoints

```typescript
GET    /api/reservations                  # List activities (filter by date, status)
POST   /api/reservations                  # Create activity (admin only)
GET    /api/reservations/:id              # Get activity details
PATCH  /api/reservations/:id              # Update activity (admin only)
DELETE /api/reservations/:id              # Cancel activity (admin only)
POST   /api/reservations/:id/join         # Join activity
POST   /api/reservations/:id/leave        # Leave activity
GET    /api/reservations/upcoming         # Get upcoming activities
```

### Rankings Endpoints

```typescript
GET    /api/rankings                      # Get current rankings
GET    /api/rankings?skillLevel=ADVANCED  # Filter by skill level
```

---

## 🎓 XI. Learning Resources

### Next.js 15 (App Router)

- [Official Docs](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

### Prisma

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

### React Hook Form + Zod

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Integration Guide](https://react-hook-form.com/get-started#SchemaValidation)

### NextAuth.js

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)

---

## ✅ XII. Immediate Next Steps

### This Week

1. **Setup Database** (Priority 1)

   ```bash
   # Choose: Supabase, Neon, or Vercel Postgres
   # Run: npx prisma migrate dev
   # Seed data: npx prisma db seed
   ```

2. **Implement Authentication** (Priority 2)

   ```bash
   # Install NextAuth.js
   # Create auth pages
   # Test login/register flow
   ```

3. **Connect First Form** (Priority 3)
   ```bash
   # Create API route for member registration
   # Connect MemberRegistrationForm to API
   # Test end-to-end flow
   ```

### Next Week

4. Build admin panel
5. Add activity sign-up functionality
6. Implement rankings page
7. Add member profile pages

---

## 🤝 XIII. Support & Resources

### Project Files Created

```
✅ /src/data/sample-members.ts
✅ /src/data/sample-reservations.ts
✅ /src/lib/validations/member.ts
✅ /src/lib/validations/reservation.ts
✅ /src/components/forms/MemberRegistrationForm.tsx
✅ /src/components/forms/CreateReservationForm.tsx
✅ /IMPLEMENTATION_GUIDE.md (this file)
```

### Existing Project Structure

```
✅ /prisma/schema.prisma (5 models, production-ready)
✅ /src/lib/db/members.ts (Prisma operations)
✅ /src/lib/db/reservations.ts (Prisma operations)
✅ /src/lib/db/prisma.ts (Prisma client singleton)
```

### Quick Commands

```bash
# Development
pnpm dev                          # Start dev server
pnpm lint                         # Run linter
pnpm check-type                   # TypeScript check

# Database
npx prisma studio                 # Open database GUI
npx prisma migrate dev            # Run migrations
npx prisma db seed                # Seed database
npx prisma generate               # Generate Prisma client

# Testing
pnpm test                         # Run unit tests
pnpm test:ui                      # Vitest UI
npx playwright test               # E2E tests
```

---

## 📝 XIV. Git Commit Suggestion

```bash
feat: implement professional data storage and form system

- Add sample data layer (members and reservations)
- Create Zod validation schemas for forms
- Build MemberRegistrationForm with React Hook Form
- Build CreateReservationForm with auto-calculations
- Add comprehensive implementation guide

Features:
- Type-safe form validation with Zod
- Real-time validation feedback
- Multi-section form layouts
- Auto-calculation for activity costs
- Comprehensive error handling

Technical:
- Follows Prisma schema structure
- Ready for database migration
- All files pass ESLint and TypeScript checks
- Mobile-responsive form design
```

---

## 🎯 XV. Success Criteria

### ✅ Phase 1 Complete When:

- [x] App runs without errors
- [x] Homepage displays sample data
- [x] Forms render correctly
- [x] All TypeScript types are correct
- [x] ESLint passes

### 🎯 Phase 2 Complete When:

- [ ] Database is connected
- [ ] Homepage fetches data from PostgreSQL
- [ ] Sample data is seeded to database
- [ ] Prisma queries work correctly

### 🎯 Phase 3 Complete When:

- [ ] Users can register and login
- [ ] Protected routes work
- [ ] Session management is functional
- [ ] Forms submit to database

### 🎯 Production Ready When:

- [ ] All user flows tested
- [ ] Admin panel functional
- [ ] Security audit passed
- [ ] Performance optimized
- [ ] Deployed to production
- [ ] Monitoring enabled

---

**End of Implementation Guide**

Last updated: 2025-10-18
Version: 1.0.0
Author: Claude Code (Sonnet 4.5)
