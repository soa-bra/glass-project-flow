
-- BCM members
CREATE TABLE public.bcm_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  segment text,
  status text NOT NULL DEFAULT 'active',
  joined_at date DEFAULT CURRENT_DATE,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bcm_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage bcm_members" ON public.bcm_members
  FOR ALL TO authenticated
  USING ((owner_id = auth.uid()) OR is_owner(auth.uid()))
  WITH CHECK ((owner_id = auth.uid()) OR is_owner(auth.uid()));
CREATE TRIGGER bcm_members_updated_at BEFORE UPDATE ON public.bcm_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partnership agreements
CREATE TABLE public.partnership_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  partner_name text,
  type text,
  status text NOT NULL DEFAULT 'active',
  start_date date,
  end_date date,
  value numeric DEFAULT 0,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.partnership_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage partnership_agreements" ON public.partnership_agreements
  FOR ALL TO authenticated
  USING ((owner_id = auth.uid()) OR is_owner(auth.uid()))
  WITH CHECK ((owner_id = auth.uid()) OR is_owner(auth.uid()));
CREATE TRIGGER partnership_agreements_updated_at BEFORE UPDATE ON public.partnership_agreements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Knowledge articles
CREATE TABLE public.knowledge_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  body_md text,
  category text,
  status text NOT NULL DEFAULT 'draft',
  tags text[] DEFAULT ARRAY[]::text[],
  version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage knowledge_articles" ON public.knowledge_articles
  FOR ALL TO authenticated
  USING ((owner_id = auth.uid()) OR is_owner(auth.uid()))
  WITH CHECK ((owner_id = auth.uid()) OR is_owner(auth.uid()));
CREATE TRIGGER knowledge_articles_updated_at BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
