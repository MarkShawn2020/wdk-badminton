# ReelVan Product Requirements Document (PRD)

**Version:** 1.0.0
**Last Updated:** 2025-10-07
**Status:** MVP Development

---

## 1. Executive Summary

### Product Vision

ReelVan is a specialized content publishing platform for AI-generated video creators. We solve the critical pain points of watermarks, quality limitations, and the "what do I write?" friction that prevents creators from sharing AI videos on social media (Sora, Veo, Kling, JiMeng).

### Tagline

**Turn Your Video Instantly Shareable** - Transform AI-generated videos into ready-to-post social content in minutes.

### Business Model

- **Freemium + Pay-per-Use**: Free tier with limitations, paid processing per video
- **API Cost Structure**: Third-party processing at $X per 5 seconds
- **Target Pricing**: 3-5x markup on API costs for sustainable margins
- **Revenue Channels**: One-time processing, subscription tiers, enterprise API access

---

## 2. Market & User Analysis

### Target Audience (Priority Order)

1. **AI Video Creators** (Primary)
   - Content creators using Sora, Veo, Kling, JiMeng
   - Social media influencers needing polished AI content
   - Marketing professionals using AI video tools

2. **Agency/Business Users** (Secondary)
   - Digital marketing agencies
   - Video production studios
   - E-commerce businesses

3. **Enterprise** (Future)
   - Large-scale AI video operations
   - Platform integrations

### User Pain Points

- ❌ Platform watermarks ruin professional presentation
- ❌ AI videos often have quality artifacts
- ❌ Writer's block: "What caption should I use for this video?"
- ❌ Time-consuming to optimize copy for each platform (Instagram, TikTok, YouTube)
- ❌ No branding options for redistribution
- ❌ Expensive video editing software required

### Competitive Advantage

- ✅ **Specialized**: Built specifically for AI-generated videos + social publishing
- ✅ **Fast**: Cloud processing, no software installation
- ✅ **SEO-First**: Discoverable when users search for solutions
- ✅ **End-to-End**: Video processing + caption generation in one flow
- ✅ **Cost-Effective**: Pay only for what you process
- ✅ **Unique Position**: Only platform combining watermark removal with AI caption generation

---

## 3. MVP Feature Set

### 3.1 Core Features (Launch Blockers)

#### F1: Video Upload System

**Priority:** P0 (Critical)
**User Story:** As a user, I can upload AI-generated videos up to 2 minutes in length.

**Requirements:**

- Support formats: MP4, MOV, WebM
- Max file size: 500MB (configurable)
- Drag-and-drop + file browser upload
- Client-side validation (format, size, duration)
- Upload progress indicator
- Automatic platform detection (if watermark patterns available)

**Technical Notes:**

- Use Supabase Storage for temporary upload storage
- Validate video codec/format server-side
- Generate thumbnail for preview

---

#### F2: Watermark Removal

**Priority:** P0 (Critical)
**User Story:** As a user, I can remove AI platform watermarks from my videos.

**Requirements:**

- Automatic watermark detection and removal
- Support for major platforms: Sora, Veo, Kling, JiMeng, others
- Preview before/after comparison
- Fallback: manual region selection if auto-detection fails

**Technical Notes:**

- Integrate third-party API for processing
- Calculate cost: video_duration / 5 seconds × unit_price
- Queue system for batch processing

---

#### F3: Quality Enhancement

**Priority:** P0 (Critical)
**User Story:** As a user, I can enhance video quality to reduce AI artifacts.

**Requirements:**

- Upscaling options: 1080p, 1440p, 4K
- Denoising and artifact reduction
- Sharpening and color correction
- Before/after quality comparison

**Technical Notes:**

- May use same or different API endpoint
- Consider GPU processing for speed
- Provide quality presets: "Fast", "Balanced", "Best"

---

#### F4: Custom Watermark Addition

**Priority:** P0 (Critical)
**User Story:** As a user, I can add my own branding/watermark to processed videos.

**Requirements:**

- Upload custom logo/watermark image
- Position options: corners, center, custom
- Opacity control (0-100%)
- Size adjustment
- Preview overlay before processing

**Technical Notes:**

- Support PNG with transparency
- Saved watermark templates for repeat users
- Apply watermark in final processing step

---

#### F5: AI Caption Generation

**Priority:** P0 (Critical)
**User Story:** As a user, I can generate platform-optimized captions for my processed videos.

**Requirements:**

- Automatic caption generation based on video content and context
- Platform-specific variants: Instagram, TikTok, YouTube, Twitter, LinkedIn
- Tone options: Professional, Casual, Humorous, Inspirational, Educational
- Hashtag suggestions relevant to content
- Emoji integration (platform-appropriate)
- Call-to-action (CTA) suggestions
- Edit capability before copying
- Copy to clipboard functionality
- Caption history/library for re-use

**Technical Notes:**

- Integrate LLM API (OpenAI GPT-4, Claude, or similar)
- Parallel processing: Generate captions while video processes
- Prompt engineering for high-quality, platform-specific outputs
- Store generated captions in database for analytics
- Character limits per platform (Instagram 2,200, TikTok 300, YouTube 5,000)
- Cost estimation: ~$0.001-0.01 per caption generation (negligible vs video processing)

**Caption Generation Flow:**

1. User uploads video with optional context (target audience, message, brand voice)
2. System analyzes video metadata (filename, duration, any user-provided description)
3. LLM generates 3-5 caption variants per selected platform
4. User reviews, edits if needed, and copies preferred captions
5. Captions saved to user's caption library for future reference

---

#### F6: Processing Queue & Status

**Priority:** P0 (Critical)
**User Story:** As a user, I can track my video processing status in real-time.

**Requirements:**

- Real-time progress updates (0-100%)
- Estimated time remaining
- Processing stage indicators (upload → process → finalize)
- Email notification on completion (optional)
- Error handling with clear messages

**Technical Notes:**

- Use Supabase Realtime for status updates
- Queue management with retry logic
- Store processing jobs in database

---

#### F7: Download & Sharing

**Priority:** P0 (Critical)
**User Story:** As a user, I can download processed videos and share results.

**Requirements:**

- One-click download of processed video
- Temporary shareable link (24-hour expiry)
- File retention: 7 days for free, 30 days for paid
- Download history in user dashboard

**Technical Notes:**

- Generate signed URLs for secure downloads
- Automatic cleanup job for expired files
- Track download analytics

---

### 3.2 Supporting Features

#### F8: User Authentication

**Priority:** P0 (Critical)
**Requirements:**

- Email/password signup
- Google OAuth
- Magic link (passwordless)
- User profile management

**Technical:** Supabase Auth

---

#### F9: Payment Processing

**Priority:** P0 (Critical)
**Requirements:**

- Credit card payment (Stripe)
- Credits system: buy credits, use per video
- Pricing display before processing
- Invoice/receipt generation

**Cost Calculation Example:**

```
Video Duration: 60 seconds
API Cost: 60/5 × $0.10 = $1.20
Our Price: $1.20 × 3.5 = $4.20
User Pays: 420 credits (1 credit = $0.01)
```

---

#### F10: User Dashboard

**Priority:** P1 (High)
**Requirements:**

- Processing history
- Credits balance
- Usage statistics
- Saved watermark templates
- Account settings

---

#### F11: Pricing & Plans

**Priority:** P0 (Critical)

**Model:** Pay-as-you-go (流量包模式) - Buy credits, no subscriptions

**Credit Packages:**

- **Trial Pack:** $1.00 for 100 credits (0% discount) - Process ~1 short video
- **Casual Pack:** $4.50 for 500 credits (10% discount) - Process ~5 videos
- **Regular Pack:** $16.00 for 2,000 credits (20% discount) - Process ~20 videos ⭐ Most Popular
- **Business Pack:** $70.00 for 10,000 credits (30% discount) - Process ~100 videos

**Pricing Formula:**

- 1 credit = $0.01
- Processing cost: ~8 credits per second
- Typical 30-second video ≈ 240 credits ($2.40)
- Credits never expire

**Tier System (Rate Limits Only):**

All users get the same features (4K quality, watermark removal, etc.). Tiers only affect daily processing limits:

- **Free Tier:** 3 videos/day (signup bonus: 100 free credits)
- **Paid Tier:** 50 videos/day (unlocked on first purchase)
- **Pro Tier:** 200 videos/day (unlocked at $50+ lifetime purchases)

**Technical Limits (Universal):**

- Max video duration: 120 seconds
- Max file size: 500MB
- Supported formats: MP4, MOV, WebM

---

## 4. User Flows

### Primary Flow: First-Time User Video Processing

```
1. Land on homepage (SEO traffic) → See value prop: "Turn Your Video Instantly Shareable"
2. Click "Enhance Your Video" → Sign up (email or OAuth)
3. Upload video → Drag & drop MP4 file
4. Select enhancements → Check: Remove watermark, Enhance quality, Add custom watermark
5. Optional: Add context → Target platform (Instagram/TikTok/YouTube), brand voice
6. Preview & price → See cost: 240 credits (30-sec video)
7. Purchase credits → Pay $4.50 for 500 credits (100 free credits for new users)
8. Start processing → Real-time progress bar (video + caption generation in parallel)
9. Results ready → Compare before/after, download MP4 + copy platform-specific captions
10. Share → Post to Instagram/TikTok with generated captions, or process another video
```

### Secondary Flow: Returning User

```
1. Login → Dashboard shows remaining credits + caption history
2. Upload video → Quick upload (remembered settings & brand voice)
3. Process → One-click process with saved preferences
4. Download + Captions → Video ready + 3-5 caption variants per platform
5. Post → Copy preferred caption, post to social media
```

### Tertiary Flow: Caption-Only Generation (Future Feature)

```
1. User has existing video (already processed or from other source)
2. Upload thumbnail or describe video → Provide context
3. Generate captions → AI creates platform-specific variants
4. Copy & use → No video processing needed
```

---

## 5. Technical Requirements

### 5.1 Architecture

```
┌─────────────────────────────────────────┐
│           Next.js App Router            │
│      (SSR/SSG for SEO optimization)     │
└──────┬──────────────────────────┬───────┘
       │                          │
       │                          │
┌──────▼──────┐           ┌───────▼────────┐
│  Supabase   │           │    Stripe      │
│             │           │                │
│ - Auth      │           │ - Payments     │
│ - Database  │           │ - Webhooks     │
│ - Storage   │           └────────────────┘
│ - Realtime  │
└──────┬──────┘
       │
       ├────────────────────┬─────────────────────┐
       │                    │                     │
┌──────▼─────────────┐  ┌──▼────────────┐  ┌─────▼────────────┐
│ Video Processing   │  │  LLM API      │  │  CDN (Vercel)    │
│ API (3rd Party)    │  │ (OpenAI/      │  │                  │
│                    │  │  Anthropic)   │  │ - Video delivery │
│ - Watermark remove │  │               │  │ - Static assets  │
│ - Quality enhance  │  │ - Caption gen │  └──────────────────┘
│ - Custom watermark │  │ - Multi-      │
│                    │  │   platform    │
│ Cost: ~$0.10/5 sec │  │               │
└────────────────────┘  │ Cost: ~$0.01  │
                        │   per request │
                        └───────────────┘
```

**Processing Pipeline:**

```
User Upload
    │
    ├──→ [Video Storage] (Supabase)
    │
    ├──→ [Video Processing API] (Parallel)
    │     - Watermark removal
    │     - Quality enhancement
    │     - Custom watermark addition
    │     ↓
    │   [Processed Video] → CDN
    │
    └──→ [Caption Generation API] (Parallel)
          - Video metadata extraction
          - Context analysis
          - Platform-specific LLM prompts
          ↓
        [Generated Captions] → Database

Both processes complete → User notified → Download + Copy
```

### 5.2 Tech Stack

**Frontend:**

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod validation

**Backend:**

- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Storage (video files)
- Supabase Auth
- Supabase Realtime (status updates)

**Payments:**

- Stripe Checkout
- Stripe Webhooks
- Credits system in database

**Content:**

- Contentlayer (MDX blog posts)
- SEO metadata with next-seo

**Infrastructure:**

- Vercel (hosting)
- Supabase Cloud
- CDN for video delivery

### 5.3 Database Schema (Core Tables)

```sql
-- Users (handled by Supabase Auth)
-- Extends auth.users

profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  credits integer DEFAULT 0,
  subscription_tier text,
  brand_voice text, -- Saved brand voice for caption generation
  created_at timestamp,
  updated_at timestamp
)

videos (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  original_filename text,
  original_url text,
  processed_url text,
  duration_seconds integer,
  status text, -- uploaded, processing, completed, failed
  enhancements jsonb, -- selected features
  cost_credits integer,
  video_description text, -- Optional user-provided context for caption generation
  created_at timestamp,
  completed_at timestamp
)

video_captions (
  id uuid PRIMARY KEY,
  video_id uuid REFERENCES videos,
  user_id uuid REFERENCES auth.users,
  platform text, -- instagram, tiktok, youtube, twitter, linkedin
  caption_text text,
  hashtags text[],
  tone text, -- professional, casual, humorous, inspirational
  was_edited boolean DEFAULT false, -- Track if user edited AI output
  was_used boolean DEFAULT false, -- Track if user copied/used this caption
  created_at timestamp
)

-- Index for fast caption retrieval
CREATE INDEX idx_video_captions_video_id ON video_captions(video_id);
CREATE INDEX idx_video_captions_user_id ON video_captions(user_id);

transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  type text, -- purchase, deduction, signup_bonus
  amount_credits integer,
  stripe_payment_id text,
  created_at timestamp
)

watermark_templates (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text,
  image_url text,
  position jsonb,
  created_at timestamp
)
```

---

## 6. SEO Strategy

### 6.1 Technical SEO (Priority: P0)

- ✅ Server-side rendering (Next.js)
- ✅ Semantic HTML structure
- ✅ Optimized Core Web Vitals
- ✅ Mobile-responsive design
- ✅ Structured data (Schema.org)
- ✅ XML sitemap
- ✅ Robots.txt optimization

### 6.2 Content SEO (Priority: P0)

**Target Keywords (High Intent):**

**Primary (Video Processing):**

- "remove watermark from AI video"
- "Sora video watermark removal"
- "enhance AI generated video quality"
- "Veo video editor"
- "Kling video enhancement"
- "AI video post-processing"

**Primary (Caption Generation - NEW):**

- "AI video caption generator"
- "Instagram caption for AI video"
- "TikTok description generator"
- "social media captions for videos"
- "Sora video captions"
- "AI generated video marketing copy"
- "YouTube description generator AI"

**Long-tail (High Commercial Intent):**

- "how to share Sora videos on Instagram"
- "best captions for AI generated videos"
- "turn AI video into social media post"
- "Veo to TikTok workflow"

**Content Strategy:**

**Video Enhancement Content:**

- Blog posts: "How to Remove [Platform] Watermark"
- Guides: "Best Practices for AI Video Quality"
- Comparisons: "Sora vs Veo vs Kling Video Output"
- Case studies: Before/after examples
- Tool pages: Dedicated pages per platform

**Caption Generation Content (NEW):**

- Blog posts: "How to Write Viral Captions for Sora Videos"
- Guides: "Instagram Caption Templates for AI Videos"
- Tutorials: "From Sora to Social Media in 5 Minutes"
- Lists: "100 Caption Ideas for AI-Generated Videos"
- Case studies: "How AI Captions Increased Engagement by 300%"

### 6.3 On-Page Optimization

- Meta titles with primary keywords
- Meta descriptions with CTAs
- Header hierarchy (H1 → H6)
- Image alt tags
- Internal linking structure
- Fast page load (<2s)

---

## 7. Success Metrics & KPIs

### North Star Metric

**Videos Published to Social Media with ReelVan** (not just "videos processed")

This measures actual value delivered: helping users share their content.

### Key Metrics (Track from Day 1)

**Acquisition:**

- Organic search traffic (target: 1000+/month by Month 3)
- Conversion rate: Visitor → Sign up (target: 5-10%)
- Cost per acquisition (SEO: $0, Paid: $5-15)

**Activation:**

- Sign up → First video processed (target: 40%+)
- Sign up → First caption generated (target: 35%+)
- Time to first value: video + caption (<5 minutes)

**Engagement (Caption Feature - NEW):**

- Caption generation adoption rate (target: 80%+ of processed videos)
- Platforms selected per video (target: 2.5+ platforms)
- Captions copied per video (target: 70%+ copy at least one)
- Caption edit rate (target: <40% = indicates good quality)
- Caption re-use rate (from library)

**Revenue:**

- Average revenue per user (ARPU) (target: $10-15, increased due to caption value)
- Credits purchased per user
- Subscription conversion rate (target: 3-5% of active users)

**Retention:**

- 7-day return rate (target: 25%+, improved by caption feature)
- Monthly active users (MAU)
- Processing frequency (videos per user per month)

**Efficiency:**

- API cost as % of revenue (target: <30%)
  - Video processing: ~$0.10-0.15 per 5 seconds
  - Caption generation: ~$0.001-0.01 per request (negligible)
- Processing success rate (target: >95%)
- Average processing time per video
- Caption generation quality (measured by edit rate)

---

## 8. MVP Development Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Next.js project setup with TypeScript
- [ ] Supabase integration (auth + database)
- [ ] Basic UI components with Tailwind
- [ ] Landing page with SEO optimization
- [ ] Authentication flows

### Phase 2: Core Features (Weeks 3-4)

- [ ] Video upload system
- [ ] Third-party API integration
- [ ] Processing queue system
- [ ] Basic watermark removal
- [ ] Download functionality

### Phase 3: Enhancement Features (Weeks 5-6)

- [ ] Quality enhancement
- [ ] Custom watermark addition
- [ ] AI caption generation (LLM integration)
- [ ] User dashboard
- [ ] Processing history + caption library

### Phase 4: Monetization (Week 7)

- [ ] Stripe integration
- [ ] Credits system
- [ ] Pricing tiers
- [ ] Payment flows
- [ ] Subscription management

### Phase 5: Polish & Launch (Week 8)

- [ ] SEO content (10+ blog posts)
- [ ] Before/after examples
- [ ] Error handling & edge cases
- [ ] Performance optimization
- [ ] Beta testing
- [ ] Public launch

---

## 9. Risk Assessment & Mitigation

### High-Priority Risks

#### R1: API Costs Spiral Out of Control

**Risk:** Users abuse free tier or costs exceed revenue
**Mitigation:**

- Strict rate limiting (1 video/day for free)
- Require payment info for larger files
- Real-time cost monitoring and alerts
- CAPTCHA for free tier
- Video duration caps

#### R2: Poor Video Quality Results

**Risk:** Third-party API produces poor output, users churn
**Mitigation:**

- Thorough API provider evaluation
- A/B test multiple providers
- Quality preview before download
- Money-back guarantee for poor results
- Clear quality expectations

#### R3: Slow SEO Traction

**Risk:** Organic traffic doesn't materialize quickly
**Mitigation:**

- Launch with 20+ optimized pages
- Paid ads for initial traffic (small budget)
- Reddit/Twitter community engagement
- Partnership with AI video creators
- YouTube tutorials showing value

#### R4: Legal/Copyright Issues

**Risk:** Watermark removal raises legal concerns
**Mitigation:**

- Clear Terms of Service (user owns content)
- "For content you own or have rights to"
- No responsibility for user violations
- DMCA compliance process
- Legal review before launch

#### R5: Competition from AI Platforms

**Risk:** Sora/Veo add built-in enhancement tools
**Mitigation:**

- Multi-platform support (not locked to one)
- Faster innovation cycle
- Better UX than platform tools
- Additional features (branding, analytics)
- Build moat through SEO and community

#### R6: Caption Quality Variability (NEW)

**Risk:** LLM-generated captions may be low quality, generic, or inappropriate
**Mitigation:**

- Extensive prompt engineering and testing
- Generate 3-5 variants per platform for user choice
- Allow full editing capability before copying
- Learn from user edits to improve future generations
- A/B test different LLM providers (OpenAI, Anthropic, open-source)
- Set clear expectations: "AI-generated suggestions, review before posting"

#### R7: LLM API Cost Unpredictability (NEW)

**Risk:** OpenAI/Anthropic pricing changes or API rate limits
**Mitigation:**

- Multi-provider strategy (can switch between OpenAI, Claude, Gemini)
- Monitor costs per generation in real-time
- Set hard caps on token usage per request
- Bundle caption generation in base price (marginal cost is low)
- Develop fallback to open-source models if needed

#### R8: Platform Caption Requirements Change (NEW)

**Risk:** Instagram/TikTok/YouTube change character limits or policies
**Mitigation:**

- Flexible prompt system (easy to update character limits)
- Monitor platform API documentation regularly
- Quick deployment pipeline for prompt updates
- Store platform requirements in database (configurable)

#### R9: AI Content Disclosure Requirements (NEW)

**Risk:** Regulations may require labeling AI-generated captions
**Mitigation:**

- Add optional disclaimer text (" AI-assisted")
- Stay informed on FTC/EU regulations
- Emphasize captions are "suggestions" and user-editable
- Provide transparency in terms of service

---

## 10. Post-MVP Roadmap

### Phase 6: Scale Features (Months 2-3)

- Batch processing (multiple videos)
- **Brand voice training** (learn user's writing style for better captions)
- **A/B testing captions** (generate variants, predict performance)
- **Caption-only mode** (generate captions without video processing)
- Audio enhancement
- Subtitle generation

### Phase 7: Advanced Features (Months 4-6)

- **Caption performance analytics** (track engagement by caption type)
- **Hashtag research tool** (trending + relevant suggestions)
- **Content calendar integration** (schedule posts directly)
- API for developers
- Team/agency accounts
- White-label solutions
- Advanced AI editing (scene detection, transitions)
- Mobile app (iOS/Android)

### Phase 8: Platform Play (Months 6-12)

- Direct integrations with AI video platforms
- **Social media auto-posting** (post with captions directly to platforms)
- **Multi-video campaign generator** (cohesive caption series)
- Analytics and performance tracking
- Community showcase
- Affiliate program

---

## 11. Open Questions & Decisions Needed

- [ ] **API Provider Selection**: Which third-party API? (evaluate cost, quality, speed)
- [ ] **Pricing Finalization**: Exact credit pricing based on API costs
- [ ] **Free Tier Limits**: Balance generosity vs. cost control
- [ ] **Launch Date Target**: 8 weeks realistic?
- [ ] **Marketing Budget**: Any paid ads or pure SEO?
- [ ] **Legal Review**: TOS and watermark removal legality
- [ ] **Branding**: Logo, color scheme, brand voice finalization

---

## 12. Appendix

### A. Competitive Analysis

- **Generic Video Editors** (Adobe, Final Cut): Too complex, not AI-focused
- **Online Editors** (Kapwing, Clideo): General purpose, not optimized for AI
- **Watermark Removers** (HitPaw, Apowersoft): Single feature, outdated UX
- **ReelVan Advantage**: Specialized + modern + SEO-optimized

### B. Technology Alternatives Considered

- **Backend**: Node.js custom vs. Next.js API routes → Next.js for simplicity
- **Database**: PostgreSQL (Supabase) vs. MongoDB → PostgreSQL for relations
- **Storage**: S3 vs. Supabase Storage → Supabase for integration
- **Queue**: BullMQ vs. Supabase functions → Start simple, scale later

### C. Revenue Projections (Optimistic)

**Month 3:**

- 500 organic visitors/day
- 5% conversion to signup = 25 signups/day
- 30% process video = 7.5 videos/day
- $5 average revenue per video = $37.50/day
- **Monthly revenue: ~$1,125**

**Month 6:**

- 2,000 organic visitors/day
- 7% conversion = 140 signups/day
- 35% process = 49 videos/day
- $6 ARPU = $294/day
- **Monthly revenue: ~$8,820**

**Month 12:**

- 5,000 organic visitors/day
- 10% conversion = 500 signups/day
- 40% process = 200 videos/day
- $7 ARPU = $1,400/day
- **Monthly revenue: ~$42,000**

---

**Document Owner:** Product Team
**Next Review:** After MVP launch (Week 9)
**Feedback:** Open GitHub discussions or product@reelvan.com
