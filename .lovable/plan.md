

# Phase 3: Data Display System Completion + KPIStatsSection Restoration — Revised Plan

---

## 1. Full Component-Family Audit

### A. Shared Visual-Data Primitives (src/components/shared/visual-data/)

| Primitive | Status | Assessment |
|-----------|--------|------------|
| `NumericStatCard` | **Reusable as-is** | Correct hierarchy (40px metric, xs title, 11px description), white bg + border, 3 size variants. Used in 22 files. |
| `MetricHeroCard` | **Reusable as-is** | 44px metric, badge support, children slot. Used in ~10 files. |
| `ComparisonMetricCard` | **Needs normalization** | Shows `changeValue` as dominant (36px) but ignores the main `value` prop entirely — the card renders only the change, not the primary metric. Missing positive/negative color treatment. |
| `DataCardFrame` | **Reusable as-is** | Standard chart container shell. Used in 18 files. |
| `CapsuleBarChart` | **Reusable as-is** | Custom capsule bars, motion, proper track. Used in 9 files. |
| `MinimalLineChart` | **Reusable as-is** | Has its own inline dark tooltip (correct spec). Used in a few files. |
| `RingMetricCard` | **Reusable as-is** | Concentric rings with motion, legend row. 0 consumers outside definition — needs adoption. |
| `ArcGaugeCard` | **Reusable as-is** | Semi-arc gauge with endpoint dot. 0 consumers outside definition — needs adoption. |
| `RadialProgressCard` | **Reusable as-is** | Full-circle progress. 0 consumers outside definition — needs adoption. |
| `ChartTooltipShell` | **Reusable as-is** | Dark tooltip (#0B0F12), RTL-safe, correct spec. **0 consumers** — every chart currently uses either `ChartTooltipContent` (shadcn light) or inline `tooltipStyle` objects. |

### B. KPIStatsSection (src/components/shared/KPIStatsSection.tsx)

**Classification: Regression — must be restored.**

Current state:
- No `bg-white`, no border, no shadow — tiles float as transparent text
- `p-5` padding (too tight)
- `min-h-[150px]` (adequate)
- Title: `text-[13px] font-bold text-[rgba(11,15,18,0.75)]` — too prominent (should be smaller, more muted)
- Metric: `text-[44px]` (correct size but visually weak without card container)
- Unit: `text-[13px]` (correct)
- Description: `text-[11px]` (correct)

**Problem**: Without a white card surface, these tiles have no visual weight. They blend into the background and feel like floating text rather than substantial KPI tiles. The title color at 0.75 opacity is too strong relative to the design system (should be ~0.50).

Used in **15 files** across Operations (3), Departments (10), and cross-department (2).

### C. Non-Compliant Patterns Found

| Location | Issue |
|----------|-------|
| **Operations: `MarketingROAS.tsx`** | Raw `div` container (no DataCardFrame), `CartesianGrid`, thin bars (`radius={[4,4,0,0]}`), `ChartTooltipContent` |
| **Operations: `AttributionChart.tsx`** | Raw `div` container, `ChartTooltipContent`, default pie styling |
| **Operations: `CashFlowForecast.tsx`** | `ChartTooltipContent`, visible CartesianGrid via axes, thin `strokeWidth={2}` |
| **Operations: `ResourceHeatMap.tsx`** | `CartesianGrid`, `ChartTooltipContent`, thin bars (`radius={[4,4,0,0]}`) |
| **Operations: `ProjectSummaryBox.tsx`** | `ChartTooltipContent`, bars with `radius={[2,2,0,0]}`, `text-2xl` metrics (not spec) |
| **Project: `FinancialOverviewBox.tsx`** | `ChartTooltipContent`, hardcoded `bg-[#96D8D0]`, `text-xl` metrics, thin pie |
| **Project: `AISuggestedPerformanceBox.tsx`** | Bars with `radius={[2,2,0,0]}` |
| **Departments: `CRM/ServiceTab.tsx`** | MetricHeroCard in local `grid grid-cols-2 lg:grid-cols-4`, inline `tooltipStyle` charts |
| **Departments: `CRM/OverviewTab.tsx`** | Inline `tooltipStyle` |
| **Departments: `CRM/AnalyticsTab.tsx`** | Inline `chartTooltipStyle` |
| **Departments: `Financial/OverviewTab.tsx`** | Inline `tooltipStyle` |
| **Departments: `Training/ReportsTab.tsx`** | `CartesianGrid` in 3 charts |
| **Departments: `CRM/OpportunitiesTab.tsx`** | `CartesianGrid` |
| **Departments: `Brand/ReportsTab.tsx`** | Hand-built KPI cards (inline div with 36px metric, no shared component) |
| **Departments: `CSR/MonitoringTab.tsx`** | MetricHeroCard in local `grid grid-cols-2 lg:grid-cols-4` |
| **Settings: `UsersRolesSettingsPanel.tsx`** | 4 inline stat blocks (`text-2xl font-bold`, `p-4 text-center`) — not using `NumericStatCard` |
| **Settings: `IntegrationsSettingsPanel.tsx`** | 3 inline stat blocks — same pattern |
| **Settings: `AccountSettingsPanel.tsx`** | 3 inline stat blocks with `bg-transparent ring-1` — not using `NumericStatCard` |
| **Settings: `DataGovernanceSettingsPanel.tsx`** | Inline stat blocks in `grid grid-cols-4` — not migrated |
| **Settings: `NotificationsSettingsPanel.tsx`** | Likely inline stats (same pattern) |
| **Archive** | **No visual-data cards found** — archive panels are document/record list views only. No stat/metric/chart widgets. Verified: no imports of any visual-data component. |

---

## 2. Execution Batches

### Batch 1: KPIStatsSection Deep Restoration

**Not just adding bg/border.** Full composition restoration:

1. **Card surface**: Add `bg-white border border-[#DADCE0]` + design-token shadow `shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06)]`
2. **Padding**: Increase from `p-5` to `p-6` for breathing room
3. **Title hierarchy**: Change from `text-[13px] font-bold text-[rgba(11,15,18,0.75)]` to `text-xs font-semibold text-[rgba(11,15,18,0.50)]` — aligning with NumericStatCard/MetricHeroCard title treatment (small, muted, secondary)
4. **Metric emphasis**: Keep `text-[44px] font-bold` but verify `tracking-tight` and `leading-none` are enforced
5. **Unit sizing**: Keep `text-[13px]` but change to `text-[rgba(11,15,18,0.40)]` to match visual-data family
6. **Description**: Keep `text-[11px] text-[rgba(11,15,18,0.40)]` (already correct)
7. **Responsive rules**: Add `@media` responsive classes — on mobile (`<640px`), reduce metric to `text-[36px]`, keep `min-h-[130px]`
8. **Empty state**: Keep existing loading state

**Result**: KPIStatsSection tiles will match the weight and composition of NumericStatCard/MetricHeroCard — substantial white tiles with clear hierarchy. All 15 consumer files benefit automatically.

### Batch 2: ComparisonMetricCard Normalization + Positive/Negative System

**ComparisonMetricCard fix**:
- Display the primary `value` as the dominant metric (36px or 40px)
- Display `changeValue` as a secondary comparison element with directional indicator
- Add positive/negative/neutral color treatment using existing palette

**Positive/Negative/Neutral rules** (app-wide, applied to ComparisonMetricCard and any trend indicators):

| State | Color | Usage |
|-------|-------|-------|
| Positive | `#3DBE8B` (accent green) | Upward trends, gains, above-target |
| Negative | `#E5564D` (accent red) | Downward trends, losses, below-target |
| Neutral | `rgba(11,15,18,0.40)` (ink-30) | No change, stable, baseline |

**Baseline behavior**: Zero-line in charts uses `rgba(11,15,18,0.08)`. Positive bars grow upward with green. Negative bars grow downward with red. Gauge/progress cards show red when value < 30%, yellow when 30-70%, green when > 70%.

### Batch 3: Tooltip Migration (12 files)

Replace all `ChartTooltipContent` and inline `tooltipStyle` usages with `ChartTooltipShell`:

**Files using `ChartTooltipContent` (8 files)**:
- `OperationsBoard/Finance/CashFlowForecast.tsx`
- `OperationsBoard/Marketing/MarketingROAS.tsx`
- `OperationsBoard/Marketing/AttributionChart.tsx`
- `OperationsBoard/HR/ResourceHeatMap.tsx`
- `OperationsBoard/Overview/ProjectSummaryBox.tsx`
- `ProjectManagement/cards/FinancialOverviewBox.tsx`
- `ProjectManagement/cards/DataVisualizationBox.tsx`
- `OperationsBoard/Clients/OpportunityFunnel.tsx` (if present)

**Files using inline `tooltipStyle` (4 files)**:
- `DepartmentTabs/Financial/OverviewTab.tsx`
- `DepartmentTabs/CRM/OverviewTab.tsx`
- `DepartmentTabs/CRM/ServiceTab.tsx`
- `DepartmentTabs/CRM/AnalyticsTab.tsx`

**Pattern**: `<Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />`

### Batch 4: Chart Styling Normalization (Operations)

For each operations chart file, apply premium chart rules:

**Bar charts** (`MarketingROAS`, `ResourceHeatMap`, `ProjectSummaryBox`):
- Bars: `radius={[999,999,999,999]}` (capsule), `barSize={20}`
- Remove `CartesianGrid`
- Axes: `axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }}`
- Wrap raw `div` containers in `DataCardFrame` (MarketingROAS, AttributionChart)

**Line/Area charts** (`CashFlowForecast`):
- `strokeWidth={2.5}`, `dot={false}`, `activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}`

**Pie charts** (`AttributionChart`):
- Thicker ring: `innerRadius` increase for better doughnut proportion
- Muted secondary segment styling

**Project `FinancialOverviewBox`**:
- Normalize colored background (`bg-[#96D8D0]`) — this is a themed card, keep color but normalize metric sizing to 36px+ and use proper hierarchy
- Thicken pie ring

**Project `AISuggestedPerformanceBox`**:
- Bars: `radius={[999,999,999,999]}`

### Batch 5: Chart Styling Normalization (Departments)

**Files with `CartesianGrid` to remove**:
- `Training/ReportsTab.tsx` (3 instances)
- `CRM/OpportunitiesTab.tsx` (1 instance)

**Files with partially correct styling** (already using capsule bars + correct axes, just need tooltip swap — done in Batch 3):
- `Financial/OverviewTab.tsx`
- `CRM/OverviewTab.tsx`
- `CRM/AnalyticsTab.tsx`
- `CRM/ServiceTab.tsx`

**Hand-built KPI cards to migrate to shared components**:
- `Brand/ReportsTab.tsx` — 4 inline KPI divs with 36px metric → replace with `NumericStatCard` or `MetricHeroCard`

**Remaining local grids wrapping MetricHeroCard/NumericStatCard** (grid-only, no content change):
- `CRM/ServiceTab.tsx` lines 105, 113 — `grid grid-cols-2 lg:grid-cols-4` wrapping MetricHeroCard → `AppDashboardGrid`
- `CSR/MonitoringTab.tsx` line 30 — same pattern

### Batch 6: Settings Stat Card Migration

Replace all inline stat blocks in Settings panels with `NumericStatCard`:

- **`UsersRolesSettingsPanel.tsx`** (4 blocks at lines 218-243): Replace `<div className="rounded-[24px]... text-2xl font-bold">` with `<NumericStatCard size="sm" />`
- **`IntegrationsSettingsPanel.tsx`** (3 blocks): Same migration
- **`AccountSettingsPanel.tsx`** (3 blocks with `bg-transparent ring-1`): Same migration
- **`DataGovernanceSettingsPanel.tsx`** (stat blocks in `grid grid-cols-4`): Same migration, wrap in `AppDashboardGrid`
- **`NotificationsSettingsPanel.tsx`**: Audit and migrate if inline stats exist

### Batch 7: Archive Verification

**Confirmed: Archive has NO visual-data widgets.** All archive panels (`PoliciesArchivePanel`, `HRArchivePanel`, `LegalArchivePanel`, etc.) are document/record list views with status badges and metadata grids. No stat cards, no charts, no metrics blocks.

**Status: Verified — no migration needed.**

### Batch 8: Responsive Data-Card Rules

Add responsive behavior to the shared visual-data primitives:

| Breakpoint | Metric Size | Card Min-Height | Chart Height | Behavior |
|------------|-------------|-----------------|--------------|----------|
| Desktop (>1024px) | 40-44px | 140-160px | 120-300px | Full layout, all zones visible |
| Tablet (768-1024px) | 36px | 130px | 100-200px | Same layout, slightly compressed |
| Mobile (<768px) | 32px | 120px | 80-160px | Stacked layout, metric remains dominant |

**Rules applied to**:
- `NumericStatCard`: Add responsive metric sizing via Tailwind (`text-[32px] sm:text-[36px] md:text-[40px]`)
- `MetricHeroCard`: Same responsive scaling (`text-[36px] sm:text-[40px] md:text-[44px]`)
- `KPIStatsSection`: Grid changes from `grid-cols-4` to `grid-cols-2` on mobile (already present), metric scales down
- `DataCardFrame`: Chart zone min-height adjusts with `min-h-[80px] md:min-h-[120px]`
- `CapsuleBarChart`: Bar container min-height `min-h-[100px] md:min-h-[140px]`
- Truncation: Description text gets `line-clamp-2` on mobile
- Minimum readable metric: Never smaller than 28px

---

## 3. Positive/Negative/Neutral System (Cross-Context)

Applied consistently across all chart types:

| Context | Positive | Negative | Neutral |
|---------|----------|----------|---------|
| Bar charts | `#3DBE8B` fill | `#E5564D` fill | `rgba(11,15,18,0.15)` fill |
| Line charts | `#3DBE8B` stroke | `#E5564D` stroke | `rgba(11,15,18,0.35)` stroke |
| Gauge/Arc | Green arc | Red arc | Gray arc |
| Progress rings | `#3DBE8B` stroke | `#E5564D` stroke | `rgba(11,15,18,0.06)` track |
| ComparisonMetricCard | Green change text + ↑ | Red change text + ↓ | Gray text, no arrow |

Baseline: `rgba(11,15,18,0.08)` for zero-lines in bar/line charts. No new colors introduced — all from existing palette.

---

## 4. Scope Protection

Will NOT touch:
- Surface primitives (`AppCardSurface`, `AppSectionSurface`)
- Grid primitives (`AppDashboardGrid`, `AppGridItem`)
- Overlay/modal/dialog internals
- Action workflows, buttons, forms
- Business logic or data sources
- Content semantics
- BaseBox internal implementation

---

## 5. Deliverables (Post-Execution)

1. **Files changed**: Full list with change description
2. **Visual-data families migrated**: NumericStatCard, MetricHeroCard, ComparisonMetricCard, KPIStatsSection, DataCardFrame, CapsuleBarChart usage — each confirmed aligned
3. **Screens fully migrated**: Operations, Project, all Department tabs with charts, Settings stat blocks
4. **Screens verified only**: Archive (confirmed no visual-data widgets)
5. **Remaining exceptions**: Any deferred items with reasons
6. **Final search results**:
   - `ChartTooltipContent` (should be 0 outside ui/chart.tsx definition)
   - `tooltipStyle` (should be 0)
   - `CartesianGrid` (should be 0)
   - `radius={[4` or `radius={[2` (should be 0)
   - Inline `text-2xl font-bold` stat blocks in Settings (should be 0)

---

## Estimated Impact

- **~35-40 files** changed total
- **KPIStatsSection**: 1 file changed, 15 consumers improved
- **ComparisonMetricCard**: 1 file normalized
- **Tooltip migration**: 12 files
- **Chart normalization**: 8-10 files (Operations + Departments + Project)
- **Settings stat migration**: 4-5 files
- **Brand/ReportsTab KPI migration**: 1 file
- **Responsive additions**: 5-6 shared primitives
- **Archive**: 0 files (verified clean)

