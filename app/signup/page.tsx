import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Sign Up - ReelVan',
  description:
    'Create your free ReelVan account and start enhancing your AI-generated videos today. No credit card required.',
})

export default function SignUp() {
  return (
    <>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-primary-100 dark:bg-primary-900 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-primary-600 dark:text-primary-400 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Coming Soon
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign up functionality is currently under development
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-gray-900">
            <div className="space-y-6">
              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        We're building an amazing experience for you!
                      </p>
                      <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">
                        <strong>What to expect:</strong>
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <li>Fast email/Google sign up</li>
                        <li>Instant free tier access</li>
                        <li>Secure authentication with Supabase</li>
                        <li>No credit card required to start</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Want to be notified when we launch?
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Follow our development progress on GitHub or check back soon.
                </p>
                <div className="mt-4 flex gap-4">
                  <Link
                    href="https://github.com/markshawn2020/reelvan-web"
                    className="bg-primary-600 hover:bg-primary-500 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  In the meantime, explore:
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Link
                    href="/pricing"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Pricing
                    </span>
                  </Link>
                  <Link
                    href="/docs"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Documentation
                    </span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Blog
                    </span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      About
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Building a product takes time, but we're moving fast.
            <br />
            Expected launch: Q2 2025
          </p>
        </div>
      </div>
    </>
  )
}
