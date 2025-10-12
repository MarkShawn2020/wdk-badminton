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
  params: { videoId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Processing Video | ReelVan',
    description: 'Your video is being processed. Watch the progress in real-time.',
  }
}

export default async function JobPage({ params }: Props) {
  const supabase = await createServerClient()

  // Authenticate
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/jobs/' + params.videoId)
  }

  // Fetch video and pipeline steps
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.videoId)
    .eq('user_id', user.id)
    .single()

  if (videoError || !video) {
    notFound()
  }

  const { data: steps } = await supabase
    .from('processing_pipeline')
    .select('*')
    .eq('video_id', params.videoId)
    .order('step_order', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <JobStatusClient videoId={params.videoId} initialVideo={video} initialSteps={steps || []} />
    </div>
  )
}
