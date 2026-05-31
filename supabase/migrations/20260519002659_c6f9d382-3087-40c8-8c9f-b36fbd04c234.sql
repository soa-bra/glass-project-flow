
-- P5: Archive Workspace — central archive_documents table
CREATE TABLE IF NOT EXISTS public.archive_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  category text NOT NULL,
  title text NOT NULL,
  description text,
  file_url text,
  version text DEFAULT 'v1',
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_archive_documents_owner ON public.archive_documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_archive_documents_category ON public.archive_documents(category);

ALTER TABLE public.archive_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners read archive_documents"
  ON public.archive_documents FOR SELECT
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()));

CREATE POLICY "owners insert archive_documents"
  ON public.archive_documents FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR public.is_owner(auth.uid()));

CREATE POLICY "owners update archive_documents"
  ON public.archive_documents FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()));

CREATE POLICY "owners delete archive_documents"
  ON public.archive_documents FOR DELETE
  USING (owner_id = auth.uid() OR public.is_owner(auth.uid()));

CREATE TRIGGER trg_archive_documents_updated_at
  BEFORE UPDATE ON public.archive_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
