-- 1) Profiles backfill
INSERT INTO public.profiles (user_id, display_name)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1))
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- 2) Owner backfill: only if no global owner exists yet
INSERT INTO public.user_roles (user_id, role, scope_type)
SELECT u.id, 'owner'::app_role, 'global'::role_scope_type
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE role = 'owner' AND scope_type = 'global'
)
ORDER BY u.created_at ASC
LIMIT 1;

-- 3) team_member for any auth user without a global role yet
INSERT INTO public.user_roles (user_id, role, scope_type)
SELECT u.id, 'team_member'::app_role, 'global'::role_scope_type
FROM auth.users u
LEFT JOIN public.user_roles ur
  ON ur.user_id = u.id AND ur.scope_type = 'global'
WHERE ur.user_id IS NULL;