-- Harden RLS for operational event, queue, and audit tables.
-- Normal authenticated users may read only authorized scopes and may only create
-- trusted/self-attributed operational records. Processing state transitions are
-- intentionally restricted to service-role workers or dedicated RPCs.

-- -----------------------------------------------------------------------------
-- Operational processing columns
-- -----------------------------------------------------------------------------
alter table public.project_events
  add column if not exists status text not null default 'pending',
  add column if not exists retry_count integer not null default 0,
  add column if not exists processed_at timestamptz;

alter table public.project_events
  drop constraint if exists project_events_status_check,
  add constraint project_events_status_check
    check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  drop constraint if exists project_events_retry_count_check,
  add constraint project_events_retry_count_check check (retry_count >= 0);

alter table public.sync_queue
  add column if not exists attempts integer not null default 0,
  add column if not exists locked_at timestamptz,
  add column if not exists locked_by uuid,
  add column if not exists last_error text,
  add column if not exists processed_at timestamptz;

-- Earlier migrations created sync_queue.status as an enum in one path and text in
-- another. Normalize to text so RPC arguments, policies, and worker updates are
-- stable regardless of which historical migration created the table first.
alter table public.sync_queue
  alter column status drop default,
  alter column status type text using status::text,
  alter column status set default 'pending';

alter table public.sync_queue
  drop constraint if exists sync_queue_status_check,
  add constraint sync_queue_status_check
    check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  drop constraint if exists sync_queue_operation_check,
  drop constraint if exists sync_queue_operation_not_blank_check,
  add constraint sync_queue_operation_not_blank_check check (btrim(operation) <> ''),
  drop constraint if exists sync_queue_attempts_check,
  add constraint sync_queue_attempts_check check (attempts >= 0);

-- -----------------------------------------------------------------------------
-- Permission seeds for trusted operational paths
-- -----------------------------------------------------------------------------
insert into public.permissions (code, module, description)
values
  ('sync_queue.enqueue', 'operations', 'Create scoped synchronization requests'),
  ('sync_queue.process', 'operations', 'Process synchronization queue records'),
  ('project_events.process', 'operations', 'Update project event processing state'),
  ('audit_events.write', 'audit', 'Write audit events through the trusted RPC'),
  ('planning.smart_conversion.approved', 'planning', 'Enqueue approved smart conversion synchronization')
on conflict (code) do update
set
  module = excluded.module,
  description = excluded.description;

insert into public.role_permissions (role, permission_code)
values
  ('owner', 'sync_queue.enqueue'),
  ('owner', 'sync_queue.process'),
  ('owner', 'project_events.process'),
  ('owner', 'audit_events.write'),
  ('owner', 'planning.smart_conversion.approved'),
  ('department_manager', 'sync_queue.enqueue'),
  ('department_manager', 'audit_events.write'),
  ('department_manager', 'planning.smart_conversion.approved'),
  ('project_manager', 'sync_queue.enqueue'),
  ('project_manager', 'audit_events.write'),
  ('project_manager', 'planning.smart_conversion.approved'),
  ('release_manager', 'sync_queue.enqueue'),
  ('release_manager', 'sync_queue.process'),
  ('release_manager', 'project_events.process'),
  ('release_manager', 'audit_events.write'),
  ('qa_lead', 'sync_queue.enqueue'),
  ('qa_lead', 'audit_events.write'),
  ('sre', 'sync_queue.enqueue'),
  ('sre', 'sync_queue.process'),
  ('sre', 'project_events.process'),
  ('sre', 'audit_events.write'),
  ('ai_analyst', 'sync_queue.enqueue'),
  ('ai_analyst', 'audit_events.write'),
  ('ai_analyst', 'planning.smart_conversion.approved'),
  ('team_member', 'sync_queue.enqueue'),
  ('team_member', 'audit_events.write')
on conflict (role, permission_code) do nothing;

-- -----------------------------------------------------------------------------
-- Helper predicates
-- -----------------------------------------------------------------------------
create or replace function private.is_service_role()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(auth.role(), '') = 'service_role';
$$;

create or replace function private.can_enqueue_sync_request(
  _project_id uuid,
  _board_id uuid,
  _operation text
)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select auth.uid() is not null
    and _operation is not null
    and btrim(_operation) <> ''
    and private.can_write_project_board_scope(_project_id, _board_id)
    and (
      public.has_permission(auth.uid(), _operation)
      or public.has_permission(auth.uid(), 'sync_queue.enqueue')
    );
$$;

create or replace function private.can_process_operational_records(_permission_code text)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select private.is_service_role()
    or (
      auth.uid() is not null
      and public.has_permission(auth.uid(), _permission_code)
    );
$$;

-- -----------------------------------------------------------------------------
-- Dedicated trusted RPCs
-- -----------------------------------------------------------------------------
create or replace function public.enqueue_sync_request(
  _project_id uuid,
  _board_id uuid,
  _entity_table text,
  _entity_id uuid,
  _operation text,
  _payload jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  _queue_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required to enqueue sync requests';
  end if;

  if not private.can_enqueue_sync_request(_project_id, _board_id, _operation) then
    raise exception 'Not authorized to enqueue sync operation %', _operation;
  end if;

  insert into public.sync_queue (
    project_id,
    board_id,
    entity_table,
    entity_id,
    operation,
    payload,
    status,
    attempts,
    locked_at,
    locked_by,
    last_error,
    processed_at,
    created_by
  )
  values (
    _project_id,
    _board_id,
    _entity_table,
    _entity_id,
    _operation,
    coalesce(_payload, '{}'::jsonb),
    'pending',
    0,
    null,
    null,
    null,
    null,
    auth.uid()
  )
  returning id into _queue_id;

  return _queue_id;
end;
$$;

create or replace function public.update_project_event_processing(
  _event_id uuid,
  _status text,
  _retry_count integer default null,
  _processed_at timestamptz default null
)
returns public.project_events
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  _event public.project_events;
begin
  if not private.can_process_operational_records('project_events.process') then
    raise exception 'Not authorized to process project events';
  end if;

  if _status not in ('pending', 'processing', 'completed', 'failed', 'cancelled') then
    raise exception 'Invalid project event status %', _status;
  end if;

  update public.project_events
  set
    status = _status,
    retry_count = coalesce(_retry_count, retry_count),
    processed_at = case
      when _status in ('completed', 'failed', 'cancelled') then coalesce(_processed_at, now())
      else _processed_at
    end
  where id = _event_id
  returning * into _event;

  if not found then
    raise exception 'Project event % was not found', _event_id;
  end if;

  return _event;
end;
$$;

create or replace function public.update_sync_queue_processing(
  _queue_id uuid,
  _status text,
  _attempts integer default null,
  _last_error text default null,
  _processed_at timestamptz default null,
  _locked_by uuid default null
)
returns public.sync_queue
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  _queue public.sync_queue;
begin
  if not private.can_process_operational_records('sync_queue.process') then
    raise exception 'Not authorized to process sync queue records';
  end if;

  if _status not in ('pending', 'processing', 'completed', 'failed', 'cancelled') then
    raise exception 'Invalid sync queue status %', _status;
  end if;

  update public.sync_queue
  set
    status = _status,
    attempts = coalesce(_attempts, attempts),
    last_error = _last_error,
    processed_at = case
      when _status in ('completed', 'failed', 'cancelled') then coalesce(_processed_at, now())
      else _processed_at
    end,
    locked_by = case when _status = 'processing' then coalesce(_locked_by, auth.uid()) else null end,
    locked_at = case when _status = 'processing' then now() else null end
  where id = _queue_id
  returning * into _queue;

  if not found then
    raise exception 'Sync queue record % was not found', _queue_id;
  end if;

  return _queue;
end;
$$;

create or replace function public.record_audit_event(
  _action text,
  _resource_type text,
  _resource_id uuid,
  _scope_type public.role_scope_type,
  _scope_id uuid,
  _decision public.audit_decision,
  _reason text default null,
  _metadata jsonb default '{}'::jsonb,
  _actor_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  _audit_id uuid;
  _effective_actor_id uuid;
begin
  if not private.is_service_role() then
    if auth.uid() is null then
      raise exception 'Authentication required to record audit events';
    end if;

    if not public.has_permission(auth.uid(), 'audit_events.write') then
      raise exception 'Not authorized to record audit events';
    end if;
  end if;

  _effective_actor_id := case
    when private.is_service_role() then _actor_id
    else coalesce(_actor_id, auth.uid())
  end;

  if not private.is_service_role() and _effective_actor_id <> auth.uid() then
    raise exception 'Authenticated audit writers may only record their own actor_id';
  end if;

  insert into public.audit_events (
    actor_id,
    action,
    resource_type,
    resource_id,
    scope_type,
    scope_id,
    decision,
    reason,
    metadata
  )
  values (
    _effective_actor_id,
    _action,
    _resource_type,
    _resource_id,
    _scope_type,
    _scope_id,
    _decision,
    _reason,
    coalesce(_metadata, '{}'::jsonb)
  )
  returning id into _audit_id;

  return _audit_id;
end;
$$;

revoke execute on function private.is_service_role() from public, anon, authenticated;
revoke execute on function private.can_enqueue_sync_request(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function private.can_process_operational_records(text) from public, anon, authenticated;
revoke execute on function public.enqueue_sync_request(uuid, uuid, text, uuid, text, jsonb) from public, anon;
revoke execute on function public.update_project_event_processing(uuid, text, integer, timestamptz) from public, anon;
revoke execute on function public.update_sync_queue_processing(uuid, text, integer, text, timestamptz, uuid) from public, anon;
revoke execute on function public.record_audit_event(text, text, uuid, public.role_scope_type, uuid, public.audit_decision, text, jsonb, uuid) from public, anon;

grant execute on function public.enqueue_sync_request(uuid, uuid, text, uuid, text, jsonb) to authenticated, service_role;
grant execute on function public.update_project_event_processing(uuid, text, integer, timestamptz) to authenticated, service_role;
grant execute on function public.update_sync_queue_processing(uuid, text, integer, text, timestamptz, uuid) to authenticated, service_role;
grant execute on function public.record_audit_event(text, text, uuid, public.role_scope_type, uuid, public.audit_decision, text, jsonb, uuid) to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Grants and RLS policies
-- -----------------------------------------------------------------------------
alter table public.project_events enable row level security;
alter table public.sync_queue enable row level security;
alter table public.audit_events enable row level security;

revoke update, delete on public.project_events from authenticated;
revoke update, delete on public.sync_queue from authenticated;
revoke insert, update, delete on public.audit_events from authenticated;
revoke update (status, retry_count, processed_at) on public.project_events from authenticated;
revoke update (status, attempts, last_error, processed_at, locked_by) on public.sync_queue from authenticated;

grant select, insert on public.project_events to authenticated;
grant select, insert on public.sync_queue to authenticated;
grant select on public.audit_events to authenticated;
grant all on public.project_events to service_role;
grant all on public.sync_queue to service_role;
grant all on public.audit_events to service_role;

-- project_events: readable by authorized members, insert-only for self-attributed
-- pending events. Direct UPDATE/DELETE is intentionally absent for authenticated.
drop policy if exists "members can read project_events" on public.project_events;
drop policy if exists "members can insert project_events" on public.project_events;
drop policy if exists "members can update project_events" on public.project_events;
drop policy if exists "members can delete project_events" on public.project_events;
drop policy if exists "project owners read project_events" on public.project_events;
drop policy if exists "auth insert project_events" on public.project_events;

create policy "authorized members read project_events"
  on public.project_events
  for select
  to authenticated
  using (private.can_read_project_board_scope(project_id, board_id));

create policy "trusted self insert project_events"
  on public.project_events
  for insert
  to authenticated
  with check (
    actor_id = auth.uid()
    and status = 'pending'
    and retry_count = 0
    and processed_at is null
    and private.can_write_project_board_scope(project_id, board_id)
  );

-- sync_queue: users can enqueue only authorized pending work. Workers and Edge
-- Functions must update processing fields through the service role or RPC.
drop policy if exists "members can read sync_queue" on public.sync_queue;
drop policy if exists "members can insert sync_queue" on public.sync_queue;
drop policy if exists "members can update sync_queue" on public.sync_queue;
drop policy if exists "members can delete sync_queue" on public.sync_queue;
drop policy if exists "editors manage sync_queue" on public.sync_queue;

create policy "authorized members read sync_queue"
  on public.sync_queue
  for select
  to authenticated
  using (private.can_read_project_board_scope(project_id, board_id));

create policy "authorized action enqueue sync_queue"
  on public.sync_queue
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and status = 'pending'
    and attempts = 0
    and locked_at is null
    and locked_by is null
    and last_error is null
    and processed_at is null
    and private.can_enqueue_sync_request(project_id, board_id, operation)
  );

-- audit_events: read by audit permission, actor, or scoped readers. Writes must
-- go through record_audit_event or a service-role Edge Function. UPDATE/DELETE
-- is intentionally absent for authenticated.
drop policy if exists "audit insert auth" on public.audit_events;
drop policy if exists "audit read own" on public.audit_events;
drop policy if exists "authorized read audit_events" on public.audit_events;

create policy "authorized read audit_events"
  on public.audit_events
  for select
  to authenticated
  using (
    actor_id = auth.uid()
    or public.has_permission(auth.uid(), 'audit.read.all')
    or (scope_type = 'project'::public.role_scope_type and private.can_read_project(scope_id))
    or (scope_type = 'board'::public.role_scope_type and private.can_read_planning_board(scope_id))
  );
