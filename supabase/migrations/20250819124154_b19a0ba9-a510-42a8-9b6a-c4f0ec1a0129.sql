-- ==========================================
-- SoaBra Glass Project Flow - Database Schema (Fixed)
-- Version: 1.0.1
-- Date: 2025-01-19
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==========================================
-- ENUMS AND TYPES
-- ==========================================

-- Board permission roles
CREATE TYPE board_role AS ENUM ('host', 'editor', 'viewer');

-- Project status
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');

-- Task status  
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'completed');

-- Task priority
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Board object types
CREATE TYPE board_object_type AS ENUM ('text', 'sticky_note', 'shape', 'image', 'drawing', 'connector', 'template');

-- Operation types for op_log
CREATE TYPE operation_type AS ENUM ('create', 'update', 'delete', 'move', 'resize');

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Boards (Main whiteboard entities)
CREATE TABLE public.boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}',
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Board permissions (RLS foundation)
CREATE TABLE public.board_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role board_role NOT NULL DEFAULT 'viewer',
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(board_id, user_id)
);

-- Board objects (Canvas elements)
CREATE TABLE public.board_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    type board_object_type NOT NULL,
    position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
    size JSONB NOT NULL DEFAULT '{"width": 100, "height": 100}',
    rotation REAL DEFAULT 0,
    z_index INTEGER DEFAULT 0,
    style JSONB DEFAULT '{}',
    content TEXT,
    metadata JSONB DEFAULT '{}',
    locked BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links between board objects
CREATE TABLE public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    from_object_id UUID NOT NULL REFERENCES public.board_objects(id) ON DELETE CASCADE,
    to_object_id UUID NOT NULL REFERENCES public.board_objects(id) ON DELETE CASCADE,
    style JSONB DEFAULT '{"color": "#000000", "width": 2, "type": "straight"}',
    label TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (from_object_id != to_object_id)
);

-- Board snapshots (Version control)
CREATE TABLE public.snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    data JSONB NOT NULL,
    file_size INTEGER,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operation log (Real-time sync)
CREATE TABLE public.op_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    operation_type operation_type NOT NULL,
    object_type TEXT NOT NULL,
    object_id UUID NOT NULL,
    data JSONB NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROJECT MANAGEMENT TABLES
-- ==========================================

-- Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status project_status DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project phases
CREATE TABLE public.project_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status project_status DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project tasks
CREATE TABLE public.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES public.project_phases(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ANALYTICS AND TELEMETRY
-- ==========================================

-- Telemetry events
CREATE TABLE public.telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    session_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Boards indexes
CREATE INDEX idx_boards_owner_id ON public.boards(owner_id);
CREATE INDEX idx_boards_created_at ON public.boards(created_at DESC);
CREATE INDEX idx_boards_updated_at ON public.boards(updated_at DESC);
CREATE INDEX idx_boards_public ON public.boards(is_public) WHERE is_public = true;

-- Board permissions indexes
CREATE INDEX idx_board_permissions_board_id ON public.board_permissions(board_id);
CREATE INDEX idx_board_permissions_user_id ON public.board_permissions(user_id);
CREATE INDEX idx_board_permissions_role ON public.board_permissions(role);

-- Board objects indexes
CREATE INDEX idx_board_objects_board_id ON public.board_objects(board_id);
CREATE INDEX idx_board_objects_type ON public.board_objects(type);
CREATE INDEX idx_board_objects_created_by ON public.board_objects(created_by);
CREATE INDEX idx_board_objects_updated_at ON public.board_objects(updated_at DESC);
CREATE INDEX idx_board_objects_z_index ON public.board_objects(z_index);

-- Links indexes
CREATE INDEX idx_links_board_id ON public.links(board_id);
CREATE INDEX idx_links_from_object_id ON public.links(from_object_id);
CREATE INDEX idx_links_to_object_id ON public.links(to_object_id);

-- Operation log indexes
CREATE INDEX idx_op_log_board_id ON public.op_log(board_id);
CREATE INDEX idx_op_log_created_at ON public.op_log(created_at DESC);
CREATE INDEX idx_op_log_user_id ON public.op_log(user_id);
CREATE INDEX idx_op_log_object_id ON public.op_log(object_id);

-- Projects indexes
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_updated_at ON public.projects(updated_at DESC);

-- Project phases indexes
CREATE INDEX idx_project_phases_project_id ON public.project_phases(project_id);
CREATE INDEX idx_project_phases_order ON public.project_phases(project_id, order_index);

-- Project tasks indexes
CREATE INDEX idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX idx_project_tasks_phase_id ON public.project_tasks(phase_id);
CREATE INDEX idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX idx_project_tasks_due_date ON public.project_tasks(due_date);

-- Telemetry indexes
CREATE INDEX idx_telemetry_events_type ON public.telemetry_events(event_type);
CREATE INDEX idx_telemetry_events_user_id ON public.telemetry_events(user_id);
CREATE INDEX idx_telemetry_events_created_at ON public.telemetry_events(created_at DESC);
CREATE INDEX idx_telemetry_events_session_id ON public.telemetry_events(session_id);

-- GIN indexes for JSONB columns
CREATE INDEX idx_boards_settings_gin ON public.boards USING GIN(settings);
CREATE INDEX idx_board_objects_metadata_gin ON public.board_objects USING GIN(metadata);
CREATE INDEX idx_telemetry_metadata_gin ON public.telemetry_events USING GIN(metadata);

-- ==========================================
-- SECURITY DEFINER FUNCTIONS
-- ==========================================

-- Get user's role for a board (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_board_role(board_id UUID, user_id UUID)
RETURNS board_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
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

-- Check if user has minimum role for board
CREATE OR REPLACE FUNCTION public.user_has_board_role(board_id UUID, user_id UUID, min_role board_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
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

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply triggers
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON public.boards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_board_objects_updated_at BEFORE UPDATE ON public.board_objects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_phases_updated_at BEFORE UPDATE ON public.project_phases
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON public.project_tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.op_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;