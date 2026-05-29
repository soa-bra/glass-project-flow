# Phase 0 Execution Source Map

## Purpose

This document starts the execution track for the Soabra implementation plan. Its goal is to freeze the current repository reality before backend, automation, AI, and project-board changes begin.

Phase 0 is intentionally documentary and verification-focused. It does not change production behavior. It creates the source map needed to sequence the next implementation phases safely.

## Source Of Truth Inputs

- `docs/soabra-foundational-master-spec-merged-ar-updated-sections-16-18.md`
- `docs/CURRENT_SYSTEM_SPECIFICATION.md`
- `docs/MIGRATION_PLAN.md`
- `docs/DOD_MATRIX.md`
- `docs/ProjectManagementBoard-tabs-boxes-backend.md`
- Current implementation under `src/`

## Confirmed Repository

The implementation target is:

- Repository: `soa-bra/glass-project-flow`
- Primary branch: `main`
- Phase branch: `codex/phase-0-source-map`

This repository matches the foundational specification references, including `ProjectManagementBoard`, `ProjectWorkspace`, Planning Canvas, workspace components, and supporting documentation.

## Code Inspection Notes

The initial assessment must be corrected by direct code inspection:

- `ProjectWorkspace` is no longer purely mock/local. It imports `useProjects`, `useCreateProject`, and `useUpdateProject` from `@/hooks/central`, maps central projects through `projectAdapter`, and writes create/update operations through central mutations.
- `ProjectWorkspace` still keeps a local `projects` view state for presentation, filtering, and sorting, but the DB-backed central hooks appear to be the source of project records.
- `ProjectManagementBoard` remains the main mixed-readiness surface. It renders several tabs that receive `null`, local props, or project-derived UI data instead of full service-backed models.
- `ProjectManagementBoard` delete/archive actions are currently UI-level handlers. They close dialogs and call update callbacks, but no explicit project delete/archive service call is visible in the inspected component.
- `RolesService` exists under `src/services/central/roles.service.ts`, with `user_roles`, `app_role`, and `role_scope_type` types, but Phase 1 must verify enforcement depth across UI, services, RLS, and audit.

## Current Workspace Map

| Workspace / Surface | Key Files | Current State | Execution Meaning |
| --- | --- | --- | --- |
| Project workspace | `src/components/ProjectWorkspace.tsx`, `src/hooks/central/useCentral.ts`, `src/services/central/*`, `src/adapters/projectAdapter.ts` | Partially central-backed | Projects list/create/update appear connected to central services. Filtering and sorting are local view concerns. Delete/archive readiness still needs verification. |
| Project Management Board | `src/components/ProjectManagement/ProjectManagementBoard.tsx`, `docs/ProjectManagementBoard-tabs-boxes-backend.md` | Mixed state: some tabs connected, many local/mock/null | Highest-priority backend completion surface after permissions foundation. |
| Planning workspace | Planning Canvas files under `src/components/planning/`, `supabase/functions/smart-elements-ai` | Most mature surface, but audit/permissions remain incomplete | Can become the reference implementation once security and audit foundations are hardened. |
| Departments workspace | Department workspace components and invoice-related services | Partial; invoices are the strongest area | Roll out one department at a time after shared contracts exist. |
| Archive workspace | Archive workspace components | Partial UI | Requires data-source, retention, search, permissions, and audit definition. |
| Settings workspace | Settings workspace components | Partial UI | Must become the control plane for roles, feature flags, integrations, and automation policies. |
| AI / Smart Elements | `supabase/functions/smart-elements-ai` and related canvas integration | Implemented for Planning use case | Must be gated by permission, quota, audit, and event logging before wider use. |
| Audit / Activity | audit-related service references and docs | Mock/incomplete in parts | Needs real audit/event catalog before automation and admin governance claims. |

## ProjectManagementBoard Tab State

Based on `docs/ProjectManagementBoard-tabs-boxes-backend.md` and direct inspection of `ProjectManagementBoard.tsx`, the current tab state is:

| Tab | Current Data Source | State | Required Phase |
| --- | --- | --- | --- |
| Overview | Project prop + local `mockStats` | Partial/local | Phase 2 |
| Tasks | `TaskManagementTab project={project}` and documented `useUnifiedTasks(project.id)` path | Partially connected | Phase 2 |
| Finance | `FinancialTab data={project}` | Project-derived/local | Phase 2 |
| Team | `TeamTab teamData={project.team}` | Project-derived/local | Phase 2 |
| Client | `ClientTab clientData={null}` | Not backend-connected | Phase 2 |
| Files | `AttachmentsTab documents={null}` | Not backend-connected | Phase 2 |
| Templates | `TemplatesTab templates={null}` | Not backend-connected | Phase 2 |
| Reports | `ReportsTab project={project}` | Project-derived/local/read-model unclear | Phase 2 |
| Delete / Archive actions | Local dialog handlers | Not service-backed in inspected component | Phase 2 or earlier if required for safety |

## Phase 1 Permission Focus

Phase 1 should not start by adding broad AI automation. It should first verify and harden the existing permission foundation:

1. Confirm canonical roles from Supabase generated types and migrations.
2. Verify `user_roles` RLS and service-level access paths.
3. Identify any default-admin or owner-bypass behavior.
4. Ensure protected operations use permission checks before mutation.
5. Ensure denied actions are audit-logged with a consistent decision reason.
6. Expose role assignment only through governed admin/settings surfaces.

## Execution Gates

The following gates must be satisfied before claiming operational readiness:

1. Permissions and RLS foundation exists and is enforced across protected surfaces.
2. PMB tab data moves from local/mock/null state into typed services/hooks backed by Supabase.
3. Audit and event logging are real, queryable, and attached to meaningful commands.
4. Automation and AI actions are routed through a command/event contract rather than direct untracked UI calls.
5. Admin/settings surfaces can control roles, feature flags, integrations, and automation policies.
6. Each rollout phase has tests or verification evidence attached to the PR.

## Immediate Execution Issues

This Phase 0 map anchors the following GitHub issues:

- #275 Phase 0: تثبيت مصدر الكود وخريطة الحالة قبل التنفيذ
- #276 P0: بناء أساس الصلاحيات وRLS قبل AI والأتمتة
- #277 P0: إكمال باك اند ProjectManagementBoard وتحويل local/mock إلى خدمات حقيقية
- #278 P0: تأسيس Audit + Event Catalog + Command Catalog + Outbox

## Phase 0 Acceptance Criteria

Phase 0 is complete when:

- The repository source map is committed and reviewed.
- Every major workspace is classified as implemented, partial, mock/local, target-only, or unknown.
- PMB tab backend status is documented tab by tab.
- Next implementation phases are tied to GitHub issues.
- No production behavior changes are included in the Phase 0 PR.

## Next Step After Phase 0

Start Phase 1 with issue #276:

- Define or confirm the canonical role model.
- Remove unsafe default-admin behavior if present.
- Add or harden RLS policies for protected tables.
- Add permission checks in services/hooks.
- Convert audit logging from mock/incomplete behavior into a reliable foundation for later automation.
