import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="border-border bg-secondary border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Product Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/transformer" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforms Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              AI Platforms
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog/remove-sora-watermark"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sora Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/remove-veo-watermark"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Veo Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/remove-kling-watermark"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Kling Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/enhance-ai-video-quality"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Enhance Quality
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-muted-foreground hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing#faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:enterprise@reelvan.com"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Enterprise
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/reelvan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-border mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright and Social Icons */}
            <div className="flex flex-col items-center gap-3 md:items-start">
              <div className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} {siteMetadata.author}. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
                <SocialIcon kind="x" href={siteMetadata.x} size={5} />
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/signup"
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
