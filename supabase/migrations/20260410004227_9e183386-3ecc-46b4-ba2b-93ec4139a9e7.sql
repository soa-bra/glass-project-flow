
-- 1. board_objects
CREATE TABLE public.board_objects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'smart',
  position JSONB NOT NULL DEFAULT '{"x":0,"y":0}',
  size JSONB NOT NULL DEFAULT '{"width":200,"height":200}',
  metadata JSONB DEFAULT '{}',
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.board_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage board_objects" ON public.board_objects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. smart_element_data
CREATE TABLE public.smart_element_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_object_id UUID NOT NULL REFERENCES public.board_objects(id) ON DELETE CASCADE,
  smart_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.smart_element_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage smart_element_data" ON public.smart_element_data FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. board_invite_links
CREATE TABLE public.board_invite_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.board_invite_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage board_invite_links" ON public.board_invite_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. board_join_requests
CREATE TABLE public.board_join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id TEXT NOT NULL,
  invite_link_id UUID REFERENCES public.board_invite_links(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  granted_role TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.board_join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage board_join_requests" ON public.board_join_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  organization_id UUID REFERENCES public.organizations(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. project_phases
CREATE TABLE public.project_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage project_phases" ON public.project_phases FOR ALL TO authenticated USING (true) WITH CHECK (true);
