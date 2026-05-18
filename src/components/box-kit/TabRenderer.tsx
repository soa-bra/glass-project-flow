/**
 * TabRenderer — renders one spec tab (a grid of BoxRenderers).
 * Consumers supply `boxData` keyed by Box Ref to feed data into primitives.
 *
 * @specRef Section 4.0.1 (Workspace Shell) + Section 4.1–4.6
 */
import React from 'react';
import { BoxRenderer } from './BoxRenderer';
import type { TabSpec } from '@/config/app-spec';
import { cn } from '@/lib/utils';

export interface TabRendererProps {
  tab: TabSpec;
  /** Per-box slot props keyed by Box Ref. */
  boxData?: Record<string, Record<string, Record<string, unknown>>>;
  /** Override default 12-col responsive grid */
  className?: string;
}

export const TabRenderer: React.FC<TabRendererProps> = ({ tab, boxData, className }) => {
  if (!tab.boxes.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        لا توجد صناديق مُعرَّفة لهذا التبويب في المواصفة.
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4', className)} dir="rtl">
      {tab.boxes.map((box) => (
        <BoxRenderer key={box.ref} box={box} slotProps={boxData?.[box.ref]} />
      ))}
    </div>
  );
};
