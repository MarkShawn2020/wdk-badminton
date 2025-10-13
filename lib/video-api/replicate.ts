/**
 * Replicate API Client
 *
 * Official API for video upscaling using Topaz Labs
 * Base URL: https://api.replicate.com
 *
 * Authentication: Bearer token in Authorization header
 *
 * Model: topazlabs/video-upscale
 * - Supports 720p, 1080p, 4k upscaling
 * - FPS up to 60
 */

import { z } from 'zod'

// ============================================================================
// Type Definitions
// ============================================================================

export const ReplicateStatusSchema = z.enum([
  'starting',
  'processing',
  'succeeded',
  'failed',
  'canceled',
])
export type ReplicateStatus = z.infer<typeof ReplicateStatusSchema>

export const ReplicatePredictionSchema = z.object({
  id: z.string(),
  status: ReplicateStatusSchema,
  input: z.object({
    video: z.string(),
    target_resolution: z.string().optional(),
    target_fps: z.number().optional(),
  }),
  output: z.union([z.string(), z.null()]).optional(), // Output is a single URL string
  error: z.string().optional().nullable(),
  created_at: z.string(),
  started_at: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
  urls: z
    .object({
      get: z.string(),
      cancel: z.string(),
    })
    .optional(),
})

export type ReplicatePrediction = z.infer<typeof ReplicatePredictionSchema>

export interface CreatePredictionInput {
  video: string
  target_resolution?: '720p' | '1080p' | '4k'
  target_fps?: number
}

// ============================================================================
// Replicate API Client
// ============================================================================

export class ReplicateClient {
  private baseUrl = 'https://api.replicate.com/v1'
  private apiToken: string
  private model = 'topazlabs/video-upscale'
  // Latest version as of 2025-01 (from https://replicate.com/topazlabs/video-upscale)
  private version = 'f4dad23bbe2d0bf4736d2ea8c9156f1911d8eeb511c8d0bb390931e25caaef61'

  constructor(apiToken: string) {
    if (!apiToken) {
      throw new Error('Replicate API token is required')
    }
    this.apiToken = apiToken
  }

  /**
   * Create a new video upscaling prediction
   *
   * POST /v1/predictions
   */
  async createPrediction(input: CreatePredictionInput): Promise<ReplicatePrediction> {
    const url = `${this.baseUrl}/predictions`

    // FIX: Use nullish coalescing (??) instead of logical AND (&&)
    // This ensures parameters are ALWAYS sent, even if 0 or falsy
    // NOTE: We default to 60fps (maximum quality), not Replicate's 30fps default
    const apiInput = {
      video: input.video,
      target_resolution: input.target_resolution ?? '1080p',
      target_fps: input.target_fps ?? 60, // Default to 60fps for maximum quality
    }

    const requestBody = {
      version: this.version,
      input: apiInput,
    }

    console.log('📤 Replicate API Request Body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Replicate API Error Response:', errorText)
      throw new Error(`Replicate API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    console.log('📥 Replicate API Response:', JSON.stringify(data, null, 2))
    console.log('✅ Replicate prediction created:', data.id)

    // VALIDATION: Verify API received correct parameters
    const validation = {
      fps_sent: apiInput.target_fps,
      fps_received: data.input?.target_fps,
      fps_match: apiInput.target_fps === data.input?.target_fps,
      resolution_sent: apiInput.target_resolution,
      resolution_received: data.input?.target_resolution,
      resolution_match: apiInput.target_resolution === data.input?.target_resolution,
    }

    console.log('🔍 Parameter Validation:', validation)

    if (!validation.fps_match) {
      console.error('⚠️ FPS MISMATCH DETECTED!', {
        expected: apiInput.target_fps,
        received: data.input?.target_fps,
      })
    }

    if (!validation.resolution_match) {
      console.error('⚠️ RESOLUTION MISMATCH DETECTED!', {
        expected: apiInput.target_resolution,
        received: data.input?.target_resolution,
      })
    }

    return ReplicatePredictionSchema.parse(data)
  }

  /**
   * Get prediction result by ID
   *
   * GET /v1/predictions/{prediction_id}
   */
  async getPrediction(predictionId: string): Promise<ReplicatePrediction> {
    const url = `${this.baseUrl}/predictions/${predictionId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Replicate API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    return ReplicatePredictionSchema.parse(data)
  }

  /**
   * Poll prediction until completion or timeout
   *
   * @param predictionId - Prediction ID to poll
   * @param options - Polling options
   * @returns Final prediction response
   */
  async pollPrediction(
    predictionId: string,
    options: {
      maxAttempts?: number
      intervalMs?: number
      onProgress?: (status: ReplicateStatus) => void
    } = {}
  ): Promise<ReplicatePrediction> {
    const { maxAttempts = 120, intervalMs = 5000, onProgress } = options

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const prediction = await this.getPrediction(predictionId)

      if (onProgress) {
        onProgress(prediction.status)
      }

      if (prediction.status === 'succeeded') {
        if (!prediction.output) {
          throw new Error('Prediction succeeded but no output URL')
        }
        return prediction
      }

      if (prediction.status === 'failed') {
        throw new Error(`Video upscaling failed: ${prediction.error || 'Unknown error'}`)
      }

      if (prediction.status === 'canceled') {
        throw new Error('Video upscaling was canceled')
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    throw new Error(`Polling timeout after ${maxAttempts} attempts`)
  }

  /**
   * Convenience method: create prediction and wait for completion
   */
  async upscaleVideo(
    input: CreatePredictionInput,
    options?: {
      maxAttempts?: number
      intervalMs?: number
      onProgress?: (status: ReplicateStatus) => void
    }
  ): Promise<ReplicatePrediction> {
    const prediction = await this.createPrediction(input)
    return this.pollPrediction(prediction.id, options)
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let clientInstance: ReplicateClient | null = null

export function getReplicateClient(): ReplicateClient {
  if (!clientInstance) {
    const apiToken = process.env.REPLICATE_API_TOKEN

    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN environment variable is not set')
    }

    clientInstance = new ReplicateClient(apiToken)
  }

  return clientInstance
}

// ============================================================================
// Cost Estimation (Replicate charges per second of processing time)
// ============================================================================

/**
 * Estimate Replicate API cost for video upscaling
 *
 * Replicate pricing: ~$0.0075 per second of processing time
 * Processing time ≈ 2-3x video duration for 4K upscaling
 *
 * @param durationSeconds - Video duration
 * @param targetResolution - Target resolution
 * @returns Estimated cost in USD
 */
export function estimateReplicateCost(
  durationSeconds: number,
  targetResolution: '720p' | '1080p' | '4k' = '1080p'
): number {
  const COST_PER_PROCESSING_SECOND = 0.0075 // $0.0075 per second

  // Processing time multiplier based on resolution
  const multipliers = {
    '720p': 1.5,
    '1080p': 2.0,
    '4k': 3.0,
  }

  const processingTime = durationSeconds * multipliers[targetResolution]

  return processingTime * COST_PER_PROCESSING_SECOND
}
