/**
 * Box-Kit — canonical micro-primitives used to render every spec box/popup.
 * Maps 1:1 to `componentRefs` from docs/specs/*.xlsx.
 *
 * @specRef Section 6.1 (مكونات الواجهة الأساسية)
 * @specRef mem://spec/box-kit-vocabulary
 */
import React from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// DAV-* — data view primitives
// ─────────────────────────────────────────────────────────────

/** DAV-TTL-01 — Box title (RTL-aware) */
export const BoxTitle: React.FC<{ children: React.ReactNode; subtitle?: string; className?: string }> = ({
  children,
  subtitle,
  className,
}) => (
  <div className={cn('flex flex-col gap-1 mb-3', className)}>
    <h3 className="text-base font-semibold text-foreground">{children}</h3>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </div>
);

/** DAV-KPI-01 — KPI cluster (value + label, RTL) */
export type KpiItem = { label: string; value: React.ReactNode; trend?: string; tone?: 'neutral' | 'positive' | 'negative' };
export const KpiCluster: React.FC<{ items: KpiItem[]; className?: string }> = ({ items, className }) => (
  <div className={cn('grid gap-3', className)} style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))` }}>
    {items.map((k, i) => (
      <div key={i} className="flex flex-col gap-1">
        <span className="text-2xl font-bold text-foreground">{k.value}</span>
        <span className="text-xs text-muted-foreground">{k.label}</span>
        {k.trend && (
          <span
            className={cn(
              'text-xs',
              k.tone === 'positive' && 'text-emerald-600',
              k.tone === 'negative' && 'text-red-600',
              !k.tone && 'text-muted-foreground'
            )}
          >
            {k.trend}
          </span>
        )}
      </div>
    ))}
  </div>
);

/** DAV-TAG-01 — Tag strip */
export const TagStrip: React.FC<{ tags: string[]; className?: string }> = ({ tags, className }) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {tags.map((t) => (
      <span key={t} className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
        {t}
      </span>
    ))}
  </div>
);

/** DAV-DTL-01 — Key/value detail list */
export type DetailRow = { label: string; value: React.ReactNode };
export const DetailList: React.FC<{ rows: DetailRow[]; className?: string }> = ({ rows, className }) => (
  <dl className={cn('grid grid-cols-2 gap-x-4 gap-y-2 text-sm', className)}>
    {rows.map((r, i) => (
      <React.Fragment key={i}>
        <dt className="text-muted-foreground">{r.label}</dt>
        <dd className="text-foreground font-medium text-end">{r.value}</dd>
      </React.Fragment>
    ))}
  </dl>
);

/** DAV-TBL-01 — Lightweight data table */
export type TableColumn<T> = { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode };
export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  empty = 'لا توجد بيانات',
  className,
}: {
  columns: TableColumn<T>[];
  rows: T[];
  empty?: string;
  className?: string;
}) {
  if (!rows.length) return <div className="text-sm text-muted-foreground py-6 text-center">{empty}</div>;
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="text-start font-medium py-2 px-3">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/50">
              {columns.map((c) => (
                <td key={String(c.key)} className="py-2 px-3 text-foreground">
                  {c.render ? c.render(r) : (r as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** DAV-LST-01 — Vertical list of cards */
export const DataList: React.FC<{ items: { id: string | number; primary: React.ReactNode; secondary?: React.ReactNode; trailing?: React.ReactNode }[]; className?: string }> = ({
  items,
  className,
}) => (
  <ul className={cn('flex flex-col gap-2', className)}>
    {items.map((it) => (
      <li key={it.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground truncate">{it.primary}</div>
          {it.secondary && <div className="text-xs text-muted-foreground truncate">{it.secondary}</div>}
        </div>
        {it.trailing && <div className="flex-shrink-0">{it.trailing}</div>}
      </li>
    ))}
  </ul>
);

/** DAV-CHT-01 — Chart frame wrapper (consumers slot Recharts inside) */
export const ChartFrame: React.FC<{ children: React.ReactNode; height?: number; className?: string }> = ({
  children,
  height = 220,
  className,
}) => (
  <div className={cn('w-full', className)} style={{ height }}>
    {children}
  </div>
);

/** DAV-ALR-01 — Alert / notification block */
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';
export const AlertBlock: React.FC<{
  tone?: AlertTone;
  title?: React.ReactNode;
  message?: React.ReactNode;
  items?: { id: string | number; text: React.ReactNode; tone?: AlertTone }[];
  className?: string;
}> = ({ tone = 'info', title, message, items, className }) => {
  const toneClass: Record<AlertTone, string> = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-red-200 bg-red-50 text-red-900',
  };
  return (
    <div className={cn('rounded-lg border px-3 py-2 text-sm', toneClass[tone], className)}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      {message && <div className="text-xs opacity-80">{message}</div>}
      {items && items.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 text-xs">
          {items.map((it) => (
            <li key={it.id} className={cn('flex items-start gap-2', it.tone && toneClass[it.tone].split(' ').slice(-1)[0])}>
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              <span>{it.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** DAV-TML-01 — Vertical activity timeline */
export type TimelineItem = {
  id: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  tone?: AlertTone;
};
export const Timeline: React.FC<{ items: TimelineItem[]; className?: string }> = ({ items, className }) => {
  if (!items.length) return <div className="text-sm text-muted-foreground py-4 text-center">لا توجد أحداث</div>;
  const dotTone: Record<AlertTone, string> = {
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };
  return (
    <ol className={cn('relative flex flex-col gap-3 ps-4', className)}>
      <span className="absolute start-1.5 top-2 bottom-2 w-px bg-border" aria-hidden />
      {items.map((it) => (
        <li key={it.id} className="relative">
          <span
            className={cn(
              'absolute -start-[14px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-background',
              dotTone[it.tone ?? 'info']
            )}
            aria-hidden
          />
          <div className="text-sm font-medium text-foreground">{it.title}</div>
          {it.description && <div className="text-xs text-muted-foreground mt-0.5">{it.description}</div>}
          {it.timestamp && <div className="text-[10px] text-muted-foreground mt-0.5">{it.timestamp}</div>}
        </li>
      ))}
    </ol>
  );
};
