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
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          decision: Database["public"]["Enums"]["audit_decision"]
          id: string
          metadata: Json | null
          reason: string | null
          resource_id: string | null
          resource_type: string
          scope_id: string | null
          scope_type: Database["public"]["Enums"]["role_scope_type"] | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          decision: Database["public"]["Enums"]["audit_decision"]
          id?: string
          metadata?: Json | null
          reason?: string | null
          resource_id?: string | null
          resource_type: string
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["role_scope_type"] | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          decision?: Database["public"]["Enums"]["audit_decision"]
          id?: string
          metadata?: Json | null
          reason?: string | null
          resource_id?: string | null
          resource_type?: string
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["role_scope_type"] | null
        }
        Relationships: []
      }
      board_invite_links: {
        Row: {
          board_id: string
          created_at: string | null
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          token: string
        }
        Insert: {
          board_id: string
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          token: string
        }
        Update: {
          board_id?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_invite_links_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_join_requests: {
        Row: {
          board_id: string
          created_at: string | null
          granted_role: string | null
          id: string
          invite_link_id: string
          processed_at: string | null
          processed_by: string | null
          requester_name: string
          requester_session_id: string
          status: string | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          granted_role?: string | null
          id?: string
          invite_link_id: string
          processed_at?: string | null
          processed_by?: string | null
          requester_name: string
          requester_session_id: string
          status?: string | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          granted_role?: string | null
          id?: string
          invite_link_id?: string
          processed_at?: string | null
          processed_by?: string | null
          requester_name?: string
          requester_session_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_join_requests_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
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
      central_boards: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Relationships: []
      }
      department_projects: {
        Row: {
          created_at: string
          department_id: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["department_project_role"]
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          project_id: string
          role: Database["public"]["Enums"]["department_project_role"]
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["department_project_role"]
        }
        Relationships: [
          {
            foreignKeyName: "department_projects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Relationships: []
      }
      dependencies: {
        Row: {
          created_at: string
          dependency_type: Database["public"]["Enums"]["central_dependency_type"]
          description: string | null
          from_entity_id: string
          from_entity_type: Database["public"]["Enums"]["central_entity_type"]
          id: string
          metadata: Json | null
          to_entity_id: string
          to_entity_type: Database["public"]["Enums"]["central_entity_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          dependency_type: Database["public"]["Enums"]["central_dependency_type"]
          description?: string | null
          from_entity_id: string
          from_entity_type: Database["public"]["Enums"]["central_entity_type"]
          id?: string
          metadata?: Json | null
          to_entity_id: string
          to_entity_type: Database["public"]["Enums"]["central_entity_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          dependency_type?: Database["public"]["Enums"]["central_dependency_type"]
          description?: string | null
          from_entity_id?: string
          from_entity_type?: Database["public"]["Enums"]["central_entity_type"]
          id?: string
          metadata?: Json | null
          to_entity_id?: string
          to_entity_type?: Database["public"]["Enums"]["central_entity_type"]
          updated_at?: string
        }
        Relationships: []
      }
      engine_jobs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["engine_job_kind"]
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          produced_by_task_id: string | null
          state: Database["public"]["Enums"]["central_state"]
          triggered_by_tool_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          kind: Database["public"]["Enums"]["engine_job_kind"]
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          produced_by_task_id?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          triggered_by_tool_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["engine_job_kind"]
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          produced_by_task_id?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          triggered_by_tool_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engine_jobs_produced_by_task_id_fkey"
            columns: ["produced_by_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engine_jobs_triggered_by_tool_id_fkey"
            columns: ["triggered_by_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      event_dlq: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          error: string
          event_type: string
          failed_at: string
          id: string
          original_event_id: string | null
          payload: Json
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          error: string
          event_type: string
          failed_at?: string
          id?: string
          original_event_id?: string | null
          payload: Json
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          error?: string
          event_type?: string
          failed_at?: string
          id?: string
          original_event_id?: string | null
          payload?: Json
        }
        Relationships: []
      }
      event_outbox: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          attempts: number
          created_at: string
          dispatched_at: string | null
          event_type: string
          id: string
          last_error: string | null
          payload: Json
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          attempts?: number
          created_at?: string
          dispatched_at?: string | null
          event_type: string
          id?: string
          last_error?: string | null
          payload: Json
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          attempts?: number
          created_at?: string
          dispatched_at?: string | null
          event_type?: string
          id?: string
          last_error?: string | null
          payload?: Json
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
          metadata: Json
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
          metadata?: Json
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
          metadata?: Json
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
      permissions: {
        Row: {
          code: string
          created_at: string
          description: string
          module: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          module: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          module?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_cards: {
        Row: {
          central_board_id: string | null
          created_at: string
          description: string | null
          id: string
          linked_project_id: string
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          projection: string
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
          visible_metrics: string[]
        }
        Insert: {
          central_board_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          linked_project_id: string
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          projection?: string
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
          visible_metrics?: string[]
        }
        Update: {
          central_board_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          linked_project_id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          projection?: string
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
          visible_metrics?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "project_cards_central_board_id_fkey"
            columns: ["central_board_id"]
            isOneToOne: false
            referencedRelation: "central_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_cards_linked_project_id_fkey"
            columns: ["linked_project_id"]
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
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          start_date: string | null
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          start_date?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          start_date?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_code: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          permission_code: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          permission_code?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["code"]
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
      "SoaBra-supabase-Notion": {
        Row: {
          archived: boolean | null
          attrs: Json | null
          created_time: string | null
          id: string | null
          last_edited_time: string | null
          url: string | null
        }
        Insert: {
          archived?: boolean | null
          attrs?: Json | null
          created_time?: string | null
          id?: string | null
          last_edited_time?: string | null
          url?: string | null
        }
        Update: {
          archived?: boolean | null
          attrs?: Json | null
          created_time?: string | null
          id?: string | null
          last_edited_time?: string | null
          url?: string | null
        }
        Relationships: []
      }
      task_cards: {
        Row: {
          central_board_id: string | null
          created_at: string
          description: string | null
          id: string
          linked_project_id: string
          linked_task_id: string
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          projection: string
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
          visible_metrics: string[]
        }
        Insert: {
          central_board_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          linked_project_id: string
          linked_task_id: string
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          projection?: string
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
          visible_metrics?: string[]
        }
        Update: {
          central_board_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          linked_project_id?: string
          linked_task_id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          projection?: string
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
          visible_metrics?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "task_cards_central_board_id_fkey"
            columns: ["central_board_id"]
            isOneToOne: false
            referencedRelation: "central_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_cards_linked_project_id_fkey"
            columns: ["linked_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_cards_linked_task_id_fkey"
            columns: ["linked_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_tool_engine_links: {
        Row: {
          created_at: string
          engine_job_id: string
          id: string
          relation_type: Database["public"]["Enums"]["task_tool_engine_relation_type"]
          task_id: string
          tool_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          engine_job_id: string
          id?: string
          relation_type: Database["public"]["Enums"]["task_tool_engine_relation_type"]
          task_id: string
          tool_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          engine_job_id?: string
          id?: string
          relation_type?: Database["public"]["Enums"]["task_tool_engine_relation_type"]
          task_id?: string
          tool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_tool_engine_links_engine_job_id_fkey"
            columns: ["engine_job_id"]
            isOneToOne: false
            referencedRelation: "engine_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_tool_engine_links_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_tool_engine_links_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_cost: number | null
          actual_duration: number | null
          assignee_id: string | null
          complexity: Database["public"]["Enums"]["central_complexity"]
          created_at: string
          description: string | null
          due_date: string | null
          estimated_cost: number
          estimated_duration: number
          id: string
          linked_project_id: string
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          required_team_size: number
          start_date: string | null
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          actual_duration?: number | null
          assignee_id?: string | null
          complexity?: Database["public"]["Enums"]["central_complexity"]
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_cost?: number
          estimated_duration?: number
          id?: string
          linked_project_id: string
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          required_team_size?: number
          start_date?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          actual_duration?: number | null
          assignee_id?: string | null
          complexity?: Database["public"]["Enums"]["central_complexity"]
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_cost?: number
          estimated_duration?: number
          id?: string
          linked_project_id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          required_team_size?: number
          start_date?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_linked_project_id_fkey"
            columns: ["linked_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
        ]
      }
      tools: {
        Row: {
          central_board_id: string
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["tool_kind"]
          metadata: Json | null
          name: string
          owner_id: string
          priority: Database["public"]["Enums"]["central_priority"]
          produced_by_task_id: string | null
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
        }
        Insert: {
          central_board_id: string
          created_at?: string
          description?: string | null
          id?: string
          kind: Database["public"]["Enums"]["tool_kind"]
          metadata?: Json | null
          name: string
          owner_id: string
          priority?: Database["public"]["Enums"]["central_priority"]
          produced_by_task_id?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Update: {
          central_board_id?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["tool_kind"]
          metadata?: Json | null
          name?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["central_priority"]
          produced_by_task_id?: string | null
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_central_board_id_fkey"
            columns: ["central_board_id"]
            isOneToOne: false
            referencedRelation: "central_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tools_produced_by_task_id_fkey"
            columns: ["produced_by_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          scope_id: string | null
          scope_type: Database["public"]["Enums"]["role_scope_type"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["role_scope_type"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["role_scope_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      has_permission: {
        Args: { _permission_code: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _scope_id?: string
          _scope_type?: Database["public"]["Enums"]["role_scope_type"]
          _user_id: string
        }
        Returns: boolean
      }
      is_owner: { Args: { _user_id: string }; Returns: boolean }
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
      validate_board_invite_token: {
        Args: { token_input: string }
        Returns: {
          board_id: string
          expires_at: string
          invite_link_id: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role:
        | "owner"
        | "ciso"
        | "dpo"
        | "infra_admin"
        | "finance_admin"
        | "department_manager"
        | "project_manager"
        | "release_manager"
        | "qa_lead"
        | "sre"
        | "brand_manager"
        | "dam_curator"
        | "hr_analyst"
        | "finance_auditor"
        | "ai_analyst"
        | "content_reviewer"
        | "legal_archivist"
        | "help_desk_agent"
        | "team_member"
        | "guest"
        | "service_account"
      audit_decision: "allowed" | "denied" | "error"
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
      central_complexity:
        | "trivial"
        | "simple"
        | "moderate"
        | "complex"
        | "critical"
      central_dependency_type:
        | "execution"
        | "data"
        | "technical"
        | "operational"
        | "time"
      central_entity_type:
        | "central_board"
        | "department"
        | "project"
        | "task"
        | "tool"
        | "engine_job"
        | "project_card"
        | "task_card"
      central_priority: "low" | "medium" | "high" | "critical"
      central_state:
        | "draft"
        | "planned"
        | "active"
        | "blocked"
        | "paused"
        | "completed"
        | "cancelled"
        | "archived"
        | "failed"
      department_project_role: "owner" | "supervisor"
      engine_job_kind:
        | "automation"
        | "data_processing"
        | "orchestration"
        | "sync"
        | "analytics"
        | "validation"
      invoice_status: "draft" | "pending" | "paid" | "overdue"
      operation_type: "create" | "update" | "delete" | "move" | "resize"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
      role_scope_type: "global" | "department" | "project" | "board"
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
      task_tool_engine_relation_type: "produces" | "binds" | "executes"
      tool_kind:
        | "board_widget"
        | "dashboard_panel"
        | "workflow_tool"
        | "analysis_tool"
        | "integration_tool"
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
      app_role: [
        "owner",
        "ciso",
        "dpo",
        "infra_admin",
        "finance_admin",
        "department_manager",
        "project_manager",
        "release_manager",
        "qa_lead",
        "sre",
        "brand_manager",
        "dam_curator",
        "hr_analyst",
        "finance_auditor",
        "ai_analyst",
        "content_reviewer",
        "legal_archivist",
        "help_desk_agent",
        "team_member",
        "guest",
        "service_account",
      ],
      audit_decision: ["allowed", "denied", "error"],
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
      central_complexity: [
        "trivial",
        "simple",
        "moderate",
        "complex",
        "critical",
      ],
      central_dependency_type: [
        "execution",
        "data",
        "technical",
        "operational",
        "time",
      ],
      central_entity_type: [
        "central_board",
        "department",
        "project",
        "task",
        "tool",
        "engine_job",
        "project_card",
        "task_card",
      ],
      central_priority: ["low", "medium", "high", "critical"],
      central_state: [
        "draft",
        "planned",
        "active",
        "blocked",
        "paused",
        "completed",
        "cancelled",
        "archived",
        "failed",
      ],
      department_project_role: ["owner", "supervisor"],
      engine_job_kind: [
        "automation",
        "data_processing",
        "orchestration",
        "sync",
        "analytics",
        "validation",
      ],
      invoice_status: ["draft", "pending", "paid", "overdue"],
      operation_type: ["create", "update", "delete", "move", "resize"],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "cancelled",
      ],
      role_scope_type: ["global", "department", "project", "board"],
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
      task_tool_engine_relation_type: ["produces", "binds", "executes"],
      tool_kind: [
        "board_widget",
        "dashboard_panel",
        "workflow_tool",
        "analysis_tool",
        "integration_tool",
      ],
    },
  },
} as const
