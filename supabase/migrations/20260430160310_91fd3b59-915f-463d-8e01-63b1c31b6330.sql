
-- ============================================================
-- P1 + P2 — Central Model + RBAC Foundation + Audit + Outbox
-- ============================================================

-- 1. DROP unused legacy tables (all empty, no code references)
DROP TABLE IF EXISTS public.kv_store_06871a1a CASCADE;
DROP TABLE IF EXISTS public.kv_store_4c8546af CASCADE;
DROP TABLE IF EXISTS public.kv_store_7c857198 CASCADE;
DROP TABLE IF EXISTS public.kv_store_7e6493e3 CASCADE;
DROP TABLE IF EXISTS public.kv_store_8cde9397 CASCADE;
DROP TABLE IF EXISTS public.project_tasks CASCADE;
DROP TABLE IF EXISTS public.project_phases CASCADE;

-- Legacy `projects` table is empty and unused by frontend;
-- invoices.project_id has no FK so safe to drop.
DROP TABLE IF EXISTS public.projects CASCADE;

-- ============================================================
-- 2. CENTRAL MODEL ENUMS
-- ============================================================

CREATE TYPE public.central_state AS ENUM (
  'draft','planned','active','blocked','paused','completed','cancelled','archived','failed'
);
CREATE TYPE public.central_priority AS ENUM ('low','medium','high','critical');
CREATE TYPE public.central_complexity AS ENUM ('trivial','simple','moderate','complex','critical');
CREATE TYPE public.central_dependency_type AS ENUM ('execution','data','technical','operational','time');
CREATE TYPE public.central_entity_type AS ENUM ('central_board','department','project','task','tool','engine_job','project_card','task_card');
CREATE TYPE public.department_project_role AS ENUM ('owner','supervisor');
CREATE TYPE public.tool_kind AS ENUM ('board_widget','dashboard_panel','workflow_tool','analysis_tool','integration_tool');
CREATE TYPE public.engine_job_kind AS ENUM ('automation','data_processing','orchestration','sync','analytics','validation');
CREATE TYPE public.task_tool_engine_relation_type AS ENUM ('produces','binds','executes');

-- ============================================================
-- 3. CENTRAL MODEL TABLES
-- ============================================================

CREATE TABLE public.central_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  start_date timestamptz,
  due_date timestamptz,
  budget numeric(14,2),
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (budget IS NULL OR budget >= 0)
);

CREATE TABLE public.department_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role public.department_project_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (department_id, project_id)
);

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  linked_project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  assignee_id uuid,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  estimated_duration numeric(12,2) NOT NULL DEFAULT 0,
  estimated_cost numeric(14,2) NOT NULL DEFAULT 0,
  complexity public.central_complexity NOT NULL DEFAULT 'simple',
  required_team_size integer NOT NULL DEFAULT 1,
  start_date timestamptz,
  due_date timestamptz,
  actual_duration numeric(12,2),
  actual_cost numeric(14,2),
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (estimated_duration >= 0),
  CHECK (estimated_cost >= 0),
  CHECK (required_team_size > 0),
  CHECK (actual_duration IS NULL OR actual_duration >= 0),
  CHECK (actual_cost IS NULL OR actual_cost >= 0)
);

CREATE TABLE public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  central_board_id uuid NOT NULL REFERENCES public.central_boards(id) ON DELETE CASCADE,
  produced_by_task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  kind public.tool_kind NOT NULL,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.engine_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  kind public.engine_job_kind NOT NULL,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  produced_by_task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  triggered_by_tool_id uuid REFERENCES public.tools(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.task_tool_engine_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  engine_job_id uuid NOT NULL REFERENCES public.engine_jobs(id) ON DELETE CASCADE,
  relation_type public.task_tool_engine_relation_type NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (task_id, tool_id, engine_job_id)
);

CREATE TABLE public.project_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  linked_project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  central_board_id uuid REFERENCES public.central_boards(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  projection text NOT NULL DEFAULT 'standard' CHECK (projection IN ('compact','standard','executive')),
  visible_metrics text[] NOT NULL DEFAULT ARRAY['status','progress','tasks'],
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.task_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  linked_task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  linked_project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  central_board_id uuid REFERENCES public.central_boards(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  owner_id uuid NOT NULL,
  priority public.central_priority NOT NULL DEFAULT 'medium',
  projection text NOT NULL DEFAULT 'standard' CHECK (projection IN ('compact','standard','executive')),
  visible_metrics text[] NOT NULL DEFAULT ARRAY['state','priority','complexity'],
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity_type public.central_entity_type NOT NULL,
  from_entity_id uuid NOT NULL,
  to_entity_type public.central_entity_type NOT NULL,
  to_entity_id uuid NOT NULL,
  dependency_type public.central_dependency_type NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (from_entity_id <> to_entity_id)
);

CREATE INDEX idx_projects_state ON public.projects(state);
CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_tasks_project ON public.tasks(linked_project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tools_board ON public.tools(central_board_id);
CREATE INDEX idx_engine_jobs_state ON public.engine_jobs(state);
CREATE INDEX idx_dependencies_from ON public.dependencies(from_entity_type, from_entity_id);
CREATE INDEX idx_dependencies_to ON public.dependencies(to_entity_type, to_entity_id);
CREATE INDEX idx_project_cards_project ON public.project_cards(linked_project_id);
CREATE INDEX idx_task_cards_task ON public.task_cards(linked_task_id);

-- ============================================================
-- 4. PROFILES
-- ============================================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_user ON public.profiles(user_id);

-- ============================================================
-- 5. RBAC — 18 ENTERPRISE ROLES
-- ============================================================

CREATE TYPE public.app_role AS ENUM (
  'owner',
  'ciso',
  'dpo',
  'infra_admin',
  'finance_admin',
  'department_manager',
  'project_manager',
  'release_manager',
  'qa_lead',
  'sre',
  'brand_manager',
  'dam_curator',
  'hr_analyst',
  'finance_auditor',
  'ai_analyst',
  'content_reviewer',
  'legal_archivist',
  'help_desk_agent',
  'team_member',
  'guest',
  'service_account'
);

CREATE TYPE public.role_scope_type AS ENUM ('global','department','project','board');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  scope_type public.role_scope_type NOT NULL DEFAULT 'global',
  scope_id uuid,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  UNIQUE (user_id, role, scope_type, scope_id)
);

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_lookup ON public.user_roles(user_id, role, scope_type);

-- Permissions catalog (seeded incrementally; just structure here)
CREATE TABLE public.permissions (
  code text PRIMARY KEY,
  description text NOT NULL,
  module text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.role_permissions (
  role public.app_role NOT NULL,
  permission_code text NOT NULL REFERENCES public.permissions(code) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role, permission_code)
);

-- ============================================================
-- 6. SECURITY DEFINER HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_role(
  _user_id uuid,
  _role public.app_role,
  _scope_type public.role_scope_type DEFAULT 'global',
  _scope_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND ur.scope_type = _scope_type
      AND (_scope_id IS NULL OR ur.scope_id = _scope_id)
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = 'owner'
      AND ur.scope_type = 'global'
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id uuid,
  _permission_code text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = _user_id
      AND rp.permission_code = _permission_code
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  ) OR public.is_owner(_user_id);
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role, public.role_scope_type, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_owner(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role, public.role_scope_type, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO authenticated;

-- ============================================================
-- 7. AUTO-PROVISION PROFILE + DEFAULT ROLE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  is_first_user boolean;
BEGIN
  -- create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  -- assign default role: 'owner' for the very first user, 'team_member' otherwise
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner' AND scope_type = 'global')
    INTO is_first_user;

  IF is_first_user THEN
    INSERT INTO public.user_roles (user_id, role, scope_type)
    VALUES (NEW.id, 'owner', 'global');
  ELSE
    INSERT INTO public.user_roles (user_id, role, scope_type)
    VALUES (NEW.id, 'team_member', 'global');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. AUDIT EVENTS
-- ============================================================

CREATE TYPE public.audit_decision AS ENUM ('allowed','denied','error');

CREATE TABLE public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  scope_type public.role_scope_type,
  scope_id uuid,
  decision public.audit_decision NOT NULL,
  reason text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_events_actor ON public.audit_events(actor_id, created_at DESC);
CREATE INDEX idx_audit_events_resource ON public.audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_events_action ON public.audit_events(action, created_at DESC);

-- ============================================================
-- 9. EVENT OUTBOX + DLQ
-- ============================================================

CREATE TABLE public.event_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  dispatched_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_outbox_pending ON public.event_outbox(created_at) WHERE dispatched_at IS NULL;

CREATE TABLE public.event_dlq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_event_id uuid,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  error text NOT NULL,
  failed_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. TIMESTAMP TRIGGERS
-- ============================================================

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_central_boards_updated_at BEFORE UPDATE ON public.central_boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_tools_updated_at BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_engine_jobs_updated_at BEFORE UPDATE ON public.engine_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_task_tool_engine_links_updated_at BEFORE UPDATE ON public.task_tool_engine_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_project_cards_updated_at BEFORE UPDATE ON public.project_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_task_cards_updated_at BEFORE UPDATE ON public.task_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_dependencies_updated_at BEFORE UPDATE ON public.dependencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 11. ENABLE RLS
-- ============================================================

ALTER TABLE public.central_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tool_engine_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_dlq ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 12. RLS POLICIES — Owner bypass + per-table rules
-- ============================================================

-- profiles
CREATE POLICY "users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- user_roles
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "owner manages roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));

-- permissions catalog (read-only for authenticated; managed by owner only)
CREATE POLICY "auth read permissions" ON public.permissions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "owner manages permissions" ON public.permissions
  FOR ALL TO authenticated USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));

CREATE POLICY "auth read role_permissions" ON public.role_permissions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "owner manages role_permissions" ON public.role_permissions
  FOR ALL TO authenticated USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));

-- central_boards
CREATE POLICY "owners manage central_boards" ON public.central_boards
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- departments
CREATE POLICY "owners manage departments" ON public.departments
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- projects
CREATE POLICY "owners manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- department_projects (link rows allowed if user owns either side)
CREATE POLICY "manage department_projects" ON public.department_projects
  FOR ALL TO authenticated
  USING (
    public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.departments d WHERE d.id = department_projects.department_id AND d.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = department_projects.project_id AND p.owner_id = auth.uid())
  )
  WITH CHECK (
    public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.departments d WHERE d.id = department_projects.department_id AND d.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = department_projects.project_id AND p.owner_id = auth.uid())
  );

-- tasks
CREATE POLICY "tasks visibility" ON public.tasks
  FOR SELECT TO authenticated USING (
    owner_id = auth.uid() OR assignee_id = auth.uid() OR public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = tasks.linked_project_id AND p.owner_id = auth.uid())
  );
CREATE POLICY "tasks owner manage" ON public.tasks
  FOR INSERT TO authenticated WITH CHECK (
    public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = tasks.linked_project_id AND p.owner_id = auth.uid())
  );
CREATE POLICY "tasks owner update" ON public.tasks
  FOR UPDATE TO authenticated USING (
    owner_id = auth.uid() OR assignee_id = auth.uid() OR public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = tasks.linked_project_id AND p.owner_id = auth.uid())
  );
CREATE POLICY "tasks owner delete" ON public.tasks
  FOR DELETE TO authenticated USING (
    public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = tasks.linked_project_id AND p.owner_id = auth.uid())
  );

-- tools
CREATE POLICY "owners manage tools" ON public.tools
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- engine_jobs
CREATE POLICY "owners manage engine_jobs" ON public.engine_jobs
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- task_tool_engine_links
CREATE POLICY "manage task_tool_engine_links" ON public.task_tool_engine_links
  FOR ALL TO authenticated
  USING (
    public.is_owner(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_tool_engine_links.task_id
        AND (t.owner_id = auth.uid() OR t.assignee_id = auth.uid())
    )
  )
  WITH CHECK (
    public.is_owner(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_tool_engine_links.task_id
        AND (t.owner_id = auth.uid() OR t.assignee_id = auth.uid())
    )
  );

-- project_cards
CREATE POLICY "owners manage project_cards" ON public.project_cards
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- task_cards
CREATE POLICY "owners manage task_cards" ON public.task_cards
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

-- dependencies (authenticated read; owner full)
CREATE POLICY "auth read dependencies" ON public.dependencies
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth manage dependencies" ON public.dependencies
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "owner update dependencies" ON public.dependencies
  FOR UPDATE TO authenticated USING (public.is_owner(auth.uid()));
CREATE POLICY "owner delete dependencies" ON public.dependencies
  FOR DELETE TO authenticated USING (public.is_owner(auth.uid()));

-- audit_events: insert by any authenticated; read own + owner reads all
CREATE POLICY "audit insert auth" ON public.audit_events
  FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);
CREATE POLICY "audit read own" ON public.audit_events
  FOR SELECT TO authenticated USING (actor_id = auth.uid() OR public.is_owner(auth.uid()));

-- event_outbox & event_dlq: locked to owner-only at app level (service role bypasses)
CREATE POLICY "owner reads outbox" ON public.event_outbox
  FOR SELECT TO authenticated USING (public.is_owner(auth.uid()));
CREATE POLICY "owner reads dlq" ON public.event_dlq
  FOR SELECT TO authenticated USING (public.is_owner(auth.uid()));

-- ============================================================
-- 13. SEED CORE PERMISSIONS (minimal, expanded later)
-- ============================================================

INSERT INTO public.permissions (code, description, module) VALUES
  ('central.project.create', 'Create central projects', 'projects'),
  ('central.project.update', 'Update central projects', 'projects'),
  ('central.project.delete', 'Delete central projects', 'projects'),
  ('central.task.create',    'Create tasks',           'tasks'),
  ('central.task.update',    'Update tasks',           'tasks'),
  ('central.task.assign',    'Assign tasks to users',  'tasks'),
  ('central.department.create', 'Create departments',  'departments'),
  ('central.department.update', 'Update departments',  'departments'),
  ('central.board.create',   'Create central boards',  'boards'),
  ('central.tool.create',    'Create tools',           'tools'),
  ('central.engine_job.trigger', 'Trigger engine jobs','engine_jobs'),
  ('audit.read.all',         'Read all audit events',  'audit'),
  ('rbac.manage',            'Manage roles & permissions', 'rbac')
ON CONFLICT (code) DO NOTHING;

-- Owner gets everything implicitly via is_owner(); seed common bindings for managers
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('project_manager', 'central.project.create'),
  ('project_manager', 'central.project.update'),
  ('project_manager', 'central.task.create'),
  ('project_manager', 'central.task.update'),
  ('project_manager', 'central.task.assign'),
  ('department_manager', 'central.department.update'),
  ('department_manager', 'central.project.create'),
  ('department_manager', 'central.task.assign'),
  ('team_member', 'central.task.update'),
  ('finance_auditor', 'audit.read.all')
ON CONFLICT DO NOTHING;
