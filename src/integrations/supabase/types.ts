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
      access_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          tier: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tier: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      achievements: {
        Row: {
          badge_url: string | null
          created_at: string
          description: string
          earned_at: string
          id: string
          quest_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          badge_url?: string | null
          created_at?: string
          description: string
          earned_at?: string
          id?: string
          quest_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          badge_url?: string | null
          created_at?: string
          description?: string
          earned_at?: string
          id?: string
          quest_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_allocations: {
        Row: {
          base_allocation: number
          created_at: string
          id: string
          level_bonus: number
          quest_bonus: number
          total_allocation: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          base_allocation?: number
          created_at?: string
          id?: string
          level_bonus?: number
          quest_bonus?: number
          total_allocation?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          base_allocation?: number
          created_at?: string
          id?: string
          level_bonus?: number
          quest_bonus?: number
          total_allocation?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quest_participants: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          quest_id: string
          status: Database["public"]["Enums"]["quest_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          quest_id: string
          status?: Database["public"]["Enums"]["quest_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          quest_id?: string
          status?: Database["public"]["Enums"]["quest_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_participants_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          business_id: string
          created_at: string
          current_participants: number
          description: string
          difficulty: Database["public"]["Enums"]["quest_difficulty"]
          end_date: string | null
          id: string
          max_participants: number | null
          requirements: Json | null
          reward_amount: number
          reward_token: string
          start_date: string | null
          status: Database["public"]["Enums"]["quest_status"]
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          current_participants?: number
          description: string
          difficulty?: Database["public"]["Enums"]["quest_difficulty"]
          end_date?: string | null
          id?: string
          max_participants?: number | null
          requirements?: Json | null
          reward_amount: number
          reward_token?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["quest_status"]
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          current_participants?: number
          description?: string
          difficulty?: Database["public"]["Enums"]["quest_difficulty"]
          end_date?: string | null
          id?: string
          max_participants?: number | null
          requirements?: Json | null
          reward_amount?: number
          reward_token?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["quest_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          quest_id: string | null
          token: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          quest_id?: string | null
          token?: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          quest_id?: string | null
          token?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_access_codes: {
        Row: {
          access_code_id: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          access_code_id: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          access_code_id?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_access_codes_access_code_id_fkey"
            columns: ["access_code_id"]
            isOneToOne: false
            referencedRelation: "access_codes"
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
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          level: number
          token: string
          updated_at: string
          user_id: string
          wallet_address: string | null
          xp: number
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          level?: number
          token?: string
          updated_at?: string
          user_id: string
          wallet_address?: string | null
          xp?: number
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          level?: number
          token?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_quest_reward: {
        Args: { p_expected_reward: number; p_quest_participant_id: string }
        Returns: {
          error_message: string
          new_level: number
          new_xp: number
          success: boolean
        }[]
      }
      generate_wallet_address: {
        Args: never
        Returns: {
          error_message: string
          success: boolean
          wallet_address: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_reward: {
        Args: { p_reward_cost: number; p_reward_name: string }
        Returns: {
          error_message: string
          new_level: number
          new_xp: number
          success: boolean
        }[]
      }
      validate_access_code: {
        Args: { p_code: string; p_user_id: string }
        Returns: {
          error_message: string
          tier: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "user" | "business" | "admin"
      quest_difficulty: "easy" | "medium" | "hard"
      quest_status: "draft" | "active" | "completed" | "expired"
      transaction_type: "reward" | "purchase" | "transfer" | "stake"
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
      app_role: ["user", "business", "admin"],
      quest_difficulty: ["easy", "medium", "hard"],
      quest_status: ["draft", "active", "completed", "expired"],
      transaction_type: ["reward", "purchase", "transfer", "stake"],
    },
  },
} as const
