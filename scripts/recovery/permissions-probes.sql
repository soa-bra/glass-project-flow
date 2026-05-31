-- Step 11 runtime probes (execute in controlled test environment)
-- Run under different roles/accounts and record output.

-- Identity & role probes
select auth.uid() as current_user;
select public.is_owner(auth.uid()) as is_owner;

-- Permission probes (sample codes; replace with real codes from permissions table)
-- select public.has_permission(auth.uid(), 'project.read') as can_project_read;
-- select public.has_permission(auth.uid(), 'project.update') as can_project_update;

-- Domain read probes
select count(*) as projects_visible from public.projects;
select count(*) as tasks_visible from public.tasks;
select count(*) as invoices_visible from public.invoices;

-- Restricted probes (expected deny for non-owner)
select count(*) as outbox_visible from public.event_outbox;
select count(*) as dlq_visible from public.event_dlq;
