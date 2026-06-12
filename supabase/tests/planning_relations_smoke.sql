-- Smoke checks for planning relation side effects that are enforced by the database.
-- Intended to be run against a disposable/local Supabase database.

begin;

do $$
declare
  owner_user_id uuid := '00000000-0000-0000-0000-00000000b101';
  board_id uuid := '00000000-0000-0000-0000-00000000b201';
  source_element_id uuid := '00000000-0000-0000-0000-00000000b301';
  target_element_id uuid := '00000000-0000-0000-0000-00000000b302';
  connector_element_id uuid := '00000000-0000-0000-0000-00000000b303';
  connector_id uuid := '00000000-0000-0000-0000-00000000b401';
  smoke_project_id uuid := '00000000-0000-0000-0000-00000000b501';
  task_id uuid := '00000000-0000-0000-0000-00000000b601';
  event_count integer;
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
  ) values (
    owner_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'planning-relations-owner@example.test',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  ) on conflict (id) do nothing;

  insert into public.planning_boards (id, owner_id, name)
  values (board_id, owner_user_id, 'Planning relation smoke board')
  on conflict (id) do nothing;

  insert into public.planning_elements (id, board_id, element_type, created_by, content)
  values
    (source_element_id, board_id, 'sticky', owner_user_id, '{"title":"Source"}'::jsonb),
    (target_element_id, board_id, 'sticky', owner_user_id, '{"title":"Target"}'::jsonb),
    (connector_element_id, board_id, 'root_connector', owner_user_id, '{"title":"Connector"}'::jsonb)
  on conflict (id) do nothing;

  insert into public.smart_connectors (
    id,
    board_id,
    connector_element_id,
    source_element_id,
    target_element_id,
    relationship_type,
    connector_kind,
    created_by
  ) values (
    connector_id,
    board_id,
    connector_element_id,
    source_element_id,
    target_element_id,
    'blocks',
    'root_connector',
    owner_user_id
  );

  insert into public.projects (id, name, owner_id, priority)
  values (smoke_project_id, 'Budget event project', owner_user_id, 'medium')
  on conflict (id) do nothing;

  insert into public.tasks (
    id,
    linked_project_id,
    name,
    owner_id,
    priority,
    estimated_duration,
    estimated_cost,
    complexity,
    required_team_size
  ) values (
    task_id,
    smoke_project_id,
    'Budget linked task',
    owner_user_id,
    'medium',
    1,
    100,
    'simple',
    1
  ) on conflict (id) do nothing;

  update public.tasks set estimated_cost = 250 where id = task_id;

  select count(*)
    into event_count
  from public.project_events
  where public.project_events.project_id = smoke_project_id
    and aggregate_type = 'task'
    and aggregate_id = task_id
    and event_type = 'task.budget.changed';

  if event_count <> 1 then
    raise exception 'Expected changing a budget-linked task to create one project_event, got %', event_count;
  end if;

  delete from public.planning_elements where id = source_element_id;

  if exists (select 1 from public.smart_connectors where id = connector_id) then
    raise exception 'Expected deleting an endpoint planning element to cascade-delete related smart_connectors';
  end if;
end $$;

rollback;
