
-- ============== HR ==============
CREATE TABLE public.hr_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  department_id uuid,
  name text NOT NULL,
  role text,
  email text,
  phone text,
  hire_date date,
  status text NOT NULL DEFAULT 'active',
  salary numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  date date NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  status text NOT NULL DEFAULT 'present',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  provider text,
  duration_hours numeric DEFAULT 0,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'planned',
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_training_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  course_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'enrolled',
  completion_date date,
  score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_performance_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  reviewer_id uuid,
  period text NOT NULL,
  score numeric,
  rating text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  type text,
  contact_email text,
  contact_phone text,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== CRM ==============
CREATE TABLE public.crm_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  segment text,
  status text NOT NULL DEFAULT 'active',
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.crm_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  customer_id uuid,
  name text NOT NULL,
  value numeric DEFAULT 0,
  probability numeric DEFAULT 0,
  stage text NOT NULL DEFAULT 'prospecting',
  expected_close date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  customer_id uuid,
  opportunity_id uuid,
  type text NOT NULL,
  subject text NOT NULL,
  due_date timestamptz,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.crm_service_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  customer_id uuid,
  subject text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  assignee_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== Financial ==============
CREATE TABLE public.financial_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  project_id uuid,
  department_id uuid,
  name text NOT NULL,
  period text NOT NULL DEFAULT 'monthly',
  start_date date,
  end_date date,
  planned_amount numeric NOT NULL DEFAULT 0,
  spent_amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SAR',
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  budget_id uuid,
  project_id uuid,
  kind text NOT NULL CHECK (kind IN ('income','expense')),
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SAR',
  date date NOT NULL DEFAULT CURRENT_DATE,
  vendor text,
  category text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== Legal ==============
CREATE TABLE public.legal_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  type text,
  status text NOT NULL DEFAULT 'open',
  client_name text,
  opened_at date DEFAULT CURRENT_DATE,
  closed_at date,
  notes text,
  external_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.legal_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  case_id uuid,
  project_id uuid,
  name text NOT NULL,
  party text,
  signed_at date,
  expires_at date,
  status text NOT NULL DEFAULT 'draft',
  file_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== Brand ==============
CREATE TABLE public.brand_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  category text,
  file_url text,
  status text NOT NULL DEFAULT 'draft',
  tags text[] DEFAULT ARRAY[]::text[],
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.brand_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  body_md text,
  version text NOT NULL DEFAULT '1.0',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== Marketing ==============
CREATE TABLE public.marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  channel text,
  status text NOT NULL DEFAULT 'planned',
  start_date date,
  end_date date,
  budget numeric DEFAULT 0,
  spent numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.marketing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  campaign_id uuid,
  name text NOT NULL,
  email text,
  phone text,
  source text,
  status text NOT NULL DEFAULT 'new',
  score numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== CSR ==============
CREATE TABLE public.csr_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  type text,
  status text NOT NULL DEFAULT 'planned',
  start_date date,
  end_date date,
  budget numeric DEFAULT 0,
  beneficiaries_count integer DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.csr_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  initiative_id uuid,
  requester_name text NOT NULL,
  requester_email text,
  subject text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  assignee_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== KMPA ==============
CREATE TABLE public.kmpa_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  category text,
  version text NOT NULL DEFAULT '1.0',
  status text NOT NULL DEFAULT 'draft',
  content_md text,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== Templates ==============
CREATE TABLE public.template_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  kind text NOT NULL,
  name text NOT NULL,
  description text,
  body_md text,
  category text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== Enable RLS + Policies (loop-style for brevity) ==============
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'hr_employees','hr_attendance','hr_training_courses','hr_training_enrollments',
    'hr_performance_reviews','hr_partners',
    'crm_customers','crm_opportunities','crm_activities','crm_service_tickets',
    'financial_budgets','financial_transactions',
    'legal_cases','legal_contracts',
    'brand_assets','brand_guidelines',
    'marketing_campaigns','marketing_leads',
    'csr_initiatives','csr_tickets',
    'kmpa_documents','template_items'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format($p$CREATE POLICY "owners manage %1$s" ON public.%1$I FOR ALL TO authenticated USING ((owner_id = auth.uid()) OR is_owner(auth.uid())) WITH CHECK ((owner_id = auth.uid()) OR is_owner(auth.uid()));$p$, t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t);
  END LOOP;
END $$;

-- ============== Indexes ==============
CREATE INDEX idx_hr_employees_dept ON public.hr_employees(department_id);
CREATE INDEX idx_hr_employees_owner ON public.hr_employees(owner_id);
CREATE INDEX idx_hr_attendance_emp_date ON public.hr_attendance(employee_id, date);
CREATE INDEX idx_hr_enroll_course ON public.hr_training_enrollments(course_id);
CREATE INDEX idx_hr_perf_emp ON public.hr_performance_reviews(employee_id);

CREATE INDEX idx_crm_opp_customer ON public.crm_opportunities(customer_id);
CREATE INDEX idx_crm_act_customer ON public.crm_activities(customer_id);
CREATE INDEX idx_crm_tickets_customer ON public.crm_service_tickets(customer_id);

CREATE INDEX idx_fin_budgets_project ON public.financial_budgets(project_id);
CREATE INDEX idx_fin_budgets_dept ON public.financial_budgets(department_id);
CREATE INDEX idx_fin_tx_budget ON public.financial_transactions(budget_id);
CREATE INDEX idx_fin_tx_project ON public.financial_transactions(project_id);
CREATE INDEX idx_fin_tx_date ON public.financial_transactions(date);

CREATE INDEX idx_legal_contracts_case ON public.legal_contracts(case_id);
CREATE INDEX idx_mkt_leads_campaign ON public.marketing_leads(campaign_id);
CREATE INDEX idx_csr_tickets_init ON public.csr_tickets(initiative_id);
