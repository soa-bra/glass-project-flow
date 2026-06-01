-- Add collaboration-specific data graph, event, sync, connector, transformation,
-- and smart document tables. The generic dependencies and event_outbox tables are
-- intentionally retained for central-model dependencies and integration dispatch,
-- but they do not replace these board/project-scoped application tables.

create schema if not exists private;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$
begin
  create type public.data_link_kind as enum ('reference', 'dependency', 'sync', 'embed', 'derivation');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.project_event_kind as enum ('created', 'updated', 'deleted', 'status_changed', 'commented', 'synced', 'custom');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.sync_queue_status as enum ('pending', 'processing', 'completed', 'failed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.smart_doc_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- Scope-aware RLS helpers
-- -----------------------------------------------------------------------------
create or replace function private.can_read_project(_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select auth.uid() is not null
    and _project_id is not null
    and (
      public.is_owner(auth.uid())
      or exists (
        select 1
        from public.projects p
        where p.id = _project_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1
        from public.user_roles ur
        where ur.user_id = auth.uid()
          and ur.scope_type = 'project'::public.role_scope_type
          and ur.scope_id = _project_id
          and ur.role in (
            'owner', 'department_manager', 'project_manager', 'release_manager',
            'qa_lead', 'sre', 'ai_analyst', 'team_member', 'guest'
          )
          and (ur.expires_at is null or ur.expires_at > now())
      )
    );
$$;

create or replace function private.can_write_project(_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select auth.uid() is not null
    and _project_id is not null
    and (
      public.is_owner(auth.uid())
      or exists (
        select 1
        from public.projects p
        where p.id = _project_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1
        from public.user_roles ur
        where ur.user_id = auth.uid()
          and ur.scope_type = 'project'::public.role_scope_type
          and ur.scope_id = _project_id
          and ur.role in (
            'owner', 'department_manager', 'project_manager', 'release_manager',
            'qa_lead', 'sre', 'ai_analyst', 'team_member'
          )
          and (ur.expires_at is null or ur.expires_at > now())
      )
    );
$$;

create or replace function private.can_read_planning_board(_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select auth.uid() is not null
    and _board_id is not null
    and (
      public.is_owner(auth.uid())
      or exists (
        select 1
        from public.planning_boards b
        where b.id = _board_id
          and b.owner_id = auth.uid()
      )
      or exists (
        select 1
        from public.user_roles ur
        where ur.user_id = auth.uid()
          and ur.scope_type = 'board'::public.role_scope_type
          and ur.scope_id = _board_id
          and ur.role in (
            'owner', 'department_manager', 'project_manager', 'release_manager',
            'qa_lead', 'sre', 'ai_analyst', 'team_member', 'guest'
          )
          and (ur.expires_at is null or ur.expires_at > now())
      )
    );
$$;

create or replace function private.can_write_planning_board(_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select auth.uid() is not null
    and _board_id is not null
    and (
      public.is_owner(auth.uid())
      or exists (
        select 1
        from public.planning_boards b
        where b.id = _board_id
          and b.owner_id = auth.uid()
      )
      or exists (
        select 1
        from public.user_roles ur
        where ur.user_id = auth.uid()
          and ur.scope_type = 'board'::public.role_scope_type
          and ur.scope_id = _board_id
          and ur.role in (
            'owner', 'department_manager', 'project_manager', 'release_manager',
            'qa_lead', 'sre', 'ai_analyst', 'team_member'
          )
          and (ur.expires_at is null or ur.expires_at > now())
      )
    );
$$;

create or replace function private.can_read_project_board_scope(_project_id uuid, _board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select auth.uid() is not null
    and (_project_id is not null or _board_id is not null)
    and (_project_id is null or private.can_read_project(_project_id))
    and (_board_id is null or private.can_read_planning_board(_board_id));
$$;

create or replace function private.can_write_project_board_scope(_project_id uuid, _board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select auth.uid() is not null
    and (_project_id is not null or _board_id is not null)
    and (_project_id is null or private.can_write_project(_project_id))
    and (_board_id is null or private.can_write_planning_board(_board_id));
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.can_read_project(uuid) from public;
revoke all on function private.can_write_project(uuid) from public;
revoke all on function private.can_read_planning_board(uuid) from public;
revoke all on function private.can_write_planning_board(uuid) from public;
revoke all on function private.can_read_project_board_scope(uuid, uuid) from public;
revoke all on function private.can_write_project_board_scope(uuid, uuid) from public;
grant execute on function private.can_read_project(uuid) to authenticated;
grant execute on function private.can_write_project(uuid) to authenticated;
grant execute on function private.can_read_planning_board(uuid) to authenticated;
grant execute on function private.can_write_planning_board(uuid) to authenticated;
grant execute on function private.can_read_project_board_scope(uuid, uuid) to authenticated;
grant execute on function private.can_write_project_board_scope(uuid, uuid) to authenticated;

-- Needed for composite FKs that ensure child rows reference elements on the same board.
create unique index if not exists planning_elements_id_board_id_key
  on public.planning_elements (id, board_id);

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table if not exists public.data_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  board_id uuid references public.planning_boards(id) on delete cascade,
  source_element_id uuid references public.planning_elements(id) on delete set null,
  target_element_id uuid references public.planning_elements(id) on delete set null,
  link_kind public.data_link_kind not null default 'reference',
  label text,
  mapping jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint data_links_scope_check check (project_id is not null or board_id is not null),
  constraint data_links_source_board_check check (source_element_id is null or board_id is not null),
  constraint data_links_target_board_check check (target_element_id is null or board_id is not null),
  constraint data_links_distinct_elements_check check (
    source_element_id is null or target_element_id is null or source_element_id <> target_element_id
  )
);

create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  board_id uuid references public.planning_boards(id) on delete set null,
  event_kind public.project_event_kind not null default 'custom',
  event_type text not null,
  event_version integer not null default 1,
  aggregate_type text,
  aggregate_id uuid,
  actor_id uuid,
  correlation_id uuid,
  causation_id uuid,
  payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint project_events_event_version_check check (event_version > 0)
);

create table if not exists public.sync_queue (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  board_id uuid references public.planning_boards(id) on delete cascade,
  entity_table text not null,
  entity_id uuid not null,
  operation text not null check (operation in ('insert', 'update', 'delete', 'upsert')),
  payload jsonb not null default '{}'::jsonb,
  status public.sync_queue_status not null default 'pending',
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by uuid,
  last_error text,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sync_queue_scope_check check (project_id is not null or board_id is not null),
  constraint sync_queue_attempts_check check (attempts >= 0)
);

create table if not exists public.element_transformations (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.planning_boards(id) on delete cascade,
  source_element_id uuid not null,
  target_element_id uuid,
  transformation_type text not null,
  config jsonb not null default '{}'::jsonb,
  result jsonb,
  status public.sync_queue_status not null default 'pending',
  last_error text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint element_transformations_distinct_elements_check check (
    target_element_id is null or source_element_id <> target_element_id
  ),
  constraint element_transformations_source_board_fkey foreign key (source_element_id, board_id)
    references public.planning_elements(id, board_id) on delete cascade,
  constraint element_transformations_target_board_fkey foreign key (target_element_id, board_id)
    references public.planning_elements(id, board_id) on delete cascade
);

create table if not exists public.smart_docs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  board_id uuid not null references public.planning_boards(id) on delete cascade,
  element_id uuid not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  status public.smart_doc_status not null default 'draft',
  version integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint smart_docs_version_check check (version > 0),
  constraint smart_docs_element_board_fkey foreign key (element_id, board_id)
    references public.planning_elements(id, board_id) on delete cascade,
  constraint smart_docs_element_id_key unique (element_id)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
create index if not exists idx_data_links_project on public.data_links(project_id) where project_id is not null;
create index if not exists idx_data_links_board on public.data_links(board_id) where board_id is not null;
create index if not exists idx_data_links_source on public.data_links(source_element_id) where source_element_id is not null;
create index if not exists idx_data_links_target on public.data_links(target_element_id) where target_element_id is not null;

create index if not exists idx_project_events_project_created on public.project_events(project_id, created_at desc);
create index if not exists idx_project_events_board_created on public.project_events(board_id, created_at desc) where board_id is not null;
create index if not exists idx_project_events_aggregate on public.project_events(aggregate_type, aggregate_id) where aggregate_id is not null;

create index if not exists idx_sync_queue_pending on public.sync_queue(status, available_at) where status in ('pending', 'failed');
create index if not exists idx_sync_queue_project on public.sync_queue(project_id) where project_id is not null;
create index if not exists idx_sync_queue_board on public.sync_queue(board_id) where board_id is not null;


create index if not exists idx_element_transformations_board on public.element_transformations(board_id);
create index if not exists idx_element_transformations_source on public.element_transformations(source_element_id);
create index if not exists idx_element_transformations_target on public.element_transformations(target_element_id) where target_element_id is not null;

create index if not exists idx_smart_docs_project on public.smart_docs(project_id) where project_id is not null;
create index if not exists idx_smart_docs_board on public.smart_docs(board_id);
create index if not exists idx_smart_docs_element on public.smart_docs(element_id);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
drop trigger if exists trg_data_links_updated on public.data_links;
create trigger trg_data_links_updated
  before update on public.data_links
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_sync_queue_updated on public.sync_queue;
create trigger trg_sync_queue_updated
  before update on public.sync_queue
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_element_transformations_updated on public.element_transformations;
create trigger trg_element_transformations_updated
  before update on public.element_transformations
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_smart_docs_updated on public.smart_docs;
create trigger trg_smart_docs_updated
  before update on public.smart_docs
  for each row execute function public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.data_links enable row level security;
alter table public.project_events enable row level security;
alter table public.sync_queue enable row level security;
alter table public.element_transformations enable row level security;
alter table public.smart_docs enable row level security;

-- data_links
drop policy if exists "members can read data_links" on public.data_links;
drop policy if exists "members can insert data_links" on public.data_links;
drop policy if exists "members can update data_links" on public.data_links;
drop policy if exists "members can delete data_links" on public.data_links;
create policy "members can read data_links" on public.data_links
  for select to authenticated
  using (private.can_read_project_board_scope(project_id, board_id));
create policy "members can insert data_links" on public.data_links
  for insert to authenticated
  with check (created_by = auth.uid() and private.can_write_project_board_scope(project_id, board_id));
create policy "members can update data_links" on public.data_links
  for update to authenticated
  using (private.can_write_project_board_scope(project_id, board_id))
  with check (private.can_write_project_board_scope(project_id, board_id));
create policy "members can delete data_links" on public.data_links
  for delete to authenticated
  using (private.can_write_project_board_scope(project_id, board_id));

-- project_events
drop policy if exists "members can read project_events" on public.project_events;
drop policy if exists "members can insert project_events" on public.project_events;
drop policy if exists "members can update project_events" on public.project_events;
drop policy if exists "members can delete project_events" on public.project_events;
create policy "members can read project_events" on public.project_events
  for select to authenticated
  using (private.can_read_project_board_scope(project_id, board_id));
create policy "members can insert project_events" on public.project_events
  for insert to authenticated
  with check ((actor_id is null or actor_id = auth.uid()) and private.can_write_project_board_scope(project_id, board_id));
create policy "members can update project_events" on public.project_events
  for update to authenticated
  using (private.can_write_project_board_scope(project_id, board_id))
  with check (private.can_write_project_board_scope(project_id, board_id));
create policy "members can delete project_events" on public.project_events
  for delete to authenticated
  using (private.can_write_project_board_scope(project_id, board_id));

-- sync_queue
drop policy if exists "members can read sync_queue" on public.sync_queue;
drop policy if exists "members can insert sync_queue" on public.sync_queue;
drop policy if exists "members can update sync_queue" on public.sync_queue;
drop policy if exists "members can delete sync_queue" on public.sync_queue;
create policy "members can read sync_queue" on public.sync_queue
  for select to authenticated
  using (private.can_read_project_board_scope(project_id, board_id));
create policy "members can insert sync_queue" on public.sync_queue
  for insert to authenticated
  with check (created_by = auth.uid() and private.can_write_project_board_scope(project_id, board_id));
create policy "members can update sync_queue" on public.sync_queue
  for update to authenticated
  using (private.can_write_project_board_scope(project_id, board_id))
  with check (private.can_write_project_board_scope(project_id, board_id));
create policy "members can delete sync_queue" on public.sync_queue
  for delete to authenticated
  using (private.can_write_project_board_scope(project_id, board_id));

-- element_transformations
drop policy if exists "members can read element_transformations" on public.element_transformations;
drop policy if exists "members can insert element_transformations" on public.element_transformations;
drop policy if exists "members can update element_transformations" on public.element_transformations;
drop policy if exists "members can delete element_transformations" on public.element_transformations;
create policy "members can read element_transformations" on public.element_transformations
  for select to authenticated
  using (private.can_read_planning_board(board_id));
create policy "members can insert element_transformations" on public.element_transformations
  for insert to authenticated
  with check (created_by = auth.uid() and private.can_write_planning_board(board_id));
create policy "members can update element_transformations" on public.element_transformations
  for update to authenticated
  using (private.can_write_planning_board(board_id))
  with check (private.can_write_planning_board(board_id));
create policy "members can delete element_transformations" on public.element_transformations
  for delete to authenticated
  using (private.can_write_planning_board(board_id));

-- smart_docs
drop policy if exists "members can read smart_docs" on public.smart_docs;
drop policy if exists "members can insert smart_docs" on public.smart_docs;
drop policy if exists "members can update smart_docs" on public.smart_docs;
drop policy if exists "members can delete smart_docs" on public.smart_docs;
create policy "members can read smart_docs" on public.smart_docs
  for select to authenticated
  using (private.can_read_project_board_scope(project_id, board_id));
create policy "members can insert smart_docs" on public.smart_docs
  for insert to authenticated
  with check (created_by = auth.uid() and private.can_write_project_board_scope(project_id, board_id));
create policy "members can update smart_docs" on public.smart_docs
  for update to authenticated
  using (private.can_write_project_board_scope(project_id, board_id))
  with check (private.can_write_project_board_scope(project_id, board_id));
create policy "members can delete smart_docs" on public.smart_docs
  for delete to authenticated
  using (private.can_write_project_board_scope(project_id, board_id));
