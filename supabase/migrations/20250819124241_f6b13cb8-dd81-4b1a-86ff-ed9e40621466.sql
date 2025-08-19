-- ==========================================
-- RLS POLICIES AND SECURITY FIXES
-- Version: 1.0.2  
-- Date: 2025-01-19
-- ==========================================

-- Fix security definer functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_board_role(board_id UUID, user_id UUID)
RETURNS board_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT bp.role
    FROM public.board_permissions bp
    WHERE bp.board_id = $1 AND bp.user_id = $2
    
    UNION ALL
    
    -- Board owner automatically gets host role
    SELECT 'host'::board_role
    FROM public.boards b
    WHERE b.id = $1 AND b.owner_id = $2
    
    LIMIT 1;
$$;

-- Fix user role check function
CREATE OR REPLACE FUNCTION public.user_has_board_role(board_id UUID, user_id UUID, min_role board_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT CASE 
        WHEN min_role = 'viewer' THEN 
            public.get_user_board_role($1, $2) IN ('viewer', 'editor', 'host')
        WHEN min_role = 'editor' THEN 
            public.get_user_board_role($1, $2) IN ('editor', 'host')
        WHEN min_role = 'host' THEN 
            public.get_user_board_role($1, $2) = 'host'
        ELSE FALSE
    END;
$$;

-- Fix update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ==========================================
-- BOARDS POLICIES
-- ==========================================

-- Users can view boards they have access to
CREATE POLICY "Users can view accessible boards" ON public.boards
    FOR SELECT USING (
        owner_id = auth.uid() 
        OR is_public = true
        OR public.user_has_board_role(id, auth.uid(), 'viewer'::board_role)
    );

-- Users can create their own boards
CREATE POLICY "Users can create boards" ON public.boards
    FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Board owners and hosts can update boards
CREATE POLICY "Hosts can update boards" ON public.boards
    FOR UPDATE USING (
        public.user_has_board_role(id, auth.uid(), 'host'::board_role)
    );

-- Board owners can delete boards
CREATE POLICY "Owners can delete boards" ON public.boards
    FOR DELETE USING (owner_id = auth.uid());

-- ==========================================
-- BOARD PERMISSIONS POLICIES
-- ==========================================

-- Users can view permissions for boards they have access to
CREATE POLICY "Users can view board permissions" ON public.board_permissions
    FOR SELECT USING (
        public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role)
    );

-- Hosts can manage permissions
CREATE POLICY "Hosts can manage permissions" ON public.board_permissions
    FOR ALL USING (
        public.user_has_board_role(board_id, auth.uid(), 'host'::board_role)
    );

-- ==========================================
-- BOARD OBJECTS POLICIES
-- ==========================================

-- Users can view objects in accessible boards
CREATE POLICY "Users can view board objects" ON public.board_objects
    FOR SELECT USING (
        public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role)
    );

-- Editors can create objects
CREATE POLICY "Editors can create objects" ON public.board_objects
    FOR INSERT WITH CHECK (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
        AND created_by = auth.uid()
    );

-- Editors can update objects
CREATE POLICY "Editors can update objects" ON public.board_objects
    FOR UPDATE USING (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
    );

-- Editors can delete objects  
CREATE POLICY "Editors can delete objects" ON public.board_objects
    FOR DELETE USING (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
    );

-- ==========================================
-- LINKS POLICIES  
-- ==========================================

-- Users can view links in accessible boards
CREATE POLICY "Users can view links" ON public.links
    FOR SELECT USING (
        public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role)
    );

-- Editors can manage links
CREATE POLICY "Editors can manage links" ON public.links
    FOR ALL USING (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
    ) WITH CHECK (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
        AND created_by = auth.uid()
    );

-- ==========================================
-- SNAPSHOTS POLICIES
-- ==========================================

-- Users can view snapshots of accessible boards
CREATE POLICY "Users can view snapshots" ON public.snapshots
    FOR SELECT USING (
        public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role)
    );

-- Editors can create snapshots
CREATE POLICY "Editors can create snapshots" ON public.snapshots
    FOR INSERT WITH CHECK (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
        AND created_by = auth.uid()
    );

-- Hosts can delete snapshots
CREATE POLICY "Hosts can delete snapshots" ON public.snapshots
    FOR DELETE USING (
        public.user_has_board_role(board_id, auth.uid(), 'host'::board_role)
    );

-- ==========================================
-- OP_LOG POLICIES
-- ==========================================

-- Users can view operations of accessible boards
CREATE POLICY "Users can view operations" ON public.op_log
    FOR SELECT USING (
        public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role)
    );

-- Editors can log operations
CREATE POLICY "Editors can log operations" ON public.op_log
    FOR INSERT WITH CHECK (
        public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
        AND user_id = auth.uid()
    );

-- ==========================================
-- PROJECT POLICIES
-- ==========================================

-- Users can view their projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (owner_id = auth.uid());

-- Users can manage their projects  
CREATE POLICY "Users can manage own projects" ON public.projects
    FOR ALL USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- ==========================================
-- PROJECT PHASES POLICIES
-- ==========================================

-- Users can access phases of their projects
CREATE POLICY "Users can access project phases" ON public.project_phases
    FOR ALL USING (
        project_id IN (
            SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
    );

-- ==========================================
-- PROJECT TASKS POLICIES
-- ==========================================

-- Users can view tasks of their projects or assigned to them
CREATE POLICY "Users can view relevant tasks" ON public.project_tasks
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR assigned_to = auth.uid()
    );

-- Project owners can manage tasks
CREATE POLICY "Owners can manage project tasks" ON public.project_tasks
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update project tasks" ON public.project_tasks
    FOR UPDATE USING (
        project_id IN (
            SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
    );

-- Assigned users can update their task status
CREATE POLICY "Assigned users can update task status" ON public.project_tasks
    FOR UPDATE USING (assigned_to = auth.uid());

-- ==========================================
-- TELEMETRY POLICIES
-- ==========================================

-- Users can only insert their own telemetry
CREATE POLICY "Users can insert own telemetry" ON public.telemetry_events
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own telemetry
CREATE POLICY "Users can view own telemetry" ON public.telemetry_events
    FOR SELECT USING (user_id = auth.uid());

-- ==========================================
-- STORAGE BUCKET AND POLICIES
-- ==========================================

-- Create storage bucket for board assets
INSERT INTO storage.buckets (id, name, public) VALUES ('board-assets', 'board-assets', false);

-- Allow authenticated users to view files in boards they have access to
CREATE POLICY "Users can view board assets" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'board-assets' 
        AND auth.role() = 'authenticated'
        AND (
            -- Extract board_id from path and compare as UUID
            CASE 
                WHEN array_length(storage.foldername(name), 1) >= 1 THEN
                    (storage.foldername(name))[1]::UUID IN (
                        SELECT b.id
                        FROM public.boards b
                        WHERE public.user_has_board_role(b.id, auth.uid(), 'viewer'::board_role)
                    )
                ELSE FALSE
            END
        )
    );

-- Allow editors to upload files to their accessible boards
CREATE POLICY "Editors can upload board assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'board-assets'
        AND auth.role() = 'authenticated'
        AND (
            CASE 
                WHEN array_length(storage.foldername(name), 1) >= 1 THEN
                    (storage.foldername(name))[1]::UUID IN (
                        SELECT b.id  
                        FROM public.boards b
                        WHERE public.user_has_board_role(b.id, auth.uid(), 'editor'::board_role)
                    )
                ELSE FALSE
            END
        )
    );

-- Allow editors to delete files from their accessible boards
CREATE POLICY "Editors can delete board assets" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'board-assets'
        AND auth.role() = 'authenticated' 
        AND (
            CASE 
                WHEN array_length(storage.foldername(name), 1) >= 1 THEN
                    (storage.foldername(name))[1]::UUID IN (
                        SELECT b.id
                        FROM public.boards b  
                        WHERE public.user_has_board_role(b.id, auth.uid(), 'editor'::board_role)
                    )
                ELSE FALSE
            END
        )
    );

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================

-- Enable realtime for collaborative features
ALTER PUBLICATION supabase_realtime ADD TABLE public.boards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.board_objects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.links;
ALTER PUBLICATION supabase_realtime ADD TABLE public.op_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.board_permissions;

-- Set replica identity for complete change data
ALTER TABLE public.boards REPLICA IDENTITY FULL;
ALTER TABLE public.board_objects REPLICA IDENTITY FULL;
ALTER TABLE public.links REPLICA IDENTITY FULL;
ALTER TABLE public.op_log REPLICA IDENTITY FULL;
ALTER TABLE public.board_permissions REPLICA IDENTITY FULL;