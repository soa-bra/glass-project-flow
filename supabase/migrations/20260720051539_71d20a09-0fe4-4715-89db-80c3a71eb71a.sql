alter table public.data_links
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists target_type text,
  add column if not exists target_id uuid,
  add column if not exists relation_type text,
  add column if not exists sync_type text not null default 'manual',
  add column if not exists fields_map jsonb not null default '{}'::jsonb,
  add column if not exists status text not null default 'active';

update public.data_links
set
  source_type = coalesce(source_type, case when source_element_id is not null then 'planning_element' end),
  source_id = coalesce(source_id, source_element_id),
  target_type = coalesce(target_type, case when target_element_id is not null then 'planning_element' end),
  target_id = coalesce(target_id, target_element_id),
  relation_type = coalesce(nullif(relation_type, ''), link_kind::text, 'reference'),
  fields_map = coalesce(nullif(fields_map, '{}'::jsonb), mapping, '{}'::jsonb),
  status = coalesce(nullif(status, ''), 'active')
where
  source_type is null
  or source_id is null
  or target_type is null
  or target_id is null
  or relation_type is null
  or fields_map = '{}'::jsonb
  or status is null;

create index if not exists idx_data_links_board_relation_type
  on public.data_links(board_id, relation_type);

create index if not exists idx_data_links_source_entity
  on public.data_links(source_type, source_id)
  where source_type is not null and source_id is not null;

create index if not exists idx_data_links_target_entity
  on public.data_links(target_type, target_id)
  where target_type is not null and target_id is not null;

create index if not exists idx_data_links_status
  on public.data_links(status);