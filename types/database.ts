/**
 * Database types generated from Supabase schema
 *
 * To regenerate after schema changes:
 * pnpm supabase gen types typescript --local > types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string
          user_id: string
          original_filename: string
          original_url: string | null
          original_storage_path: string | null
          duration_seconds: number
          file_size_bytes: number
          mime_type: string
          video_hash: string | null
          remove_watermark: boolean
          target_resolution: '1080p' | '1440p' | '4K' | null
          target_aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5' | null
          enhance_quality: boolean
          status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'
          progress: number
          error_message: string | null
          processed_url: string | null
          processed_storage_path: string | null
          estimated_cost_credits: number
          actual_cost_credits: number | null
          api_cost_usd: number | null
          external_job_id: string | null
          external_provider: string | null
          created_at: string
          started_processing_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          original_filename: string
          original_url?: string | null
          original_storage_path?: string | null
          duration_seconds: number
          file_size_bytes: number
          mime_type: string
          video_hash?: string | null
          remove_watermark?: boolean
          target_resolution?: '1080p' | '1440p' | '4K' | null
          target_aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:5' | null
          enhance_quality?: boolean
          status?: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'
          progress?: number
          error_message?: string | null
          processed_url?: string | null
          processed_storage_path?: string | null
          estimated_cost_credits: number
          actual_cost_credits?: number | null
          api_cost_usd?: number | null
          external_job_id?: string | null
          external_provider?: string | null
          created_at?: string
          started_processing_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          original_filename?: string
          original_url?: string | null
          original_storage_path?: string | null
          duration_seconds?: number
          file_size_bytes?: number
          mime_type?: string
          video_hash?: string | null
          remove_watermark?: boolean
          target_resolution?: '1080p' | '1440p' | '4K' | null
          target_aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:5' | null
          enhance_quality?: boolean
          status?: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'
          progress?: number
          error_message?: string | null
          processed_url?: string | null
          processed_storage_path?: string | null
          estimated_cost_credits?: number
          actual_cost_credits?: number | null
          api_cost_usd?: number | null
          external_job_id?: string | null
          external_provider?: string | null
          created_at?: string
          started_processing_at?: string | null
          completed_at?: string | null
        }
      }
      user_credits: {
        Row: {
          user_id: string
          balance: number
          total_earned: number
          total_spent: number
          tier: 'free' | 'paid' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          balance?: number
          total_earned?: number
          total_spent?: number
          tier?: 'free' | 'paid' | 'pro'
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          balance?: number
          total_earned?: number
          total_spent?: number
          tier?: 'free' | 'paid' | 'pro'
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          video_id: string | null
          type:
            | 'purchase'
            | 'signup_bonus'
            | 'refund'
            | 'processing_debit'
            | 'admin_adjustment'
            | 'coupon_redemption'
          amount: number
          balance_after: number
          stripe_payment_id: string | null
          stripe_session_id: string | null
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id?: string | null
          type:
            | 'purchase'
            | 'signup_bonus'
            | 'refund'
            | 'processing_debit'
            | 'admin_adjustment'
            | 'coupon_redemption'
          amount: number
          balance_after: number
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string | null
          type?:
            | 'purchase'
            | 'signup_bonus'
            | 'refund'
            | 'processing_debit'
            | 'admin_adjustment'
            | 'coupon_redemption'
          amount?: number
          balance_after?: number
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          credits_amount: number
          max_uses: number | null
          current_uses: number
          max_uses_per_user: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          credits_amount: number
          max_uses?: number | null
          current_uses?: number
          max_uses_per_user?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          credits_amount?: number
          max_uses?: number | null
          current_uses?: number
          max_uses_per_user?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coupon_redemptions: {
        Row: {
          id: string
          coupon_id: string
          user_id: string
          credits_received: number
          redeemed_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id: string
          credits_received: number
          redeemed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string
          credits_received?: number
          redeemed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Functions: {
      deduct_credits: {
        Args: {
          p_user_id: string
          p_video_id: string
          p_amount: number
        }
        Returns: boolean
      }
      refund_credits: {
        Args: {
          p_user_id: string
          p_video_id: string
          p_amount: number
        }
        Returns: boolean
      }
      add_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_stripe_payment_id?: string
          p_stripe_session_id?: string
        }
        Returns: boolean
      }
      update_video_progress: {
        Args: {
          p_video_id: string
          p_status: string
          p_progress?: number
        }
        Returns: boolean
      }
      validate_coupon: {
        Args: {
          p_code: string
          p_user_id: string
        }
        Returns: {
          valid: boolean
          reason: string
          coupon_id: string | null
          credits_amount: number
        }[]
      }
      redeem_coupon: {
        Args: {
          p_code: string
          p_user_id: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: {
          success: boolean
          message: string
          credits_received: number
          new_balance: number | null
        }[]
      }
      create_coupon: {
        Args: {
          p_code: string
          p_credits_amount: number
          p_description?: string
          p_max_uses?: number
          p_max_uses_per_user?: number
          p_valid_from?: string
          p_valid_until?: string
          p_created_by?: string
        }
        Returns: string
      }
    }
  }
}
