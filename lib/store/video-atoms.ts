/**
 * Jotai atoms for video state management
 *
 * Provides persistent state for video URL input
 */

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

/**
 * Video input source type
 */
export type VideoInputSource = 'file' | 'url'

/**
 * Persistent atom for video URL input
 */
export const videoUrlAtom = atomWithStorage<string>('reelvan:video-url', '')

/**
 * Atom for input source selection
 */
export const videoInputSourceAtom = atom<VideoInputSource>('file')
