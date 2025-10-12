export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      coupon_redemptions: {
        Row: {
          coupon_id: string
          credits_received: number
          id: string
          ip_address: string | null
          redeemed_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          credits_received: number
          id?: string
          ip_address?: string | null
          redeemed_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          credits_received?: number
          id?: string
          ip_address?: string | null
          redeemed_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'coupon_redemptions_coupon_id_fkey'
            columns: ['coupon_id']
            isOneToOne: false
            referencedRelation: 'coupons'
            referencedColumns: ['id']
          },
        ]
      }
      processing_pipeline: {
        Row: {
          id: string
          video_id: string
          step_order: number
          step_type: string
          step_name: string
          status: string
          progress: number | null
          provider: string
          external_job_id: string | null
          input_video_url: string
          output_video_url: string | null
          estimated_cost_credits: number
          actual_cost_credits: number | null
          api_cost_usd: number | null
          error_message: string | null
          retry_count: number
          max_retries: number
          config: Json | null
          created_at: string | null
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          video_id: string
          step_order: number
          step_type: string
          step_name: string
          status?: string
          progress?: number | null
          provider: string
          external_job_id?: string | null
          input_video_url: string
          output_video_url?: string | null
          estimated_cost_credits: number
          actual_cost_credits?: number | null
          api_cost_usd?: number | null
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          config?: Json | null
          created_at?: string | null
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          video_id?: string
          step_order?: number
          step_type?: string
          step_name?: string
          status?: string
          progress?: number | null
          provider?: string
          external_job_id?: string | null
          input_video_url?: string
          output_video_url?: string | null
          estimated_cost_credits?: number
          actual_cost_credits?: number | null
          api_cost_usd?: number | null
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          config?: Json | null
          created_at?: string | null
          started_at?: string | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'processing_pipeline_video_id_fkey'
            columns: ['video_id']
            isOneToOne: false
            referencedRelation: 'videos'
            referencedColumns: ['id']
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          credits_amount: number
          current_uses: number
          description: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          max_uses_per_user: number
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          credits_amount: number
          current_uses?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_user?: number
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          credits_amount?: number
          current_uses?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_user?: number
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          stripe_payment_id: string | null
          stripe_session_id: string | null
          type: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          type: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          type?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'credit_transactions_video_id_fkey'
            columns: ['video_id']
            isOneToOne: false
            referencedRelation: 'videos'
            referencedColumns: ['id']
          },
        ]
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string | null
          tier: string
          total_earned: number
          total_spent: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          tier?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          tier?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      video_showcase: {
        Row: {
          after_url: string | null
          approved: boolean | null
          before_url: string | null
          created_at: string | null
          featured: boolean | null
          features_used: Json | null
          id: string
          is_public: boolean | null
          like_count: number | null
          original_prompt: string | null
          report_count: number | null
          reported: boolean | null
          reward_amount: number | null
          reward_claimed: boolean | null
          share_count: number | null
          show_username: boolean | null
          showcase_description: string | null
          showcase_title: string | null
          social_url: string | null
          target_platform: string | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string
          video_id: string
          view_count: number | null
        }
        Insert: {
          after_url?: string | null
          approved?: boolean | null
          before_url?: string | null
          created_at?: string | null
          featured?: boolean | null
          features_used?: Json | null
          id?: string
          is_public?: boolean | null
          like_count?: number | null
          original_prompt?: string | null
          report_count?: number | null
          reported?: boolean | null
          reward_amount?: number | null
          reward_claimed?: boolean | null
          share_count?: number | null
          show_username?: boolean | null
          showcase_description?: string | null
          showcase_title?: string | null
          social_url?: string | null
          target_platform?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id: string
          video_id: string
          view_count?: number | null
        }
        Update: {
          after_url?: string | null
          approved?: boolean | null
          before_url?: string | null
          created_at?: string | null
          featured?: boolean | null
          features_used?: Json | null
          id?: string
          is_public?: boolean | null
          like_count?: number | null
          original_prompt?: string | null
          report_count?: number | null
          reported?: boolean | null
          reward_amount?: number | null
          reward_claimed?: boolean | null
          share_count?: number | null
          show_username?: boolean | null
          showcase_description?: string | null
          showcase_title?: string | null
          social_url?: string | null
          target_platform?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string
          video_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'video_showcase_video_id_fkey'
            columns: ['video_id']
            isOneToOne: true
            referencedRelation: 'videos'
            referencedColumns: ['id']
          },
        ]
      }
      video_showcase_likes: {
        Row: {
          created_at: string | null
          id: string
          showcase_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          showcase_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          showcase_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'video_showcase_likes_showcase_id_fkey'
            columns: ['showcase_id']
            isOneToOne: false
            referencedRelation: 'video_showcase'
            referencedColumns: ['id']
          },
        ]
      }
      videos: {
        Row: {
          actual_cost_credits: number | null
          api_cost_usd: number | null
          completed_at: string | null
          created_at: string | null
          current_pipeline_step: number | null
          duration_seconds: number
          enhance_quality: boolean | null
          error_message: string | null
          estimated_cost_credits: number
          external_job_id: string | null
          external_provider: string | null
          file_size_bytes: number
          id: string
          mime_type: string
          original_filename: string
          original_storage_path: string | null
          original_url: string | null
          pipeline_enabled: boolean | null
          processed_storage_path: string | null
          processed_url: string | null
          progress: number | null
          remove_watermark: boolean | null
          started_processing_at: string | null
          status: string
          target_aspect_ratio: string | null
          target_resolution: string | null
          total_pipeline_steps: number | null
          user_id: string
          video_hash: string | null
        }
        Insert: {
          actual_cost_credits?: number | null
          api_cost_usd?: number | null
          completed_at?: string | null
          created_at?: string | null
          current_pipeline_step?: number | null
          duration_seconds: number
          enhance_quality?: boolean | null
          error_message?: string | null
          estimated_cost_credits: number
          external_job_id?: string | null
          external_provider?: string | null
          file_size_bytes: number
          id?: string
          mime_type: string
          original_filename: string
          original_storage_path?: string | null
          original_url?: string | null
          pipeline_enabled?: boolean | null
          processed_storage_path?: string | null
          processed_url?: string | null
          progress?: number | null
          remove_watermark?: boolean | null
          started_processing_at?: string | null
          status?: string
          target_aspect_ratio?: string | null
          target_resolution?: string | null
          total_pipeline_steps?: number | null
          user_id: string
          video_hash?: string | null
        }
        Update: {
          actual_cost_credits?: number | null
          api_cost_usd?: number | null
          completed_at?: string | null
          created_at?: string | null
          current_pipeline_step?: number | null
          duration_seconds?: number
          enhance_quality?: boolean | null
          error_message?: string | null
          estimated_cost_credits?: number
          external_job_id?: string | null
          external_provider?: string | null
          file_size_bytes?: number
          id?: string
          mime_type?: string
          original_filename?: string
          original_storage_path?: string | null
          original_url?: string | null
          pipeline_enabled?: boolean | null
          processed_storage_path?: string | null
          processed_url?: string | null
          progress?: number | null
          remove_watermark?: boolean | null
          started_processing_at?: string | null
          status?: string
          target_aspect_ratio?: string | null
          target_resolution?: string | null
          total_pipeline_steps?: number | null
          user_id?: string
          video_hash?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          p_amount: number
          p_stripe_payment_id?: string
          p_stripe_session_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      create_coupon: {
        Args: {
          p_code: string
          p_created_by?: string
          p_credits_amount: number
          p_description?: string
          p_max_uses?: number
          p_max_uses_per_user?: number
          p_valid_from?: string
          p_valid_until?: string
        }
        Returns: string
      }
      deduct_credits: {
        Args: { p_amount: number; p_user_id: string; p_video_id: string }
        Returns: boolean
      }
      get_next_pipeline_step: {
        Args: { p_video_id: string }
        Returns: Tables<'processing_pipeline'>
      }
      get_pipeline_progress: {
        Args: { p_video_id: string }
        Returns: number
      }
      increment_showcase_views: {
        Args: { showcase_uuid: string }
        Returns: undefined
      }
      is_pipeline_completed: {
        Args: { p_video_id: string }
        Returns: boolean
      }
      redeem_coupon: {
        Args: {
          p_code: string
          p_ip_address?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: {
          credits_received: number
          message: string
          new_balance: number
          success: boolean
        }[]
      }
      refund_credits: {
        Args: { p_amount: number; p_user_id: string; p_video_id: string }
        Returns: boolean
      }
      toggle_showcase_like: {
        Args: { showcase_uuid: string; user_uuid: string }
        Returns: boolean
      }
      update_video_progress: {
        Args: { p_progress?: number; p_status: string; p_video_id: string }
        Returns: boolean
      }
      validate_coupon: {
        Args: { p_code: string; p_user_id: string }
        Returns: {
          coupon_id: string
          credits_amount: number
          reason: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
