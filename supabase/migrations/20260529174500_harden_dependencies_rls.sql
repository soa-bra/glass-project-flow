-- Harden dependencies RLS so cross-entity links are only visible/manageable
-- when the authenticated user can access both linked entities.

create or replace function public.can_access_central_entity(
  entity_type public.central_entity_type,
  entity_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case entity_type
    when 'board' then exists (
      select 1
      from public.central_boards b
      where b.id = entity_id
        and b.owner_id = auth.uid()
    )
    when 'department' then exists (
      select 1
      from public.departments d
      where d.id = entity_id
        and d.owner_id = auth.uid()
    )
    when 'project' then exists (
      select 1
      from public.projects p
      where p.id = entity_id
        and p.owner_id = auth.uid()
    )
    when 'task' then exists (
      select 1
      from public.tasks t
      left join public.projects p on p.id = t.linked_project_id
      where t.id = entity_id
        and (
          t.owner_id = auth.uid()
          or t.assignee_id = auth.uid()
          or p.owner_id = auth.uid()
        )
    )
    when 'tool' then exists (
      select 1
      from public.tools t
      left join public.central_boards b on b.id = t.central_board_id
      where t.id = entity_id
        and (
          t.owner_id = auth.uid()
          or b.owner_id = auth.uid()
        )
    )
    when 'engine_job' then exists (
      select 1
      from public.engine_jobs j
      where j.id = entity_id
        and j.owner_id = auth.uid()
    )
    when 'project_card' then exists (
      select 1
      from public.project_cards c
      left join public.projects p on p.id = c.linked_project_id
      where c.id = entity_id
        and (
          c.owner_id = auth.uid()
          or p.owner_id = auth.uid()
        )
    )
    when 'task_card' then exists (
      select 1
      from public.task_cards c
      left join public.tasks t on t.id = c.linked_task_id
      left join public.projects p on p.id = c.linked_project_id
      where c.id = entity_id
        and (
          c.owner_id = auth.uid()
          or t.owner_id = auth.uid()
          or t.assignee_id = auth.uid()
          or p.owner_id = auth.uid()
        )
    )
    else false
  end;
$$;

revoke all on function public.can_access_central_entity(public.central_entity_type, uuid) from public;
grant execute on function public.can_access_central_entity(public.central_entity_type, uuid) to authenticated;

drop policy if exists "authenticated users can manage dependencies" on public.dependencies;
drop policy if exists "users can view accessible dependencies" on public.dependencies;
drop policy if exists "users can create accessible dependencies" on public.dependencies;
drop policy if exists "users can update accessible dependencies" on public.dependencies;
drop policy if exists "users can delete accessible dependencies" on public.dependencies;

create policy "users can view accessible dependencies"
  on public.dependencies
  for select
  to authenticated
  using (
    public.can_access_central_entity(from_entity_type, from_entity_id)
    and public.can_access_central_entity(to_entity_type, to_entity_id)
  );

create policy "users can create accessible dependencies"
  on public.dependencies
  for insert
  to authenticated
  with check (
    public.can_access_central_entity(from_entity_type, from_entity_id)
    and public.can_access_central_entity(to_entity_type, to_entity_id)
  );

create policy "users can update accessible dependencies"
  on public.dependencies
  for update
  to authenticated
  using (
    public.can_access_central_entity(from_entity_type, from_entity_id)
    and public.can_access_central_entity(to_entity_type, to_entity_id)
  )
  with check (
    public.can_access_central_entity(from_entity_type, from_entity_id)
    and public.can_access_central_entity(to_entity_type, to_entity_id)
  );

create policy "users can delete accessible dependencies"
  on public.dependencies
  for delete
  to authenticated
  using (
    public.can_access_central_entity(from_entity_type, from_entity_id)
    and public.can_access_central_entity(to_entity_type, to_entity_id)
  );
