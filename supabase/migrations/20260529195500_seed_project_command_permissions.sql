-- Seed baseline project command permissions for service-level guards.

insert into public.permissions (code, module, description)
values
  ('central.project.create', 'projects', 'Create central projects'),
  ('central.project.update', 'projects', 'Update central project details'),
  ('central.project.archive', 'projects', 'Archive central projects'),
  ('central.project.delete', 'projects', 'Delete central projects')
on conflict (code) do update
set
  module = excluded.module,
  description = excluded.description;

insert into public.role_permissions (role, permission_code)
values
  ('owner', 'central.project.create'),
  ('owner', 'central.project.update'),
  ('owner', 'central.project.archive'),
  ('owner', 'central.project.delete'),
  ('project_manager', 'central.project.create'),
  ('project_manager', 'central.project.update'),
  ('project_manager', 'central.project.archive'),
  ('department_manager', 'central.project.create'),
  ('department_manager', 'central.project.update'),
  ('department_manager', 'central.project.archive')
on conflict (role, permission_code) do nothing;
