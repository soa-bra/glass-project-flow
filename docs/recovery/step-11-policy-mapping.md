# Step 11 Appendix — RLS Policy Mapping (Initial)

- المصدر: `supabase/migrations/20260430160310_91fd3b59-915f-463d-8e01-63b1c31b6330.sql`
- الحالة: Draft Mapping (In Progress)

| Policy Name | Table | Coverage in Permissions Matrix |
|---|---|---|
| users read own profile | profiles | Profile read self |
| users update own profile | profiles | Profile update self |
| users insert own profile | profiles | Profile create self |
| users read own roles | user_roles | Roles read own |
| owner manages roles | user_roles | Role management owner-only |
| auth read permissions | permissions | Read permissions (authenticated) |
| owner manages permissions | permissions | Permission catalog owner-only |
| auth read role_permissions | role_permissions | Read role-permission map |
| owner manages role_permissions | role_permissions | Manage role-permission map |
| owners manage projects | projects | Project CRUD owner/scope |
| tasks visibility | tasks | Task read scope/assignee |
| tasks owner manage | tasks | Task CUD owner |
| owners manage departments | departments | Department management owner |
| owners manage central_boards | central_boards | Board management owner |
| manage department_projects | department_projects | Department-project link management |
| owners manage tools | tools | Tools management owner |
| owners manage engine_jobs | engine_jobs | Engine jobs management owner |
| manage task_tool_engine_links | task_tool_engine_links | Link management |
| owners manage project_cards | project_cards | Project card management owner |
| owners manage task_cards | task_cards | Task card management owner |
| auth read dependencies | dependencies | Dependencies read |
| auth manage dependencies | dependencies | Dependencies create/update |
| owner update dependencies | dependencies | Dependencies owner update |
| owner delete dependencies | dependencies | Dependencies owner delete |
| audit insert auth | audit_events | Audit insert authenticated |
| audit read own | audit_events | Audit read own/owner |
| owner reads outbox | event_outbox | Outbox read owner-only |
| owner reads dlq | event_dlq | DLQ read owner-only |

## Remaining
1. ربط كل Policy بعمليات frontend/service المقابلة (endpoint/hook).
2. إضافة أدلة تشغيل deny/allow لكل صف حرج.
