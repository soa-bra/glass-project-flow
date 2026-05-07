# Duplication Matrix (Initial Static Pass)

## High-Risk Candidates (merge/refactor first)

| Area | Deprecated Compatibility Shim | Canonical Implementation | Classification | Action |
|---|---|---|---|---|
| Canvas Snap | `src/engine/canvas/math/snapEngine.ts` | `src/engine/canvas/interaction/snapEngine.ts` | deprecated compatibility shim | تحديث الاستيرادات القديمة إلى canonical path: `src/engine/canvas/interaction/snapEngine.ts`.<br>حذف shim بعد اختفاء كل المراجع القديمة. |
| Shape Rendering | `src/features/planning/elements/diagram/ShapeRenderer.tsx` | `src/features/planning/elements/shared/ShapeRenderer.tsx` | deprecated compatibility shim | تحديث الاستيرادات القديمة إلى canonical path: `src/features/planning/elements/shared/ShapeRenderer.tsx`.<br>حذف shim بعد اختفاء كل المراجع القديمة. |

## Resolved Items

| Area | Canonical Implementation | Resolution |
|---|---|---|
| Canvas Snap | `src/engine/canvas/interaction/snapEngine.ts` | Legacy snap engine imports were migrated to the interaction snap engine canonical path. The deprecated math shim file is absent, and no source imports remain for that old snap engine path. |
| Shape Rendering | `src/features/planning/elements/shared/ShapeRenderer.tsx` | Legacy diagram renderer imports were migrated to the shared element renderer barrel. The deprecated diagram shim file is absent, and no source imports remain for that old renderer path. |
| Project financial modals | `src/components/custom/ExpenseModal.tsx`, `src/components/custom/ApprovalRequestModal.tsx`, `src/components/custom/FinancialAnalysisModal.tsx` | `src/components/ProjectPanel/ExpenseModal.tsx`, `src/components/ProjectPanel/ApprovalRequestModal.tsx`, and `src/components/ProjectPanel/AnalysisModal.tsx` are absent and have no source imports. The active project finance flow stays on the custom modal implementations imported by `src/components/ProjectPanel/ProjectTabs.tsx`, so no additional deletion or schema extraction is needed for those absent ProjectPanel copies. |
| Upload UI | `src/features/planning/ui/overlays/FileUploadModal.tsx`, `src/components/custom/FileUploadModal.tsx`, `src/shared/fileUploadSchema.ts` | Both modal wrappers are active: planning imports the overlay directly from `src/features/planning/ui/overlays/FileUploadModal.tsx`, while project/template flows import `src/components/custom/FileUploadModal.tsx`. Shared upload policy schemas, file validation, project upload form validation, file-size formatting, and project file type mapping now live in `src/shared/fileUploadSchema.ts`; each wrapper keeps only its contextual shell and destination-specific save behavior. |

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
