import type { GridDensity } from './AppDashboardGrid';

/**
 * GridLayoutPreset — إعدادات مسبقة لأنواع اللوحات المختلفة
 */
export interface GridLayoutPreset {
  /** كثافة الشبكة الافتراضية */
  density: GridDensity;
  /** الحد الأدنى لارتفاع الصف */
  minRowHeight: string;
  /** عدد الأعمدة */
  columns: 4 | 6 | 8 | 12;
}

/**
 * الإعدادات المسبقة المتاحة لكل نوع لوحة
 */
export const GRID_PRESETS: Record<string, GridLayoutPreset> = {
  operations: {
    density: 'default',
    minRowHeight: '140px',
    columns: 12,
  },
  project: {
    density: 'default',
    minRowHeight: '160px',
    columns: 12,
  },
  departments: {
    density: 'spacious',
    minRowHeight: '140px',
    columns: 12,
  },
  archive: {
    density: 'compact',
    minRowHeight: '120px',
    columns: 12,
  },
  settings: {
    density: 'spacious',
    minRowHeight: 'auto',
    columns: 12,
  },
} as const;

/**
 * Role-Based Height Rules — قواعد الارتفاع حسب نوع البطاقة
 */
export const ROLE_HEIGHT: Record<string, { minHeight: string; rowSpan: 1 | 2 | 3 | 4 }> = {
  'kpi-tile': { minHeight: '140px', rowSpan: 1 },
  'summary-card': { minHeight: '160px', rowSpan: 1 },
  'chart-card': { minHeight: '280px', rowSpan: 2 },
  'table-card': { minHeight: '320px', rowSpan: 2 },
  'feature-card': { minHeight: '200px', rowSpan: 1 },
  'detail-card': { minHeight: 'auto', rowSpan: 1 },
};
