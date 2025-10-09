'use client'

/**
 * Share to Discover Dialog
 *
 * Allows users to share their processed videos to the community showcase
 * Features:
 * - Optional title and description
 * - Username visibility toggle
 * - Credit reward notification
 */

import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/components/ui/dialog'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { Textarea } from '@/components/components/ui/textarea'
import { Checkbox } from '@/components/components/ui/checkbox'
import { Badge } from '@/components/components/ui/badge'
import { Sparkles, Globe, User } from 'lucide-react'

interface ShareToDiscoverDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoId: string
  onShare: (data: ShareToDiscoverData) => Promise<void>
}

export interface ShareToDiscoverData {
  videoId: string
  showcaseTitle?: string
  showcaseDescription?: string
  showUsername: boolean
  features: string[]
  targetPlatform?: string
}

export function ShareToDiscoverDialog({
  open,
  onOpenChange,
  videoId,
  onShare,
}: ShareToDiscoverDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showUsername, setShowUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleShare = async () => {
    setIsSubmitting(true)
    try {
      await onShare({
        videoId,
        showcaseTitle: title.trim() || undefined,
        showcaseDescription: description.trim() || undefined,
        showUsername,
        features: [], // Will be populated from video metadata
      })
      onOpenChange(false)
      // Reset form
      setTitle('')
      setDescription('')
      setShowUsername(false)
    } catch (error) {
      console.error('Failed to share video:', error)
      alert('Failed to share video. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Share to Discover
          </DialogTitle>
          <DialogDescription>
            Share your creation with the community and earn credits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reward Badge */}
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <span className="text-foreground font-semibold">Earn 10 Free Credits</span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Thank you for contributing to the community!
            </p>
          </div>

          {/* Title (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="title"
              placeholder="Give your video a creative title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-muted-foreground text-xs">{title.length}/100 characters</p>
          </div>

          {/* Description (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Tell others about your video (e.g., original prompt, inspiration, tools used)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-muted-foreground text-xs">{description.length}/500 characters</p>
          </div>

          {/* Privacy Options */}
          <div className="space-y-3 rounded-lg border p-4">
            <Label className="text-base">Privacy Settings</Label>

            <div className="flex items-start gap-3">
              <Checkbox
                id="show-username"
                checked={showUsername}
                onCheckedChange={(checked) => setShowUsername(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="show-username"
                  className="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Show my username
                  </div>
                </label>
                <p className="text-muted-foreground text-xs">
                  Others will see your username. If unchecked, video will be shown as "Anonymous"
                </p>
              </div>
            </div>

            <div className="bg-secondary rounded-md p-3">
              <p className="text-muted-foreground text-xs">
                <strong>Note:</strong> Your video will be reviewed before appearing in Discover.
                We'll notify you once it's approved (usually within 24 hours).
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Skip
          </Button>
          <Button onClick={handleShare} disabled={isSubmitting}>
            {isSubmitting ? 'Sharing...' : 'Share & Earn Credits'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
