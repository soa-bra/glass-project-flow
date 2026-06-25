import React from 'react';
import { Activity, AlertTriangle, ArrowUpLeft, Building2, Users } from 'lucide-react';
import { OverviewGrid, TimelineBox } from './index';
import type { OverviewData } from './index';
import { Reveal } from '@/components/shared/motion';
import { BaseBox } from '@/components/ui/BaseBox';

interface OverviewLayoutProps {
  data: OverviewData;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('ar-SA-u-nu-latn').format(Math.max(0, value));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * تخطيط النظرة العامة - يعرض الإحصائيات الرئيسية والشبكة التفاعلية
 */
export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  const { expectedRevenue, complaints, delayedProjects, totalCustomers = 0 } = data.stats;
  const healthScore = clamp(100 - delayedProjects * 8 - complaints * 4, 0, 100);
  const riskLevel = delayedProjects + complaints > 8 ? 'مرتفع' : delayedProjects + complaints > 0 ? 'متوسط' : 'مستقر';

  const overviewSignals = [
    {
      label: 'مؤشر التشغيل',
      value: `${healthScore}%`,
      description: 'محسوب من التأخير والشكاوى النشطة',
      icon: Activity,
    },
    {
      label: 'العملاء المسجلون',
      value: formatNumber(totalCustomers),
      description: 'من قاعدة عملاء CRM',
      icon: Users,
    },
    {
      label: 'مستوى المخاطر',
      value: riskLevel,
      description: `${formatNumber(delayedProjects)} مشاريع متأخرة / ${formatNumber(complaints)} شكاوى`,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <Reveal delay={0}>
        <BaseBox variant="standard" size="md" className="overflow-hidden">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="flex min-w-0 flex-col justify-between gap-5 rounded-[22px] border border-[#3e494c]/10 bg-[hsl(var(--ink))]/[0.035] p-5">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#3e494c]/15 bg-white/65 px-3 py-1 text-xs font-medium text-[hsl(var(--ink))]">
                  <Building2 className="h-4 w-4" />
                  مركز متابعة الإدارة والتشغيل
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[hsl(var(--ink))] font-arabic">
                    نظرة موحدة على الجاهزية والمخاطر
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[hsl(var(--ink-60))] font-arabic">
                    ملخص سريع يربط أداء التشغيل بالمشاريع المتأخرة، الشكاوى المفتوحة، وحجم قاعدة العملاء قبل الدخول في تفاصيل الصناديق.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                  <p className="text-xs text-[hsl(var(--ink-60))]">الإيرادات المتوقعة</p>
                  <p className="mt-1 text-xl font-bold text-[hsl(var(--ink))]">
                    {formatNumber(expectedRevenue)}
                    <span className="mr-1 text-xs font-medium text-[hsl(var(--ink-60))]">ألف ر.س</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                  <p className="text-xs text-[hsl(var(--ink-60))]">المشاريع المتأخرة</p>
                  <p className="mt-1 text-xl font-bold text-[hsl(var(--ink))]">{formatNumber(delayedProjects)}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                  <p className="text-xs text-[hsl(var(--ink-60))]">الشكاوى النشطة</p>
                  <p className="mt-1 text-xl font-bold text-[hsl(var(--ink))]">{formatNumber(complaints)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {overviewSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div key={signal.label} className="flex items-center gap-3 rounded-[22px] border border-[#DADCE0] bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#3e494c]/15 bg-[hsl(var(--ink))]/[0.04] text-[hsl(var(--ink))]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[hsl(var(--ink))]">{signal.label}</p>
                      <p className="mt-0.5 truncate text-xs text-[hsl(var(--ink-60))]">{signal.description}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2 text-left">
                      <span className="text-lg font-bold text-[hsl(var(--ink))]">{signal.value}</span>
                      <ArrowUpLeft className="h-4 w-4 text-[hsl(var(--ink-60))]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BaseBox>
      </Reveal>

      {/* بطاقة الأحداث القادمة */}
      <Reveal delay={0.1}>
        <TimelineBox />
      </Reveal>

      {/* الشبكة التفاعلية 3x3 */}
      <Reveal delay={0.2}>
        <OverviewGrid />
      </Reveal>
    </div>
  );
};