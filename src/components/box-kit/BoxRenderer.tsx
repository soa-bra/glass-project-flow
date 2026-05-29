/**
 * BoxRenderer — renders one spec box using BaseBox shell + spec componentRefs.
 *
 * @specRef Section 4.0.1 (Workspace Shell) + Section 6
 */
import React from 'react';
import { AlertTriangle, Layers } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';
import { resolveBoxKitComponent } from './registry';
import type { BoxSpec } from '@/config/app-spec';
import { LAYOUT_BOX_ROLE_MAP, resolveBoxLayoutRef } from '@/config/box-kit/layout-reference-map';
import { ACTION_BUTTON_REFERENCE_MAP, normalizeActionButtonRef } from '@/config/box-kit/action-reference-map';
import { cn } from '@/lib/utils';

export interface BoxRendererProps {
  box: BoxSpec;
  slotProps?: Record<string, Record<string, unknown>>;
  fallback?: React.ReactNode;
}

const PRIMITIVE_RE = /^(DAV|IPF|ACT|MDL)-/;
const BOX_ICON_ONLY_BASE_REFS = new Set(['ACT-BTN-P03', 'ACT-BTN-S03', 'ACT-BTN-PSA03', 'ACT-BTN-SSA03']);

type LayoutMode = 'default' | 'form' | 'action-panel' | 'content-with-actions';

export const BoxRenderer: React.FC<BoxRendererProps> = ({ box, slotProps, fallback }) => {
  const refs = box.componentRefs ?? [];
  const primitiveRefs = refs.filter((r) => PRIMITIVE_RE.test(r));
  const unknownRefs = primitiveRefs.filter((r) => !resolveBoxKitComponent(r));
  const renderedPrimitives = primitiveRefs.filter((r) => resolveBoxKitComponent(r));
  const boxLayoutRef = resolveBoxLayoutRef(box);
  const boxLayout = LAYOUT_BOX_ROLE_MAP[boxLayoutRef];

  const wiredCount = renderedPrimitives.filter((r) => slotProps?.[r]).length;
  const hasAnyWiring = wiredCount > 0;

  const actionButtonRefs = renderedPrimitives.filter((ref) => ref.startsWith('ACT-BTN-'));
  const actionMenuRefs = renderedPrimitives.filter((ref) => ref.startsWith('ACT-MNU-'));
  const statusRefs = renderedPrimitives.filter((ref) => ref.startsWith('ACT-STS-'));
  const inputRefs = renderedPrimitives.filter((ref) => ref.startsWith('IPF-'));
  const visualDataRefs = renderedPrimitives.filter((ref) =>
    /^(DAV-KPI-01|DAV-TAG-01|DAV-DTL-01|DAV-LST-01|DAV-TBL-01|DAV-CHT-01|DAV-ALR-01|DAV-TML-01)$/.test(ref),
  );

  const headerButtonRefs = actionButtonRefs.filter((ref) => {
    const normalized = normalizeActionButtonRef(ref);
    if (!normalized) return false;
    const cfg = ACTION_BUTTON_REFERENCE_MAP[normalized];
    return cfg.family === 'secondary' && cfg.content === 'iconOnly';
  });
  const bodyButtonRefs = actionButtonRefs.filter((ref) => !headerButtonRefs.includes(ref));

  const layoutMode: LayoutMode = inputRefs.length
    ? 'form'
    : bodyButtonRefs.length > 0 && visualDataRefs.length === 0
      ? 'action-panel'
      : bodyButtonRefs.length > 0
        ? 'content-with-actions'
        : 'default';

  const contentRefs = renderedPrimitives.filter(
    (ref) =>
      !headerButtonRefs.includes(ref) &&
      !bodyButtonRefs.includes(ref) &&
      !actionMenuRefs.includes(ref) &&
      !statusRefs.includes(ref),
  );

  const resolveBoxScopedComponentRef = (ref: string) => {
    if (BOX_ICON_ONLY_BASE_REFS.has(ref)) {
      return `${ref}-1`;
    }
    return ref;
  };

  const renderPrimitive = (ref: string, extraClassName?: string) => {
    const Cmp = resolveBoxKitComponent(ref);
    const supplied = slotProps?.[ref];
    if (!Cmp || !supplied) return null;
    return (
      <Cmp
        key={ref}
        componentRef={resolveBoxScopedComponentRef(ref)}
        {...supplied}
        className={cn((supplied as { className?: string }).className, extraClassName)}
      />
    );
  };

  const headerActions =
    headerButtonRefs.length > 0 || actionMenuRefs.length > 0 ? (
      <>
        {headerButtonRefs.map((ref) => renderPrimitive(ref))}
        {actionMenuRefs.map((ref) => renderPrimitive(ref))}
      </>
    ) : null;

  const bodyActions =
    bodyButtonRefs.length > 0 ? (
      <div
        className={cn(
          'pt-4',
          layoutMode === 'action-panel' && bodyButtonRefs.length === 1
            ? 'mt-auto flex justify-center'
            : 'mt-auto flex flex-wrap items-center gap-2',
        )}
      >
        {bodyButtonRefs.map((ref) => renderPrimitive(ref))}
      </div>
    ) : null;

  const statusRow =
    statusRefs.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        {statusRefs.map((ref) => renderPrimitive(ref))}
      </div>
    ) : null;

  return (
    <div
      data-box-ref={box.ref}
      data-layout-ref={boxLayoutRef}
      className={cn(
        'h-full self-stretch',
        boxLayout.columnsSpan === 2 && 'xl:col-span-2',
        boxLayout.columnsSpan === 4 && 'md:col-span-2 xl:col-span-4',
        boxLayout.rowSpan === 2 && 'md:row-span-2',
        boxLayout.rowSpan === 3 && 'md:row-span-3',
      )}
      style={{ minHeight: boxLayout.minHeight }}
    >
      <BaseBox
        title={box.name ?? undefined}
        headerActions={headerActions}
        variant="standard"
        size="md"
        overflow="visible"
        className="flex h-full flex-col"
      >
        {renderedPrimitives.length === 0 && (fallback ?? <EmptyHint purpose={box.purpose} />)}

        {hasAnyWiring ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            {layoutMode === 'form' ? statusRow : null}

            {contentRefs.map((ref) => {
              if (!slotProps?.[ref]) return null;
              return renderPrimitive(ref);
            })}

            {layoutMode !== 'form' ? statusRow : null}
            {bodyActions}
          </div>
        ) : (
          renderedPrimitives.length > 0 && <PendingWiring purpose={box.purpose} count={renderedPrimitives.length} />
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
