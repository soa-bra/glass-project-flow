# Duplication Matrix

Last reviewed: 2026-05-07

## Current High-Risk Candidates

| Area | Candidate A | Candidate B | Classification | Action |
|---|---|---|---|---|
| Upload UI | `src/features/planning/ui/overlays/FileUploadModal.tsx` | `src/components/custom/FileUploadModal.tsx` | Separate upload policies/errors | Centralize upload service + role-specific shells |

## Resolved Items

| Area | Canonical Implementation | Legacy / Duplicate Path | Classification | Verification | Resolution |
|---|---|---|---|---|---|
| Canvas Snap | `src/engine/canvas/interaction/snapEngine.ts` | `src/engine/canvas/math/snapEngine.ts` | compatibility shim, not a duplicate implementation | The legacy math file is absent. Source imports for the old math path are absent; active imports point to `@/engine/canvas/interaction/snapEngine`. | No adapter is needed because the shim has already been removed after references were migrated. Keep the interaction snap engine as the single canonical implementation. |
| Shape Rendering | `src/features/planning/elements/shared/ShapeRenderer.tsx` | `src/features/planning/elements/diagram/ShapeRenderer.tsx` | compatibility shim, not a duplicate implementation | The legacy diagram file is absent. Source imports for the old diagram renderer path are absent; active canvas imports point to `@/features/planning/elements/shared`. | No adapter is needed because the shim has already been removed after references were migrated. Keep the shared renderer/barrel as the single canonical implementation. |
| Project financial modals | `src/components/custom/ExpenseModal.tsx`, `src/components/custom/ApprovalRequestModal.tsx`, `src/components/custom/FinancialAnalysisModal.tsx` | `src/components/ProjectPanel/ExpenseModal.tsx`, `src/components/ProjectPanel/ApprovalRequestModal.tsx`, `src/components/ProjectPanel/AnalysisModal.tsx` | removed legacy wrappers | The ProjectPanel modal files are absent and have no source imports. | The active project finance flow stays on the custom modal implementations used by `ProjectTabs`; no shared schema extraction is needed while there are no remaining parallel wrappers or divergent modal behaviors in source. |

## 2026-05-07 Shim Audit Notes

- `src/engine/canvas/math/snapEngine.ts` was classified as a deprecated compatibility shim for `src/engine/canvas/interaction/snapEngine.ts`; it is already absent from the tree.
- `src/features/planning/elements/diagram/ShapeRenderer.tsx` was classified as a deprecated compatibility shim for `src/features/planning/elements/shared/ShapeRenderer.tsx`; it is already absent from the tree.
- No duplicate contracts needed to be unified in this pass because neither legacy shim still exists as an implementation or adapter.
- No imports required migration in this pass: the remaining source references already use the canonical snap engine and shared ShapeRenderer paths.

## Medium-Risk Candidates

| Pattern | Examples | Action |
|---|---|---|
| Repeated domain tabs | many `OverviewTab.tsx`, `ReportsTab.tsx`, `TemplatesTab.tsx` under `src/components/DepartmentTabs/*` | Introduce composable tab scaffolds + shared cards/widgets |
| Panel factories | `ArchivePanel/CategoryPanelFactory.tsx` vs `SettingsPanel/CategoryPanelFactory.tsx` | Normalize factory contract and generator helpers |
| Repeated “box” cards | `BudgetBox.tsx`, `FinancialOverviewBox.tsx` in multiple domains | Replace with parametric stat/card primitives |

## Classification Rules for Next Pass

- **Compatibility shim:** a legacy path that re-exports or adapts a canonical implementation without owning independent behavior.
- **Valid duplication:** same name but domain-specific data/flows and different contracts.
- **Mergeable duplication:** ≥70% structural overlap and same interaction model.
- **Harmful duplication:** shared behavior diverges with no explicit reason.
