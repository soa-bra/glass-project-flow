import React from 'react';
import { cn } from '@/lib/utils';

export type GridItemRole = 'metric' | 'chart' | 'list' | 'hero' | 'feature' | 'detail' | 'form' | 'default';

export interface AppGridItemProps {
  children: React.ReactNode;
  className?: string;
  /** Columns to span on desktop (lg). Default 1. Max 12. */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Columns to span on tablet (md). Defaults to colSpan clamped to 6. */
  tabletSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Columns to span on mobile. Defaults to 1 (full-width in 1-col grid). */
  mobileSpan?: 1;
  /** Rows to span. Default 1. */
  rowSpan?: 1 | 2 | 3 | 4;
  /** Minimum height CSS value */
  minHeight?: string;
  /** Semantic role for layout presets */
  role?: GridItemRole;
  /** Shorthand: span all 12 columns (full width) */
  fullWidth?: boolean;
  /** Mobile order override */
  mobileOrder?: number;
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
 * AppGridItem — خلية واحدة في AppDashboardGrid
 *
 * يدعم تحديد المساحة بشكل متجاوب مع الشاشات المختلفة.
 * الجوال دائماً عمود واحد (col-span-1 في شبكة من عمود واحد).
 */
export const AppGridItem: React.FC<AppGridItemProps> = ({
  children,
  className,
  colSpan = 1,
  tabletSpan,
  mobileSpan: _mobileSpan,
  rowSpan = 1,
  minHeight,
  role: _role,
  fullWidth = false,
  mobileOrder,
}) => {
  const effectiveColSpan = fullWidth ? 12 : colSpan;
  const effectiveTabletSpan = tabletSpan ?? Math.min(effectiveColSpan, 6) as 1 | 2 | 3 | 4 | 5 | 6;

  return (
    <div
      className={cn(
        'col-span-1', // mobile: always 1 col
        tabletSpanClasses[effectiveTabletSpan],
        desktopSpanClasses[effectiveColSpan],
        rowSpanClasses[rowSpan],
        'min-h-0 h-full overflow-hidden',
        className
      )}
      style={{
        ...(minHeight ? { minHeight } : {}),
        ...(mobileOrder != null ? { order: mobileOrder } : {}),
      }}
    >
      {children}
    </div>
  );
};
