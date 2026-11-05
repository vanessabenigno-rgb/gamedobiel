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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      daily_checkins: {
        Row: {
          child_id: string
          family_id: string
          id: string
          improve: string | null
          initiatives: string | null
          log_date: string
          mom_note: string | null
          pending: string | null
          reviewed_at: string | null
          school_ok: boolean
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
        }
        Insert: {
          child_id: string
          family_id: string
          id?: string
          improve?: string | null
          initiatives?: string | null
          log_date?: string
          mom_note?: string | null
          pending?: string | null
          reviewed_at?: string | null
          school_ok?: boolean
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Update: {
          child_id?: string
          family_id?: string
          id?: string
          improve?: string | null
          initiatives?: string | null
          log_date?: string
          mom_note?: string | null
          pending?: string | null
          reviewed_at?: string | null
          school_ok?: boolean
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_checkins_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_tasks: {
        Row: {
          child_id: string
          completed_at: string | null
          created_at: string
          family_id: string
          id: string
          mom_note: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["task_status"]
          task_date: string
          task_id: string
        }
        Insert: {
          child_id: string
          completed_at?: string | null
          created_at?: string
          family_id: string
          id?: string
          mom_note?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_date?: string
          task_id: string
        }
        Update: {
          child_id?: string
          completed_at?: string | null
          created_at?: string
          family_id?: string
          id?: string
          mom_note?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_date?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      initiative_activities: {
        Row: {
          active: boolean
          created_at: string
          emoji: string
          family_id: string
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
          family_id: string
          id?: string
          max_per_day?: number
          minutes: number
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          emoji?: string
          family_id?: string
          id?: string
          max_per_day?: number
          minutes?: number
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "initiative_activities_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      initiative_logs: {
        Row: {
          activity_id: string
          approved_minutes: number | null
          child_id: string
          created_at: string
          description: string | null
          family_id: string
          id: string
          log_date: string
          mom_note: string | null
          proposed_minutes: number
          reviewed_at: string | null
          status: Database["public"]["Enums"]["review_status"]
        }
        Insert: {
          activity_id: string
          approved_minutes?: number | null
          child_id: string
          created_at?: string
          description?: string | null
          family_id: string
          id?: string
          log_date?: string
          mom_note?: string | null
          proposed_minutes: number
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["review_status"]
        }
        Update: {
          activity_id?: string
          approved_minutes?: number | null
          child_id?: string
          created_at?: string
          description?: string | null
          family_id?: string
          id?: string
          log_date?: string
          mom_note?: string | null
          proposed_minutes?: number
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["review_status"]
        }
        Relationships: [
          {
            foreignKeyName: "initiative_logs_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "initiative_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiative_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiative_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string
          created_at: string
          display_name: string
          family_id: string
          id: string
          role: Database["public"]["Enums"]["member_role"]
        }
        Insert: {
          avatar?: string
          created_at?: string
          display_name: string
          family_id: string
          id: string
          role: Database["public"]["Enums"]["member_role"]
        }
        Update: {
          avatar?: string
          created_at?: string
          display_name?: string
          family_id?: string
          id?: string
          role?: Database["public"]["Enums"]["member_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      school_logs: {
        Row: {
          child_id: string
          difficulties: string | null
          done_activities: string | null
          family_id: string
          has_pending: boolean
          id: string
          log_date: string
          mom_note: string | null
          needs_help: boolean
          pending_tasks: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["review_status"]
          subjects: string | null
          updated_at: string
        }
        Insert: {
          child_id: string
          difficulties?: string | null
          done_activities?: string | null
          family_id: string
          has_pending?: boolean
          id?: string
          log_date?: string
          mom_note?: string | null
          needs_help?: boolean
          pending_tasks?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          subjects?: string | null
          updated_at?: string
        }
        Update: {
          child_id?: string
          difficulties?: string | null
          done_activities?: string | null
          family_id?: string
          has_pending?: boolean
          id?: string
          log_date?: string
          mom_note?: string | null
          needs_help?: boolean
          pending_tasks?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          subjects?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      screen_time_ledger: {
        Row: {
          child_id: string
          created_at: string
          created_by: string
          event_date: string
          event_type: string
          family_id: string
          id: string
          minutes: number
          note: string | null
          source_id: string | null
        }
        Insert: {
          child_id: string
          created_at?: string
          created_by: string
          event_date?: string
          event_type: string
          family_id: string
          id?: string
          minutes: number
          note?: string | null
          source_id?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string
          created_by?: string
          event_date?: string
          event_type?: string
          family_id?: string
          id?: string
          minutes?: number
          note?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screen_time_ledger_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screen_time_ledger_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screen_time_ledger_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      screen_time_settings: {
        Row: {
          cutoff_time: string
          family_id: string
          guaranteed_minutes: number
          max_extra_minutes: number
          updated_at: string
        }
        Insert: {
          cutoff_time?: string
          family_id: string
          guaranteed_minutes?: number
          max_extra_minutes?: number
          updated_at?: string
        }
        Update: {
          cutoff_time?: string
          family_id?: string
          guaranteed_minutes?: number
          max_extra_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "screen_time_settings_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: true
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          active: boolean
          created_at: string
          emoji: string
          family_id: string
          id: string
          name: string
          sort_order: number
          weekdays: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          emoji?: string
          family_id: string
          id?: string
          name: string
          sort_order?: number
          weekdays?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          emoji?: string
          family_id?: string
          id?: string
          name?: string
          sort_order?: number
          weekdays?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_family_id: { Args: never; Returns: string }
      is_responsavel: { Args: never; Returns: boolean }
      review_initiative: {
        Args: {
          approved?: number
          decision: Database["public"]["Enums"]["review_status"]
          initiative_id: string
          note?: string
        }
        Returns: {
          activity_id: string
          approved_minutes: number | null
          child_id: string
          created_at: string
          description: string | null
          family_id: string
          id: string
          log_date: string
          mom_note: string | null
          proposed_minutes: number
          reviewed_at: string | null
          status: Database["public"]["Enums"]["review_status"]
        }
        SetofOptions: {
          from: "*"
          to: "initiative_logs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      member_role: "responsavel" | "filho"
      review_status: "pendente" | "aprovado" | "recusado" | "correcao"
      task_status: "pendente" | "aguardando" | "aprovado" | "recusado"
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
      member_role: ["responsavel", "filho"],
      review_status: ["pendente", "aprovado", "recusado", "correcao"],
      task_status: ["pendente", "aguardando", "aprovado", "recusado"],
    },
  },
} as const

