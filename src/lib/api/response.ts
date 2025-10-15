/**
 * Standardized API response helpers
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: unknown
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Create success response
 */
export function successResponse<T>(data: T, status = 200): Response {
  return Response.json(
    {
      success: true,
      data,
    } as ApiSuccessResponse<T>,
    { status }
  )
}

/**
 * Create error response
 */
export function errorResponse(message: string, status = 400, details?: unknown): Response {
  return Response.json(
    {
      success: false,
      error: message,
      details,
    } as ApiErrorResponse,
    { status }
  )
}
