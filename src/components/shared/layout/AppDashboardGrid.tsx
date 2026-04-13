import React from 'react';
import { cn } from '@/lib/utils';

// ─── Grid Density Modes ─────────────────────────────────────────
export type GridDensity = 'compact' | 'default' | 'spacious';

const gapClasses: Record<GridDensity, string> = {
  compact: 'gap-2',
  default: 'gap-[10px]',
  spacious: 'gap-4',
};

export interface AppDashboardGridProps {
  children: React.ReactNode;
  className?: string;
  /** Grid gap density */
  density?: GridDensity;
  /** Override column count on desktop (default 12) */
  columns?: 4 | 6 | 8 | 12;
  /** Constrain grid height to viewport fraction */
  viewportHeight?: string;
  /** Auto-flow rows (default) or dense packing */
  autoFlow?: 'row' | 'dense';
  /** Minimum row height for grid-auto-rows. Default '140px'. Use 'auto' for no constraint. */
  minRowHeight?: string;
}

/**
 * AppDashboardGrid — 12-column responsive CSS Grid system
 *
 * Desktop:  12 columns (or custom)
 * Tablet:   6 columns
 * Mobile:   1 column (stacked)
 *
 * Usage:
 * ```tsx
 * <AppDashboardGrid>
 *   <AppGridItem colSpan={3} rowSpan={2}>
 *     <SomeCard />
 *   </AppGridItem>
 * </AppDashboardGrid>
 * ```
 */
export const AppDashboardGrid: React.FC<AppDashboardGridProps> = ({
  children,
  className,
  density = 'default',
  columns = 12,
  viewportHeight,
  autoFlow = 'row',
  minRowHeight = '140px',
}) => {
  const colClass = {
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    8: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-8',
    12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12',
  }[columns];

  const flowClass = autoFlow === 'dense' ? 'grid-flow-dense' : '';
  const rowStyle = minRowHeight && minRowHeight !== 'auto' 
    ? { gridAutoRows: `minmax(${minRowHeight}, auto)` }
    : { gridAutoRows: 'auto' };

  return (
    <div
      className={cn(
        'grid w-full',
        colClass,
        gapClasses[density],
        flowClass,
        className
      )}
      style={{
        ...rowStyle,
        ...(viewportHeight ? { height: viewportHeight, minHeight: 0 } : {}),
      }}
      dir="rtl"
    >
      {children}
    </div>
  );
};
