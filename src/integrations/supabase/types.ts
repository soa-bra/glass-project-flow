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
      archive_documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          metadata: Json
          owner_id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json
          owner_id?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json
          owner_id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
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
      bcm_members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          joined_at: string | null
          metadata: Json | null
          name: string
          notes: string | null
          owner_id: string
          segment: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          joined_at?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          owner_id: string
          segment?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          joined_at?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          owner_id?: string
          segment?: string | null
          status?: string
          updated_at?: string
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
      brand_assets: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          name: string
          owner_id: string
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          name: string
          owner_id: string
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          name?: string
          owner_id?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      brand_guidelines: {
        Row: {
          body_md: string | null
          created_at: string
          id: string
          owner_id: string
          status: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          body_md?: string | null
          created_at?: string
          id?: string
          owner_id: string
          status?: string
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          body_md?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          status?: string
          title?: string
          updated_at?: string
          version?: string
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
      crm_activities: {
        Row: {
          created_at: string
          customer_id: string | null
          due_date: string | null
          id: string
          notes: string | null
          opportunity_id: string | null
          owner_id: string
          status: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          owner_id: string
          status?: string
          subject: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          owner_id?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_customers: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
          segment: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          notes?: string | null
          owner_id: string
          phone?: string | null
          segment?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
          segment?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_opportunities: {
        Row: {
          created_at: string
          customer_id: string | null
          expected_close: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          probability: number | null
          stage: string
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          expected_close?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          probability?: number | null
          stage?: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          expected_close?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          probability?: number | null
          stage?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      crm_service_tickets: {
        Row: {
          assignee_id: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          owner_id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          owner_id: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          owner_id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      csr_initiatives: {
        Row: {
          beneficiaries_count: number | null
          budget: number | null
          created_at: string
          end_date: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          start_date: string | null
          status: string
          type: string | null
          updated_at: string
        }
        Insert: {
          beneficiaries_count?: number | null
          budget?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          start_date?: string | null
          status?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          beneficiaries_count?: number | null
          budget?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          start_date?: string | null
          status?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      csr_tickets: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          id: string
          initiative_id: string | null
          owner_id: string
          priority: string
          requester_email: string | null
          requester_name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          initiative_id?: string | null
          owner_id: string
          priority?: string
          requester_email?: string | null
          requester_name: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          initiative_id?: string | null
          owner_id?: string
          priority?: string
          requester_email?: string | null
          requester_name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_links: {
        Row: {
          board_id: string
          created_at: string
          created_by: string
          id: string
          label: string | null
          link_kind: string
          mapping: Json
          metadata: Json
          project_id: string | null
          source_element_id: string | null
          target_element_id: string | null
        }
        Insert: {
          board_id: string
          created_at?: string
          created_by: string
          id?: string
          label?: string | null
          link_kind: string
          mapping?: Json
          metadata?: Json
          project_id?: string | null
          source_element_id?: string | null
          target_element_id?: string | null
        }
        Update: {
          board_id?: string
          created_at?: string
          created_by?: string
          id?: string
          label?: string | null
          link_kind?: string
          mapping?: Json
          metadata?: Json
          project_id?: string | null
          source_element_id?: string | null
          target_element_id?: string | null
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
      element_transformations: {
        Row: {
          board_id: string
          created_at: string
          created_by: string
          id: string
          metadata: Json
          result: Json
          source_element_id: string
          status: string
          transformation_type: string
        }
        Insert: {
          board_id: string
          created_at?: string
          created_by: string
          id?: string
          metadata?: Json
          result?: Json
          source_element_id: string
          status?: string
          transformation_type: string
        }
        Update: {
          board_id?: string
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json
          result?: Json
          source_element_id?: string
          status?: string
          transformation_type?: string
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
      financial_budgets: {
        Row: {
          created_at: string
          currency: string
          department_id: string | null
          end_date: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          period: string
          planned_amount: number
          project_id: string | null
          spent_amount: number
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          department_id?: string | null
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          period?: string
          planned_amount?: number
          project_id?: string | null
          spent_amount?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          department_id?: string | null
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          period?: string
          planned_amount?: number
          project_id?: string | null
          spent_amount?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          budget_id: string | null
          category: string | null
          created_at: string
          currency: string
          date: string
          id: string
          kind: string
          notes: string | null
          owner_id: string
          project_id: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount?: number
          budget_id?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          date?: string
          id?: string
          kind: string
          notes?: string | null
          owner_id: string
          project_id?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          budget_id?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          date?: string
          id?: string
          kind?: string
          notes?: string | null
          owner_id?: string
          project_id?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      hr_attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          owner_id: string
          status: string
          updated_at: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          owner_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          owner_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hr_employees: {
        Row: {
          created_at: string
          department_id: string | null
          email: string | null
          hire_date: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string
          phone: string | null
          role: string | null
          salary: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id: string
          phone?: string | null
          role?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          phone?: string | null
          role?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hr_partners: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          owner_id: string
          status: string
          type: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          status?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          status?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hr_performance_reviews: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          notes: string | null
          owner_id: string
          period: string
          rating: string | null
          reviewer_id: string | null
          score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          notes?: string | null
          owner_id: string
          period: string
          rating?: string | null
          reviewer_id?: string | null
          score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          notes?: string | null
          owner_id?: string
          period?: string
          rating?: string | null
          reviewer_id?: string | null
          score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hr_training_courses: {
        Row: {
          created_at: string
          description: string | null
          duration_hours: number | null
          end_date: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string
          provider: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id: string
          provider?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          provider?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hr_training_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          created_at: string
          employee_id: string
          id: string
          owner_id: string
          score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          created_at?: string
          employee_id: string
          id?: string
          owner_id: string
          score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          owner_id?: string
          score?: number | null
          status?: string
          updated_at?: string
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
      kmpa_documents: {
        Row: {
          category: string | null
          content_md: string | null
          created_at: string
          id: string
          owner_id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          category?: string | null
          content_md?: string | null
          created_at?: string
          id?: string
          owner_id: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          category?: string | null
          content_md?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      knowledge_articles: {
        Row: {
          body_md: string | null
          category: string | null
          created_at: string
          id: string
          owner_id: string
          status: string
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          body_md?: string | null
          category?: string | null
          created_at?: string
          id?: string
          owner_id: string
          status?: string
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          body_md?: string | null
          category?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          status?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      legal_cases: {
        Row: {
          client_name: string | null
          closed_at: string | null
          created_at: string
          external_reference: string | null
          id: string
          notes: string | null
          opened_at: string | null
          owner_id: string
          status: string
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          closed_at?: string | null
          created_at?: string
          external_reference?: string | null
          id?: string
          notes?: string | null
          opened_at?: string | null
          owner_id: string
          status?: string
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          closed_at?: string | null
          created_at?: string
          external_reference?: string | null
          id?: string
          notes?: string | null
          opened_at?: string | null
          owner_id?: string
          status?: string
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      legal_contracts: {
        Row: {
          case_id: string | null
          created_at: string
          expires_at: string | null
          file_url: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          party: string | null
          project_id: string | null
          signed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          expires_at?: string | null
          file_url?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          party?: string | null
          project_id?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          expires_at?: string | null
          file_url?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          party?: string | null
          project_id?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
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
      marketing_campaigns: {
        Row: {
          budget: number | null
          channel: string | null
          created_at: string
          end_date: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          spent: number | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          channel?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          spent?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          channel?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          spent?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_leads: {
        Row: {
          campaign_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
          score: number | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      partnership_agreements: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          metadata: Json | null
          name: string
          notes: string | null
          owner_id: string
          partner_name: string | null
          start_date: string | null
          status: string
          type: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          notes?: string | null
          owner_id: string
          partner_name?: string | null
          start_date?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          notes?: string | null
          owner_id?: string
          partner_name?: string | null
          start_date?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: []
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
      planning_boards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string
          settings: Json
          state: Database["public"]["Enums"]["central_state"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id: string
          settings?: Json
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          settings?: Json
          state?: Database["public"]["Enums"]["central_state"]
          updated_at?: string
        }
        Relationships: []
      }
      planning_element_history: {
        Row: {
          action: string
          actor_id: string | null
          board_id: string
          changed_fields: Json
          created_at: string
          element_id: string
          id: string
          snapshot: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          board_id: string
          changed_fields?: Json
          created_at?: string
          element_id: string
          id?: string
          snapshot?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          board_id?: string
          changed_fields?: Json
          created_at?: string
          element_id?: string
          id?: string
          snapshot?: Json | null
        }
        Relationships: []
      }
      planning_elements: {
        Row: {
          board_id: string
          content: Json
          created_at: string
          created_by: string
          element_type: Database["public"]["Enums"]["planning_element_type"]
          id: string
          locked_at: string | null
          locked_by: string | null
          metadata: Json
          position: Json
          rotation: number
          schema_version: number
          size: Json
          style: Json
          updated_at: string
          z_index: number
        }
        Insert: {
          board_id: string
          content?: Json
          created_at?: string
          created_by: string
          element_type: Database["public"]["Enums"]["planning_element_type"]
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          metadata?: Json
          position?: Json
          rotation?: number
          schema_version?: number
          size?: Json
          style?: Json
          updated_at?: string
          z_index?: number
        }
        Update: {
          board_id?: string
          content?: Json
          created_at?: string
          created_by?: string
          element_type?: Database["public"]["Enums"]["planning_element_type"]
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          metadata?: Json
          position?: Json
          rotation?: number
          schema_version?: number
          size?: Json
          style?: Json
          updated_at?: string
          z_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "planning_elements_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "planning_boards"
            referencedColumns: ["id"]
          },
        ]
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
      project_events: {
        Row: {
          actor_id: string
          aggregate_id: string
          aggregate_type: string
          board_id: string | null
          created_at: string
          event_kind: string
          event_type: string
          id: string
          payload: Json
          project_id: string
        }
        Insert: {
          actor_id: string
          aggregate_id: string
          aggregate_type: string
          board_id?: string | null
          created_at?: string
          event_kind: string
          event_type: string
          id?: string
          payload?: Json
          project_id: string
        }
        Update: {
          actor_id?: string
          aggregate_id?: string
          aggregate_type?: string
          board_id?: string | null
          created_at?: string
          event_kind?: string
          event_type?: string
          id?: string
          payload?: Json
          project_id?: string
        }
        Relationships: []
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
      smart_connectors: {
        Row: {
          board_id: string
          connector_element_id: string
          connector_kind: string
          created_at: string
          created_by: string
          id: string
          label: string | null
          metadata: Json
          relationship_type: string
          source_element_id: string
          style: Json
          target_element_id: string
          updated_at: string
        }
        Insert: {
          board_id: string
          connector_element_id: string
          connector_kind: string
          created_at?: string
          created_by: string
          id?: string
          label?: string | null
          metadata?: Json
          relationship_type: string
          source_element_id: string
          style?: Json
          target_element_id: string
          updated_at?: string
        }
        Update: {
          board_id?: string
          connector_element_id?: string
          connector_kind?: string
          created_at?: string
          created_by?: string
          id?: string
          label?: string | null
          metadata?: Json
          relationship_type?: string
          source_element_id?: string
          style?: Json
          target_element_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      smart_docs: {
        Row: {
          board_id: string
          content: Json
          created_at: string
          created_by: string
          element_id: string
          id: string
          metadata: Json
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          board_id: string
          content?: Json
          created_at?: string
          created_by: string
          element_id: string
          id?: string
          metadata?: Json
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          board_id?: string
          content?: Json
          created_at?: string
          created_by?: string
          element_id?: string
          id?: string
          metadata?: Json
          status?: string
          title?: string
          updated_at?: string
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
      spec_tab_items: {
        Row: {
          created_at: string
          department_code: string
          details: Json
          id: string
          kpis: Json
          meta: string | null
          owner_id: string
          position: number
          status: string | null
          subtitle: string | null
          tab_key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_code: string
          details?: Json
          id?: string
          kpis?: Json
          meta?: string | null
          owner_id?: string
          position?: number
          status?: string | null
          subtitle?: string | null
          tab_key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_code?: string
          details?: Json
          id?: string
          kpis?: Json
          meta?: string | null
          owner_id?: string
          position?: number
          status?: string | null
          subtitle?: string | null
          tab_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_queue: {
        Row: {
          board_id: string
          created_at: string
          created_by: string
          entity_id: string
          entity_table: string
          id: string
          operation: string
          payload: Json
          processed_at: string | null
          project_id: string | null
          status: string
        }
        Insert: {
          board_id: string
          created_at?: string
          created_by: string
          entity_id: string
          entity_table: string
          id?: string
          operation: string
          payload?: Json
          processed_at?: string | null
          project_id?: string | null
          status?: string
        }
        Update: {
          board_id?: string
          created_at?: string
          created_by?: string
          entity_id?: string
          entity_table?: string
          id?: string
          operation?: string
          payload?: Json
          processed_at?: string | null
          project_id?: string | null
          status?: string
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
      template_items: {
        Row: {
          body_md: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          kind: string
          metadata: Json | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          body_md?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind: string
          metadata?: Json | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          body_md?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          metadata?: Json | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
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
      user_settings: {
        Row: {
          category: string
          created_at: string
          id: string
          payload: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          payload?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          payload?: Json
          updated_at?: string
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
        | "depends_on"
        | "causes"
        | "blocks"
        | "references"
        | "funds"
        | "delivers"
        | "belongs_to"
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
      planning_element_type:
        | "sticky"
        | "shape"
        | "text"
        | "smart_doc"
        | "interactive_sheet"
        | "mindmap_node"
        | "frame"
        | "connector"
        | "entity_card"
        | "mindmap_connector"
        | "root_connector"
        | "visual_connector"
        | "visual_node"
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
        "depends_on",
        "causes",
        "blocks",
        "references",
        "funds",
        "delivers",
        "belongs_to",
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
      planning_element_type: [
        "sticky",
        "shape",
        "text",
        "smart_doc",
        "interactive_sheet",
        "mindmap_node",
        "frame",
        "connector",
        "entity_card",
        "mindmap_connector",
        "root_connector",
        "visual_connector",
        "visual_node",
      ],
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
