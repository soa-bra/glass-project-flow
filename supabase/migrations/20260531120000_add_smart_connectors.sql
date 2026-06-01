-- Smart connector compatibility migration.
-- The smart_connectors table is created in
-- 20260531120000_add_collaboration_data_tables.sql; keep this file as an
-- additive migration so it does not compete with the canonical schema.

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

-- Keep this compatibility block aligned with smartConnectors.service.ts. The
-- collaboration-data migration owns table creation; this migration only patches
-- older/local databases that reached smart_connectors before the canonical shape.
alter table public.smart_connectors
  add column if not exists relationship_type text not null default 'references',
  add column if not exists connector_kind public.smart_connector_kind not null default 'visual_connector',
  add column if not exists style jsonb not null default '{}'::jsonb,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_smart_connectors_relationship
  on public.smart_connectors(relationship_type);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'smart_connectors_connector_element_unique'
      and conrelid = 'public.smart_connectors'::regclass
  ) then
    alter table public.smart_connectors
      add constraint smart_connectors_connector_element_unique unique (connector_element_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'smart_connectors_relationship_type_check'
      and conrelid = 'public.smart_connectors'::regclass
  ) then
    alter table public.smart_connectors
      add constraint smart_connectors_relationship_type_check check (
        relationship_type in ('depends_on','causes','blocks','references','funds','delivers','belongs_to')
      );
  end if;
end $$;

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
