import React from 'react';
import { cn } from '@/lib/utils';

export type GridItemRole = 'metric' | 'chart' | 'list' | 'hero' | 'feature' | 'default';

export interface AppGridItemProps {
  children: React.ReactNode;
  className?: string;
  /** Columns to span on desktop (lg). Default 1. Max 12. */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Columns to span on tablet (md). Defaults to colSpan clamped to 6. */
  tabletSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Rows to span. Default 1. */
  rowSpan?: 1 | 2 | 3 | 4;
  /** Minimum height CSS value */
  minHeight?: string;
  /** Semantic role (for future layout presets) */
  role?: GridItemRole;
}

// Desktop (lg) col-span classes
const desktopSpanClasses: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};

// Tablet (md) col-span classes
const tabletSpanClasses: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
};

// Row span classes
const rowSpanClasses: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
};

/**
 * AppGridItem — a single cell in AppDashboardGrid
 *
 * Supports responsive column spans and row spans.
 * Mobile always stacks to full width (col-span-1 in a 1-col grid).
 *
 * ```tsx
 * <AppGridItem colSpan={3} rowSpan={2} role="chart">
 *   <CapsuleBarChart ... />
 * </AppGridItem>
 * ```
 */
export const AppGridItem: React.FC<AppGridItemProps> = ({
  children,
  className,
  colSpan = 1,
  tabletSpan,
  rowSpan = 1,
  minHeight,
  role: _role,
}) => {
  // Auto-compute tablet span: clamp desktop span to max 6
  const effectiveTabletSpan = tabletSpan ?? Math.min(colSpan, 6) as 1 | 2 | 3 | 4 | 5 | 6;

  return (
    <div
      className={cn(
        'col-span-1', // mobile: always 1 col
        tabletSpanClasses[effectiveTabletSpan],
        desktopSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        'min-h-0 h-full',
        className
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      {children}
    </div>
  );
};
