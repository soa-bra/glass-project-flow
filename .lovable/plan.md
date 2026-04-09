

# Visual Data System Refactor — Full Application Plan

## Current State Summary

The app has a well-built `visual-data/` component library with 8 premium card components (NumericStatCard, MetricHeroCard, CapsuleBarChart, MinimalLineChart, RingMetricCard, ArcGaugeCard, RadialProgressCard, ComparisonMetricCard). However, adoption is inconsistent:

- **KPIStatsSection** (used in 14 files) renders its own flat stat cards with basic styling — no motion, weaker hierarchy
- **BaseStatsCard** (used in Legal OverviewTab) is a legacy component with centered text and minimal styling
- **~10 inline recharts** blocks across overview tabs render raw recharts without the shared card wrappers
- The visual-data components themselves are already close to the target but need minor refinements

## Audit: Component Families Found

| Component | Files Using | Status |
|-----------|------------|--------|
| KPIStatsSection | 14 files (all dept overviews, operations) | **Non-compliant** — flat cards, no motion, weak hierarchy |
| BaseStatsCard | 1 file (Legal) | **Legacy** — basic centered grid |
| NumericStatCard | ~12 files | Compliant ✓ |
| MetricHeroCard | ~6 files | Compliant ✓ |
| CapsuleBarChart | ~4 files | Compliant ✓ |
| MinimalLineChart | ~3 files | Compliant ✓ |
| RingMetricCard | ~2 files | Compliant ✓ |
| ArcGaugeCard | ~2 files | Compliant ✓ |
| RadialProgressCard | ~2 files | Compliant ✓ |
| ComparisonMetricCard | ~2 files | Compliant ✓ |
| Inline recharts (no wrapper) | ~10 files | **Non-compliant** — raw charts in plain divs |

## Plan

### Phase 1 — Restore KPIStatsSection

Rewrite `KPIStatsSection` to render `NumericStatCard` components internally instead of its own custom flat cards. This gives every KPI section across 14 files the premium visual treatment (framer-motion reveal, bold 40px metrics, proper hierarchy) without changing any consuming code.

**Files changed:** `src/components/shared/KPIStatsSection.tsx`

### Phase 2 — Retire BaseStatsCard usage

Replace `BaseStatsCard` usage in `Legal/OverviewTab.tsx` with `NumericStatCard` grid. Remove or deprecate `BaseStatsCard`.

**Files changed:** `src/components/DepartmentTabs/Legal/OverviewTab.tsx`

### Phase 3 — Wrap inline recharts in visual-data cards

Create a lightweight `DataCardFrame` wrapper that provides the standard card container (rounded-[24px], white bg, border, p-6, motion reveal, title zone) for inline chart usage. Then migrate inline recharts blocks in these files:

- `Financial/OverviewTab.tsx` (2 chart blocks)
- `CRM/OverviewTab.tsx` (3 chart blocks)
- `CRM/AnalyticsTab.tsx`
- `CRM/OpportunitiesTab.tsx`
- `CRM/ServiceTab.tsx`
- `Training/ReportsTab.tsx`
- `Financial/AnalysisTab.tsx`

The migration wraps existing `<div className="rounded-[24px]...">` containers with `DataCardFrame`, standardizing the title/padding/motion pattern.

**New file:** `src/components/shared/visual-data/DataCardFrame.tsx`

### Phase 4 — Minor visual refinements to existing primitives

- Increase default tooltip contrast and padding consistency across all chart components
- Ensure all bar charts use `barSize={20}` + `radius={[999,999,999,999]}` consistently
- Standardize axis styling (hide axisLine/tickLine, use `rgba(11,15,18,0.35)` for tick text at 10px)

**Files changed:** Minor tweaks to `CapsuleBarChart.tsx`, `MinimalLineChart.tsx`

### Phase 5 — Verify responsive behavior

Ensure `NumericStatCard` grid columns degrade properly: 4-col → 2-col → 1-col. All visual-data cards already use `min-h` and flex layout, so this is primarily verifying the grid wrappers in consuming files.

## Technical Details

### KPIStatsSection rewrite approach
```tsx
// Instead of custom Stagger.Item cards, delegate to NumericStatCard:
<Stagger className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
  {stats.map((stat, i) => (
    <NumericStatCard
      key={i}
      title={stat.title}
      value={stat.value}
      unit={stat.unit}
      description={stat.description}
    />
  ))}
</Stagger>
```

### DataCardFrame spec
- Wraps any chart content with the standard card shell
- Props: `title`, `subtitle?`, `heroValue?`, `heroUnit?`, `className?`, `children`
- Container: `rounded-[24px] bg-white border border-[#DADCE0] p-6`, framer-motion reveal
- Title: `text-xs font-semibold text-[rgba(11,15,18,0.50)] uppercase tracking-wide`

## Files Changed (estimated ~20 files)

1. `src/components/shared/KPIStatsSection.tsx` — rewrite
2. `src/components/shared/visual-data/DataCardFrame.tsx` — new
3. `src/components/shared/visual-data/index.ts` — add export
4. `src/components/DepartmentTabs/Legal/OverviewTab.tsx` — replace BaseStatsCard
5. `src/components/DepartmentTabs/Financial/OverviewTab.tsx` — wrap charts
6. `src/components/DepartmentTabs/CRM/OverviewTab.tsx` — wrap charts
7. `src/components/DepartmentTabs/CRM/AnalyticsTab.tsx` — wrap charts
8. `src/components/DepartmentTabs/CRM/OpportunitiesTab.tsx` — wrap charts
9. `src/components/DepartmentTabs/CRM/ServiceTab.tsx` — wrap charts
10. `src/components/DepartmentTabs/Training/ReportsTab.tsx` — wrap charts
11. `src/components/DepartmentTabs/Financial/AnalysisTab.tsx` — wrap charts
12. Minor tweaks to `CapsuleBarChart.tsx`, `MinimalLineChart.tsx`

## Impact

- **14 KPI sections** instantly upgraded via KPIStatsSection rewrite (zero changes to consumers)
- **~10 inline charts** wrapped in consistent card frames
- **1 legacy component** (BaseStatsCard) retired
- **1 new shared primitive** (DataCardFrame) for future chart cards
- All existing visual-data components preserved — no breaking changes

