-- Fix smart conversion persistence schema drift without rewriting historical migrations.
-- Keeps legacy columns in place for compatibility, and adds the canonical fields
-- used by planning smart-conversion services and generated Supabase types.

-- -----------------------------------------------------------------------------
-- data_links canonical link shape
-- -----------------------------------------------------------------------------
alter table if exists public.data_links
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists target_type text,
  add column if not exists target_id uuid,
  add column if not exists relation_type text not null default 'reference',
  add column if not exists sync_type text not null default 'manual',
  add column if not exists fields_map jsonb not null default '{}'::jsonb;

update public.data_links
set
  source_type = coalesce(source_type, case when source_element_id is not null then 'planning_element' end),
  source_id = coalesce(source_id, source_element_id),
  target_type = coalesce(target_type, case when target_element_id is not null then 'planning_element' end),
  target_id = coalesce(target_id, target_element_id),
  relation_type = coalesce(nullif(relation_type, ''), link_kind::text, 'reference'),
  fields_map = coalesce(nullif(fields_map, '{}'::jsonb), mapping, '{}'::jsonb)
where
  source_type is null
  or source_id is null
  or target_type is null
  or target_id is null
  or relation_type is null
  or relation_type = ''
  or fields_map = '{}'::jsonb;

create index if not exists idx_data_links_source_entity
  on public.data_links(source_type, source_id)
  where source_type is not null and source_id is not null;

create index if not exists idx_data_links_target_entity
  on public.data_links(target_type, target_id)
  where target_type is not null and target_id is not null;

create index if not exists idx_data_links_relation_type
  on public.data_links(relation_type);

-- -----------------------------------------------------------------------------
-- project_events processing shape
-- -----------------------------------------------------------------------------
alter table if exists public.project_events
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists status text not null default 'pending',
  add column if not exists retry_count integer not null default 0,
  add column if not exists processed_at timestamptz;

update public.project_events
set
  source_type = coalesce(source_type, aggregate_type),
  source_id = coalesce(source_id, aggregate_id)
where source_type is null or source_id is null;

alter table if exists public.project_events
  drop constraint if exists project_events_retry_count_check,
  add constraint project_events_retry_count_check check (retry_count >= 0);

create index if not exists idx_project_events_status_created
  on public.project_events(status, created_at desc);

create index if not exists idx_project_events_source
  on public.project_events(source_type, source_id)
  where source_type is not null and source_id is not null;

-- -----------------------------------------------------------------------------
-- sync_queue operation compatibility for domain event handlers
-- -----------------------------------------------------------------------------
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'sync_queue'
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%operation%'
  loop
    execute format('alter table public.sync_queue drop constraint if exists %I', constraint_name);
  end loop;
end $$;

alter table if exists public.sync_queue
  add constraint sync_queue_operation_check check (
    operation in ('insert', 'update', 'delete', 'upsert', 'planning.smart_conversion.approved')
  );

-- Some schema generations historically exposed processed_at while the canonical
-- queue table used attempts/available_at. Ensure smart-conversion inserts and
-- worker status updates share the same final shape.
alter table if exists public.sync_queue
  add column if not exists processed_at timestamptz;

create index if not exists idx_sync_queue_operation_status
  on public.sync_queue(operation, status);

-- -----------------------------------------------------------------------------
-- smart_connectors service/database naming alignment
-- -----------------------------------------------------------------------------
alter table if exists public.smart_connectors
  add column if not exists source_element_id uuid,
  add column if not exists target_element_id uuid,
  add column if not exists relationship_type text not null default 'references',
  add column if not exists connector_kind public.smart_connector_kind not null default 'visual_connector',
  add column if not exists style jsonb not null default '{}'::jsonb,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_smart_connectors_source
  on public.smart_connectors(source_element_id);

create index if not exists idx_smart_connectors_target
  on public.smart_connectors(target_element_id);

create index if not exists idx_smart_connectors_relationship
  on public.smart_connectors(relationship_type);

-- -----------------------------------------------------------------------------
-- element_transformations canonical conversion trace fields
-- -----------------------------------------------------------------------------
alter table if exists public.element_transformations
  add column if not exists target_entity_type text,
  add column if not exists target_entity_id uuid,
  add column if not exists suggested_type text,
  add column if not exists extracted_data jsonb not null default '{}'::jsonb;

update public.element_transformations
set
  target_entity_type = coalesce(target_entity_type, result->>'entityType'),
  target_entity_id = coalesce(
    target_entity_id,
    case
      when result->>'entityId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then (result->>'entityId')::uuid
      else null
    end
  ),
  suggested_type = coalesce(suggested_type, transformation_type),
  extracted_data = coalesce(nullif(extracted_data, '{}'::jsonb), result, '{}'::jsonb)
where
  target_entity_type is null
  or target_entity_id is null
  or suggested_type is null
  or extracted_data = '{}'::jsonb;

create index if not exists idx_element_transformations_target_entity
  on public.element_transformations(target_entity_type, target_entity_id)
  where target_entity_type is not null and target_entity_id is not null;

-- -----------------------------------------------------------------------------
-- smart_docs multi-source tracking
-- -----------------------------------------------------------------------------
alter table if exists public.smart_docs
  add column if not exists source_element_ids uuid[] not null default '{}'::uuid[];

update public.smart_docs
set source_element_ids = array[element_id]
where coalesce(array_length(source_element_ids, 1), 0) = 0;

create index if not exists idx_smart_docs_source_element_ids
  on public.smart_docs using gin(source_element_ids);
