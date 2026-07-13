alter table if exists public.smart_connectors
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists target_type text,
  add column if not exists target_id uuid,
  add column if not exists status text not null default 'pending',
  add column if not exists direction text not null default 'source_to_target',
  add column if not exists source text,
  add column if not exists confidence numeric,
  add column if not exists logical_created_by text,
  add column if not exists is_ai_generated boolean not null default false,
  add column if not exists approved_by_user boolean not null default false,
  add column if not exists approved_by text;

alter table if exists public.smart_connectors
  drop constraint if exists smart_connectors_status_check,
  add constraint smart_connectors_status_check check (status in ('pending', 'approved', 'rejected', 'active', 'broken', 'archived', 'unlinked')),
  drop constraint if exists smart_connectors_direction_check,
  add constraint smart_connectors_direction_check check (direction in ('source_to_target', 'target_to_source', 'bidirectional')),
  drop constraint if exists smart_connectors_confidence_check,
  add constraint smart_connectors_confidence_check check (confidence is null or (confidence >= 0 and confidence <= 1)),
  drop constraint if exists smart_connectors_entity_endpoint_pair_check,
  add constraint smart_connectors_entity_endpoint_pair_check check (
    (source_type is null and source_id is null and target_type is null and target_id is null)
    or (source_type is not null and source_id is not null and target_type is not null and target_id is not null)
  );

create index if not exists idx_smart_connectors_entity_source
  on public.smart_connectors(source_type, source_id)
  where source_type is not null and source_id is not null;

create index if not exists idx_smart_connectors_entity_target
  on public.smart_connectors(target_type, target_id)
  where target_type is not null and target_id is not null;

create index if not exists idx_smart_connectors_status_relationship
  on public.smart_connectors(status, relationship_type);

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';