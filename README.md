# ReelVan - Share Your AI Video

<div align="center">

![ReelVan Logo](./public/logo.png)

**Transform AI-generated videos into professional, share-ready content**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ecf8e)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Website](https://reelvan.com) • [Documentation](./docs) • [PRD](./PRD.md) • [Roadmap](./PRD.md#8-mvp-development-roadmap)

</div>

---

## 🎬 **NEW: Video Processing Feature**

A complete video upload, processing, and enhancement system is now implemented!

**Quick Start**: [QUICK_START_VIDEO.md](./QUICK_START_VIDEO.md) - Get running in 5 minutes
**Full Documentation**: [README_VIDEO_FEATURE.md](./README_VIDEO_FEATURE.md) - Complete implementation guide
**Setup Guide**: [SETUP.md](./SETUP.md) - Detailed configuration instructions
**Feature Summary**: [VIDEO_FEATURE_SUMMARY.md](./VIDEO_FEATURE_SUMMARY.md) - Architecture overview

**What's included:**

- ✅ Drag-and-drop video upload with real-time cost estimation
- ✅ Processing options (watermark removal, resolution, aspect ratio)
- ✅ Real-time status updates via Supabase Realtime
- ✅ Side-by-side video comparison player
- ✅ Credit system with automatic refunds
- ✅ User dashboard with processing history
- ✅ Complete API routes and webhooks
- ✅ Production-ready database schema

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

ReelVan is a specialized video enhancement platform designed specifically for AI-generated video content. We solve critical pain points for creators using AI video platforms like Sora, Veo, Kling, and JiMeng by providing:

- 🎬 **Watermark Removal** - Clean, professional videos without platform branding
- ✨ **Quality Enhancement** - Upscale and denoise AI-generated content
- 📐 **Aspect Ratio Conversion** - Optimize for any social platform
- 🎨 **Custom Branding** - Add your own watermarks and logos
- ⚡ **Cloud Processing** - Fast, reliable, no software installation

### Why ReelVan?

AI video platforms produce amazing content but often with limitations:

- Platform watermarks reduce professional appearance
- Fixed aspect ratios don't suit all distribution channels
- Quality artifacts need post-processing
- No easy way to add custom branding

ReelVan solves these problems in one streamlined workflow, optimized for AI-generated content.

---

## ✨ Features

### MVP Features (v1.0)

- [x] **Video Upload System**
  - Drag-and-drop interface
  - Support for MP4, MOV, WebM
  - Up to 2 minutes, 500MB max
  - Automatic format validation

- [x] **AI Watermark Removal**
  - Automatic detection for major platforms
  - Sora, Veo, Kling, JiMeng support
  - Manual region selection fallback
  - Before/after preview

- [x] **Quality Enhancement**
  - Upscaling to 1080p/1440p/4K
  - AI-powered denoising
  - Artifact reduction
  - Color correction

- [x] **Aspect Ratio Conversion**
  - Smart cropping with AI focus detection
  - Presets: 16:9, 9:16, 1:1, 4:5
  - Platform-specific recommendations
  - Manual adjustment controls

- [x] **Custom Watermarks**
  - Upload custom logos
  - Position and opacity control
  - Saved templates
  - PNG with transparency

- [x] **User Management**
  - Email/password authentication
  - Google OAuth integration
  - Credits-based billing
  - Processing history dashboard

- [x] **Payment Processing**
  - Stripe integration
  - Pay-as-you-go credits
  - Subscription plans
  - Automatic invoicing

### Coming Soon (Post-MVP)

- [ ] Batch processing for multiple videos
- [ ] Video trimming and basic editing
- [ ] Audio enhancement and noise removal
- [ ] Automatic subtitle generation
- [ ] Template marketplace
- [ ] Developer API
- [ ] Mobile apps (iOS/Android)
- [ ] Direct social media publishing

See full roadmap in [PRD.md](./PRD.md#10-post-mvp-roadmap)

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State:** React Context + Hooks
- **Content:** [Contentlayer](https://contentlayer.dev/) for MDX blog

### Backend & Services

- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Realtime:** Supabase Realtime (processing updates)
- **Payments:** [Stripe](https://stripe.com/)
- **Video Processing:** Third-party API integration

### Infrastructure

- **Hosting:** [Vercel](https://vercel.com/)
- **Database:** Supabase Cloud
- **CDN:** Vercel Edge Network
- **Analytics:** (TBD - Plausible/Vercel Analytics)

### Development Tools

- **Package Manager:** [pnpm](https://pnpm.io/)
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Testing:** (TBD - Vitest + Testing Library)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.17 or higher
- **pnpm:** v8.0 or higher
- **Git:** Latest version
- **Accounts:**
  - [Supabase](https://supabase.com/) (free tier)
  - [Stripe](https://stripe.com/) (test mode)
  - [Video Processing API](#) (TBD)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/markshawn2020/reelvan-web.git
cd reelvan-web
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables))

4. **Set up Supabase**

```bash
# Run database migrations
pnpm supabase:migrate

# Generate TypeScript types
pnpm supabase:types
```

5. **Start development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm type-check       # Run TypeScript compiler check

# Supabase
pnpm supabase:start   # Start local Supabase instance
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:migrate # Run database migrations
pnpm supabase:types   # Generate TypeScript types
pnpm supabase:reset   # Reset database (WARNING: deletes data)

# Content
pnpm contentlayer:build  # Build content layer

# Testing (coming soon)
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
```

### Development Workflow

1. **Create feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make changes** following [CLAUDE.md](./CLAUDE.md) guidelines

3. **Test locally**

```bash
pnpm dev
# Verify functionality
pnpm type-check
pnpm lint
```

4. **Commit with conventional commits**

```bash
git add .
git commit -m "feat: add watermark removal feature"
```

5. **Push and create PR**

```bash
git push origin feature/your-feature-name
# Open PR on GitHub
```

### Code Quality

This project enforces quality through:

- **TypeScript strict mode** - No implicit any, strict null checks
- **ESLint** - Linting errors block commits
- **Prettier** - Auto-formatting on save
- **Husky pre-commit hooks** - Runs lint-staged before commits
- **Conventional Commits** - Standardized commit messages

See [CLAUDE.md](./CLAUDE.md) for detailed coding standards.

---

## 📁 Project Structure

```
reelvan-web/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth layout group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/          # Dashboard layout group
│   │   ├── dashboard/
│   │   ├── history/
│   │   └── settings/
│   ├── (marketing)/          # Marketing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── pricing/
│   │   ├── how-it-works/
│   │   └── blog/
│   ├── api/                  # API routes
│   │   ├── upload/
│   │   ├── process/
│   │   ├── stripe/
│   │   └── webhooks/
│   ├── layout.tsx            # Root layout
│   └── providers.tsx         # Context providers
│
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── video/                # Video-related components
│   │   ├── VideoUploader.tsx
│   │   ├── VideoPreview.tsx
│   │   └── ProcessingStatus.tsx
│   ├── auth/                 # Auth components
│   ├── dashboard/            # Dashboard components
│   └── marketing/            # Marketing components
│
├── lib/                      # Utility libraries
│   ├── supabase/             # Supabase client & helpers
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries.ts
│   ├── stripe/               # Stripe integration
│   ├── video-api/            # Video processing API client
│   ├── utils.ts              # General utilities
│   └── constants.ts          # App constants
│
├── types/                    # TypeScript types
│   ├── database.ts           # Supabase generated types
│   ├── video.ts              # Video-related types
│   └── user.ts               # User types
│
├── content/                  # MDX content (blog posts)
│   └── blog/
│       ├── remove-sora-watermark.mdx
│       └── ai-video-quality-guide.mdx
│
├── supabase/                 # Supabase configuration
│   ├── migrations/           # SQL migrations
│   └── seed.sql              # Seed data
│
├── public/                   # Static assets
│   ├── images/
│   ├── videos/
│   └── logo.png
│
├── docs/                     # Additional documentation
│   ├── api.md
│   ├── deployment.md
│   └── architecture.md
│
├── .env.example              # Environment variables template
├── .env.local                # Local environment (not in git)
├── contentlayer.config.ts    # Contentlayer configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── pnpm-lock.yaml            # Lockfile
├── PRD.md                    # Product Requirements Document
├── CLAUDE.md                 # Development guidelines
└── README.md                 # This file
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ReelVan

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Video Processing API (TBD)
VIDEO_API_URL=https://api.videoprocessor.com
VIDEO_API_KEY=your-api-key
VIDEO_API_COST_PER_5_SECONDS=0.10

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Getting Credentials

**Supabase:**

1. Create project at [supabase.com](https://supabase.com/)
2. Go to Settings → API
3. Copy URL and anon key

**Stripe:**

1. Create account at [stripe.com](https://stripe.com/)
2. Go to Developers → API keys
3. Use test mode keys for development
4. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`

**Video Processing API:**

- (Instructions depend on chosen provider)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git push origin main
```

2. **Import in Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Configure environment variables
- Deploy

3. **Configure domains**

- Add custom domain in Vercel settings
- Update `NEXT_PUBLIC_APP_URL` to production URL

4. **Set up webhooks**

- Configure Stripe webhook: `https://your-domain.com/api/webhooks/stripe`
- Add webhook secret to environment variables

### Database Migrations

```bash
# Run migrations in production
pnpm supabase:migrate --env production
```

### Post-Deployment Checklist

- [ ] Verify Supabase connection
- [ ] Test authentication flows
- [ ] Test payment processing
- [ ] Test video upload and processing
- [ ] Configure CDN and caching
- [ ] Set up monitoring (Sentry, Vercel Analytics)
- [ ] Configure backup strategy
- [ ] Test error handling and edge cases
- [ ] SSL certificate active
- [ ] SEO metadata configured

See [docs/deployment.md](./docs/deployment.md) for detailed instructions.

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Read [CLAUDE.md](./CLAUDE.md) for coding standards

### Contribution Process

1. **Check existing issues** or create a new one
2. **Discuss major changes** before implementing
3. **Follow coding standards** (see [CLAUDE.md](./CLAUDE.md))
4. **Write tests** for new features (when testing is set up)
5. **Update documentation** if needed
6. **Use conventional commits:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation only
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

7. **Submit pull request** with clear description

### Code Review Process

- All PRs require review before merging
- Automated checks must pass (lint, type-check)
- Address feedback promptly
- Keep PRs focused and reasonably sized

### Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for:

- TypeScript best practices
- Component patterns
- API integration guidelines
- Cost optimization strategies
- SEO requirements

---

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Product Requirements Document
- **[CLAUDE.md](./CLAUDE.md)** - Development Guidelines for AI Assistants
- **[docs/api.md](./docs/api.md)** - API Documentation
- **[docs/architecture.md](./docs/architecture.md)** - System Architecture
- **[docs/deployment.md](./docs/deployment.md)** - Deployment Guide

---

## 🐛 Bug Reports & Feature Requests

- **Bug Reports:** [GitHub Issues](https://github.com/markshawn2020/reelvan-web/issues/new?template=bug_report.md)
- **Feature Requests:** [GitHub Issues](https://github.com/markshawn2020/reelvan-web/issues/new?template=feature_request.md)
- **Security Issues:** Email security@reelvan.com (do not open public issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📞 Contact

- **Website:** [reelvan.com](https://reelvan.com)
- **Email:** hello@reelvan.com
- **Twitter:** [@reelvan](https://twitter.com/reelvan)
- **Discord:** [Join our community](https://discord.gg/reelvan)

---

<div align="center">

**Built with ❤️ for AI video creators**

[⬆ Back to Top](#reelvan---share-your-ai-video)

</div>
