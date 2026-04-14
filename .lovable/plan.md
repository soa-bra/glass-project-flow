

# Phase 3: Data Display System Completion + KPIStatsSection Restoration — Complete Revised Plan

---

## 1. Full Component-Family Audit

### A. Shared Primitives (src/components/shared/visual-data/)

| Primitive | Status | Consumers | Action |
|-----------|--------|-----------|--------|
| `NumericStatCard` | Reusable as-is | 22 files | No change |
| `MetricHeroCard` | Reusable as-is | ~10 files | No change |
| `DataCardFrame` | Reusable as-is | 18 files | No change |
| `CapsuleBarChart` | Reusable as-is | 9 files | No change |
| `MinimalLineChart` | Reusable as-is | ~4 files | No change |
| `ChartTooltipShell` | Reusable as-is | 13 files (migrated) | 3 remaining consumers to fix |
| `ComparisonMetricCard` | Already fixed | 1 consumer (Financial/KPICards) | Verify only |
| `RingMetricCard` | Reusable, **0 consumers** | 0 | Needs adoption targets |
| `ArcGaugeCard` | Reusable, **0 consumers** | 0 | Needs adoption targets |
| `RadialProgressCard` | Reusable, 1 consumer | 1 (SatisfactionBox) | Verify only |

### B. KPIStatsSection

**Status: Partially restored in last pass.** Currently has `bg-white`, `border`, `shadow`, `p-6`, responsive metric scaling (`32/36/44px`), muted title (`xs/0.50`). This is already substantially improved vs. the transparent-tile regression. Needs final polish pass (see Batch 1).

### C. Remaining Non-Compliant Patterns

| Location | Issue |
|----------|-------|
| `Financial/OverviewTab.tsx` | Inline `tooltipStyle` variable (last remaining) |
| `CRM/OpportunitiesTab.tsx` line 228 | Bare `<Tooltip />` with no content/style at all |
| `Project/AISuggestedPerformanceBox.tsx` | `radius={[2,2,0,0]}` (thin bars, not capsule) |
| `Brand/ReportsTab.tsx` | 4 hand-built KPI divs (inline 36px metric, progress bar, no shared component) |
| `CRM/ServiceTab.tsx` | `grid grid-cols-2 lg:grid-cols-4` wrapping MetricHeroCard (should be AppDashboardGrid) |
| `CSR/MonitoringTab.tsx` | Same local grid pattern |
| `HR/ReportsTab.tsx` | Same local grid pattern |
| `HR/OverviewTab.tsx` | `grid grid-cols-2 lg:grid-cols-4` (quick actions — content-level, may be acceptable) |
| **Settings (7 panels)** | 30+ inline `text-2xl font-bold` stat blocks — must migrate to `NumericStatCard` |
| `GenericSettingsPanel.tsx` | 3 inline stat blocks in `grid grid-cols-3` |

---

## 2. KPIStatsSection Restoration (Final Polish)

**Current state** (after last pass): already has white bg, border, shadow, responsive sizing, muted title. This is 90% restored.

**Remaining polish:**

1. **Shadow refinement**: Verify the shadow token is the design-system-mandated `shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06)]` — confirmed present.
2. **Tile composition verification**: Ensure each tile has exactly 3 visual zones — (a) title at top (small, muted), (b) dominant metric at bottom-left (44px bold), (c) description below metric (11px muted). No icons, no decorative elements.
3. **Metric emphasis**: The `text-[32px] sm:text-[36px] md:text-[44px]` responsive scale is already applied. Verify `tracking-tight` and `leading-none` are enforced for visual density.
4. **Title/support hierarchy**: Title is `text-xs font-semibold text-[rgba(11,15,18,0.50)]`. Unit is `text-[13px] text-[rgba(11,15,18,0.40)]`. Description is `text-[11px] text-[rgba(11,15,18,0.40)] line-clamp-2`. This matches the editorial analytics spec.
5. **Spacing**: `p-6` padding confirmed. `min-h-[130/140/150px]` responsive min-heights confirmed. `gap-4` between tiles.
6. **Tile weight**: With white bg + border + shadow + p-6, tiles now have substantial KPI weight matching NumericStatCard. No further surface changes needed.

**Verdict**: KPIStatsSection is already restored to reference quality. This batch is a **verify-only** pass — no code changes expected unless a regression is found during inspection.

---

## 3. Unused Primitive Adoption Plan

### RingMetricCard — Adoption Targets

Currently used by: **0 files**

| Target | Replaces | Rationale |
|--------|----------|-----------|
| `CRM/OverviewTab.tsx` (satisfaction pie, lines 57-68) | Raw Recharts PieChart with manual center overlay | The current implementation is a raw pie with an absolute-positioned center div. RingMetricCard provides the same doughnut-with-center-metric pattern natively. |
| `CRM/AnalyticsTab.tsx` (revenue by segment pie, lines 129-138) | Raw Recharts PieChart | Same pattern — ring with labeled segments |

### ArcGaugeCard — Adoption Targets

Currently used by: **0 files**

| Target | Replaces | Rationale |
|--------|----------|-----------|
| `Brand/ReportsTab.tsx` KPI cards (lines 38-54) | 4 hand-built KPI cards with progress bars | The cards show `current/target` with a linear progress bar. Two of these (score percentages) are better expressed as arc gauges showing achievement. The remaining two can stay as NumericStatCard. |

### RadialProgressCard — Verification

Currently used by: **1 file** (`OperationsBoard/Overview/SatisfactionBox.tsx`). Already adopted correctly. No further adoption targets identified — other progress indicators use linear bars which are contextually appropriate.

### ChartTooltipShell — Remaining Adoption

| File | Current State | Fix |
|------|--------------|-----|
| `Financial/OverviewTab.tsx` | Inline `tooltipStyle` variable | Replace with `ChartTooltipShell` |
| `CRM/OpportunitiesTab.tsx` line 228 | Bare `<Tooltip />` | Replace with `ChartTooltipShell` |

---

## 4. Full Migration Map by Screen/Area

### Operations

| File | Current State | Migration Action |
|------|--------------|-----------------|
| `MarketingROAS.tsx` | ✅ Already migrated (DataCardFrame + ChartTooltipShell + capsule bars) | Verify only |
| `AttributionChart.tsx` | ✅ Already migrated (DataCardFrame + ChartTooltipShell + thicker pie) | Verify only |
| `CashFlowForecast.tsx` | ✅ Already migrated (ChartTooltipShell + strokeWidth 2.5) | Verify only |
| `ResourceHeatMap.tsx` | ✅ Already migrated (ChartTooltipShell + capsule bars, CartesianGrid removed) | Verify only |
| `ProjectSummaryBox.tsx` | ✅ Already migrated (ChartTooltipShell + capsule bars) | Verify only |
| `SatisfactionBox.tsx` | ✅ Uses RadialProgressCard | Verify only |
| `OperationStatsSection.tsx` | ✅ Uses NumericStatCard in AppDashboardGrid | Verify only |

### Project

| File | Current State | Migration Action |
|------|--------------|-----------------|
| `FinancialOverviewBox.tsx` | ✅ Already migrated (ChartTooltipShell) | Verify only |
| `DataVisualizationBox.tsx` | ✅ Uses MinimalLineChart | Verify only |
| `AISuggestedPerformanceBox.tsx` | ❌ `radius={[2,2,0,0]}` | Fix to `radius={[999,999,999,999]}` + add ChartTooltipShell |

### Departments

| File | Current State | Migration Action |
|------|--------------|-----------------|
| `CRM/OverviewTab.tsx` | ✅ ChartTooltipShell migrated | Replace raw PieChart with RingMetricCard |
| `CRM/ServiceTab.tsx` | ✅ ChartTooltipShell migrated | Migrate local grid to AppDashboardGrid |
| `CRM/AnalyticsTab.tsx` | ✅ ChartTooltipShell migrated | Replace raw PieChart with RingMetricCard |
| `CRM/OpportunitiesTab.tsx` | ❌ Bare `<Tooltip />` on pie (line 228) | Add ChartTooltipShell |
| `Financial/OverviewTab.tsx` | ❌ Inline `tooltipStyle` | Replace with ChartTooltipShell, remove variable |
| `Training/ReportsTab.tsx` | ✅ ChartTooltipShell + CartesianGrid removed | Verify only |
| `Brand/ReportsTab.tsx` | ❌ 4 hand-built KPI cards + local grid | Migrate to NumericStatCard/ArcGaugeCard + AppDashboardGrid |
| `CSR/MonitoringTab.tsx` | ❌ Local `grid grid-cols-2 lg:grid-cols-4` | Migrate to AppDashboardGrid |
| `HR/ReportsTab.tsx` | ❌ Local `grid grid-cols-2 lg:grid-cols-4` | Migrate to AppDashboardGrid |
| All other department tabs | ✅ Already migrated in previous passes | Verify only |

### Archive

**Audit result: No visual-data widgets found.** Archive panels contain document/record lists with status badges. No stat cards, no charts, no metric blocks. **Verified — no migration needed.**

### Settings

| File | Inline Stats | Migration Action |
|------|-------------|-----------------|
| `SecuritySettingsPanel.tsx` | 4 inline stat blocks (lines 315-337) | Replace with NumericStatCard size="sm" |
| `UsersRolesSettingsPanel.tsx` | 4 inline stat blocks (lines 218-242) | Replace with NumericStatCard size="sm" |
| `NotificationsSettingsPanel.tsx` | 4 inline stat blocks (lines 357-379) | Replace with NumericStatCard size="sm" |
| `IntegrationsSettingsPanel.tsx` | 3 inline stat blocks (lines 369-387) | Replace with NumericStatCard size="sm" |
| `AccountSettingsPanel.tsx` | 3 inline stat blocks (lines 339-355) | Replace with NumericStatCard size="sm" |
| `DataGovernanceSettingsPanel.tsx` | 4 inline stat blocks in `grid grid-cols-4` (lines 284-300) | Replace with NumericStatCard + AppDashboardGrid |
| `AISettingsPanel.tsx` | 4 inline stat blocks in `grid grid-cols-4` (lines 344-360) | Replace with NumericStatCard + AppDashboardGrid |
| `GenericSettingsPanel.tsx` | 3 inline stat blocks in `grid grid-cols-3` (lines 202-214) | Replace with NumericStatCard + AppDashboardGrid |

---

## 5. Responsive Data-Card Rules

Applied to shared primitives (NumericStatCard, MetricHeroCard, KPIStatsSection, DataCardFrame):

| Breakpoint | Metric Size | Card Min-Height | Chart Height |
|------------|-------------|-----------------|--------------|
| Desktop (≥1024px) | 40-44px | 140-160px | 200-300px |
| Tablet (768-1024px) | 36px | 130px | 160-220px |
| Mobile (<768px) | 32px | 120px | 120-160px |

**Rules already applied** in the last pass to KPIStatsSection, NumericStatCard, MetricHeroCard, and DataCardFrame:
- Metric: `text-[32px] sm:text-[36px] md:text-[40px]` (or `md:text-[44px]` for KPI)
- Min-height: `min-h-[130px] sm:min-h-[140px] md:min-h-[150px]`
- DataCardFrame chart zone: `min-h-[80px] md:min-h-[120px]`
- Description: `line-clamp-2` for truncation

**Verify-only** in this pass. If any primitive is missing responsive classes, add them.

**Minimum readable metric**: Never smaller than 28px (enforced by `text-[32px]` base).

---

## 6. Positive / Negative / Neutral System

Cross-context rules using existing palette only:

| State | Color | Arrow | Usage |
|-------|-------|-------|-------|
| Positive | `#3DBE8B` | ↑ | Upward trends, gains, above-target |
| Negative | `#E5564D` | ↓ | Downward trends, losses, below-target |
| Neutral | `rgba(11,15,18,0.40)` | — | No change, stable |

**Application by context:**

| Context | Positive | Negative | Neutral | Baseline |
|---------|----------|----------|---------|----------|
| ComparisonMetricCard | Green change text + ↑ | Red change text + ↓ | Gray, no arrow | — |
| Bar charts | Green fill | Red fill | Gray fill (`rgba(11,15,18,0.15)`) | `rgba(11,15,18,0.08)` zero-line |
| Line charts | Green stroke | Red stroke | Gray stroke | — |
| ArcGaugeCard | Green arc (>70%) | Red arc (<30%) | Yellow arc (30-70%) | Gray track |
| RadialProgressCard | Green ring | Red ring | Gray ring | `rgba(11,15,18,0.06)` track |

**Already applied** in ComparisonMetricCard (`directionColors` map). For chart-level positive/negative, this applies only where data semantically contains directional values — not forced onto all charts.

---

## 7. Execution Batches

### Batch 1: KPIStatsSection Verify + Brand/ReportsTab KPI Migration (~2 files)

- **KPIStatsSection**: Verify-only pass. Confirm composition, spacing, hierarchy, shadow match spec.
- **Brand/ReportsTab.tsx**: Replace 4 hand-built KPI divs with 2× `NumericStatCard` (for text metrics) + 2× `ArcGaugeCard` (for percentage metrics with progress). Migrate local `grid grid-cols-2 lg:grid-cols-4` to `AppDashboardGrid`.

### Batch 2: Remaining Tooltip Fixes (~3 files)

- `Financial/OverviewTab.tsx`: Remove `tooltipStyle` variable, replace `contentStyle={tooltipStyle}` with `content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE}`
- `CRM/OpportunitiesTab.tsx` line 228: Replace bare `<Tooltip />` with `<Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />`
- `Project/AISuggestedPerformanceBox.tsx`: Fix `radius={[2,2,0,0]}` to `radius={[999,999,999,999]}`, add ChartTooltipShell

### Batch 3: RingMetricCard Adoption (~2 files)

- `CRM/OverviewTab.tsx`: Replace raw PieChart+absolute-center-div (lines 57-68) with `RingMetricCard`
- `CRM/AnalyticsTab.tsx`: Replace raw PieChart for revenue-by-segment (lines 129-138) with `RingMetricCard`

### Batch 4: Local Grid Migration (~3 files)

- `CRM/ServiceTab.tsx`: Replace `grid grid-cols-2 lg:grid-cols-4` with `AppDashboardGrid columns={12}` + `AppGridItem colSpan={3}`
- `CSR/MonitoringTab.tsx`: Same migration
- `HR/ReportsTab.tsx`: Same migration

### Batch 5: Settings Stat Card Migration (~8 files)

Replace all `text-2xl font-bold` inline stat blocks with `NumericStatCard size="sm"`:
- SecuritySettingsPanel (4 blocks)
- UsersRolesSettingsPanel (4 blocks)
- NotificationsSettingsPanel (4 blocks)
- IntegrationsSettingsPanel (3 blocks)
- AccountSettingsPanel (3 blocks)
- DataGovernanceSettingsPanel (4 blocks + grid migration)
- AISettingsPanel (4 blocks + grid migration)
- GenericSettingsPanel (3 blocks + grid migration)

### Batch 6: Responsive Verify + Final Search

- Verify responsive classes on all shared primitives
- Run final searches for remaining debt patterns

---

## 8. Deliverables (Post-Execution)

1. **Files changed**: Full list with change category
2. **Visual-data families migrated**: Which shared primitives were adopted where
3. **Screens fully migrated**: Operations, Project, Departments, Settings
4. **Screens verified only**: Archive (no widgets), Operations (already clean)
5. **Remaining exceptions**: Any deferred items with reasons
6. **Final search results**:
   - `ChartTooltipContent` (should be 0 outside ui/chart.tsx)
   - `tooltipStyle` / `chartTooltipStyle` (should be 0)
   - `CartesianGrid` (should be 0)
   - `radius={[4` / `radius={[2` (should be 0)
   - `text-2xl font-bold` in SettingsPanel (should be 0 in stat contexts)
   - `grid grid-cols-2 lg:grid-cols-4` wrapping MetricHeroCard (should be 0)

---

## Estimated Impact

- ~18-22 files changed
- 1 KPIStatsSection verify pass (0 changes expected)
- 3 tooltip fixes
- 2 RingMetricCard adoptions
- 1 ArcGaugeCard adoption (Brand/ReportsTab)
- 3 local grid migrations
- 8 Settings panels stat migration
- 1 bar radius fix (AISuggestedPerformanceBox)

## Scope Protection

Will NOT touch: surface primitives, grid primitives, overlays/modals, action workflows, business logic, data sources, BaseBox internals.

