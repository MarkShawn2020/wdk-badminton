'use client'

/**
 * Share to Discover Button
 *
 * Client component that shows the share dialog when clicked
 */

import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Globe } from 'lucide-react'
import { ShareToDiscoverDialog, ShareToDiscoverData } from './ShareToDiscoverDialog'

interface ShareToDiscoverButtonProps {
  videoId: string
}

export function ShareToDiscoverButton({ videoId }: ShareToDiscoverButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleShare = async (data: ShareToDiscoverData) => {
    const response = await fetch('/api/showcase/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to share video')
    }

    const result = await response.json()
    alert(result.data.message)
  }

  return (
    <>
      <Button variant="outline" size="lg" onClick={() => setShowDialog(true)} className="gap-2">
        <Globe className="h-5 w-5" />
        Share to Discover
      </Button>

      <ShareToDiscoverDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        videoId={videoId}
        onShare={handleShare}
      />
    </>
  )
}
