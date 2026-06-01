-- Seed AI usage permissions for canvas and project features.

insert into public.permissions (code, module, description)
values
  ('canvas.ai.use', 'canvas', 'Use AI features in canvas workflows'),
  ('project.ai.use', 'projects', 'Use AI features in project workflows')
on conflict (code) do update
set
  module = excluded.module,
  description = excluded.description;

-- Intentionally do not grant these permissions to guest/viewer-style roles.
insert into public.role_permissions (role, permission_code)
values
  ('owner', 'canvas.ai.use'),
  ('owner', 'project.ai.use'),
  ('project_manager', 'canvas.ai.use'),
  ('project_manager', 'project.ai.use'),
  ('department_manager', 'canvas.ai.use'),
  ('department_manager', 'project.ai.use')
on conflict (role, permission_code) do nothing;
