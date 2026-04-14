

# Phase 3 — Data Display System Completion + KPIStatsSection Restoration

## Audit Summary

### Primitive Status

| Primitive | Status | Consumers | Verdict |
|---|---|---|---|
| **KPIStatsSection** | Has shadow + surface | 12 files | Needs restoration (tile weight, metric scale) |
| **NumericStatCard** | Compliant | ~10 files | Reusable as-is |
| **MetricHeroCard** | Compliant | ~8 files | Reusable as-is |
| **ComparisonMetricCard** | Compliant | 1 file (imported but unused in Financial/KPICards) | Needs adoption |
| **DataCardFrame** | Compliant | ~5 files | Reusable as-is |
| **CapsuleBarChart** | Compliant | ~4 files | Reusable as-is |
| **MinimalLineChart** | Has local CustomTooltip instead of ChartTooltipShell | ~3 files | Needs normalization |
| **RingMetricCard** | Compliant | **0 consumers** | Must be adopted |
| **ArcGaugeCard** | Compliant | 1 file (Brand/ReportsTab) | Needs more adoption |
| **RadialProgressCard** | Compliant | 1 file (SatisfactionBox) | Needs more adoption |
| **ChartTooltipShell** | Compliant | ~12 files | Already well-adopted for raw Recharts; MinimalLineChart uses local tooltip instead |

### Regressions & Non-Compliant Patterns Found

1. **~59 files with `text-2xl font-bold` hand-built stat blocks** — major violation. Key offenders:
   - `HR/RecruitmentTab.tsx` (5 BaseBox stat cards with icons + colored text)
   - `OperationsBoard/Clients/ClientPortfolioHealth.tsx` (6 hand-built stats)
   - `OperationsBoard/Reports/ReportLibrary.tsx` (4 hand-built stats)
   - `Legal/ContractsTab.tsx` (4 hand-built ring-1 stat blocks)
   - `Legal/ComplianceTab.tsx` (4 hand-built stat blocks)
   - `Legal/OverviewTab.tsx` (hand-built metric)
   - `Brand/ContentMessagingTab.tsx` (4 colored stat blocks)
   - `Marketing/ReportsTab.tsx` (4 BaseBox stat blocks)
   - `OperationsBoard/Overview/FinancialOverviewBox.tsx` (3 inline stats)
   - `OperationsBoard/Overview/ExtraBoxTwo.tsx` (1 inline stat)

2. **MinimalLineChart** uses a local `CustomTooltip` instead of `ChartTooltipShell` — inconsistency.

3. **PieChart/Doughnut charts in CRM, Marketing, Training** use raw Recharts PieChart where `RingMetricCard` could replace simpler cases.

4. **HR/TrainingTab.tsx** uses raw `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6` instead of `AppDashboardGrid`.

---

## Implementation Plan

### Step 1: KPIStatsSection Restoration

Strengthen the KPI tile system:
- Increase `min-h` from 130/140/150px to 140/150/160px for more breathing room
- Ensure metric size matches the token spec: `text-[32px] sm:text-[36px] md:text-[44px]` (already present — verify)
- Add `shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06)]` (already present)
- Increase padding from `p-6` to `p-6 sm:p-7` for more tile weight
- Add gap between title and value zone (`gap-3`) for clearer hierarchy
- Ensure responsive grid: `grid-cols-2 sm:grid-cols-2 md:grid-cols-4` with `gap-4 sm:gap-5`

### Step 2: MinimalLineChart Tooltip Normalization

Replace local `CustomTooltip` inside `MinimalLineChart.tsx` with `ChartTooltipShell`, passing `formatValue` via the existing prop. This ensures all charts app-wide use the same dark premium tooltip.

### Step 3: Migrate Hand-Built Stat Blocks (Priority Files)

Replace `text-2xl font-bold` hand-built stat cards with `NumericStatCard` or `MetricHeroCard`:

**Operations:**
- `ClientPortfolioHealth.tsx` — 6 stat cards → `NumericStatCard`
- `ReportLibrary.tsx` — 4 stat cards → `NumericStatCard`

**Departments:**
- `HR/RecruitmentTab.tsx` — 5 BaseBox stat cards → `NumericStatCard` inside `AppDashboardGrid`
- `Legal/ContractsTab.tsx` — 4 ring-1 stat blocks → `NumericStatCard`
- `Legal/ComplianceTab.tsx` — 4 stat blocks → `NumericStatCard`
- `Brand/ContentMessagingTab.tsx` — 4 colored stat blocks → `NumericStatCard`
- `Marketing/ReportsTab.tsx` — 4 BaseBox stat blocks → `NumericStatCard`
- `HR/TrainingTab.tsx` — already uses `MetricHeroCard` but raw grid → wrap in `AppDashboardGrid`

### Step 4: Adopt Unused/Underused Primitives

**RingMetricCard** (0 consumers → adopt):
- `CRM/AnalyticsTab.tsx` — replace raw PieChart doughnut for "الإيرادات حسب الشريحة" with `RingMetricCard`
- `CRM/OpportunitiesTab.tsx` — replace raw PieChart for "مصادر الفرص" with `RingMetricCard`
- `OperationsBoard/Marketing/AttributionChart.tsx` — replace raw PieChart with `RingMetricCard`

**ArcGaugeCard** (1 consumer → more adoption):
- `Legal/ComplianceTab.tsx` — compliance percentage → `ArcGaugeCard`
- `OperationsBoard/HR/TeamFillProgress.tsx` — fill percentage → `ArcGaugeCard`

**RadialProgressCard** (1 consumer → more adoption):
- `OperationsBoard/Overview/ExtraBoxTwo.tsx` — "معدل الإنجاز 78%" → `RadialProgressCard`

**ComparisonMetricCard** (imported but unused):
- `DepartmentTabs/Financial/KPICards.tsx` — import exists but not used; apply to revenue/expense cards showing month-over-month change

### Step 5: Chart Standardization

Ensure all raw Recharts usage follows premium specs:
- Bar charts: `barSize={20}`, `radius={[999,999,999,999]}`, no CartesianGrid, muted axes
- Line charts: `strokeWidth={2.5}`, no dots, activeDot with white stroke
- All tooltips: `<Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />`

Files to audit and fix:
- `DepartmentTabs/Financial/OverviewTab.tsx` (verify chart specs)
- `OperationsBoard/HR/ResourceHeatMap.tsx` (uses ChartContainer — normalize)
- `ProjectManagement/cards/AISuggestedPerformanceBox.tsx` (raw Recharts without tooltip)

### Step 6: Responsive Rules

Codify in every visual-data primitive:
- **Desktop (md+):** Full metric sizes (44px KPI, 36-40px hero), standard padding
- **Tablet (sm-md):** Metric scales down (36px KPI, 32-36px hero), cards go 2-col
- **Mobile (<sm):** Metric at 32px minimum, cards full-width, chart height compressed to 80px min

Already partially implemented in KPIStatsSection and MetricHeroCard via responsive text classes. Will verify and extend to CapsuleBarChart and RadialProgressCard.

---

## Migration Map Summary

| Area | Files to Change | What Gets Applied |
|---|---|---|
| **Operations** | ClientPortfolioHealth, ReportLibrary, ExtraBoxTwo, TeamFillProgress, ResourceHeatMap | NumericStatCard, RadialProgressCard, ArcGaugeCard, chart normalization |
| **Project** | AISuggestedPerformanceBox | ChartTooltipShell adoption |
| **Departments/HR** | RecruitmentTab, TrainingTab | NumericStatCard, AppDashboardGrid |
| **Departments/Legal** | ContractsTab, ComplianceTab | NumericStatCard, ArcGaugeCard |
| **Departments/Brand** | ContentMessagingTab | NumericStatCard |
| **Departments/Marketing** | ReportsTab, AttributionChart | NumericStatCard, RingMetricCard |
| **Departments/CRM** | AnalyticsTab, OpportunitiesTab | RingMetricCard |
| **Departments/Financial** | KPICards | ComparisonMetricCard adoption |
| **Shared** | MinimalLineChart | ChartTooltipShell replacement |
| **Archive** | No stat violations found | Verified clean |
| **Settings** | No stat violations found (already migrated to NumericStatCard) | Verified clean |

---

## Estimated Scope

- **~20 files** modified
- **~1 shared primitive** normalized (MinimalLineChart tooltip)
- **~1 shared primitive** restored (KPIStatsSection)
- **~30+ hand-built stat blocks** replaced with shared primitives
- **3 primitives** adopted from zero/near-zero usage (RingMetricCard, ArcGaugeCard expansion, RadialProgressCard expansion)

