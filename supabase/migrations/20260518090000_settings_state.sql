CREATE TABLE IF NOT EXISTS public.settings_state (
  section text PRIMARY KEY,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.settings_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_state read by settings perms" ON public.settings_state
FOR SELECT TO authenticated
USING (
  public.has_permission(auth.uid(), 'settings.admin')
  OR public.has_permission(auth.uid(), 'settings.security')
);

CREATE POLICY "settings_state write by settings perms" ON public.settings_state
FOR INSERT TO authenticated
WITH CHECK (
  public.has_permission(auth.uid(), 'settings.admin')
  OR public.has_permission(auth.uid(), 'settings.security')
);

CREATE POLICY "settings_state update by settings perms" ON public.settings_state
FOR UPDATE TO authenticated
USING (
  public.has_permission(auth.uid(), 'settings.admin')
  OR public.has_permission(auth.uid(), 'settings.security')
)
WITH CHECK (
  public.has_permission(auth.uid(), 'settings.admin')
  OR public.has_permission(auth.uid(), 'settings.security')
);
