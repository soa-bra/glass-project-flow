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
