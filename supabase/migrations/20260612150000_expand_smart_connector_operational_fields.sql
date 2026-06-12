-- Persist logical smart-connector approval and operational-link metadata in columns.
-- data_links remains the temporary EntityLink-compatible fallback for cross-entity
-- operational traces until a dedicated entity_links table is introduced.

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

update public.smart_connectors
set
  source_type = coalesce(source_type, metadata->>'sourceEntityType'),
  source_id = coalesce(
    source_id,
    case
      when metadata->>'sourceEntityId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then (metadata->>'sourceEntityId')::uuid
      else null
    end
  ),
  target_type = coalesce(target_type, metadata->>'targetEntityType'),
  target_id = coalesce(
    target_id,
    case
      when metadata->>'targetEntityId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then (metadata->>'targetEntityId')::uuid
      else null
    end
  ),
  status = case
    when coalesce(approved_by_user, false) or lower(metadata->>'approvedByUser') in ('true', 'yes', 'approved', 'user_approved') then 'approved'
    when status is null or status = '' then 'pending'
    else status
  end,
  direction = coalesce(nullif(direction, ''), nullif(metadata->>'direction', ''), 'source_to_target'),
  source = coalesce(source, metadata->>'source'),
  confidence = coalesce(
    confidence,
    case
      when metadata->>'confidence' ~ '^(0(\.[0-9]+)?|1(\.0+)?)$' then (metadata->>'confidence')::numeric
      else null
    end
  ),
  logical_created_by = coalesce(logical_created_by, metadata->>'createdBy'),
  is_ai_generated = coalesce(is_ai_generated, lower(metadata->>'isAIGenerated') in ('true', 'yes'), false),
  approved_by_user = coalesce(approved_by_user, lower(metadata->>'approvedByUser') in ('true', 'yes', 'approved', 'user_approved'), false),
  approved_by = coalesce(approved_by, metadata->>'approvedBy')
where metadata is not null;

alter table if exists public.smart_connectors
  drop constraint if exists smart_connectors_status_check,
  add constraint smart_connectors_status_check check (status in ('pending', 'approved', 'rejected')),
  drop constraint if exists smart_connectors_direction_check,
  add constraint smart_connectors_direction_check check (direction in ('source_to_target', 'target_to_source', 'bidirectional')),
  drop constraint if exists smart_connectors_confidence_check,
  add constraint smart_connectors_confidence_check check (confidence is null or (confidence >= 0 and confidence <= 1)),
  drop constraint if exists smart_connectors_entity_endpoint_pair_check,
  add constraint smart_connectors_entity_endpoint_pair_check check (
    (source_type is null and source_id is null and target_type is null and target_id is null)
    or (source_type is not null and source_id is not null and target_type is not null and target_id is not null)
  ),
  drop constraint if exists smart_connectors_approval_metadata_check,
  add constraint smart_connectors_approval_metadata_check check (
    status <> 'approved' or approved_by_user = true
  );

create index if not exists idx_smart_connectors_entity_source
  on public.smart_connectors(source_type, source_id)
  where source_type is not null and source_id is not null;

create index if not exists idx_smart_connectors_entity_target
  on public.smart_connectors(target_type, target_id)
  where target_type is not null and target_id is not null;

create index if not exists idx_smart_connectors_status_relationship
  on public.smart_connectors(status, relationship_type);
