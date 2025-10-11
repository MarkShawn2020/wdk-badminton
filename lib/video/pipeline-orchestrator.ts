/**
 * Processing Pipeline Orchestrator
 *
 * Manages multi-step video processing workflows:
 * 1. Remove watermark (WaveSpeed)
 * 2. Enhance quality (Replicate Topaz Labs)
 * 3. ...future steps
 *
 * Key features:
 * - Serial execution: Step 2 starts only after Step 1 completes
 * - State management: Track each step's progress
 * - Error handling: Refund credits on failure
 * - Cost calculation: Sum of all steps
 */

import { createServiceClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'
import { calculateCreditsRequired as calculateWatermarkCost } from '@/lib/video/cost'
import { estimateReplicateCost } from '@/lib/video-api/replicate'

type ProcessingPipeline = Database['public']['Tables']['processing_pipeline']['Row']
type ProcessingPipelineInsert = Database['public']['Tables']['processing_pipeline']['Insert']

// ============================================================================
// Pipeline Step Definitions
// ============================================================================

export type StepType = 'remove_watermark' | 'enhance_quality'

export interface PipelineStep {
  stepType: StepType
  stepName: string
  provider: 'wavespeed' | 'replicate'
  estimatedCostCredits: number
  config?: {
    targetResolution?: '720p' | '1080p' | '4k'
    targetFps?: number
  }
}

export interface ProcessingOptions {
  removeWatermark: boolean
  enhanceQuality: boolean
  targetResolution?: '720p' | '1080p' | '4k' // Aligned with Replicate API
  targetFps?: number // 15-60 FPS range
}

// ============================================================================
// Pipeline Builder
// ============================================================================

/**
 * Build processing pipeline based on user options
 *
 * @param options - User-selected processing options
 * @param videoUrl - Input video URL
 * @param durationSeconds - Video duration for cost calculation
 * @returns Array of pipeline steps
 */
export function buildPipeline(
  options: ProcessingOptions,
  videoUrl: string,
  durationSeconds: number
): PipelineStep[] {
  const steps: PipelineStep[] = []

  // Step 1: Remove watermark (if enabled)
  if (options.removeWatermark) {
    steps.push({
      stepType: 'remove_watermark',
      stepName: 'Remove Watermark',
      provider: 'wavespeed',
      estimatedCostCredits: calculateWatermarkCost(durationSeconds),
    })
  }

  // Step 2: Enhance quality (if enabled)
  if (options.enhanceQuality) {
    // Use the resolution directly as it's already in Replicate format
    const replicateResolution = options.targetResolution || '1080p'
    const replicateFps = options.targetFps || 60 // Default to 60 FPS

    const replicateCostUsd = estimateReplicateCost(durationSeconds, replicateResolution)
    const replicateCostCredits = Math.ceil(replicateCostUsd * 100) // USD to credits

    steps.push({
      stepType: 'enhance_quality',
      stepName: `Enhance Quality (${replicateResolution.toUpperCase()})`, // Display as uppercase
      provider: 'replicate',
      estimatedCostCredits: replicateCostCredits,
      config: {
        targetResolution: replicateResolution,
        targetFps: replicateFps,
      },
    })
  }

  return steps
}

/**
 * Calculate total cost of all pipeline steps
 */
export function calculatePipelineCost(steps: PipelineStep[]): number {
  return steps.reduce((total, step) => total + step.estimatedCostCredits, 0)
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Create pipeline steps in database
 *
 * @param videoId - Video ID
 * @param steps - Pipeline steps to create
 * @param inputVideoUrl - Initial video URL
 * @returns Created pipeline steps
 */
export async function createPipelineSteps(
  videoId: string,
  steps: PipelineStep[],
  inputVideoUrl: string
): Promise<ProcessingPipeline[]> {
  const supabase = createServiceClient()

  const pipelineInserts: ProcessingPipelineInsert[] = steps.map((step, index) => ({
    video_id: videoId,
    step_order: index + 1,
    step_type: step.stepType,
    step_name: step.stepName,
    provider: step.provider,
    status: 'pending',
    progress: 0,
    // First step uses input video, subsequent steps will use previous step's output
    input_video_url: index === 0 ? inputVideoUrl : '',
    estimated_cost_credits: step.estimatedCostCredits,
  }))

  const { data, error } = await supabase
    .from('processing_pipeline')
    .insert(pipelineInserts as never[])
    .select()

  if (error) {
    throw new Error(`Failed to create pipeline steps: ${error.message}`)
  }

  return data as ProcessingPipeline[]
}

/**
 * Get next pending step in pipeline
 */
export async function getNextPipelineStep(videoId: string): Promise<ProcessingPipeline | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('processing_pipeline')
    .select('*')
    .eq('video_id', videoId)
    .eq('status', 'pending')
    .order('step_order', { ascending: true })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is OK
    throw new Error(`Failed to get next pipeline step: ${error.message}`)
  }

  return data as ProcessingPipeline | null
}

/**
 * Get previous completed step's output URL
 */
export async function getPreviousStepOutput(
  videoId: string,
  currentStepOrder: number
): Promise<string | null> {
  const supabase = createServiceClient()

  const previousStepOrder = currentStepOrder - 1

  if (previousStepOrder < 1) {
    return null // No previous step
  }

  const { data, error } = await supabase
    .from('processing_pipeline')
    .select('output_video_url')
    .eq('video_id', videoId)
    .eq('step_order', previousStepOrder)
    .eq('status', 'completed')
    .single()

  if (error) {
    throw new Error(`Failed to get previous step output: ${error.message}`)
  }

  return data?.output_video_url || null
}

/**
 * Check if all pipeline steps are completed
 */
export async function isPipelineCompleted(videoId: string): Promise<boolean> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('processing_pipeline')
    .select('status')
    .eq('video_id', videoId)
    .in('status', ['pending', 'processing'])

  if (error) {
    throw new Error(`Failed to check pipeline completion: ${error.message}`)
  }

  return data?.length === 0
}

/**
 * Get final output URL from last completed step
 */
export async function getFinalOutputUrl(videoId: string): Promise<string | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('processing_pipeline')
    .select('output_video_url')
    .eq('video_id', videoId)
    .eq('status', 'completed')
    .order('step_order', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get final output URL: ${error.message}`)
  }

  return data?.output_video_url || null
}

/**
 * Calculate overall pipeline progress
 *
 * Formula: (completed_steps / total_steps * 100) + (current_step_progress / total_steps)
 */
export async function calculatePipelineProgress(videoId: string): Promise<number> {
  const supabase = createServiceClient()

  const { data: steps, error } = await supabase
    .from('processing_pipeline')
    .select('status, progress')
    .eq('video_id', videoId)
    .order('step_order')

  if (error) {
    throw new Error(`Failed to calculate pipeline progress: ${error.message}`)
  }

  if (!steps || steps.length === 0) {
    return 0
  }

  const totalSteps = steps.length
  const completedSteps = steps.filter((s) => s.status === 'completed').length
  const currentStep = steps.find((s) => s.status === 'processing')
  const currentStepProgress = currentStep?.progress || 0

  // Overall progress
  const baseProgress = (completedSteps / totalSteps) * 100
  const currentProgress = currentStepProgress / totalSteps

  return Math.min(100, Math.round(baseProgress + currentProgress))
}

// ============================================================================
// Pipeline Summary
// ============================================================================

export interface PipelineSummary {
  totalSteps: number
  completedSteps: number
  currentStep: ProcessingPipeline | null
  overallProgress: number
  estimatedTimeRemaining: number // seconds
}

export async function getPipelineSummary(videoId: string): Promise<PipelineSummary> {
  const supabase = createServiceClient()

  const { data: steps, error } = await supabase
    .from('processing_pipeline')
    .select('*')
    .eq('video_id', videoId)
    .order('step_order')

  if (error) {
    throw new Error(`Failed to get pipeline summary: ${error.message}`)
  }

  const totalSteps = steps?.length || 0
  const completedSteps = steps?.filter((s) => s.status === 'completed').length || 0
  const currentStep = steps?.find((s) => s.status === 'processing') || null

  const overallProgress = await calculatePipelineProgress(videoId)

  // Estimate time remaining (rough estimate: 2 minutes per step)
  const remainingSteps = totalSteps - completedSteps
  const estimatedTimeRemaining = remainingSteps * 120 // 2 minutes per step

  return {
    totalSteps,
    completedSteps,
    currentStep,
    overallProgress,
    estimatedTimeRemaining,
  }
}
