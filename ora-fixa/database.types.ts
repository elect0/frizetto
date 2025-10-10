export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_notes: string | null
          created_at: string
          end_time: string | null
          id: number
          reminder_sent_at: string | null
          review_sent_at: string | null
          service_id: number
          start_time: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          client_notes?: string | null
          created_at?: string
          end_time?: string | null
          id?: number
          reminder_sent_at?: string | null
          review_sent_at?: string | null
          service_id: number
          start_time?: string | null
          status?: string | null
          user_id?: string
        }
        Update: {
          client_notes?: string | null
          created_at?: string
          end_time?: string | null
          id?: number
          reminder_sent_at?: string | null
          review_sent_at?: string | null
          service_id?: number
          start_time?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          favorite_service_id: number | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_banned: boolean | null
          marketing_opt_in: boolean
          notes: string | null
          notify_email_confirmation: boolean
          notify_sms_reminder: boolean
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          favorite_service_id?: number | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_banned?: boolean | null
          marketing_opt_in?: boolean
          notes?: string | null
          notify_email_confirmation?: boolean
          notify_sms_reminder?: boolean
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          favorite_service_id?: number | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_banned?: boolean | null
          marketing_opt_in?: boolean
          notes?: string | null
          notify_email_confirmation?: boolean
          notify_sms_reminder?: boolean
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_favorite_service_id_fkey"
            columns: ["favorite_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: number | null
          content: string | null
          created_at: string
          id: number
          mood: Database["public"]["Enums"]["mood_enum"]
          user_id: string | null
        }
        Insert: {
          appointment_id?: number | null
          content?: string | null
          created_at?: string
          id?: number
          mood: Database["public"]["Enums"]["mood_enum"]
          user_id?: string | null
        }
        Update: {
          appointment_id?: number | null
          content?: string | null
          created_at?: string
          id?: number
          mood?: Database["public"]["Enums"]["mood_enum"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_overrides: {
        Row: {
          date: string
          end_time: string
          id: number
          is_active: boolean
          start_time: string
        }
        Insert: {
          date: string
          end_time: string
          id?: number
          is_active?: boolean
          start_time: string
        }
        Update: {
          date?: string
          end_time?: string
          id?: number
          is_active?: boolean
          start_time?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: number
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: number
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      work_schedules: {
        Row: {
          day_of_week: number | null
          end_time: string | null
          id: number
          is_active: boolean | null
          start_time: string | null
        }
        Insert: {
          day_of_week?: number | null
          end_time?: string | null
          id?: number
          is_active?: boolean | null
          start_time?: string | null
        }
        Update: {
          day_of_week?: number | null
          end_time?: string | null
          id?: number
          is_active?: boolean | null
          start_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_appointment: {
        Args: { new_appointment_time: string; user_id_to_check: string }
        Returns: boolean
      }
      get_available_slots: {
        Args: { p_date: string; p_duration_minutes: number; p_timezone: string }
        Returns: {
          available_slot: string
        }[]
      }
      get_client_stats: {
        Args: { p_user_id: string }
        Returns: {
          noshow_count: number
          total_spent: number
          total_visits: number
        }[]
      }
      get_clients_count: {
        Args: { p_search_term: string }
        Returns: number
      }
      get_clients_with_stats: {
        Args: {
          p_page_number: number
          p_page_size: number
          p_search_term: string
          p_sort_column: string
          p_sort_order: string
        }
        Returns: {
          client_notes: string
          created_at: string
          email: string
          full_name: string
          id: string
          is_banned: boolean
          last_visit: string
          noshow_count: number
          phone: string
          status: string
          total_spent: number
          total_visits: number
        }[]
      }
      get_dashboard_stats: {
        Args: { p_date: string }
        Returns: {
          new_clients_change_pct: string
          new_clients_count: number
          noshow_change_pct: string
          noshow_count: number
          revenue_change_pct: string
          total_revenue: number
        }[]
      }
      get_service_popularity: {
        Args: Record<PropertyKey, never>
        Returns: {
          bookings_this_month: number
          service_description: string
          service_duration_minutes: number
          service_id: number
          service_name: string
          service_price: number
        }[]
      }
      get_user_stats: {
        Args: { p_user_id: string }
        Returns: {
          total_spent: number
          total_visits: number
        }[]
      }
      get_weekly_revenue: {
        Args: Record<PropertyKey, never>
        Returns: {
          date: string
          lei: number
        }[]
      }
    }
    Enums: {
      mood_enum: "angry" | "frown" | "meh" | "smile" | "laugh"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mood_enum: ["angry", "frown", "meh", "smile", "laugh"],
    },
  },
} as const
