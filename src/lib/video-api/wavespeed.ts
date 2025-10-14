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

// Raw response from API (may vary)
const PredictionResponseRawSchema = z
  .object({
    id: z.string().optional(),
    request_id: z.string().optional(),
    model: z.string().optional(),
    status: PredictionStatusSchema.optional(),
    created_at: z.string().optional(),
    outputs: z.array(z.string()).optional().nullable(),
    has_nsfw_contents: z.array(z.boolean()).optional().nullable(),
    urls: z.object({}).passthrough().optional().nullable(),
  })
  .passthrough() // Allow extra fields we don't know about

export const PredictionResponseSchema = PredictionResponseRawSchema.transform((data) => {
  // Handle different API response formats
  const id = data.id || data.request_id
  if (!id) {
    throw new Error('WaveSpeed API response missing required id/request_id field')
  }

  return {
    id,
    model: data.model || 'wavespeed-watermark-remover',
    status: data.status || 'created',
    created_at: data.created_at || new Date().toISOString(),
    outputs: data.outputs || [],
    has_nsfw_contents: data.has_nsfw_contents,
    urls: data.urls || {},
  }
})

export type PredictionResponse = z.output<typeof PredictionResponseSchema>

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

    console.log('📡 WaveSpeed POST create prediction:', { videoUrl })

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
      console.error('❌ WaveSpeed HTTP error:', response.status, errorText)
      throw new Error(`WaveSpeed API error (${response.status}): ${errorText}`)
    }

    const responseBody = await response.json()
    console.log('📡 WaveSpeed create response:', JSON.stringify(responseBody, null, 2))

    // WaveSpeed API wraps response in { code, message, data } envelope
    if (responseBody.code !== 200) {
      console.error('❌ WaveSpeed API error code:', responseBody.code, responseBody.message)
      throw new Error(`WaveSpeed API error: ${responseBody.message || 'Unknown error'}`)
    }

    // Extract the actual prediction data from the envelope
    const data = responseBody.data

    if (!data) {
      console.error('❌ WaveSpeed response missing data field')
      throw new Error('WaveSpeed API response missing data field')
    }

    console.log('✅ WaveSpeed prediction created:', {
      id: data.id || data.request_id,
      status: data.status,
    })

    return PredictionResponseSchema.parse(data)
  }

  /**
   * Get prediction result by ID
   *
   * GET /api/v3/predictions/{request_id}/result
   */
  async getPredictionResult(requestId: string): Promise<PredictionResponse> {
    const url = `${this.baseUrl}/api/v3/predictions/${requestId}/result`

    console.log('📡 WaveSpeed GET result:', { requestId, url })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ WaveSpeed HTTP error:', response.status, errorText)
      throw new Error(`WaveSpeed API error (${response.status}): ${errorText}`)
    }

    const responseBody = await response.json()
    console.log('📡 WaveSpeed response body:', JSON.stringify(responseBody, null, 2))

    // WaveSpeed API wraps response in { code, message, data } envelope
    if (responseBody.code !== 200) {
      console.error('❌ WaveSpeed API error code:', responseBody.code, responseBody.message)
      throw new Error(`WaveSpeed API error: ${responseBody.message || 'Unknown error'}`)
    }

    // Extract the actual prediction data from the envelope
    const data = responseBody.data

    if (!data) {
      console.error('❌ WaveSpeed response missing data field')
      throw new Error('WaveSpeed API response missing data field')
    }

    console.log('✅ WaveSpeed data parsed:', {
      id: data.id || data.request_id,
      status: data.status,
      has_outputs: !!data.outputs && data.outputs.length > 0,
    })

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
