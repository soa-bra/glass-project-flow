-- Smoke check for AI usage permissions.
-- Intended to be run against a disposable/local Supabase database.

begin;

do $$
declare
  authorized_user_id uuid := '00000000-0000-0000-0000-00000000a101';
  guest_user_id uuid := '00000000-0000-0000-0000-00000000a102';
begin
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values
    (
      authorized_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'ai-permission-authorized@example.test',
      '',
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    ),
    (
      guest_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'ai-permission-guest@example.test',
      '',
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role, scope_type)
  values
    (authorized_user_id, 'project_manager', 'global'),
    (guest_user_id, 'guest', 'global')
  on conflict (user_id, role, scope_type, scope_id) do nothing;

  if not public.has_permission(authorized_user_id, 'canvas.ai.use') then
    raise exception 'Expected project_manager to have canvas.ai.use';
  end if;

  if not public.has_permission(authorized_user_id, 'project.ai.use') then
    raise exception 'Expected project_manager to have project.ai.use';
  end if;

  if public.has_permission(guest_user_id, 'canvas.ai.use') then
    raise exception 'Expected guest not to have canvas.ai.use';
  end if;

  if public.has_permission(guest_user_id, 'project.ai.use') then
    raise exception 'Expected guest not to have project.ai.use';
  end if;
end $$;

rollback;
