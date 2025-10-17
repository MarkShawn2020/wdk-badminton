'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Button } from '@/components/components/ui/button'
import { Separator } from '@/components/components/ui/separator'
import { VideoUploader } from '@/components/video/VideoUploader'
import { ProcessingOptionsCompact } from '@/components/video/ProcessingOptionsCompact'
import { calculateCreditsRequired, formatCredits } from '@/lib/video/cost'
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/components/ui/alert'

/**
 * Upload Page - New video upload and processing configuration
 *
 * Features:
 * - Video upload with drag-and-drop
 * - Enhancement options selection
 * - Real-time cost estimation
 * - Processing initiation
 * - Redirect to dashboard on success
 */

interface VideoFile {
  file?: File
  duration: number
  size: number
  url: string
  sourceType: 'file' | 'url'
  filename?: string
}

interface ProcessingOptions {
  removeWatermark: boolean
  enhanceQuality: boolean
  targetResolution?: '720p' | '1080p' | '4k'
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5'
  addBranding?: boolean
}

const DEFAULT_OPTIONS: ProcessingOptions = {
  removeWatermark: true,
  enhanceQuality: true,
  targetResolution: '1080p',
}

export default function UploadPage() {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [options, setOptions] = useState<ProcessingOptions>(DEFAULT_OPTIONS)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate estimated cost
  const estimatedCost = selectedVideo ? calculateCreditsRequired(selectedVideo.duration) : 0

  const estimatedTime = selectedVideo ? Math.ceil(selectedVideo.duration / 10) * 2 : 0 // ~2 min per 10s

  const handleProcess = async () => {
    if (!selectedVideo) return

    setIsProcessing(true)
    setError(null)

    try {
      // TODO: Implement actual upload and processing logic
      // 1. Upload video to Supabase Storage
      // 2. Create video record in database
      // 3. Trigger processing job
      // 4. Redirect to dashboard

      // Mock processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to dashboard
      router.push('/workspace/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video')
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Video</h1>
        <p className="text-muted-foreground">
          Transform your AI-generated videos with professional enhancements
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select Video</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoUploader
            onVideoSelected={setSelectedVideo}
            onVideoRemoved={() => setSelectedVideo(null)}
          />
        </CardContent>
      </Card>

      {/* Enhancement Options */}
      {selectedVideo && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                2. Choose Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingOptionsCompact
                value={options}
                onChange={setOptions}
                disabled={isProcessing}
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Cost Estimation & Process Button */}
          <Card className="border-primary/50 from-primary/5 bg-gradient-to-br to-transparent">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Estimation Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-background rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-sm">Estimated Cost</p>
                    <p className="text-2xl font-bold">{formatCredits(estimatedCost)}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      ≈ ${(estimatedCost * 0.01).toFixed(2)} USD
                    </p>
                  </div>
                  <div className="bg-background rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-sm">Processing Time</p>
                    <p className="text-2xl font-bold">~{estimatedTime} min</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {Math.round(selectedVideo.duration)}s video
                    </p>
                  </div>
                </div>

                {/* Selected Options Summary */}
                <div className="bg-background rounded-lg border p-4">
                  <p className="mb-3 text-sm font-medium">Selected Enhancements:</p>
                  <div className="flex flex-wrap gap-2">
                    {options.removeWatermark && (
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        Watermark Removal
                      </span>
                    )}
                    {options.enhanceQuality && (
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        Quality Enhancement ({options.targetResolution})
                      </span>
                    )}
                    {options.aspectRatio && (
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        Aspect Ratio: {options.aspectRatio}
                      </span>
                    )}
                    {options.addBranding && (
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        Custom Branding
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Process Button */}
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleProcess}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Process Video
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-muted-foreground text-center text-xs">
                  You will be notified when processing is complete
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State Tips */}
      {!selectedVideo && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-3 font-semibold">💡 Tips for Best Results</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Use high-quality source videos for better enhancement results</li>
              <li>• MP4 format recommended for fastest processing</li>
              <li>• Keep videos under 2 minutes for optimal turnaround time</li>
              <li>• Watermark removal works best with centered/corner watermarks</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
