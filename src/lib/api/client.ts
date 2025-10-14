/**
 * API client utilities for client-side fetch requests
 *
 * Provides centralized error handling and request configuration
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Enhanced fetch with better error handling
 *
 * Features:
 * - Automatic credential inclusion for auth
 * - Network error detection
 * - HTTP error handling
 * - Timeout support
 * - Detailed error messages
 *
 * @throws {NetworkError} When network connection fails
 * @throws {APIError} When HTTP request fails (4xx, 5xx)
 */
export async function apiFetch<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options

  // Default options
  const defaultOptions: RequestInit = {
    credentials: 'same-origin', // Include cookies for auth
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle HTTP errors
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error')
      throw new APIError(`API request failed: ${errorBody}`, response.status, response.statusText)
    }

    // Parse JSON response
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return (await response.json()) as T
    }

    // Return raw response for non-JSON
    return response as unknown as T
  } catch (error) {
    clearTimeout(timeoutId)

    // Handle abort (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new NetworkError(`Request timeout after ${timeout}ms`)
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new NetworkError(
        'Network connection failed. Please check your internet connection and try again.'
      )
    }

    // Re-throw API errors
    if (error instanceof APIError) {
      throw error
    }

    // Unknown error
    throw new Error(`Unexpected error: ${error}`)
  }
}

/**
 * Type-safe API response wrapper
 */
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Fetch with standard API response format
 */
export async function apiRequest<T>(url: string, options?: FetchOptions): Promise<APIResponse<T>> {
  try {
    const response = await apiFetch<APIResponse<T>>(url, options)
    return response
  } catch (error) {
    if (error instanceof NetworkError) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (error instanceof APIError) {
      // Parse error response if it's JSON
      try {
        const errorData = JSON.parse(error.message.replace('API request failed: ', ''))
        return {
          success: false,
          error: errorData.error || errorData.message || error.statusText,
        }
      } catch {
        return {
          success: false,
          error: `${error.status} ${error.statusText}`,
        }
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
