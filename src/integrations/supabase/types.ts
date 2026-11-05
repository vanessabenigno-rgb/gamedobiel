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
      achievements: {
        Row: {
          criteria: string
          description: string
          id: string
          name: string
          unlocked: boolean
          unlocked_at: string | null
        }
        Insert: {
          criteria: string
          description: string
          id?: string
          name: string
          unlocked?: boolean
          unlocked_at?: string | null
        }
        Update: {
          criteria?: string
          description?: string
          id?: string
          name?: string
          unlocked?: boolean
          unlocked_at?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          key: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          id: string
          improve: string | null
          initiatives: string | null
          log_date: string
          mom_note: string | null
          pending: string | null
          school_ok: boolean
          updated_at: string
          user_id: string
          validated: boolean
        }
        Insert: {
          id?: string
          improve?: string | null
          initiatives?: string | null
          log_date?: string
          mom_note?: string | null
          pending?: string | null
          school_ok?: boolean
          updated_at?: string
          user_id: string
          validated?: boolean
        }
        Update: {
          id?: string
          improve?: string | null
          initiatives?: string | null
          log_date?: string
          mom_note?: string | null
          pending?: string | null
          school_ok?: boolean
          updated_at?: string
          user_id?: string
          validated?: boolean
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          approved_at: string | null
          completed_at: string | null
          created_at: string
          date: string
          id: string
          spontaneous: boolean
          status: string
          task_id: string
        }
        Insert: {
          approved_at?: string | null
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          spontaneous?: boolean
          status?: string
          task_id: string
        }
        Update: {
          approved_at?: string | null
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          spontaneous?: boolean
          status?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      initiative_activities: {
        Row: {
          active: boolean
          created_at: string
          emoji: string
          id: string
          max_per_day: number
          minutes: number
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          emoji?: string
          id?: string
          max_per_day?: number
          minutes?: number
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          emoji?: string
          id?: string
          max_per_day?: number
          minutes?: number
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      initiative_logs: {
        Row: {
          activity_id: string
          created_at: string
          description: string | null
          id: string
          log_date: string
          minutes: number
          mom_note: string | null
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          description?: string | null
          id?: string
          log_date?: string
          minutes?: number
          mom_note?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          description?: string | null
          id?: string
          log_date?: string
          minutes?: number
          mom_note?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_logs_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "initiative_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      player_data: {
        Row: {
          avatar: string
          best_streak: number
          current_streak: number
          id: string
          total_points: number
          updated_at: string
        }
        Insert: {
          avatar?: string
          best_streak?: number
          current_streak?: number
          id?: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          avatar?: string
          best_streak?: number
          current_streak?: number
          id?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          date: string
          id: string
          points_spent: number
          reward_id: string
          status: string
        }
        Insert: {
          date?: string
          id?: string
          points_spent: number
          reward_id: string
          status?: string
        }
        Update: {
          date?: string
          id?: string
          points_spent?: number
          reward_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          id: string
          log_date: string
          note: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log_date?: string
          note?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          note?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          active: boolean
          id: string
          name: string
          points_required: number
          type: string
        }
        Insert: {
          active?: boolean
          id?: string
          name: string
          points_required: number
          type?: string
        }
        Update: {
          active?: boolean
          id?: string
          name?: string
          points_required?: number
          type?: string
        }
        Relationships: []
      }
      school_logs: {
        Row: {
          difficulties: string | null
          done_activities: string | null
          has_pending: boolean
          id: string
          log_date: string
          mom_note: string | null
          needs_help: boolean
          pending_tasks: string | null
          subjects: string | null
          updated_at: string
          user_id: string
          validation: string
        }
        Insert: {
          difficulties?: string | null
          done_activities?: string | null
          has_pending?: boolean
          id?: string
          log_date?: string
          mom_note?: string | null
          needs_help?: boolean
          pending_tasks?: string | null
          subjects?: string | null
          updated_at?: string
          user_id: string
          validation?: string
        }
        Update: {
          difficulties?: string | null
          done_activities?: string | null
          has_pending?: boolean
          id?: string
          log_date?: string
          mom_note?: string | null
          needs_help?: boolean
          pending_tasks?: string | null
          subjects?: string | null
          updated_at?: string
          user_id?: string
          validation?: string
        }
        Relationships: []
      }
      screen_time_settings: {
        Row: {
          base_minutes: number
          id: string
          max_extra_minutes: number
          updated_at: string
        }
        Insert: {
          base_minutes?: number
          id?: string
          max_extra_minutes?: number
          updated_at?: string
        }
        Update: {
          base_minutes?: number
          id?: string
          max_extra_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      screen_time_usage: {
        Row: {
          created_at: string
          id: string
          log_date: string
          minutes: number
          note: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log_date?: string
          minutes: number
          note?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          minutes?: number
          note?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          created_at: string
          emoji: string
          essential: boolean
          id: string
          name: string
          points: number
          sort_order: number
          weekdays: string
        }
        Insert: {
          category?: string
          created_at?: string
          emoji?: string
          essential?: boolean
          id?: string
          name: string
          points: number
          sort_order?: number
          weekdays?: string
        }
        Update: {
          category?: string
          created_at?: string
          emoji?: string
          essential?: boolean
          id?: string
          name?: string
          points?: number
          sort_order?: number
          weekdays?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_missions: {
        Row: {
          active: boolean
          completed: boolean
          current_progress: number
          description: string
          goal: number
          id: string
          week_start: string
        }
        Insert: {
          active?: boolean
          completed?: boolean
          current_progress?: number
          description: string
          goal: number
          id?: string
          week_start?: string
        }
        Update: {
          active?: boolean
          completed?: boolean
          current_progress?: number
          description?: string
          goal?: number
          id?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fortaleza_today: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_member: { Args: never; Returns: boolean }
      is_mom: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "responsavel" | "filho"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["responsavel", "filho"],
    },
  },
} as const
