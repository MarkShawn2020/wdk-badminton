/**
 * WaveSpeed API Client
 *
 * Official API for video watermark removal and enhancement
 * Base URL: https://api.wavespeed.ai
 *
 * Authentication: Bearer token in Authorization header
 */

import { z } from 'zod'

// ============================================================================
// Type Definitions (based on OpenAPI schema)
// ============================================================================

export const PredictionStatusSchema = z.enum(['created', 'processing', 'completed', 'failed'])
export type PredictionStatus = z.infer<typeof PredictionStatusSchema>

export const CreatePredictionRequestSchema = z.object({
  video: z.string().url().describe('URL to the video file'),
})

export const PredictionResponseSchema = z.object({
  id: z.string().describe('Unique identifier for the prediction'),
  model: z.string().describe('Model ID used for the prediction'),
  status: PredictionStatusSchema,
  created_at: z.string().datetime().describe('ISO timestamp when request was created'),
  outputs: z.array(z.string()).describe('Array of URLs to generated content'),
  has_nsfw_contents: z.array(z.boolean()).optional(),
  urls: z.object({}).passthrough().describe('Related API endpoints'),
})

export type PredictionResponse = z.infer<typeof PredictionResponseSchema>

// ============================================================================
// WaveSpeed API Client
// ============================================================================

export class WaveSpeedClient {
  private baseUrl = 'https://api.wavespeed.ai'
  private apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('WaveSpeed API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Create a new watermark removal prediction
   *
   * POST /api/v3/wavespeed-ai/video-watermark-remover
   */
  async createPrediction(videoUrl: string): Promise<PredictionResponse> {
    const url = `${this.baseUrl}/api/v3/wavespeed-ai/video-watermark-remover`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ video: videoUrl }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`WaveSpeed API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return PredictionResponseSchema.parse(data)
  }

  /**
   * Get prediction result by ID
   *
   * GET /api/v3/predictions/{request_id}/result
   */
  async getPredictionResult(requestId: string): Promise<PredictionResponse> {
    const url = `${this.baseUrl}/api/v3/predictions/${requestId}/result`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`WaveSpeed API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return PredictionResponseSchema.parse(data)
  }

  /**
   * Poll prediction until completion or timeout
   *
   * @param requestId - Prediction ID to poll
   * @param options - Polling options
   * @returns Final prediction response
   */
  async pollPrediction(
    requestId: string,
    options: {
      maxAttempts?: number
      intervalMs?: number
      onProgress?: (status: PredictionStatus) => void
    } = {}
  ): Promise<PredictionResponse> {
    const { maxAttempts = 60, intervalMs = 5000, onProgress } = options

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.getPredictionResult(requestId)

      if (onProgress) {
        onProgress(result.status)
      }

      if (result.status === 'completed') {
        return result
      }

      if (result.status === 'failed') {
        throw new Error('Video processing failed')
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    throw new Error(`Polling timeout after ${maxAttempts} attempts`)
  }

  /**
   * Process video: create prediction and wait for completion
   *
   * Convenience method that combines createPrediction and pollPrediction
   */
  async processVideo(
    videoUrl: string,
    options?: {
      maxAttempts?: number
      intervalMs?: number
      onProgress?: (status: PredictionStatus) => void
    }
  ): Promise<PredictionResponse> {
    const prediction = await this.createPrediction(videoUrl)
    return this.pollPrediction(prediction.id, options)
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let clientInstance: WaveSpeedClient | null = null

export function getWaveSpeedClient(): WaveSpeedClient {
  if (!clientInstance) {
    const apiKey = process.env.WAVESPEED_API_KEY

    if (!apiKey) {
      throw new Error('WAVESPEED_API_KEY environment variable is not set')
    }

    clientInstance = new WaveSpeedClient(apiKey)
  }

  return clientInstance
}
