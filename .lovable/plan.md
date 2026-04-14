

# Surface + Grid Completion — Execution Plan

## Current State Summary

**Clean (no action needed):**
- `GenericCard`, `InnerCard`, `glass-enhanced`, `rounded-[40px]`, `rounded-[41px]` — all removed
- `variant="glass"` — only in BaseBox stories (acceptable) + BaseBox definition
- `BaseBox` — properly normalized, all legacy variants map to `STANDARD_SURFACE`
- Surface primitives (`AppCardSurface`, `AppSectionSurface`, etc.) — complete
- Grid primitives (`AppDashboardGrid`, `AppGridItem`, `AppGridSection`, `GRID_PRESETS`) — complete
- Operations `OverviewGrid` — already migrated to shared grid

**Needs migration (4 areas):**

| Area | Issue | Scope |
|------|-------|-------|
| **Department Tabs** | 72 files with local `grid grid-cols-*` for top-level card layouts; ~15 files with `bg-white/N` (most inside Dialogs = OK, ~3-5 on static surfaces) | ~35 files (top-level grids only) |
| **Settings** | 9 panels using hand-built `grid grid-cols-*` + inline surface classes; 2 files with `bg-white/50` on static elements | ~9 files |
| **Archive** | Layout shell not using shared grid; archive panels use inline surface styling; internal metadata grids are content-level (OK) | ~4 files |
| **Project** | `ProjectCardGrid` uses `grid-cols-3 grid-rows-4`; `ProjectManagementBoard` uses local grid; task tabs use local grids | ~8 files |
| **Operations** | 6 files with remaining `bg-white/N` on static surfaces (AttributionChart, ActiveCampaigns, MarketingROAS, CustomReportForm, TimelineBox, BudgetBox) | ~6 files |

---

## Execution Order

### Batch 1: Surface Violations Cleanup (~12 files)

Fix remaining `bg-white/N` on **static** surfaces across all areas:
- **Operations:** `AttributionChart.tsx`, `ActiveCampaigns.tsx`, `MarketingROAS.tsx`, `CustomReportForm.tsx` — replace `bg-white/60`, `bg-white/80`, `bg-white/70`, `bg-white/50` with `bg-gray-50 border border-[#DADCE0]` or `bg-white`
- **Operations TimelineBox:** `bg-white/30` on form inputs inside a Popover — this is overlay context, leave as-is
- **Operations BudgetBox:** `bg-white/20` on Progress inside colored gradient card — this is on colored bg, leave as-is
- **Settings:** `AccountSettingsPanel.tsx` (`bg-white/50`→`bg-gray-50`), `SecuritySettingsPanel.tsx` (`bg-white/50`→`bg-gray-50`)
- **Departments (static only):** Any `bg-white/N` on non-Dialog surfaces — verify each file, fix ~3-5

### Batch 2: Settings Migration (~9 files)

Replace hand-built grids + inline surfaces with shared primitives:
- `GenericSettingsPanel.tsx` — wrap content in `AppDashboardGrid`, replace colored `div` blocks with `AppCardSurface`
- Category panels (`ThemeSettingsPanel`, `AccountSettingsPanel`, `SecuritySettingsPanel`, `DataGovernanceSettingsPanel`, `UsersRolesSettingsPanel`, etc.) — replace `grid grid-cols-*` with `AppDashboardGrid + AppGridItem`, replace inline `rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0]` divs with `AppCardSurface`

### Batch 3: Archive Migration (~4 files)

- `ArchivePanelLayout.tsx` — simplify redundant nesting
- Archive category panels — replace inline surface `div` patterns (`bg-[#FFFFFF] p-6 rounded-[24px] ring-1 ring-[#DADCE0]`) with `AppCardSurface`
- Internal metadata grids (grid-cols-2/3/4 inside cards) are content-level — leave as-is

### Batch 4: Project Dashboard Migration (~8 files)

- `ProjectCardGrid.tsx` — replace `grid grid-cols-3 grid-rows-4` with `AppDashboardGrid + AppGridItem` using project preset
- `ProjectManagementBoard.tsx` — replace `grid grid-cols-3` stat header with `AppDashboardGrid`
- `TaskManagementTab.tsx` — replace `grid grid-cols-2 md:grid-cols-4` stats with `AppDashboardGrid + AppGridItem`
- `ReportsTab.tsx` — same pattern for stats grids
- Content-level grids inside cards (metadata, filters) — leave as-is

### Batch 5: Department Tabs Top-Level Grids (~25-35 files)

For each department tab file that wraps cards/BaseBox in `grid grid-cols-*`:
- Replace outer card-arrangement `div` with `AppDashboardGrid + AppGridItem`
- Keep `BaseBox` usage (it's compliant via STANDARD_SURFACE)
- Only migrate **top-level board grids**, not internal content grids
- Priority files: overview tabs, stats sections, card grids across all 9 departments

### Batch 6: Operations Completion (~3-5 files)

- `ReportLibrary.tsx` — uses `Card` from shadcn with inline surface classes → normalize to `AppCardSurface` or `BaseBox`
- `OperationStatsSection.tsx` — uses `grid grid-cols-3` → `AppDashboardGrid`
- Remaining operations files — verify, fix any missed local grids

### Batch 7: Verification & Deliverables

Run codebase searches for all rogue patterns and produce final report.

---

## Scope Protection

Will NOT touch:
- `bg-white/N` inside Dialog/DialogContent/Popover (overlay surfaces — glass OK)
- `bg-white/N` on colored gradient backgrounds (BudgetBox, sidebar — contextual OK)
- Chart internals, KPIStatsSection, modal structures, tooltip systems
- Internal content-level grids (metadata inside cards)
- Business logic, action workflows

---

## Estimated Impact

~55-65 files changed total across all batches. Execution will proceed batch-by-batch in implementation mode.

