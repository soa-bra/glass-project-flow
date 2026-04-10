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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          category: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          category?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          category?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          approved_by: string | null
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at: string | null
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          organization_id: string | null
          status: Database["public"]["Enums"]["asset_status"] | null
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          approved_by?: string | null
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          organization_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          approved_by?: string | null
          asset_type?: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      board_invite_links: {
        Row: {
          board_id: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          token: string
        }
        Insert: {
          board_id: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          token: string
        }
        Update: {
          board_id?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          token?: string
        }
        Relationships: []
      }
      board_join_requests: {
        Row: {
          board_id: string
          created_at: string
          granted_role: string | null
          id: string
          invite_link_id: string | null
          processed_at: string | null
          processed_by: string | null
          requester_name: string
          requester_session_id: string
          status: string
        }
        Insert: {
          board_id: string
          created_at?: string
          granted_role?: string | null
          id?: string
          invite_link_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requester_name: string
          requester_session_id: string
          status?: string
        }
        Update: {
          board_id?: string
          created_at?: string
          granted_role?: string | null
          id?: string
          invite_link_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requester_name?: string
          requester_session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_join_requests_invite_link_id_fkey"
            columns: ["invite_link_id"]
            isOneToOne: false
            referencedRelation: "board_invite_links"
            referencedColumns: ["id"]
          },
        ]
      }
      board_objects: {
        Row: {
          board_id: string
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          position: Json
          size: Json
          type: string
          updated_at: string
        }
        Insert: {
          board_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          position?: Json
          size?: Json
          type?: string
          updated_at?: string
        }
        Update: {
          board_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          position?: Json
          size?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      brand_book_exports: {
        Row: {
          brand_book_id: string
          completed_at: string | null
          created_at: string
          export_type: string
          file_url: string | null
          id: string
          share_url: string | null
          status: string
          user_id: string
        }
        Insert: {
          brand_book_id: string
          completed_at?: string | null
          created_at?: string
          export_type: string
          file_url?: string | null
          id?: string
          share_url?: string | null
          status?: string
          user_id: string
        }
        Update: {
          brand_book_id?: string
          completed_at?: string | null
          created_at?: string
          export_type?: string
          file_url?: string | null
          id?: string
          share_url?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_book_exports_brand_book_id_fkey"
            columns: ["brand_book_id"]
            isOneToOne: false
            referencedRelation: "brand_books"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_books: {
        Row: {
          created_at: string
          data: Json
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      detailed_activities: {
        Row: {
          activity_type: string
          created_at: string
          details: Json
          id: string
          impact_score: number | null
          organization_id: string
          resource_id: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json
          id?: string
          impact_score?: number | null
          organization_id: string
          resource_id?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json
          id?: string
          impact_score?: number | null
          organization_id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "detailed_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_analytics: {
        Row: {
          active_users: number
          created_at: string
          cultural_harmony_avg: number | null
          date: string
          id: string
          organization_id: string
          total_analyses: number
          total_assets: number
          total_templates: number
          verbal_compliance_avg: number | null
        }
        Insert: {
          active_users?: number
          created_at?: string
          cultural_harmony_avg?: number | null
          date: string
          id?: string
          organization_id: string
          total_analyses?: number
          total_assets?: number
          total_templates?: number
          verbal_compliance_avg?: number | null
        }
        Update: {
          active_users?: number
          created_at?: string
          cultural_harmony_avg?: number | null
          date?: string
          id?: string
          organization_id?: string
          total_analyses?: number
          total_assets?: number
          total_templates?: number
          verbal_compliance_avg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          is_trial: boolean | null
          logo_url: string | null
          name: string
          slug: string
          subscription_end_date: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_trial?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          subscription_end_date?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_trial?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          subscription_end_date?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          order_index: number
          project_id: string
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          order_index?: number
          project_id: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          order_index?: number
          project_id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          organization_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          organization_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          granted: boolean | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          role: Database["public"]["Enums"]["user_role_extended"]
        }
        Insert: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          role: Database["public"]["Enums"]["user_role_extended"]
        }
        Update: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          role?: Database["public"]["Enums"]["user_role_extended"]
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          filters: Json
          id: string
          is_public: boolean
          name: string
          organization_id: string
          report_type: string
          schedule: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          filters?: Json
          id?: string
          is_public?: boolean
          name: string
          organization_id: string
          report_type: string
          schedule?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          filters?: Json
          id?: string
          is_public?: boolean
          name?: string
          organization_id?: string
          report_type?: string
          schedule?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_element_data: {
        Row: {
          board_object_id: string
          created_at: string
          data: Json
          id: string
          smart_type: string
          updated_at: string
          version: number
        }
        Insert: {
          board_object_id: string
          created_at?: string
          data?: Json
          id?: string
          smart_type: string
          updated_at?: string
          version?: number
        }
        Update: {
          board_object_id?: string
          created_at?: string
          data?: Json
          id?: string
          smart_type?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "smart_element_data_board_object_id_fkey"
            columns: ["board_object_id"]
            isOneToOne: false
            referencedRelation: "board_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_trial: boolean | null
          payment_method: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_trial?: boolean | null
          payment_method?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_trial?: boolean | null
          payment_method?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          data: Json
          description: string | null
          form_fields: Json | null
          id: string
          is_locked: boolean | null
          name: string
          organization_id: string | null
          preview_url: string | null
          status: Database["public"]["Enums"]["template_status"] | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          description?: string | null
          form_fields?: Json | null
          id?: string
          is_locked?: boolean | null
          name: string
          organization_id?: string | null
          preview_url?: string | null
          status?: Database["public"]["Enums"]["template_status"] | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          description?: string | null
          form_fields?: Json | null
          id?: string
          is_locked?: boolean | null
          name?: string
          organization_id?: string | null
          preview_url?: string | null
          status?: Database["public"]["Enums"]["template_status"] | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      text_analyses: {
        Row: {
          analysis_result: Json
          analyzed_by: string | null
          content: string
          created_at: string | null
          cultural_harmony_score: number | null
          id: string
          organization_id: string | null
          suggestions: Json | null
          verbal_compliance_score: number | null
        }
        Insert: {
          analysis_result?: Json
          analyzed_by?: string | null
          content: string
          created_at?: string | null
          cultural_harmony_score?: number | null
          id?: string
          organization_id?: string | null
          suggestions?: Json | null
          verbal_compliance_score?: number | null
        }
        Update: {
          analysis_result?: Json
          analyzed_by?: string | null
          content?: string
          created_at?: string | null
          cultural_harmony_score?: number | null
          id?: string
          organization_id?: string | null
          suggestions?: Json | null
          verbal_compliance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "text_analyses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_advanced_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          organization_id: string
          permission_name: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          organization_id: string
          permission_name: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string
          permission_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_advanced_permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_advanced_permissions_permission_name_fkey"
            columns: ["permission_name"]
            isOneToOne: false
            referencedRelation: "advanced_permissions"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_permission:
        | { Args: never; Returns: undefined }
        | {
            Args: {
              org_id: string
              required_permission: Database["public"]["Enums"]["permission_type"]
              user_id: string
            }
            Returns: boolean
          }
      handle_new_user_v2: { Args: never; Returns: undefined }
      has_advanced_permission: {
        Args: {
          p_organization_id: string
          p_permission_name: string
          p_user_id: string
        }
        Returns: boolean
      }
      has_role_in_org: {
        Args: {
          org_id: string
          required_role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_action: string
          p_category?: string
          p_metadata?: Json
          p_organization_id: string
          p_resource_id?: string
          p_resource_type?: string
          p_severity?: string
          p_user_id: string
        }
        Returns: string
      }
      update_daily_analytics: { Args: never; Returns: undefined }
    }
    Enums: {
      asset_status: "pending" | "approved" | "rejected"
      asset_type: "image" | "video" | "document" | "font" | "audio"
      permission_type:
        | "view_assets"
        | "manage_assets"
        | "approve_assets"
        | "view_templates"
        | "create_templates"
        | "edit_templates"
        | "publish_templates"
        | "view_reports"
        | "export_reports"
        | "manage_brand_identity"
        | "view_brand_identity"
        | "manage_team"
        | "invite_users"
        | "manage_billing"
        | "view_billing"
        | "admin_settings"
        | "api_access"
      subscription_tier: "free" | "basic" | "growth" | "enterprise"
      template_status: "draft" | "published" | "archived"
      user_role: "owner" | "brand_manager" | "editor" | "viewer"
      user_role_extended:
        | "owner"
        | "brand_manager"
        | "editor"
        | "viewer"
        | "agency_admin"
        | "client_admin"
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
      asset_status: ["pending", "approved", "rejected"],
      asset_type: ["image", "video", "document", "font", "audio"],
      permission_type: [
        "view_assets",
        "manage_assets",
        "approve_assets",
        "view_templates",
        "create_templates",
        "edit_templates",
        "publish_templates",
        "view_reports",
        "export_reports",
        "manage_brand_identity",
        "view_brand_identity",
        "manage_team",
        "invite_users",
        "manage_billing",
        "view_billing",
        "admin_settings",
        "api_access",
      ],
      subscription_tier: ["free", "basic", "growth", "enterprise"],
      template_status: ["draft", "published", "archived"],
      user_role: ["owner", "brand_manager", "editor", "viewer"],
      user_role_extended: [
        "owner",
        "brand_manager",
        "editor",
        "viewer",
        "agency_admin",
        "client_admin",
      ],
    },
  },
} as const
