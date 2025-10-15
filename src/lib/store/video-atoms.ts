/**
 * Jotai atoms for video state management
 *
 * Provides persistent state for video settings and processing options
 */

import { atomWithStorage } from 'jotai/utils'

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
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const videoUrlAtom = atomWithStorage<string>('reelvan:video-url', '', undefined, {
  getOnInit: true,
})

/**
 * Persistent atom for input source selection (file or URL)
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const videoInputSourceAtom = atomWithStorage<VideoInputSource>(
  'reelvan:input-source',
  'file',
  undefined,
  { getOnInit: true }
)

// ==================== Processing Options Atoms ====================

/**
 * Persistent atom for watermark removal option
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const removeWatermarkAtom = atomWithStorage<boolean>(
  'reelvan:remove-watermark',
  false,
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for quality enhancement option
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const enhanceQualityAtom = atomWithStorage<boolean>(
  'reelvan:enhance-quality',
  false,
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for target resolution
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const targetResolutionAtom = atomWithStorage<TargetResolution>(
  'reelvan:target-resolution',
  undefined,
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for target FPS
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const targetFpsAtom = atomWithStorage<TargetFps>(
  'reelvan:target-fps',
  undefined,
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for custom watermark addition option
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const addCustomWatermarkAtom = atomWithStorage<boolean>(
  'reelvan:add-custom-watermark',
  false,
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for AI caption generation option
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const generateCaptionsAtom = atomWithStorage<boolean>(
  'reelvan:generate-captions',
  false,
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for selected platforms for captions
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const selectedPlatformsAtom = atomWithStorage<string[]>(
  'reelvan:selected-platforms',
  [],
  undefined,
  { getOnInit: true }
)

/**
 * Persistent atom for caption tone
 * getOnInit: true - Eagerly read from localStorage on initialization to prevent flash
 */
export const captionToneAtom = atomWithStorage<CaptionTone>(
  'reelvan:caption-tone',
  'professional',
  undefined,
  { getOnInit: true }
)
