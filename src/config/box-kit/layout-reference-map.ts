export type LayoutHeaderRef = 'LAY-HDR-D01';

export type LayoutTabRef = 'LAY-TAB-O01' | 'LAY-TAB-W01';

export type LayoutKpiRef = 'LAY-KPI-O01';

export type LayoutGridRef = 'LAY-GRD-D01' | 'LAY-GRD-A01' | 'LAY-GRD-S01';

export type LayoutBoxRef =
  | 'LAY-BOX-SUM01'
  | 'LAY-BOX-CHT01'
  | 'LAY-BOX-TBL01'
  | 'LAY-BOX-FTR01'
  | 'LAY-BOX-DTL01';

export const LAYOUT_HEADER_MAP = {
  'LAY-HDR-D01': {
    component: 'DashboardLayout',
    titleMode: 'standard-dashboard-title',
    tabsMode: 'standard-dashboard-tabs',
    shell: 'shared-dashboard-shell',
  },
} as const;

export const LAYOUT_TAB_MAP = {
  'LAY-TAB-O01': {
    mode: 'overview',
    showKpiRow: true,
    showBoxesGrid: true,
    kpiRef: 'LAY-KPI-O01',
  },
  'LAY-TAB-W01': {
    mode: 'workflow',
    showKpiRow: false,
    showBoxesGrid: true,
    kpiRef: null,
  },
} as const;

export const LAYOUT_KPI_MAP = {
  'LAY-KPI-O01': {
    component: 'KPIStatsSection',
    minItems: 2,
    maxItems: 4,
    placement: 'before-grid',
    allowedTabs: ['overview'],
  },
} as const;

export const LAYOUT_GRID_MAP = {
  'LAY-GRD-D01': {
    density: 'spacious',
    minRowHeight: '160px',
    columns: 4,
  },
  'LAY-GRD-A01': {
    density: 'compact',
    minRowHeight: '120px',
    columns: 4,
  },
  'LAY-GRD-S01': {
    density: 'spacious',
    minRowHeight: 'auto',
    columns: 2,
  },
} as const;

export const LAYOUT_BOX_ROLE_MAP = {
  'LAY-BOX-SUM01': {
    role: 'summary-Box',
    minHeight: '160px',
    rowSpan: 1,
    columnsSpan: 2,
  },
  'LAY-BOX-CHT01': {
    role: 'chart-Box',
    minHeight: '320px',
    rowSpan: 2,
    columnsSpan: 1,
  },
  'LAY-BOX-TBL01': {
    role: 'table-Box',
    minHeight: '320px',
    rowSpan: 2,
    columnsSpan: 2,
  },
  'LAY-BOX-FTR01': {
    role: 'feature-Box',
    minHeight: '160px',
    rowSpan: 1,
    columnsSpan: 1,
  },
  'LAY-BOX-DTL01': {
    role: 'detail-Box',
    minHeight: '160px',
    rowSpan: 1,
    columnsSpan: 1,
  },
} as const;

export const LAYOUT_RUNTIME_MAP = {
  departments: {
    headerRef: 'LAY-HDR-D01',
    gridRef: 'LAY-GRD-D01',
    overviewTabRef: 'LAY-TAB-O01',
    workflowTabRef: 'LAY-TAB-W01',
  },
  archive: {
    headerRef: 'LAY-HDR-D01',
    gridRef: 'LAY-GRD-A01',
    overviewTabRef: 'LAY-TAB-O01',
    workflowTabRef: 'LAY-TAB-W01',
  },
  settings: {
    headerRef: 'LAY-HDR-D01',
    gridRef: 'LAY-GRD-S01',
    overviewTabRef: 'LAY-TAB-W01',
    workflowTabRef: 'LAY-TAB-W01',
  },
} as const;

export function resolveDashboardLayoutKey(dashboardKey: string): keyof typeof LAYOUT_RUNTIME_MAP {
  if (dashboardKey === 'archive') return 'archive';
  if (dashboardKey === 'settings') return 'settings';
  return 'departments';
}

export function resolveTabLayoutRef(tab: { code?: string | null; name?: string | null }): LayoutTabRef {
  const code = (tab.code ?? '').toLowerCase();
  const name = (tab.name ?? '').toLowerCase();
  if (code.includes('overview') || name.includes('نظرة عامة')) {
    return 'LAY-TAB-O01';
  }
  return 'LAY-TAB-W01';
}

export function resolveBoxLayoutRef(box: { componentRefs?: string[]; purpose?: string | null }): LayoutBoxRef {
  const refs = box.componentRefs ?? [];
  if (refs.includes('DAV-TBL-01')) return 'LAY-BOX-TBL01';
  if (refs.includes('DAV-CHT-01')) return 'LAY-BOX-CHT01';
  if (refs.includes('DAV-KPI-01')) return 'LAY-BOX-SUM01';
  if (refs.includes('DAV-DTL-01')) return 'LAY-BOX-DTL01';
  return 'LAY-BOX-FTR01';
}
