/**
 * Zod validation schemas for video upload and processing
 *
 * IMPORTANT: All API inputs MUST be validated with these schemas
 */

import { z } from 'zod'
import { PRICING } from '@/lib/video/cost'

/**
 * Allowed video MIME types
 */
export const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4'] as const

/**
 * Video upload metadata schema
 */
export const videoUploadSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .refine((name) => !name.includes('..'), 'Invalid filename'),

  fileSize: z
    .number()
    .int()
    .positive()
    .max(
      PRICING.MAX_FILE_SIZE,
      `File size must not exceed ${PRICING.MAX_FILE_SIZE / (1024 * 1024)}MB`
    ),

  duration: z
    .number()
    .positive()
    .min(PRICING.MIN_VIDEO_DURATION, `Video must be at least ${PRICING.MIN_VIDEO_DURATION} second`)
    .max(
      PRICING.MAX_VIDEO_DURATION,
      `Video must not exceed ${PRICING.MAX_VIDEO_DURATION} seconds (2 minutes)`
    ),

  mimeType: z.enum(ALLOWED_VIDEO_MIME_TYPES, {
    message: `File type must be one of: ${ALLOWED_VIDEO_MIME_TYPES.join(', ')}`,
  }),

  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

export type VideoUpload = z.infer<typeof videoUploadSchema>

/**
 * Video processing options schema
 */
export const processingOptionsSchema = z.object({
  removeWatermark: z.boolean().default(false),

  targetResolution: z.enum(['720p', '1080p', '4k']).optional(),

  targetFps: z.number().int().min(15).max(60).optional(),

  targetAspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).optional(),

  enhanceQuality: z.boolean().default(false),
})

export type ProcessingOptions = z.infer<typeof processingOptionsSchema>

/**
 * Video processing request schema (combines upload + options)
 */
export const processVideoRequestSchema = z
  .object({
    videoId: z.string().uuid('Invalid video ID'),
  })
  .merge(processingOptionsSchema)

export type ProcessVideoRequest = z.infer<typeof processVideoRequestSchema>

/**
 * Create video record schema (for database insertion)
 */
export const createVideoRecordSchema = videoUploadSchema.merge(processingOptionsSchema).extend({
  originalUrl: z.string().url().optional(),
  originalStoragePath: z.string().optional(),
  videoHash: z.string().optional(),
})

export type CreateVideoRecord = z.infer<typeof createVideoRecordSchema>

/**
 * Video URL input schema (for users providing external URLs)
 */
export const videoUrlSchema = z.object({
  url: z
    .string()
    .url('Invalid video URL')
    .refine(
      (url) => {
        // Check if URL points to a video file
        const videoExtensions = ['.mp4']
        return videoExtensions.some((ext) => url.toLowerCase().includes(ext))
      },
      { message: 'URL must point to a MP4 video file' }
    ),
})

export type VideoUrl = z.infer<typeof videoUrlSchema>

/**
 * Upload signed URL request schema
 */
export const uploadUrlRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_VIDEO_MIME_TYPES),
  fileSize: z.number().int().positive().max(PRICING.MAX_FILE_SIZE),
})

export type UploadUrlRequest = z.infer<typeof uploadUrlRequestSchema>

/**
 * Video status update schema (for webhooks)
 */
export const videoStatusUpdateSchema = z.object({
  videoId: z.string().uuid(),
  status: z.enum(['pending', 'uploading', 'processing', 'completed', 'failed', 'cancelled']),
  progress: z.number().int().min(0).max(100).optional(),
  errorMessage: z.string().optional(),
  processedUrl: z.string().url().optional(),
  externalJobId: z.string().optional(),
})

export type VideoStatusUpdate = z.infer<typeof videoStatusUpdateSchema>

/**
 * Credit purchase schema
 */
export const creditPurchaseSchema = z.object({
  amount: z
    .number()
    .int()
    .positive()
    .min(100, 'Minimum purchase is 100 credits ($1)')
    .max(100000, 'Maximum purchase is 100,000 credits ($1000)'),
})

export type CreditPurchase = z.infer<typeof creditPurchaseSchema>

/**
 * Helper function to sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
    .replace(/\.{2,}/g, '.') // Remove consecutive dots
    .slice(0, 255) // Limit length
}

/**
 * Helper function to get file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

/**
 * Helper function to validate MIME type matches extension
 */
export function validateMimeTypeMatchesExtension(
  mimeType: string,
  filename: string
): { valid: boolean; reason?: string } {
  const extension = getFileExtension(filename)
  const mimeToExt: Record<string, string[]> = {
    'video/mp4': ['mp4', 'm4v'],
  }

  const expectedExtensions = mimeToExt[mimeType]
  if (!expectedExtensions) {
    return { valid: false, reason: 'Unknown MIME type. Only MP4 is supported.' }
  }

  if (!expectedExtensions.includes(extension)) {
    return {
      valid: false,
      reason: `File extension .${extension} does not match MIME type ${mimeType}. Only MP4 is supported.`,
    }
  }

  return { valid: true }
}
