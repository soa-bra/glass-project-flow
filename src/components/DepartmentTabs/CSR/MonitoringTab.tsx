import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { mockCSRInitiatives } from './data';

export const MonitoringTab: React.FC = () => {
  const [selectedInitiative, setSelectedInitiative] = useState('all');

  const totalSROI = (mockCSRInitiatives.reduce((s, i) => s + i.impact.sroi, 0) / mockCSRInitiatives.length).toFixed(2);
  const totalBeneficiaries = mockCSRInitiatives.reduce((s, i) => s + i.impact.directBeneficiaries + i.impact.indirectBeneficiaries, 0);
  const totalVolunteerHours = mockCSRInitiatives.reduce((s, i) => s + i.impact.volunteerHours, 0);
  const totalBudget = mockCSRInitiatives.reduce((s, i) => s + i.allocatedBudget, 0);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <AppCardSurface density="standard">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-[#0B0F12]" />
          <div>
            <h3 className="text-base font-bold text-[#0B0F12] font-arabic">إطار المتابعة والتقييم</h3>
            <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">متابعة شاملة لأداء المبادرات الاجتماعية وقياس الأثر</p>
          </div>
        </div>
      </AppCardSurface>

      {/* KPIs */}
      <AppDashboardGrid columns={12} density="default">
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="العائد الاجتماعي (SROI)" value={totalSROI} description="لكل ريال مستثمر" /></AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="إجمالي المستفيدين" value={totalBeneficiaries.toLocaleString('ar-SA')} description="مباشر وغير مباشر" /></AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="ساعات التطوع" value={totalVolunteerHours.toLocaleString('ar-SA')} description="من موظفي سوبرا" /></AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="إجمالي الاستثمار" value={formatCurrency(totalBudget)} /></AppGridItem>
      </AppDashboardGrid>

      {/* Initiative Performance */}
      <AppCardSurface density="standard">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">أداء المبادرات</span>
          <select value={selectedInitiative} onChange={e => setSelectedInitiative(e.target.value)} className="px-3 py-1.5 border border-[#DADCE0] rounded-full bg-white font-arabic text-xs">
            <option value="all">جميع المبادرات</option>
            {mockCSRInitiatives.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>

        <div className="space-y-4">
          {mockCSRInitiatives.map(initiative => (
            <div key={initiative.id} className="rounded-[18px] border border-[#DADCE0] p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#0B0F12] font-arabic">{initiative.title}</h4>
                <span className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">
                  مؤشر الأثر: {initiative.impact.socialImpactIndex}/10
                </span>
              </div>

              {/* Mini KPIs */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#3DBE8B]">
                    {initiative.kpis.filter(k => k.achieved >= k.target).length}/{initiative.kpis.length}
                  </p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">KPIs المحققة</p>
                </div>
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#9B59B6]">{initiative.impact.sroi}:1</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">SROI</p>
                </div>
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#3DA8F5]">
                    {((initiative.allocatedBudget / initiative.budget) * 100).toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">تقدم الميزانية</p>
                </div>
              </div>

              {/* KPI Progress Bars */}
              <div className="space-y-2">
                {initiative.kpis.map(kpi => {
                  const progress = Math.min((kpi.achieved / kpi.target) * 100, 100);
                  return (
                    <div key={kpi.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-[rgba(11,15,18,0.60)] font-arabic">{kpi.metric}</span>
                        <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">
                          {kpi.achieved.toLocaleString('ar-SA')} / {kpi.target.toLocaleString('ar-SA')} {kpi.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[rgba(11,15,18,0.08)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: progress >= 100 ? '#3DBE8B' : progress >= 80 ? '#3DA8F5' : '#F6C445',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </AppCardSurface>
    </div>
  );
};
