CREATE TABLE public.spec_tab_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  department_code text NOT NULL,
  tab_key text NOT NULL,
  title text NOT NULL,
  subtitle text,
  status text,
  meta text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  kpis jsonb NOT NULL DEFAULT '[]'::jsonb,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_spec_tab_items_owner_tab ON public.spec_tab_items (owner_id, department_code, tab_key);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.spec_tab_items TO authenticated;
GRANT ALL ON public.spec_tab_items TO service_role;

ALTER TABLE public.spec_tab_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners manage spec_tab_items"
  ON public.spec_tab_items
  FOR ALL
  TO authenticated
  USING ((owner_id = auth.uid()) OR is_owner(auth.uid()))
  WITH CHECK ((owner_id = auth.uid()) OR is_owner(auth.uid()));

CREATE TRIGGER trg_spec_tab_items_updated_at
  BEFORE UPDATE ON public.spec_tab_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();