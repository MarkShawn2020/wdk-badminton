# ReelVan Documentation

## 📚 Documentation Index

### 🚀 Quick Start Guides

| Guide                                            | Description                         | Time   | Audience   |
| ------------------------------------------------ | ----------------------------------- | ------ | ---------- |
| [STRIPE_QUICKSTART.md](./STRIPE_QUICKSTART.md)   | Set up Stripe payments in 5 minutes | 5 min  | Developers |
| [QUICK_START_VIDEO.md](../QUICK_START_VIDEO.md)  | Get video processing running        | 5 min  | Developers |
| [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) | Configure Google Sign-In            | 10 min | Developers |

---

### 💳 Stripe Payment System

**Recommended reading order:**

1. **[STRIPE_OVERVIEW.md](./STRIPE_OVERVIEW.md)** ⭐ START HERE
   - Product design philosophy (流量包 vs 订阅)
   - Tier system explanation
   - Architecture overview
   - Security design

2. **[STRIPE_QUICKSTART.md](./STRIPE_QUICKSTART.md)**
   - 5-minute local setup
   - Environment variables
   - Test payment flow

3. **[STRIPE_SETUP.md](./STRIPE_SETUP.md)**
   - Complete configuration guide
   - Local development (Stripe CLI)
   - Production deployment
   - Troubleshooting FAQ

4. **[STRIPE_CHECKLIST.md](./STRIPE_CHECKLIST.md)**
   - Pre-deployment verification
   - Security checklist
   - Monitoring setup

**Key Concepts:**

```
Credit System:
- 1 credit = $0.01
- Packages: 100 → 500 → 2000 → 10000 credits
- Volume discounts: 10% → 20% → 30%

Tier System (永久升级):
- free: 注册赠送 100 credits (3 videos/day)
- paid: 首次购买 (50 videos/day)
- pro: 累计购买 $50+ (200 videos/day)
```

---

### 🎬 Video Processing

| Document                                                | Description                   |
| ------------------------------------------------------- | ----------------------------- |
| [VIDEO_FEATURE_SUMMARY.md](../VIDEO_FEATURE_SUMMARY.md) | Architecture overview         |
| [README_VIDEO_FEATURE.md](../README_VIDEO_FEATURE.md)   | Complete implementation guide |
| [SETUP.md](../SETUP.md)                                 | Environment setup             |

**Features:**

- Upload & process videos
- Watermark removal
- Quality enhancement
- Real-time status updates

---

### 🔐 Authentication

| Document                                         | Description                  |
| ------------------------------------------------ | ---------------------------- |
| [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) | Google Sign-In configuration |

**Supported methods:**

- Email/Password (Supabase Auth)
- Google OAuth 2.0

---

### 🏗️ Project Resources

| Document                  | Description                         |
| ------------------------- | ----------------------------------- |
| [PRD.md](../PRD.md)       | Product requirements & roadmap      |
| [README.md](../README.md) | Main project README                 |
| [CLAUDE.md](../CLAUDE.md) | AI assistant development guidelines |

---

## 📂 Documentation Structure

```
docs/
├── README.md (this file)               # Documentation index
├── STRIPE_OVERVIEW.md                  # Stripe system overview
├── STRIPE_QUICKSTART.md                # 5-min Stripe setup
├── STRIPE_SETUP.md                     # Complete Stripe guide
├── STRIPE_CHECKLIST.md                 # Deployment checklist
└── GOOGLE_OAUTH_SETUP.md               # Google OAuth guide

Root level:
├── PRD.md                              # Product requirements
├── README.md                           # Main README
├── SETUP.md                            # Environment setup
├── QUICK_START_VIDEO.md                # Video feature quickstart
├── VIDEO_FEATURE_SUMMARY.md            # Video architecture
└── README_VIDEO_FEATURE.md             # Video implementation
```

---

## 🎯 Common Tasks

### I want to...

**Set up Stripe payments for the first time**
→ Read [STRIPE_QUICKSTART.md](./STRIPE_QUICKSTART.md)

**Understand the credit & tier system**
→ Read [STRIPE_OVERVIEW.md](./STRIPE_OVERVIEW.md) (Section: Tier System)

**Deploy to production**
→ Follow [STRIPE_SETUP.md](./STRIPE_SETUP.md) (Section: Production Deployment)
→ Verify with [STRIPE_CHECKLIST.md](./STRIPE_CHECKLIST.md)

**Debug Stripe webhook issues**
→ See [STRIPE_SETUP.md](./STRIPE_SETUP.md) (Section: Common Problems)

**Add video processing**
→ Follow [QUICK_START_VIDEO.md](../QUICK_START_VIDEO.md)

**Configure Google Sign-In**
→ Follow [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

---

## 🆘 Getting Help

### Documentation

1. Check this README for the right doc
2. Read the relevant guide
3. Check "Common Problems" sections

### Resources

- **Stripe Docs:** https://stripe.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

### Contact

- **Issues:** GitHub Issues
- **Email:** support@reelvan.com

---

## 🔄 Document Updates

| Date       | Changes                            |
| ---------- | ---------------------------------- |
| 2025-10-09 | Added Stripe payment documentation |
| 2025-10-08 | Added video processing guides      |
| 2025-10-07 | Added Google OAuth setup           |

---

**Last updated:** 2025-10-09
