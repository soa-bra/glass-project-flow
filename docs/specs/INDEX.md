# Source-of-Truth Index — Soabra Master Spec

> **Governing document**: [`master-spec-ar.md`](./master-spec-ar.md) (5554 lines, 16 sections 0-15)
>
> **Structural detail workbooks** (auto-loaded by `scripts/generate-app-spec.mjs` → `src/config/app-spec.ts`):
> - [`departments-spec.xlsx`](./departments-spec.xlsx) — 12 departments • 94 tabs • 376 boxes • 166 popups
> - [`project-management-spec.xlsx`](./project-management-spec.xlsx) — 8 tabs • 29 boxes • 18 popups
> - [`archive-spec.xlsx`](./archive-spec.xlsx) — 9 tabs • 27 boxes
> - [`settings-spec.xlsx`](./settings-spec.xlsx) — 13 tabs • 44 boxes
>
> **Totals**: 15 dashboards • 124 tabs • 476 boxes • 184 popups — enforced by `src/__tests__/app-spec.coverage.test.ts`.

## Section ↔ Code Map

Status legend: ✅ matched · 🟡 partial · 🔴 missing

| § | Topic | Code | Status |
|---|---|---|---|
| 0 | مقدمة الوثيقة | — (meta) | ✅ |
| 1 | هوية سوبرا والمنطق الحاكم | `mem://spec/master-spec` | ✅ |
| 2.2 | 6 Workspaces | `src/components/{ProjectWorkspace,DepartmentsWorkspace,PlanningWorkspace,ArchiveWorkspace,SettingsWorkspace}` + `OperationsBoard` (to be promoted) | 🟡 (5/6 — Operations not yet a Workspace) |
| 3 | مبادئ البناء | ESLint config + memory rules | 🟡 |
| 4.0.1 | Workspace Shell | `src/components/workspaces/WorkspaceShell.tsx` | 🔴 (planned R3) |
| 4.1 | Projects Workspace | `src/components/ProjectManagement/*` | 🟡 |
| 4.2 | Departments Workspace | `src/components/DepartmentTabs/*` (10/12 dirs) | 🟡 |
| 4.3 | Operations | `src/components/OperationsBoard/*` | 🟡 |
| 4.4 | Planning Workspace | `src/features/planning/*` | 🟡 |
| 4.5 | Archive Workspace | `src/components/ArchivePanel/*` + sidebar | 🟡 |
| 4.6 | Settings Workspace | `src/components/SettingsPanel.tsx` + sidebar | 🟡 |
| 5 | Planning & Canvas (13 subsections) | `src/features/planning`, `src/engine/canvas/*`, `src/stores/canvas/*` | 🟡 |
| 6 | كتالوج المكونات | `src/components/box-kit/*` | 🔴 (planned R2) |
| 7 | Design System & Tokens | `src/index.css`, `tailwind.config.ts` | 🟡 |
| 8 | الخصائص والسلوكيات | scattered hooks/stores | 🟡 |
| 9 | نموذج البيانات النهائي | Supabase migrations + `src/integrations/supabase/types.ts` | 🟡 |
| 10 | عقود الأحداث والأوامر | `src/shared/events/*` (events ✅), `src/shared/commands/*` | 🟡 (commands 🔴) |
| 11 | التكاملات | `src/integrations/*` + `supabase/functions/*` | 🟡 |
| 12 | تدفقات الاستخدام | scattered; e2e tests pending | 🔴 |
| 13 | معايير القبول | `docs/specs/acceptance-checklist.md` | 🔴 (planned R13) |
| 14 | الصورة التقنية (10 طبقات) | repository layout | 🟡 |
| 15 | قواعد البناء | ESLint + PR template | 🟡 |

## Regeneration

```bash
node scripts/generate-app-spec.mjs   # rebuilds src/config/app-spec.ts
bunx vitest run src/__tests__/app-spec.coverage.test.ts
```

## Rule

Every React/SQL/service file added or modified to satisfy this spec MUST carry a JSDoc tag `@specRef <section-or-ref>` (e.g. `@specRef 4.2 / FinancialDashboard.overview.summary`). Files without a `@specRef` are considered orphan code and surfaced for review.
