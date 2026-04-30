-- Central integration data model foundation

create type public.central_state as enum (
  'draft',
  'planned',
  'active',
  'blocked',
  'paused',
  'completed',
  'cancelled',
  'archived',
  'failed'
);

create type public.central_priority as enum ('low', 'medium', 'high', 'critical');
create type public.central_complexity as enum ('trivial', 'simple', 'moderate', 'complex', 'critical');
create type public.central_dependency_type as enum ('execution', 'data', 'technical', 'operational', 'time');
create type public.central_entity_type as enum ('board', 'department', 'project', 'task', 'tool', 'engine_job', 'project_card', 'task_card');
create type public.department_project_role as enum ('owner', 'supervisor');
create type public.tool_kind as enum ('board_widget', 'dashboard_panel', 'workflow_tool', 'analysis_tool', 'integration_tool');
create type public.engine_job_kind as enum ('automation', 'data_processing', 'orchestration', 'sync', 'analytics', 'validation');
create type public.task_tool_engine_relation_type as enum ('produces', 'binds', 'executes');

create table public.boards (
  id uuid primary key,
  name text not null,
  code text not null,
  description text,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (code)
);

create table public.departments (
  id uuid primary key,
  name text not null,
  code text not null,
  description text,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (code)
);

create table public.projects (
  id uuid primary key,
  name text not null,
  description text,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  start_date timestamptz,
  due_date timestamptz,
  budget numeric(14,2),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (budget is null or budget >= 0)
);

create table public.department_projects (
  id uuid primary key,
  department_id uuid not null references public.departments(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  role public.department_project_role not null,
  created_at timestamptz not null default now(),
  unique (department_id, project_id)
);

create table public.tasks (
  id uuid primary key,
  linked_project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  state public.central_state not null default 'draft',
  owner_id uuid,
  assignee_id uuid,
  priority public.central_priority not null default 'medium',
  estimated_duration numeric(12,2) not null,
  estimated_cost numeric(14,2) not null,
  complexity public.central_complexity not null,
  required_team_size integer not null,
  start_date timestamptz,
  due_date timestamptz,
  actual_duration numeric(12,2),
  actual_cost numeric(14,2),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (estimated_duration >= 0),
  check (estimated_cost >= 0),
  check (required_team_size > 0),
  check (actual_duration is null or actual_duration >= 0),
  check (actual_cost is null or actual_cost >= 0)
);

create table public.tools (
  id uuid primary key,
  board_id uuid not null references public.boards(id) on delete cascade,
  produced_by_task_id uuid references public.tasks(id) on delete set null,
  name text not null,
  description text,
  kind public.tool_kind not null,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.engine_jobs (
  id uuid primary key,
  name text not null,
  description text,
  kind public.engine_job_kind not null,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  produced_by_task_id uuid references public.tasks(id) on delete set null,
  triggered_by_tool_id uuid references public.tools(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_tool_engine_links (
  id uuid primary key,
  task_id uuid not null references public.tasks(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  engine_job_id uuid not null references public.engine_jobs(id) on delete cascade,
  relation_type public.task_tool_engine_relation_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(task_id, tool_id, engine_job_id)
);



create table public.project_cards (
  id uuid primary key,
  linked_project_id uuid not null references public.projects(id) on delete cascade,
  board_id uuid references public.boards(id) on delete set null,
  name text not null,
  description text,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  projection text not null default 'standard' check (projection in ('compact','standard','executive')),
  visible_metrics text[] not null default array['status','progress','tasks'],
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_cards (
  id uuid primary key,
  linked_task_id uuid not null references public.tasks(id) on delete cascade,
  linked_project_id uuid not null references public.projects(id) on delete cascade,
  board_id uuid references public.boards(id) on delete set null,
  name text not null,
  description text,
  state public.central_state not null default 'draft',
  owner_id uuid,
  priority public.central_priority not null default 'medium',
  projection text not null default 'standard' check (projection in ('compact','standard','executive')),
  visible_metrics text[] not null default array['state','priority','complexity'],
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dependencies (
  id uuid primary key,
  from_entity_type public.central_entity_type not null,
  from_entity_id uuid not null,
  to_entity_type public.central_entity_type not null,
  to_entity_id uuid not null,
  dependency_type public.central_dependency_type not null,
  description text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_entity_id <> to_entity_id)
);

create index idx_projects_state on public.projects(state);
create index idx_tasks_project on public.tasks(linked_project_id);
create index idx_tools_board on public.tools(board_id);
create index idx_engine_jobs_state on public.engine_jobs(state);
create index idx_dependencies_from on public.dependencies(from_entity_type, from_entity_id);
create index idx_dependencies_to on public.dependencies(to_entity_type, to_entity_id);

create index idx_project_cards_project on public.project_cards(linked_project_id);
create index idx_task_cards_task on public.task_cards(linked_task_id);

alter table public.boards enable row level security;
alter table public.departments enable row level security;
alter table public.projects enable row level security;
alter table public.department_projects enable row level security;
alter table public.tasks enable row level security;
alter table public.tools enable row level security;
alter table public.engine_jobs enable row level security;
alter table public.task_tool_engine_links enable row level security;
alter table public.project_cards enable row level security;
alter table public.task_cards enable row level security;
alter table public.dependencies enable row level security;

create policy "owners can manage boards" on public.boards
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners can manage departments" on public.departments
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners can manage projects" on public.projects
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners can manage department projects" on public.department_projects
  for all to authenticated
  using (
    exists (
      select 1 from public.departments d
      where d.id = department_projects.department_id
        and d.owner_id = auth.uid()
    )
    and exists (
      select 1 from public.projects p
      where p.id = department_projects.project_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.departments d
      where d.id = department_projects.department_id
        and d.owner_id = auth.uid()
    )
    and exists (
      select 1 from public.projects p
      where p.id = department_projects.project_id
        and p.owner_id = auth.uid()
    )
  );

create policy "owners or assignees can access tasks" on public.tasks
  for all to authenticated
  using (
    owner_id = auth.uid()
    or assignee_id = auth.uid()
    or exists (
      select 1 from public.projects p
      where p.id = tasks.linked_project_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    owner_id = auth.uid()
    or assignee_id = auth.uid()
    or exists (
      select 1 from public.projects p
      where p.id = tasks.linked_project_id
        and p.owner_id = auth.uid()
    )
  );

create policy "owners can manage tools" on public.tools
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners can manage engine jobs" on public.engine_jobs
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners can manage task tool engine links" on public.task_tool_engine_links
  for all to authenticated
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_tool_engine_links.task_id
        and (t.owner_id = auth.uid() or t.assignee_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_tool_engine_links.task_id
        and (t.owner_id = auth.uid() or t.assignee_id = auth.uid())
    )
  );

create policy "owners can manage project cards" on public.project_cards
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners can manage task cards" on public.task_cards
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "authenticated users can manage dependencies" on public.dependencies
  for all to authenticated
  using (true)
  with check (true);
