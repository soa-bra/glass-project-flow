

# Surface + Grid Completion Pass — Revised Plan

## Scope

Migration completion pass to adopt `AppCardSurface`, `AppDashboardGrid`, and `AppGridItem` across all remaining areas. No surface/grid primitive rebuilds. No data-display, overlay, or action work.

---

## Batch 1: Settings — Surface + Grid Migration (~8 files)

**Surface**: All 8 settings panels still use hand-built `<div className="bg-white border border-[#DADCE0] rounded-[24px] p-6 shadow-[...]">` for every card section. Replace each with `<AppCardSurface density="standard">`.

**Grid**: Multiple panels still use top-level `grid grid-cols-1 md:grid-cols-2` and `grid grid-cols-1 md:grid-cols-3` as board-level layout for arranging card sections. Replace these with `AppDashboardGrid` + `AppGridItem`. Internal form grids inside a card body stay as-is.

Files:
- `SecuritySettingsPanel.tsx` — 7 hand-built cards + board grids
- `NotificationsSettingsPanel.tsx` — 5 hand-built cards + 4 board grids
- `ThemeSettingsPanel.tsx` — 4 hand-built cards + 4 board grids
- `DataGovernanceSettingsPanel.tsx` — 5 hand-built cards + 3 board grids
- `AccountSettingsPanel.tsx` — hand-built cards + board grids
- `UsersRolesSettingsPanel.tsx` — hand-built cards
- `IntegrationsSettingsPanel.tsx` — hand-built cards
- `AISettingsPanel.tsx` — hand-built cards + board grids
- `GenericSettingsPanel.tsx` — hand-built cards + board grid

**Rule**: If `grid grid-cols-*` arranges multiple `AppCardSurface` sections at the page level, it is board-level and must become `AppDashboardGrid`. If it arranges form fields or options inside a single card, it is content-level and stays.

---

## Batch 2: Archive — Surface + Shell Migration (~8 files)

**Record cards**: All 8 archive panels use `<div className="bg-[#FFFFFF] p-6 rounded-[24px] ring-1 ring-[#DADCE0]">` for record cards. Replace with `<AppCardSurface interactive="hoverable">`.

**Search bar shells**: Use `<AppCardSurface density="compact">` to replace the search bar wrapper `bg-[#FFFFFF] p-4 rounded-[24px] ring-1 ring-[#DADCE0]`.

**Top-level shell/layout wrappers**: Verify and fix the archive panel layout wrapper (`ArchivePanelLayout.tsx` and each panel's outer `<div className="h-full flex flex-col bg-transparent">`). If any top-level shell still uses a hand-built white background or non-compliant wrapper, migrate it. Internal metadata grids inside record cards stay.

Files:
- `OrganizationalArchivePanel.tsx`
- `ProjectsArchivePanel.tsx`
- `HRArchivePanel.tsx`
- `LegalArchivePanel.tsx`
- `FinancialArchivePanel.tsx`
- `KnowledgeArchivePanel.tsx`
- `PoliciesArchivePanel.tsx`
- `TemplatesArchivePanel.tsx`
- `ArchivePanelLayout.tsx` (verify shell compliance)
- `DocumentsArchivePanel.tsx` (uses `BaseSearchBar` — verify only)

---

## Batch 3: Departments — Priority Migration Set (~6-8 files)

Priority files with known top-level board-level local grids or hand-built card shells:

- `Training/CoursesTab.tsx` — stat cards in `grid grid-cols-1 md:grid-cols-5` + course cards grid
- `Training/LMSTab.tsx` — stat cards in local grid
- `Training/SchedulingTab.tsx` — stat cards in `grid grid-cols-1 md:grid-cols-4`
- `Training/TemplatesTab.tsx` — template card grid
- `KMPA/KnowledgeRepositoryTab.tsx` — document card grid
- `KMPA/ModelsTemplatesTab.tsx` — local grids + `text-2xl font-bold` stat blocks
- `Brand/VisualAssetsTab.tsx` — sidebar+content layout + stat cards with `text-3xl font-bold`
- `Marketing/TemplatesTab.tsx` — `grid grid-cols-1 md:grid-cols-4` stat blocks + card grids

**After priority set**: Run a final search for remaining `grid grid-cols` patterns across all department tabs that function as board-level layout (not content-level). Fix any additional leftovers found.

---

## Batch 4: Operations — Verify + Fix (~6 files)

Operations has **6 files** with remaining hand-built `bg-white border border-[#DADCE0] rounded-[24px]` card shells that are NOT using `AppCardSurface`:

- `Reports/TemplatesList.tsx` — hand-built card shell
- `Reports/CustomReportForm.tsx` — hand-built card shell
- `Finance/ProjectBudgetChart.tsx` — hand-built card shells per project
- `Finance/OverBudgetAlert.tsx` — hand-built card shell
- `Clients/ClientSentiment.tsx` — duplicated `bg-white border` on Card
- `Clients/ClientPortfolioHealth.tsx` — 6 Card components with duplicated/conflicting `bg-white border border-[#DADCE0] rounded-[24px] bg-[#f3ffff] border-0` classes

**Action**: Replace all hand-built static card shells with `AppCardSurface`. Fix the broken `ClientPortfolioHealth.tsx` which has contradictory class stacking.

---

## Batch 5: Project — Verify + Fix

Project appears clean from the search (no `bg-white border...rounded-[24px]` matches). Run a targeted verification pass to confirm no remaining top-level grid or surface violations. Fix any found.

---

## Batch 6: Final Search Verification

Run final searches for remaining debt patterns across the entire `src/components` directory:
- `bg-white border border-[#DADCE0] rounded-[24px]` outside shared primitives (should be 0)
- `bg-[#FFFFFF].*rounded-[24px].*ring-1` outside shared primitives (should be 0)
- Board-level `grid grid-cols-*` wrapping multiple cards at page level (should be 0 — only content-level grids remain)

---

## Scope Protection

Will NOT touch:
- KPIStatsSection, DataCardFrame, chart internals, visual-data primitives
- Modals, dialogs, popovers, overlays
- Action logic, buttons, forms (content-level)
- Business logic, data structures
- BaseBox internals
- Content-level metadata/form grids inside card bodies

---

## Deliverables

1. **Files changed** — full list with change category
2. **Areas fully migrated** — Settings, Archive, Departments (priority set + leftovers), Operations
3. **Areas verified only** — Project (if clean)
4. **Remaining exceptions** — file, issue, reason deferred
5. **Final verification results** — search counts for remaining hand-built surfaces and board-level local grids

---

## Estimated Impact

- **Settings**: ~8-9 files (surface + grid)
- **Archive**: ~8-10 files (surface + shell)
- **Departments**: ~6-8 priority files + any leftovers found
- **Operations**: ~6 files (surface)
- **Project**: verify-only (0 changes expected)
- **Total**: ~28-35 files

