/**
 * Jotai atoms for video state management
 *
 * Provides persistent state for video settings and processing options
 * All atoms use SSR-friendly storage configuration
 */

import { atomWithStorage, createJSONStorage } from 'jotai/utils'

/**
 * SSR-friendly storage configuration
 * - Uses localStorage in browser
 * - Returns null on server (no localStorage available)
 * - delayInit: true prevents Suspense on first read
 */
const createSsrStorage = <T>() =>
  createJSONStorage<T>(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // Server-side: return a no-op storage
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
    }
    // Client-side: use localStorage
    return window.localStorage
  })

/**
 * Video input source type
 */
export type VideoInputSource = 'file' | 'url'

/**
 * Target resolution type
 */
export type TargetResolution = '720p' | '1080p' | '4k' | undefined

/**
 * Target FPS type
 */
export type TargetFps = 24 | 30 | 60 | undefined

/**
 * Caption tone type
 */
export type CaptionTone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational'

// ==================== Video Input Atoms ====================

/**
 * Persistent atom for video URL input
 */
export const videoUrlAtom = atomWithStorage<string>('reelvan:video-url', '')

/**
 * Persistent atom for input source selection (file or URL)
 */
export const videoInputSourceAtom = atomWithStorage<VideoInputSource>(
  'reelvan:input-source',
  'file'
)

// ==================== Processing Options Atoms ====================

/**
 * Persistent atom for watermark removal option
 */
export const removeWatermarkAtom = atomWithStorage<boolean>('reelvan:remove-watermark', false)

/**
 * Persistent atom for quality enhancement option
 */
export const enhanceQualityAtom = atomWithStorage<boolean>('reelvan:enhance-quality', false)

/**
 * Persistent atom for target resolution
 */
export const targetResolutionAtom = atomWithStorage<TargetResolution>(
  'reelvan:target-resolution',
  undefined
)

/**
 * Persistent atom for target FPS
 */
export const targetFpsAtom = atomWithStorage<TargetFps>('reelvan:target-fps', undefined)

/**
 * Persistent atom for custom watermark addition option
 */
export const addCustomWatermarkAtom = atomWithStorage<boolean>(
  'reelvan:add-custom-watermark',
  false
)

/**
 * Persistent atom for AI caption generation option
 */
export const generateCaptionsAtom = atomWithStorage<boolean>('reelvan:generate-captions', false)

/**
 * Persistent atom for selected platforms for captions
 */
export const selectedPlatformsAtom = atomWithStorage<string[]>('reelvan:selected-platforms', [])

/**
 * Persistent atom for caption tone
 */
export const captionToneAtom = atomWithStorage<CaptionTone>('reelvan:caption-tone', 'professional')
