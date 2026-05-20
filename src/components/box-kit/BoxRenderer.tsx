/**
 * BoxRenderer — renders one spec box using BaseBox shell + spec componentRefs.
 *
 * Spec componentRefs mix two kinds:
 *   1) Box-Kit primitive codes (DAV-/IPF-/ACT-/MDL-) → resolved via registry.
 *   2) Shell hints like "BaseBox" or feature component names → metadata only,
 *      silently ignored (the box already lives inside <BaseBox/>).
 *
 * @specRef Section 4.0.1 (Workspace Shell) + Section 6
 */
import React from 'react';
import { AlertTriangle, Layers } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';
import { resolveBoxKitComponent } from './registry';
import type { BoxSpec } from '@/config/app-spec';
import { LAYOUT_BOX_ROLE_MAP, resolveBoxLayoutRef } from '@/config/box-kit/layout-reference-map';
import { cn } from '@/lib/utils';

export interface BoxRendererProps {
  box: BoxSpec;
  /** Optional per-ref props supplied by the consumer (data wiring) */
  slotProps?: Record<string, Record<string, unknown>>;
  /** Optional default body shown when no slotProps supplied */
  fallback?: React.ReactNode;
}

const PRIMITIVE_RE = /^(DAV|IPF|ACT|MDL)-/;

export const BoxRenderer: React.FC<BoxRendererProps> = ({ box, slotProps, fallback }) => {
  const refs = box.componentRefs ?? [];
  const primitiveRefs = refs.filter((r) => PRIMITIVE_RE.test(r));
  const unknownRefs = primitiveRefs.filter((r) => !resolveBoxKitComponent(r));
  const renderedPrimitives = primitiveRefs.filter((r) => resolveBoxKitComponent(r));
  const boxLayoutRef = resolveBoxLayoutRef(box);
  const boxLayout = LAYOUT_BOX_ROLE_MAP[boxLayoutRef];

  const wiredCount = renderedPrimitives.filter((r) => slotProps?.[r]).length;
  const hasAnyWiring = wiredCount > 0;

  return (
    <div
      data-box-ref={box.ref}
      data-layout-ref={boxLayoutRef}
      className={cn(
        'h-full',
        boxLayout.columnsSpan === 2 && 'md:col-span-2',
        boxLayout.rowSpan === 2 && 'md:row-span-2',
      )}
      style={{ minHeight: boxLayout.minHeight }}
    >
      <BaseBox title={box.name ?? undefined} variant="standard" size="md">
        {renderedPrimitives.length === 0 && (fallback ?? <EmptyHint purpose={box.purpose} />)}

        {hasAnyWiring ? (
          <div className="flex flex-col gap-3">
            {renderedPrimitives.map((ref, i) => {
              const Cmp = resolveBoxKitComponent(ref)!;
              const supplied = slotProps?.[ref];
              if (!supplied) return null;
              return <Cmp key={`${ref}-${i}`} componentRef={ref} {...supplied} />;
            })}
          </div>
        ) : (
          renderedPrimitives.length > 0 && (
            <PendingWiring purpose={box.purpose} count={renderedPrimitives.length} />
          )
        )}

        {unknownRefs.length > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>مكون غير مُسجّل: {unknownRefs.join(', ')}</span>
          </div>
        )}
      </BaseBox>
    </div>
  );
};

const EmptyHint: React.FC<{ purpose?: string | null }> = ({ purpose }) => (
  <div className="py-4 text-center text-xs text-muted-foreground">
    {purpose ?? 'لم يُربط هذا الصندوق ببيانات حقيقية بعد.'}
  </div>
);

const PendingWiring: React.FC<{ purpose?: string | null; count: number }> = ({ purpose, count }) => (
  <div className="flex flex-col items-start gap-2 py-3">
    {purpose ? <p className="text-start text-sm leading-relaxed text-foreground/80">{purpose}</p> : null}
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Layers className="h-3 w-3" />
      <span>{count} عنصر بانتظار ربط البيانات</span>
    </div>
  </div>
);
