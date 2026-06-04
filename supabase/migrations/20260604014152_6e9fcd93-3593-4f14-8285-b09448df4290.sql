
-- smart_docs: rich docs attached to canvas elements
CREATE TABLE IF NOT EXISTS public.smart_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL,
  element_id uuid NOT NULL UNIQUE,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.smart_docs TO authenticated;
GRANT ALL ON public.smart_docs TO service_role;
ALTER TABLE public.smart_docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editors manage smart_docs" ON public.smart_docs FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role))
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role));
CREATE POLICY "viewers read smart_docs" ON public.smart_docs FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- data_links: links between elements / projects
CREATE TABLE IF NOT EXISTS public.data_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL,
  project_id uuid,
  source_element_id uuid,
  target_element_id uuid,
  link_kind text NOT NULL,
  label text,
  mapping jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_links TO authenticated;
GRANT ALL ON public.data_links TO service_role;
ALTER TABLE public.data_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editors manage data_links" ON public.data_links FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role))
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role));
CREATE POLICY "viewers read data_links" ON public.data_links FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- element_transformations: history of smart conversions
CREATE TABLE IF NOT EXISTS public.element_transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL,
  source_element_id uuid NOT NULL,
  transformation_type text NOT NULL,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.element_transformations TO authenticated;
GRANT ALL ON public.element_transformations TO service_role;
ALTER TABLE public.element_transformations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editors manage element_transformations" ON public.element_transformations FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role))
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role));
CREATE POLICY "viewers read element_transformations" ON public.element_transformations FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- sync_queue: pending entity sync operations
CREATE TABLE IF NOT EXISTS public.sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL,
  project_id uuid,
  entity_table text NOT NULL,
  entity_id uuid NOT NULL,
  operation text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_queue TO authenticated;
GRANT ALL ON public.sync_queue TO service_role;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editors manage sync_queue" ON public.sync_queue FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role))
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role));

-- project_events: domain events generated for a project
CREATE TABLE IF NOT EXISTS public.project_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  board_id uuid,
  event_kind text NOT NULL,
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.project_events TO authenticated;
GRANT ALL ON public.project_events TO service_role;
ALTER TABLE public.project_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project owners read project_events" ON public.project_events FOR SELECT TO authenticated
  USING (
    public.is_owner(auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_events.project_id AND p.owner_id = auth.uid())
    OR (board_id IS NOT NULL AND public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role))
  );
CREATE POLICY "auth insert project_events" ON public.project_events FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());
