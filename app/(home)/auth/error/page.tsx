import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { AlertCircle } from 'lucide-react'

export const metadata = genPageMetadata({
  title: 'Authentication Error - ReelVan',
  description: 'An error occurred during authentication.',
})

export default async function AuthError({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  const errorMessage = params.message || 'An unexpected error occurred during authentication'

  return (
    <>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-destructive/20 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-6 w-6" />
          </div>
          <h2 className="text-foreground mt-6 text-center text-3xl font-bold tracking-tight">
            Authentication Failed
          </h2>
          <p className="text-muted-foreground mt-2 text-center text-sm">We couldn't sign you in</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-gray-900">
            <div className="space-y-6">
              {/* Error Message */}
              <div className="border-destructive/30 bg-destructive/10 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-destructive h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-destructive-foreground text-sm font-medium">
                      Error Details
                    </h3>
                    <p className="text-destructive-foreground mt-1 text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Steps */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-foreground text-sm font-medium">What you can try:</h3>
                <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure pop-ups are not blocked in your browser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Clear your browser cache and cookies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Try signing in with a different Google account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Check if third-party cookies are enabled</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="bg-primary-600 hover:bg-primary-500 flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Try Again
                </Link>
                <Link
                  href="/"
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Back to Home
                </Link>
              </div>

              {/* Contact Support */}
              <div className="text-center">
                <p className="text-muted-foreground text-xs">
                  Still having trouble?{' '}
                  <Link
                    href="https://github.com/markshawn2020/reelvan-web/issues"
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
