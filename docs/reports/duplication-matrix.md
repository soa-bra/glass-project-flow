# Duplication Matrix (Initial Static Pass)

## High-Risk Candidates (merge/refactor first)

| Area | Candidate A | Candidate B | Risk | Action |
|---|---|---|---|---|
| Canvas Snap | `src/engine/canvas/math/snapEngine.ts` | `src/engine/canvas/interaction/snapEngine.ts` | Behavior divergence in snapping rules | Unify algorithm source + keep thin adapter if needed |
| Shape Rendering | `src/features/planning/elements/diagram/ShapeRenderer.tsx` | `src/features/planning/elements/shared/ShapeRenderer.tsx` | Inconsistent render output/style props | Consolidate into one renderer + explicit variants |
| Expense UI | `src/components/ProjectPanel/ExpenseModal.tsx` | `src/components/custom/ExpenseModal.tsx` | UX drift + duplicated validation logic | Extract shared form model and keep context-specific wrappers |
| Upload UI | `src/features/planning/ui/overlays/FileUploadModal.tsx` | `src/components/custom/FileUploadModal.tsx` | Separate upload policies/errors | Centralize upload service + role-specific shells |

## Medium-Risk Candidates

| Pattern | Examples | Action |
|---|---|---|
| Repeated domain tabs | many `OverviewTab.tsx`, `ReportsTab.tsx`, `TemplatesTab.tsx` under `src/components/DepartmentTabs/*` | Introduce composable tab scaffolds + shared cards/widgets |
| Panel factories | `ArchivePanel/CategoryPanelFactory.tsx` vs `SettingsPanel/CategoryPanelFactory.tsx` | Normalize factory contract and generator helpers |
| Repeated “box” cards | `BudgetBox.tsx`, `FinancialOverviewBox.tsx` in multiple domains | Replace with parametric stat/card primitives |

## Classification Rules for Next Pass
- **Valid duplication:** same name but domain-specific data/flows and different contracts.
- **Mergeable duplication:** ≥70% structural overlap and same interaction model.
- **Harmful duplication:** shared behavior diverges with no explicit reason.
