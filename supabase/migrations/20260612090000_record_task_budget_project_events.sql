-- Record project events whenever task budget/cost fields change.

create or replace function public.record_task_budget_project_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  event_actor_id uuid;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if new.estimated_cost is not distinct from old.estimated_cost
     and new.actual_cost is not distinct from old.actual_cost then
    return new;
  end if;

  select coalesce(auth.uid(), new.owner_id, p.owner_id)
    into event_actor_id
  from public.projects p
  where p.id = new.linked_project_id;

  insert into public.project_events (
    project_id,
    event_kind,
    event_type,
    aggregate_type,
    aggregate_id,
    actor_id,
    payload,
    metadata
  ) values (
    new.linked_project_id,
    'updated',
    'task.budget.changed',
    'task',
    new.id,
    event_actor_id,
    jsonb_build_object(
      'taskId', new.id,
      'projectId', new.linked_project_id,
      'estimatedCost', jsonb_build_object('old', old.estimated_cost, 'new', new.estimated_cost),
      'actualCost', jsonb_build_object('old', old.actual_cost, 'new', new.actual_cost)
    ),
    jsonb_build_object('source', 'tasks_budget_trigger')
  );

  return new;
end;
$$;

drop trigger if exists trg_record_task_budget_project_event on public.tasks;
create trigger trg_record_task_budget_project_event
  after update of estimated_cost, actual_cost on public.tasks
  for each row
  when (
    new.estimated_cost is distinct from old.estimated_cost
    or new.actual_cost is distinct from old.actual_cost
  )
  execute function public.record_task_budget_project_event();
