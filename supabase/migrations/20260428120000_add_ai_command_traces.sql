CREATE TABLE IF NOT EXISTS public.ai_command_traces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  selected_tool text NOT NULL,
  model text NOT NULL,
  prompt_excerpt text,
  selected_elements_count integer NOT NULL DEFAULT 0,
  target_type text,
  confidence_min numeric,
  confidence_max numeric,
  confidence_avg numeric,
  confidence_count integer NOT NULL DEFAULT 0,
  escalation_gate text NOT NULL,
  sensitivity_score numeric NOT NULL DEFAULT 0,
  sensitivity_reasons text[] NOT NULL DEFAULT '{}',
  approval_required boolean NOT NULL DEFAULT false,
  approval_provided boolean NOT NULL DEFAULT false,
  approver_id text,
  approved_at timestamptz,
  output_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  explainability_payload jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.ai_command_traces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own AI traces"
ON public.ai_command_traces
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI traces"
ON public.ai_command_traces
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_command_traces_user_created_at
  ON public.ai_command_traces (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_command_traces_escalation_gate
  ON public.ai_command_traces (escalation_gate);
