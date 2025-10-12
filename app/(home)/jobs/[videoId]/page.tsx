/**
 * Video Processing Job Status Page
 *
 * Server Component that fetches initial job data
 * Renders client component for real-time polling
 */

import { createServerClient } from '@/lib/supabase/server'
import { JobStatusClient } from './JobStatusClient'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ videoId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params
  return {
    title: 'Processing Video | ReelVan',
    description: 'Your video is being processed. Watch the progress in real-time.',
  }
}

export default async function JobPage({ params }: Props) {
  const { videoId } = await params
  const supabase = await createServerClient()

  // Authenticate
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/jobs/' + videoId)
  }

  // Fetch video and pipeline steps
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  if (videoError || !video) {
    notFound()
  }

  const { data: steps } = await supabase
    .from('processing_pipeline')
    .select('*')
    .eq('video_id', videoId)
    .order('step_order', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <JobStatusClient videoId={videoId} initialVideo={video} initialSteps={steps || []} />
    </div>
  )
}
