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

## Current Workspace Map

| Workspace / Surface | Key Files | Current State | Execution Meaning |
| --- | --- | --- | --- |
| Project workspace | `src/components/ProjectWorkspace.tsx`, `src/data/mockProjects.ts` | Mock/local project loading | Must not be treated as backend-complete. Needs migration to Supabase services/hooks before operational rollout. |
| Project Management Board | `src/components/ProjectManagement/ProjectManagementBoard.tsx`, `docs/ProjectManagementBoard-tabs-boxes-backend.md` | Mixed state: some tabs connected, many local/mock | Highest-priority backend completion surface after permissions foundation. |
| Planning workspace | Planning Canvas files under `src/components/planning/`, `supabase/functions/smart-elements-ai` | Most mature surface, but audit/permissions remain incomplete | Can become the reference implementation once security and audit foundations are hardened. |
| Departments workspace | Department workspace components and invoice-related services | Partial; invoices are the strongest area | Roll out one department at a time after shared contracts exist. |
| Archive workspace | Archive workspace components | Partial UI | Requires data-source, retention, search, permissions, and audit definition. |
| Settings workspace | Settings workspace components | Partial UI | Must become the control plane for roles, feature flags, integrations, and automation policies. |
| AI / Smart Elements | `supabase/functions/smart-elements-ai` and related canvas integration | Implemented for Planning use case | Must be gated by permission, quota, audit, and event logging before wider use. |
| Audit / Activity | audit-related service references and docs | Mock/incomplete in parts | Needs real audit/event catalog before automation and admin governance claims. |

## ProjectManagementBoard Tab State

Based on `docs/ProjectManagementBoard-tabs-boxes-backend.md`, the current tab state is:

| Tab | Current Data Source | State | Required Phase |
| --- | --- | --- | --- |
| Overview | Local project state | Partial/local | Phase 2 |
| Tasks | `useUnifiedTasks(project.id)` | Partially connected | Phase 2 |
| Finance | Local finance state | Local/mock | Phase 2 |
| Team | Local team member state | Local/mock | Phase 2 |
| Client | Client mock/local data | Local/mock | Phase 2 |
| Files | `projectFiles` data + attachments UI | Partial | Phase 2 |
| Templates | `TemplateLibrary` local props | Local/target-only | Phase 2 |
| Reports | `ReportsTab` local state | Local/mock | Phase 2 |

## Execution Gates

The following gates must be satisfied before claiming operational readiness:

1. Permissions and RLS foundation exists and is enforced across protected surfaces.
2. PMB tab data moves from local/mock state into typed services/hooks backed by Supabase.
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

- Define the canonical role model.
- Remove unsafe default-admin behavior.
- Add or harden RLS policies for protected tables.
- Add permission checks in services/hooks.
- Convert audit logging from mock/incomplete behavior into a reliable foundation for later automation.
