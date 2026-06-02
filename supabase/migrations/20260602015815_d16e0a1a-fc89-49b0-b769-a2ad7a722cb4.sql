
CREATE TABLE IF NOT EXISTS public.smart_connectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_element_id uuid NOT NULL UNIQUE,
  board_id uuid NOT NULL,
  source_element_id uuid NOT NULL,
  target_element_id uuid NOT NULL,
  relationship_type text NOT NULL,
  connector_kind text NOT NULL,
  label text,
  style jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.smart_connectors TO authenticated;
GRANT ALL ON public.smart_connectors TO service_role;

ALTER TABLE public.smart_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "smart_connectors_select_auth"
  ON public.smart_connectors FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "smart_connectors_insert_own"
  ON public.smart_connectors FOR INSERT
  TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "smart_connectors_update_own"
  ON public.smart_connectors FOR UPDATE
  TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

CREATE POLICY "smart_connectors_delete_own"
  ON public.smart_connectors FOR DELETE
  TO authenticated USING (created_by = auth.uid());

CREATE INDEX IF NOT EXISTS idx_smart_connectors_board ON public.smart_connectors(board_id);
CREATE INDEX IF NOT EXISTS idx_smart_connectors_source ON public.smart_connectors(source_element_id);
CREATE INDEX IF NOT EXISTS idx_smart_connectors_target ON public.smart_connectors(target_element_id);
