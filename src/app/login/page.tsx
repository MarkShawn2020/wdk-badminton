import Link from '@/components/Link'
import { genPageMetadata } from '@/app/seo'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export const metadata = genPageMetadata({
  title: 'Login - ReelVan',
  description: 'Sign in to your ReelVan account to continue enhancing your AI videos.',
})

export default function Login() {
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
          <h2 className="text-foreground mt-6 text-center text-3xl font-bold tracking-tight">
            Welcome Back
          </h2>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Sign in to continue enhancing your AI videos
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-gray-900">
            <div className="space-y-6">
              {/* Google Sign In */}
              <GoogleSignInButton redirectTo="/dashboard" />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-border w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background text-muted-foreground px-2">
                    Email coming soon
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-xs">By signing in, you get access to:</p>
            <div className="text-muted-foreground mt-3 flex justify-center gap-6 text-xs">
              <div className="flex items-center">
                <svg
                  className="text-primary-500 mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Watermark Removal
              </div>
              <div className="flex items-center">
                <svg
                  className="text-primary-500 mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Quality Enhancement
              </div>
              <div className="flex items-center">
                <svg
                  className="text-primary-500 mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Fast Processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
