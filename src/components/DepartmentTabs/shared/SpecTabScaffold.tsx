/**
 * SpecTabScaffold — a high-contrast scaffold for newly-added spec tabs
 * (CSR impact/beneficiaries/resources, Training development-paths,
 *  KMPA research-pipeline/publications/peer-review).
 *
 * Renders a KPI row + the four canonical spec boxes:
 *   1) filters   2) list/workspace   3) detail   4) actions
 *
 * Mock-data only — backend wiring is scheduled per the Data-Wiring plan.
 *
 * @specRef DepartmentsWorkspace-tabs-boxes-backend.md (boxes 1–4 per tab)
 */
import React, { useState } from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { Search, Plus, Eye, Filter } from 'lucide-react';

export interface SpecKPI {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
}

export interface SpecListItem {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  meta?: string;
}

export interface SpecAction {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface Props {
  intro: { title: string; description: string; accent?: string };
  kpis: SpecKPI[];
  items: SpecListItem[];
  detailFields: Array<{ label: string; value: string }>;
  actions: SpecAction[];
  filterPlaceholder?: string;
}

export const SpecTabScaffold: React.FC<Props> = ({
  intro, kpis, items, detailFields, actions, filterPlaceholder = 'بحث…',
}) => {
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState(items[0]?.id);

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(q.toLowerCase()) ||
    (i.subtitle ?? '').toLowerCase().includes(q.toLowerCase()),
  );
  const selected = items.find(i => i.id === selectedId) ?? items[0];

  const accent = intro.accent ?? '#a4e2f6';

  return (
    <div className="space-y-5">
      <KPIStatsSection stats={kpis} />

      {/* Intro */}
      <div
        className="rounded-[24px] p-6 flex items-center gap-4"
        style={{ backgroundColor: `${accent}1f`, border: `1px solid ${accent}55` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: accent }}
        >
          <Filter className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-arabic text-[#0B0F12] mb-0.5">{intro.title}</h3>
          <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">{intro.description}</p>
        </div>
      </div>

      <AppDashboardGrid columns={12} density="default">
        {/* Box 1 — Filters & Search */}
        <AppGridItem colSpan={12} tabletSpan={6}>
          <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
                بحث وفلاتر
              </span>
              <span className="text-[10px] text-[rgba(11,15,18,0.30)] font-arabic">IPF-SRH-01</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={filterPlaceholder}
                  className="pr-9 h-10 rounded-[14px]"
                />
              </div>
              <BaseActionButton variant="secondary" icon={Filter}>تصفية</BaseActionButton>
            </div>
          </div>
        </AppGridItem>

        {/* Box 2 — Workspace list */}
        <AppGridItem colSpan={7} tabletSpan={6}>
          <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
                القائمة
              </span>
              <span className="text-[10px] text-[rgba(11,15,18,0.30)] font-arabic">DAV-LST-01</span>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filtered.map(it => {
                const active = it.id === selected?.id;
                return (
                  <button
                    type="button"
                    key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    className={`w-full text-right p-3 rounded-[14px] transition ${
                      active
                        ? 'bg-[rgba(11,15,18,0.05)] ring-1 ring-[rgba(11,15,18,0.15)]'
                        : 'bg-[rgba(11,15,18,0.02)] hover:bg-[rgba(11,15,18,0.04)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-[13px] font-arabic font-medium text-[#0B0F12]">{it.title}</p>
                        {it.subtitle && (
                          <p className="text-[11px] font-arabic text-[rgba(11,15,18,0.55)] mt-0.5">{it.subtitle}</p>
                        )}
                      </div>
                      {it.status && (
                        <span
                          className="text-[10px] font-arabic px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${accent}33`, color: '#0B0F12' }}
                        >
                          {it.status}
                        </span>
                      )}
                    </div>
                    {it.meta && (
                      <p className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic mt-1">{it.meta}</p>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-[12px] text-[rgba(11,15,18,0.4)] font-arabic">
                  لا توجد نتائج مطابقة
                </div>
              )}
            </div>
          </div>
        </AppGridItem>

        {/* Box 3 — Detail */}
        <AppGridItem colSpan={5} tabletSpan={6}>
          <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
                التفاصيل
              </span>
              <span className="text-[10px] text-[rgba(11,15,18,0.30)] font-arabic">DAV-DTL-01</span>
            </div>
            {selected ? (
              <>
                <h4 className="text-[15px] font-bold font-arabic text-[#0B0F12] mb-3">{selected.title}</h4>
                <div className="space-y-2.5">
                  {detailFields.map((f, i) => (
                    <div key={i} className="flex justify-between gap-3 py-1.5 border-b border-[rgba(11,15,18,0.06)] last:border-0">
                      <span className="text-[11px] text-[rgba(11,15,18,0.55)] font-arabic">{f.label}</span>
                      <span className="text-[12px] text-[#0B0F12] font-arabic font-medium text-left">{f.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[12px] text-[rgba(11,15,18,0.4)] font-arabic">اختر عنصراً لعرض تفاصيله</p>
            )}
          </div>
        </AppGridItem>

        {/* Box 4 — Actions */}
        <AppGridItem colSpan={12} tabletSpan={6}>
          <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
                الإجراءات
              </span>
              <span className="text-[10px] text-[rgba(11,15,18,0.30)] font-arabic">ACT-BTN-01</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {actions.map((a, i) => (
                <BaseActionButton
                  key={i}
                  variant={a.variant ?? (i === 0 ? 'primary' : 'secondary')}
                  icon={(a.icon as any) ?? (i === 0 ? Plus : Eye)}
                  onClick={a.onClick}
                >
                  {a.label}
                </BaseActionButton>
              ))}
            </div>
          </div>
        </AppGridItem>
      </AppDashboardGrid>
    </div>
  );
};
