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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          access_notes: string | null
          address_line: string
          created_at: string
          id: string
          label: string
          landmark: string | null
          latitude: number | null
          longitude: number | null
          parking_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_notes?: string | null
          address_line: string
          created_at?: string
          id?: string
          label?: string
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          parking_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_notes?: string | null
          address_line?: string
          created_at?: string
          id?: string
          label?: string
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          parking_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          color: string | null
          created_at: string
          id: string
          license_plate: string
          make: string
          model: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          license_plate: string
          make: string
          model: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          license_plate?: string
          make?: string
          model?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      disputes: {
        Row: {
          created_at: string
          description: string
          id: string
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
          wash_job_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          wash_job_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          wash_job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_wash_job_id_fkey"
            columns: ["wash_job_id"]
            isOneToOne: false
            referencedRelation: "wash_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string
          estimated_cars: number | null
          id: string
          route_date: string
          route_name: string | null
          updated_at: string
          washer_id: string | null
        }
        Insert: {
          created_at?: string
          estimated_cars?: number | null
          id?: string
          route_date?: string
          route_name?: string | null
          updated_at?: string
          washer_id?: string | null
        }
        Update: {
          created_at?: string
          estimated_cars?: number | null
          id?: string
          route_date?: string
          route_name?: string | null
          updated_at?: string
          washer_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          address_id: string | null
          auto_renew: boolean
          car_id: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          plan: Database["public"]["Enums"]["subscription_plan"]
          price_per_month: number
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          auto_renew?: boolean
          car_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          plan: Database["public"]["Enums"]["subscription_plan"]
          price_per_month: number
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          auto_renew?: boolean
          car_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price_per_month?: number
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wash_jobs: {
        Row: {
          address_id: string | null
          after_photo_url: string | null
          before_photo_url: string | null
          car_id: string
          completed_at: string | null
          created_at: string
          gps_latitude: number | null
          gps_longitude: number | null
          gps_verified: boolean | null
          id: string
          missed_reason: Database["public"]["Enums"]["missed_reason"] | null
          notes: string | null
          route_id: string | null
          scheduled_date: string
          sequence_order: number | null
          status: Database["public"]["Enums"]["wash_status"]
          subscription_id: string
          updated_at: string
          washer_id: string | null
        }
        Insert: {
          address_id?: string | null
          after_photo_url?: string | null
          before_photo_url?: string | null
          car_id: string
          completed_at?: string | null
          created_at?: string
          gps_latitude?: number | null
          gps_longitude?: number | null
          gps_verified?: boolean | null
          id?: string
          missed_reason?: Database["public"]["Enums"]["missed_reason"] | null
          notes?: string | null
          route_id?: string | null
          scheduled_date?: string
          sequence_order?: number | null
          status?: Database["public"]["Enums"]["wash_status"]
          subscription_id: string
          updated_at?: string
          washer_id?: string | null
        }
        Update: {
          address_id?: string | null
          after_photo_url?: string | null
          before_photo_url?: string | null
          car_id?: string
          completed_at?: string | null
          created_at?: string
          gps_latitude?: number | null
          gps_longitude?: number | null
          gps_verified?: boolean | null
          id?: string
          missed_reason?: Database["public"]["Enums"]["missed_reason"] | null
          notes?: string | null
          route_id?: string | null
          scheduled_date?: string
          sequence_order?: number | null
          status?: Database["public"]["Enums"]["wash_status"]
          subscription_id?: string
          updated_at?: string
          washer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wash_jobs_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wash_jobs_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wash_jobs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wash_jobs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "washer" | "customer"
      missed_reason:
        | "car_not_available"
        | "access_denied"
        | "weather"
        | "mechanical_issue"
        | "customer_request"
      subscription_plan: "daily" | "weekly_2x" | "weekly_3x"
      wash_status: "pending" | "completed" | "missed" | "skipped"
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
      app_role: ["admin", "washer", "customer"],
      missed_reason: [
        "car_not_available",
        "access_denied",
        "weather",
        "mechanical_issue",
        "customer_request",
      ],
      subscription_plan: ["daily", "weekly_2x", "weekly_3x"],
      wash_status: ["pending", "completed", "missed", "skipped"],
    },
  },
} as const
