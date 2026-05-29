/**
 * TabRenderer — renders one spec tab (a grid of BoxRenderers).
 * Consumers supply `boxData` keyed by Box Ref to feed data into primitives.
 *
 * @specRef Section 4.0.1 (Workspace Shell) + Section 4.1–4.6
 */
import React from 'react';
import { Plus } from 'lucide-react';
import { BoxRenderer } from './BoxRenderer';
import type { TabSpec } from '@/config/app-spec';
import { cn } from '@/lib/utils';
import {
  LAYOUT_GRID_MAP,
  LAYOUT_RUNTIME_MAP,
  LAYOUT_TAB_MAP,
  resolveDashboardLayoutKey,
  resolveTabLayoutRef,
  resolveBoxLayoutRef,
} from '@/config/box-kit/layout-reference-map';
import { KPIStatsSection, type KPIStat } from '@/components/shared/KPIStatsSection';
import { ActionButton } from '@/components/box-kit/primitives/action';

export interface TabRendererProps {
  tab: TabSpec;
  dashboardKey: string;
  boxData?: Record<string, Record<string, Record<string, unknown>>>;
  className?: string;
}

type TabPrimaryActionConfig = {
  title?: string;
  label?: string;
  componentRef?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

function extractOverviewStats(tab: TabSpec, boxData?: Record<string, Record<string, Record<string, unknown>>>): KPIStat[] {
  const stats = tab.boxes.flatMap((box) => {
    const layoutRef = resolveBoxLayoutRef(box);
    if (layoutRef !== 'LAY-BOX-SUM01') return [];
    const kpi = boxData?.[box.ref]?.['DAV-KPI-01'] as { items?: Array<{ label: string; value: string | number; unit?: string; description?: string }> } | undefined;
    return (kpi?.items ?? []).map((item) => ({
      title: item.label,
      value: item.value,
      unit: item.unit,
      description: item.description,
    }));
  });

  return stats.slice(0, 4);
}

function getDefaultWorkflowTitle(tab: TabSpec) {
  return `إدارة ${tab.name}`;
}

function getDefaultPrimaryActionLabel(tab: TabSpec) {
  const singularMap: Record<string, string> = {
    contracts: 'عقد جديد',
    budgets: 'ميزانية جديدة',
    transactions: 'معاملة جديدة',
    invoices: 'فاتورة جديدة',
    payments: 'دفعة جديدة',
    reports: 'تقرير جديد',
    members: 'عضو جديد',
    agreements: 'اتفاقية جديدة',
    articles: 'مقال جديد',
    assets: 'أصل جديد',
    policies: 'سياسة جديدة',
    templates: 'قالب جديد',
  };
  return singularMap[tab.code] ?? `${tab.name} جديد`;
}

function resolveTabPrimaryAction(
  tab: TabSpec,
  boxData?: Record<string, Record<string, Record<string, unknown>>>,
): TabPrimaryActionConfig | null {
  const meta = boxData?.__tabMeta as Record<string, unknown> | undefined;
  const action = meta?.primaryAction as TabPrimaryActionConfig | undefined;
  if (action) return action;
  if ((tab.code ?? '').toLowerCase().includes('overview')) return null;
  return {
    title: getDefaultWorkflowTitle(tab),
    label: getDefaultPrimaryActionLabel(tab),
    componentRef: 'ACT-BTN-P01',
    icon: <Plus />,
  };
}

export const TabRenderer: React.FC<TabRendererProps> = ({ tab, dashboardKey, boxData, className }) => {
  if (!tab.boxes.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        لا توجد صناديق مُعرَّفة لهذا التبويب في المواصفة.
      </div>
    );
  }

  const dashboardLayout = LAYOUT_RUNTIME_MAP[resolveDashboardLayoutKey(dashboardKey)];
  const tabLayoutRef = resolveTabLayoutRef(tab);
  const tabLayout = LAYOUT_TAB_MAP[tabLayoutRef];
  const gridLayout = LAYOUT_GRID_MAP[dashboardLayout.gridRef];
  const overviewStats = tabLayout.showKpiRow ? extractOverviewStats(tab, boxData) : [];
  const gridClass = gridLayout.columns === 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 xl:grid-cols-2';
  const primaryAction = !tabLayout.showKpiRow ? resolveTabPrimaryAction(tab, boxData) : null;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {tabLayout.showKpiRow && overviewStats.length > 0 ? <KPIStatsSection stats={overviewStats} /> : null}

      {primaryAction ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[22px] font-semibold text-black">{primaryAction.title ?? getDefaultWorkflowTitle(tab)}</h3>
          <ActionButton
            componentRef={(primaryAction.componentRef as string) ?? 'ACT-BTN-P01'}
            icon={primaryAction.icon ?? <Plus />}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label ?? getDefaultPrimaryActionLabel(tab)}
          </ActionButton>
        </div>
      ) : null}

      <div
        className={cn('grid gap-4', gridClass, className)}
        style={{ gridAutoRows: `minmax(${gridLayout.minRowHeight}, auto)` }}
        data-grid-ref={dashboardLayout.gridRef}
        data-tab-layout-ref={tabLayoutRef}
      >
        {tab.boxes.map((box) => (
          <BoxRenderer key={box.ref} box={box} slotProps={boxData?.[box.ref]} />
        ))}
      </div>
    </div>
  );
};