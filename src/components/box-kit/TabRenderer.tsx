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
import { ActionButton } from './primitives/action';
import { ModalShell } from './primitives/modal';

export interface TabRendererProps {
  tab: TabSpec;
  dashboardKey: string;
  /** Per-box slot props keyed by Box Ref. */
  boxData?: Record<string, Record<string, Record<string, unknown>>>;
  /** Override default responsive grid */
  className?: string;
}

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

function derivePrimaryTabAction(tab: TabSpec): {
  sectionTitle: string;
  buttonLabel: string;
  modalTitle: string;
  modalDescription?: string;
} | null {
  const popupCandidates = (((tab as unknown as { popups?: Array<{ ref?: string; name?: string; purpose?: string; trigger?: string }> }).popups) ?? []);
  const preferredPopup =
    popupCandidates.find((popup) => /editor|action|create|modal\.editor|modal\.action/i.test(popup.ref ?? '')) ??
    popupCandidates.find((popup) => /إدارة|إنشاء|إجراء/.test(popup.name ?? '')) ??
    popupCandidates[0];

  const sectionTitle = tab.name;
  const modalTitle = preferredPopup?.name ?? `إجراء ${tab.name}`;
  const buttonLabel = modalTitle.replace(/^نافذة\s+/, '').trim() || `إدارة ${tab.name}`;
  const modalDescription = preferredPopup?.purpose ?? (tab as unknown as { description?: string }).description;

  return {
    sectionTitle,
    buttonLabel,
    modalTitle,
    modalDescription,
  };
}

export const TabRenderer: React.FC<TabRendererProps> = ({ tab, dashboardKey, boxData, className }) => {
  const [primaryActionOpen, setPrimaryActionOpen] = React.useState(false);

  if (!tab.boxes.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        لا توجد صناديق مُعرَّفة لهذا التبويب في المواصفة.
      </div>
    );
  }

  const dashboardLayoutKey = resolveDashboardLayoutKey(dashboardKey);
  const dashboardLayout = LAYOUT_RUNTIME_MAP[dashboardLayoutKey];
  const tabLayoutRef = resolveTabLayoutRef(tab);
  const tabLayout = LAYOUT_TAB_MAP[tabLayoutRef];
  const gridLayout = LAYOUT_GRID_MAP[dashboardLayout.gridRef];
  const overviewStats = tabLayout.showKpiRow ? extractOverviewStats(tab, boxData) : [];
  const gridClass = gridLayout.columns === 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 xl:grid-cols-2';
  const primaryTabAction = dashboardLayoutKey === 'departments' && tabLayoutRef === 'LAY-TAB-W01' ? derivePrimaryTabAction(tab) : null;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {tabLayout.showKpiRow && overviewStats.length > 0 ? (
        <KPIStatsSection stats={overviewStats} />
      ) : null}

      {primaryTabAction ? (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-medium text-[#0B0F12]">{primaryTabAction.sectionTitle}</h3>
            </div>
            <ActionButton componentRef="ACT-BTN-P01" icon={<Plus />} onClick={() => setPrimaryActionOpen(true)}>
              {primaryTabAction.buttonLabel}
            </ActionButton>
          </div>

          <ModalShell
            componentRef="MDL-WND-D01"
            open={primaryActionOpen}
            onOpenChange={setPrimaryActionOpen}
            title={primaryTabAction.modalTitle}
            description={primaryTabAction.modalDescription}
            footer={
              <ActionButton componentRef="ACT-BTN-S02-1" onClick={() => setPrimaryActionOpen(false)}>
                إغلاق
              </ActionButton>
            }
          >
            <div className="text-sm leading-7 text-black/70">
              {primaryTabAction.modalDescription ?? 'سيتم ربط هذه النافذة بسير العمل الرئيسي لهذا التبويب.'}
            </div>
          </ModalShell>
        </>
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
