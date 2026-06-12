-- Preserve approved/operational planning relationships when their visual endpoint
-- disappears. Visual-only connectors still follow the canvas element lifecycle.

alter type public.data_link_kind add value if not exists 'operational_relationship';

alter table if exists public.data_links
  add column if not exists status text not null default 'active';

alter table if exists public.data_links
  drop constraint if exists data_links_status_check,
  add constraint data_links_status_check check (status in ('active', 'broken', 'archived', 'unlinked'));

alter table if exists public.smart_connectors
  add column if not exists status text not null default 'active';

alter table if exists public.smart_connectors
  alter column source_element_id drop not null,
  alter column target_element_id drop not null,
  drop constraint if exists smart_connectors_status_check,
  add constraint smart_connectors_status_check check (status in ('active', 'broken', 'archived', 'unlinked')),
  drop constraint if exists smart_connectors_distinct_elements_check,
  add constraint smart_connectors_distinct_elements_check check (
    source_element_id is null or target_element_id is null or source_element_id <> target_element_id
  );

alter table if exists public.smart_connectors
  drop constraint if exists smart_connectors_source_board_fkey,
  drop constraint if exists smart_connectors_target_board_fkey;

alter table if exists public.smart_connectors
  add constraint smart_connectors_source_board_fkey foreign key (source_element_id, board_id)
    references public.planning_elements(id, board_id) on delete set null,
  add constraint smart_connectors_target_board_fkey foreign key (target_element_id, board_id)
    references public.planning_elements(id, board_id) on delete set null;

create index if not exists idx_smart_connectors_status
  on public.smart_connectors(status);

create index if not exists idx_data_links_status
  on public.data_links(status);

create or replace function private.is_operational_relationship_type(_relationship_type text)
returns boolean
language sql
immutable
set search_path = public, private, pg_temp
as $$
  select coalesce(_relationship_type, '') in ('depends_on', 'blocks', 'funds', 'delivers');
$$;

create or replace function public.archive_operational_connectors_for_deleted_endpoint()
returns trigger
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
begin
  -- Visual-only connectors are canvas artifacts. Removing an endpoint removes the
  -- connector row, and the existing smart-connector delete trigger removes the
  -- connector planning element.
  delete from public.smart_connectors sc
  where sc.board_id = old.board_id
    and (sc.source_element_id = old.id or sc.target_element_id = old.id)
    and not private.is_operational_relationship_type(sc.relationship_type);

  -- Operational connectors keep the auditable relation row but become broken
  -- until a user relinks or archives them explicitly.
  update public.smart_connectors sc
  set
    source_element_id = case when sc.source_element_id = old.id then null else sc.source_element_id end,
    target_element_id = case when sc.target_element_id = old.id then null else sc.target_element_id end,
    status = 'broken',
    metadata = coalesce(sc.metadata, '{}'::jsonb) || jsonb_build_object(
      'status', 'broken',
      'unlinkedAt', now(),
      'missingElementId', old.id,
      'missingEndpoint', case
        when sc.source_element_id = old.id then 'source'
        when sc.target_element_id = old.id then 'target'
        else 'unknown'
      end,
      'preservedOperationalRelationship', true
    ),
    updated_at = now()
  where sc.board_id = old.board_id
    and (sc.source_element_id = old.id or sc.target_element_id = old.id)
    and private.is_operational_relationship_type(sc.relationship_type);

  update public.data_links dl
  set
    source_element_id = case when dl.source_element_id = old.id then null else dl.source_element_id end,
    target_element_id = case when dl.target_element_id = old.id then null else dl.target_element_id end,
    status = 'broken',
    metadata = coalesce(dl.metadata, '{}'::jsonb) || jsonb_build_object(
      'status', 'broken',
      'unlinkedAt', now(),
      'missingElementId', old.id,
      'missingEndpoint', case
        when dl.source_element_id = old.id then 'source'
        when dl.target_element_id = old.id then 'target'
        else 'unknown'
      end,
      'preservedOperationalRelationship', true
    ),
    updated_at = now()
  where dl.board_id = old.board_id
    and (dl.source_element_id = old.id or dl.target_element_id = old.id)
    and (
      dl.link_kind::text = 'operational_relationship'
      or dl.relation_type in ('depends_on', 'blocks', 'funds', 'delivers')
      or dl.metadata->>'relationshipType' in ('depends_on', 'blocks', 'funds', 'delivers')
    );

  return old;
end;
$$;

drop trigger if exists trg_archive_operational_connectors_for_deleted_endpoint on public.planning_elements;
create trigger trg_archive_operational_connectors_for_deleted_endpoint
  before delete on public.planning_elements
  for each row execute function public.archive_operational_connectors_for_deleted_endpoint();
