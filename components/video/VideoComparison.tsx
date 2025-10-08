'use client'

/**
 * Video comparison component with synchronized playback
 *
 * Features:
 * - Side-by-side video display
 * - Synchronized playback controls
 * - Draggable timeline for both videos
 * - Play/pause, volume controls
 * - Toggle between split and overlay views
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { Button } from '@/components/components/ui/button'
import { Slider } from '@/components/components/ui/slider'

interface VideoComparisonProps {
  originalUrl: string
  processedUrl: string
  originalLabel?: string
  processedLabel?: string
}

export function VideoComparison({
  originalUrl,
  processedUrl,
  originalLabel = 'Original',
  processedLabel = 'Processed',
}: VideoComparisonProps) {
  const originalRef = useRef<HTMLVideoElement>(null)
  const processedRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)

  /**
   * Initialize videos when both are loaded
   */
  useEffect(() => {
    const original = originalRef.current
    const processed = processedRef.current

    if (!original || !processed) return

    const handleLoadedMetadata = () => {
      // Use the longer duration
      const maxDuration = Math.max(original.duration, processed.duration)
      setDuration(maxDuration)
      setIsReady(true)
    }

    // Wait for both videos to load
    if (original.readyState >= 2 && processed.readyState >= 2) {
      handleLoadedMetadata()
    } else {
      original.addEventListener('loadedmetadata', handleLoadedMetadata)
      processed.addEventListener('loadedmetadata', handleLoadedMetadata)
    }

    return () => {
      original.removeEventListener('loadedmetadata', handleLoadedMetadata)
      processed.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [originalUrl, processedUrl])

  /**
   * Synchronize time updates
   */
  const handleTimeUpdate = useCallback(() => {
    const original = originalRef.current
    if (original) {
      setCurrentTime(original.currentTime)
    }
  }, [])

  /**
   * Play both videos
   */
  const handlePlay = useCallback(async () => {
    const original = originalRef.current
    const processed = processedRef.current

    if (!original || !processed) return

    try {
      await Promise.all([original.play(), processed.play()])
      setIsPlaying(true)
    } catch (error) {
      console.error('Failed to play videos:', error)
    }
  }, [])

  /**
   * Pause both videos
   */
  const handlePause = useCallback(() => {
    const original = originalRef.current
    const processed = processedRef.current

    if (original) original.pause()
    if (processed) processed.pause()

    setIsPlaying(false)
  }, [])

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }, [isPlaying, handlePlay, handlePause])

  /**
   * Seek to specific time
   */
  const handleSeek = useCallback((newTime: number) => {
    const original = originalRef.current
    const processed = processedRef.current

    if (original) original.currentTime = newTime
    if (processed) processed.currentTime = newTime

    setCurrentTime(newTime)
  }, [])

  /**
   * Handle timeline drag
   */
  const handleTimelineChange = useCallback(
    (values: number[]) => {
      handleSeek(values[0])
    },
    [handleSeek]
  )

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    const original = originalRef.current
    const processed = processedRef.current

    const newMuted = !isMuted

    if (original) original.muted = newMuted
    if (processed) processed.muted = newMuted

    setIsMuted(newMuted)
  }, [isMuted])

  /**
   * Change volume
   */
  const handleVolumeChange = useCallback((values: number[]) => {
    const newVolume = values[0]
    const original = originalRef.current
    const processed = processedRef.current

    if (original) original.volume = newVolume
    if (processed) processed.volume = newVolume

    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }, [])

  /**
   * Format time as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Enter fullscreen
   */
  const handleFullscreen = useCallback(() => {
    const container = document.getElementById('video-comparison-container')
    if (container?.requestFullscreen) {
      container.requestFullscreen()
    }
  }, [])

  return (
    <div id="video-comparison-container" className="w-full space-y-4">
      {/* Video Players */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Original Video */}
        <div className="relative overflow-hidden rounded-lg bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={originalRef}
            src={originalUrl}
            className="h-full w-full"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            muted={isMuted}
          />
          <div className="absolute top-4 left-4 rounded bg-black/70 px-3 py-1 text-sm font-semibold text-white">
            {originalLabel}
          </div>
        </div>

        {/* Processed Video */}
        <div className="relative overflow-hidden rounded-lg bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={processedRef}
            src={processedUrl}
            className="h-full w-full"
            playsInline
            muted={isMuted}
          />
          <div className="bg-primary/90 absolute top-4 left-4 rounded px-3 py-1 text-sm font-semibold text-white">
            {processedLabel}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        {/* Timeline */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleTimelineChange}
            disabled={!isReady}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <Button
            onClick={togglePlay}
            disabled={!isReady}
            size="sm"
            variant="outline"
            className="h-10 w-10 p-0"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button onClick={toggleMute} size="sm" variant="ghost" className="h-8 w-8 p-0">
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Fullscreen */}
          <Button onClick={handleFullscreen} size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
