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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      board_objects: {
        Row: {
          board_id: string
          content: string | null
          created_at: string | null
          created_by: string
          id: string
          locked: boolean | null
          metadata: Json | null
          position: Json
          rotation: number | null
          size: Json
          style: Json | null
          type: Database["public"]["Enums"]["board_object_type"]
          updated_at: string | null
          z_index: number | null
        }
        Insert: {
          board_id: string
          content?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          locked?: boolean | null
          metadata?: Json | null
          position?: Json
          rotation?: number | null
          size?: Json
          style?: Json | null
          type: Database["public"]["Enums"]["board_object_type"]
          updated_at?: string | null
          z_index?: number | null
        }
        Update: {
          board_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          locked?: boolean | null
          metadata?: Json | null
          position?: Json
          rotation?: number | null
          size?: Json
          style?: Json | null
          type?: Database["public"]["Enums"]["board_object_type"]
          updated_at?: string | null
          z_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "board_objects_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_permissions: {
        Row: {
          board_id: string
          granted_at: string | null
          granted_by: string
          id: string
          role: Database["public"]["Enums"]["board_role"]
          user_id: string
        }
        Insert: {
          board_id: string
          granted_at?: string | null
          granted_by: string
          id?: string
          role?: Database["public"]["Enums"]["board_role"]
          user_id: string
        }
        Update: {
          board_id?: string
          granted_at?: string | null
          granted_by?: string
          id?: string
          role?: Database["public"]["Enums"]["board_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_permissions_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          owner_id: string
          settings: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          owner_id: string
          settings?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          owner_id?: string
          settings?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string
          item_description: string
          order_index: number
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id: string
          item_description: string
          order_index?: number
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string
          item_description?: string
          order_index?: number
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          invoice_id: string
          notes: string | null
          paid_date: string | null
          payment_amount: number
          payment_method: string | null
          payment_number: number
          payment_percentage: number
          status: Database["public"]["Enums"]["invoice_status"]
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          invoice_id: string
          notes?: string | null
          paid_date?: string | null
          payment_amount?: number
          payment_method?: string | null
          payment_number: number
          payment_percentage?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          paid_date?: string | null
          payment_amount?: number
          payment_method?: string | null
          payment_number?: number
          payment_percentage?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          owner_id: string
          paid_date: string | null
          payment_terms: number | null
          project_id: string | null
          service_description: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          tax_rate: number | null
          terms_conditions: string | null
          total_amount: number
          total_payments: number | null
          updated_at: string | null
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          owner_id: string
          paid_date?: string | null
          payment_terms?: number | null
          project_id?: string | null
          service_description?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number
          total_payments?: number | null
          updated_at?: string | null
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          owner_id?: string
          paid_date?: string | null
          payment_terms?: number | null
          project_id?: string | null
          service_description?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number
          total_payments?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kv_store_06871a1a: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_4c8546af: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_7c857198: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_7e6493e3: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_8cde9397: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      links: {
        Row: {
          board_id: string
          created_at: string | null
          created_by: string
          from_object_id: string
          id: string
          label: string | null
          style: Json | null
          to_object_id: string
        }
        Insert: {
          board_id: string
          created_at?: string | null
          created_by: string
          from_object_id: string
          id?: string
          label?: string | null
          style?: Json | null
          to_object_id: string
        }
        Update: {
          board_id?: string
          created_at?: string | null
          created_by?: string
          from_object_id?: string
          id?: string
          label?: string | null
          style?: Json | null
          to_object_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_from_object_id_fkey"
            columns: ["from_object_id"]
            isOneToOne: false
            referencedRelation: "board_objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_to_object_id_fkey"
            columns: ["to_object_id"]
            isOneToOne: false
            referencedRelation: "board_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      op_log: {
        Row: {
          board_id: string
          created_at: string | null
          data: Json
          id: string
          object_id: string
          object_type: string
          operation_type: Database["public"]["Enums"]["operation_type"]
          user_id: string
        }
        Insert: {
          board_id: string
          created_at?: string | null
          data: Json
          id?: string
          object_id: string
          object_type: string
          operation_type: Database["public"]["Enums"]["operation_type"]
          user_id: string
        }
        Update: {
          board_id?: string
          created_at?: string | null
          data?: Json
          id?: string
          object_id?: string
          object_type?: string
          operation_type?: Database["public"]["Enums"]["operation_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_log_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          order_index: number
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          order_index: number
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          order_index?: number
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "finance_dashboard_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_cards_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          board_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          phase_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          project_id: string
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          board_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          phase_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          board_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          phase_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "finance_dashboard_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_cards_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
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
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: []
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
            isOneToOne: true
            referencedRelation: "board_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      snapshots: {
        Row: {
          board_id: string
          created_at: string | null
          created_by: string
          data: Json
          description: string | null
          file_size: number | null
          id: string
          name: string
        }
        Insert: {
          board_id: string
          created_at?: string | null
          created_by: string
          data: Json
          description?: string | null
          file_size?: number | null
          id?: string
          name: string
        }
        Update: {
          board_id?: string
          created_at?: string | null
          created_by?: string
          data?: Json
          description?: string | null
          file_size?: number | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "snapshots_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry_events: {
        Row: {
          board_id: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          project_id: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          board_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          project_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          board_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          project_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_events_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "finance_dashboard_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "telemetry_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_cards_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      crm_activities_view: {
        Row: {
          activity_status: string | null
          activity_title: string | null
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          priority_score: number | null
          project_name: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      csr_requests_view: {
        Row: {
          agent_id: string | null
          customer_id: string | null
          hours_open: number | null
          id: string | null
          is_overdue: boolean | null
          last_updated: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          project_context: string | null
          request_date: string | null
          request_details: string | null
          request_title: string | null
          resolution_due: string | null
          severity_level: string | null
          status: Database["public"]["Enums"]["task_status"] | null
        }
        Relationships: []
      }
      finance_dashboard_view: {
        Row: {
          avg_task_hours: number | null
          budget: number | null
          budget_used_percentage: number | null
          end_date: string | null
          estimated_cost: number | null
          project_id: string | null
          project_name: string | null
          remaining_budget: number | null
          spent_amount: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      project_cards_view: {
        Row: {
          actual_hours: number | null
          budget: number | null
          completed_phases: number | null
          completed_tasks: number | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          estimated_hours: number | null
          id: string | null
          name: string | null
          owner_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_phases: number | null
          total_tasks: number | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_board_role: {
        Args: { board_id: string; user_id: string }
        Returns: Database["public"]["Enums"]["board_role"]
      }
      get_widget_data: {
        Args: {
          filters?: Json
          limit_count?: number
          user_id?: string
          widget_type: string
        }
        Returns: {
          data: Json
        }[]
      }
      get_widget_stats: {
        Args: { user_id?: string; widget_type: string }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      user_has_board_role: {
        Args: {
          board_id: string
          min_role: Database["public"]["Enums"]["board_role"]
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      board_object_type:
        | "text"
        | "sticky_note"
        | "shape"
        | "image"
        | "drawing"
        | "connector"
        | "template"
        | "smart"
      board_role: "host" | "editor" | "viewer"
      invoice_status: "draft" | "pending" | "paid" | "overdue"
      operation_type: "create" | "update" | "delete" | "move" | "resize"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
      service_type:
        | "brand_strategy"
        | "visual_identity"
        | "digital_marketing"
        | "content_creation"
        | "market_research"
        | "consulting"
        | "training"
        | "other"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "review" | "completed"
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
      board_object_type: [
        "text",
        "sticky_note",
        "shape",
        "image",
        "drawing",
        "connector",
        "template",
        "smart",
      ],
      board_role: ["host", "editor", "viewer"],
      invoice_status: ["draft", "pending", "paid", "overdue"],
      operation_type: ["create", "update", "delete", "move", "resize"],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "cancelled",
      ],
      service_type: [
        "brand_strategy",
        "visual_identity",
        "digital_marketing",
        "content_creation",
        "market_research",
        "consulting",
        "training",
        "other",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "review", "completed"],
    },
  },
} as const
