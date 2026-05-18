/**
 * BoxRenderer — renders one spec box using BaseBox shell + spec componentRefs.
 * Unknown refs render a visible diagnostic chip instead of crashing.
 *
 * @specRef Section 4.0.1 (Workspace Shell) + Section 6
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';
import { resolveBoxKitComponent } from './registry';
import type { BoxSpec } from '@/config/app-spec';

export interface BoxRendererProps {
  box: BoxSpec;
  /** Optional per-ref props supplied by the consumer (data wiring) */
  slotProps?: Record<string, Record<string, unknown>>;
  /** Optional default body shown when no slotProps supplied */
  fallback?: React.ReactNode;
}

export const BoxRenderer: React.FC<BoxRendererProps> = ({ box, slotProps, fallback }) => {
  const unknownRefs = (box.componentRefs ?? []).filter((r) => !resolveBoxKitComponent(r));

  return (
    <div data-box-ref={box.ref} className="h-full">
    <BaseBox title={box.name ?? undefined} variant="standard" size="md">
      {(box.componentRefs ?? []).length === 0 && (fallback ?? <EmptyHint purpose={box.purpose} />)}

      <div className="flex flex-col gap-3">
        {(box.componentRefs ?? []).map((ref, i) => {
          const Cmp = resolveBoxKitComponent(ref);
          if (!Cmp) return null;
          const supplied = slotProps?.[ref];
          if (!supplied) {
            // No data wired yet — render a neutral placeholder instead of forcing
            // every primitive to accept undefined props.
            return (
              <div
                key={`${ref}-${i}`}
                className="text-[11px] text-muted-foreground/70 italic border border-dashed border-border/60 rounded-md px-2 py-1.5"
                data-component-ref={ref}
              >
                {ref}
              </div>
            );
          }
          return <Cmp key={`${ref}-${i}`} {...supplied} />;
        })}
      </div>

      {unknownRefs.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>مكون غير مُسجّل: {unknownRefs.join(', ')}</span>
        </div>
      )}
    </BaseBox>
    </div>
  );
};

const EmptyHint: React.FC<{ purpose?: string | null }> = ({ purpose }) => (
  <div className="text-xs text-muted-foreground py-4 text-center">
    {purpose ?? 'لم يُربط هذا الصندوق ببيانات حقيقية بعد.'}
  </div>
);
