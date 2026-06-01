-- Persist logical connector relationships for SVG connector elements on planning canvases.

alter type public.planning_element_type add value if not exists 'visual_node';
alter type public.planning_element_type add value if not exists 'visual_connector';
alter type public.planning_element_type add value if not exists 'mindmap_connector';
alter type public.planning_element_type add value if not exists 'root_connector';

alter type public.central_dependency_type add value if not exists 'depends_on';
alter type public.central_dependency_type add value if not exists 'causes';
alter type public.central_dependency_type add value if not exists 'blocks';
alter type public.central_dependency_type add value if not exists 'references';
alter type public.central_dependency_type add value if not exists 'funds';
alter type public.central_dependency_type add value if not exists 'delivers';
alter type public.central_dependency_type add value if not exists 'belongs_to';

create table if not exists public.smart_connectors (
  id uuid primary key default gen_random_uuid(),
  connector_element_id uuid not null references public.planning_elements(id) on delete cascade,
  board_id uuid not null references public.planning_boards(id) on delete cascade,
  source_element_id uuid not null references public.planning_elements(id) on delete cascade,
  target_element_id uuid not null references public.planning_elements(id) on delete cascade,
  relationship_type text not null check (
    relationship_type in ('depends_on','causes','blocks','references','funds','delivers','belongs_to')
  ),
  connector_kind text not null check (
    connector_kind in ('visual_connector','mindmap_connector','root_connector')
  ),
  label text,
  style jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint smart_connectors_connector_element_unique unique (connector_element_id),
  constraint smart_connectors_distinct_endpoints check (source_element_id <> target_element_id)
);

create index if not exists idx_smart_connectors_board
  on public.smart_connectors(board_id);
create index if not exists idx_smart_connectors_source
  on public.smart_connectors(source_element_id);
create index if not exists idx_smart_connectors_target
  on public.smart_connectors(target_element_id);
create index if not exists idx_smart_connectors_relationship
  on public.smart_connectors(relationship_type);

alter table public.smart_connectors enable row level security;

drop policy if exists "read smart_connectors on accessible boards" on public.smart_connectors;
create policy "read smart_connectors on accessible boards"
on public.smart_connectors
for select to authenticated
using (
  exists (
    select 1 from public.planning_boards b
    where b.id = smart_connectors.board_id
      and ((b.owner_id = auth.uid()) or public.is_owner(auth.uid()))
  )
);

drop policy if exists "insert smart_connectors on owned boards" on public.smart_connectors;
create policy "insert smart_connectors on owned boards"
on public.smart_connectors
for insert to authenticated
with check (
  exists (
    select 1 from public.planning_boards b
    where b.id = smart_connectors.board_id
      and ((b.owner_id = auth.uid()) or public.is_owner(auth.uid()))
  )
);

drop policy if exists "update smart_connectors on owned boards" on public.smart_connectors;
create policy "update smart_connectors on owned boards"
on public.smart_connectors
for update to authenticated
using (
  exists (
    select 1 from public.planning_boards b
    where b.id = smart_connectors.board_id
      and ((b.owner_id = auth.uid()) or public.is_owner(auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.planning_boards b
    where b.id = smart_connectors.board_id
      and ((b.owner_id = auth.uid()) or public.is_owner(auth.uid()))
  )
);

drop policy if exists "delete smart_connectors on owned boards" on public.smart_connectors;
create policy "delete smart_connectors on owned boards"
on public.smart_connectors
for delete to authenticated
using (
  exists (
    select 1 from public.planning_boards b
    where b.id = smart_connectors.board_id
      and ((b.owner_id = auth.uid()) or public.is_owner(auth.uid()))
  )
);

drop trigger if exists trg_smart_connectors_updated on public.smart_connectors;
create trigger trg_smart_connectors_updated
  before update on public.smart_connectors
  for each row execute function public.update_updated_at_column();

create or replace function public.delete_smart_connector_canvas_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.planning_elements
  where id = old.connector_element_id;
  return old;
end;
$$;

drop trigger if exists trg_delete_smart_connector_canvas_row on public.smart_connectors;
create trigger trg_delete_smart_connector_canvas_row
  after delete on public.smart_connectors
  for each row execute function public.delete_smart_connector_canvas_row();
