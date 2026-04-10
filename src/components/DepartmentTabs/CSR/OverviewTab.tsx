import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { NumericStatCard } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { mockCSRDashboardData } from './data';

export const OverviewTab: React.FC = () => {
  const { overview } = mockCSRDashboardData;

  const kpiStats = [
    { title: 'إجمالي المبادرات', value: overview.totalInitiatives, unit: 'مبادرة', description: `${overview.activeInitiatives} مبادرة نشطة` },
    { title: 'إجمالي المستفيدين', value: overview.totalBeneficiaries.toLocaleString('ar-SA'), unit: 'مستفيد', description: 'مستفيد مباشر وغير مباشر' },
    { title: 'مؤشر الأثر الاجتماعي', value: overview.socialImpactIndex.toFixed(1), unit: 'نقطة', description: 'من 10 نقاط' },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);

  const statsCards = [
    { title: 'إجمالي المبادرات', value: overview.totalInitiatives, description: `${overview.activeInitiatives} مبادرة نشطة`, color: '#f1b5b9' },
    { title: 'إجمالي المستفيدين', value: overview.totalBeneficiaries.toLocaleString('ar-SA'), description: 'مستفيد مباشر وغير مباشر', color: '#a4e2f6' },
    { title: 'ساعات التطوع', value: overview.totalVolunteerHours.toLocaleString('ar-SA'), description: 'ساعة تطوعية', color: '#bdeed3' },
    { title: 'إجمالي الاستثمار', value: formatCurrency(overview.totalBudget), description: 'استثمار مجتمعي', color: '#d9d2fd' },
    { title: 'مؤشر الأثر', value: overview.socialImpactIndex.toFixed(1), description: 'من 10 نقاط', color: '#fbe2aa' },
    { title: 'العائد الاجتماعي', value: `${overview.averageSROI.toFixed(1)}:1`, description: 'متوسط SROI', color: '#a4e2f6' },
  ];

  const recentActivities = [
    { msg: 'تم إكمال ورشة المهارات الرقمية', time: 'منذ ساعتين', color: '#bdeed3' },
    { msg: 'إضافة شريك جديد - جمعية البيئة', time: 'منذ 4 ساعات', color: '#a4e2f6' },
    { msg: 'تحديث مؤشرات الأداء لمبادرة الطاقة النظيفة', time: 'منذ 6 ساعات', color: '#fbe2aa' },
  ];

  const achievements = [
    { msg: 'تحقيق هدف 500 مستفيد', sub: 'برنامج محو الأمية الرقمية', color: '#fbe2aa' },
    { msg: 'زيادة مؤشر الأثر بنسبة 15%', sub: 'مقارنة بالربع السابق', color: '#bdeed3' },
    { msg: 'انضمام 15 متطوع جديد', sub: 'هذا الشهر', color: '#a4e2f6' },
  ];

  return (
    <div className="space-y-5">
      <KPIStatsSection stats={kpiStats} />

      {/* Welcome */}
      <div className="rounded-[24px] p-6 flex items-center gap-4" style={{ backgroundColor: 'rgba(241,181,185,0.12)', border: '1px solid rgba(241,181,185,0.3)' }}>
        <div className="w-10 h-10 rounded-full bg-[#f1b5b9] flex items-center justify-center shrink-0">
          <span className="text-white text-lg">❤</span>
        </div>
        <div>
          <h3 className="text-sm font-bold font-arabic text-[#0B0F12] mb-0.5">لوحة إدارة المسؤولية الاجتماعية</h3>
          <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">تتبع وإدارة المبادرات الاجتماعية وقياس الأثر المجتمعي</p>
        </div>
      </div>

      {/* Stats Grid */}
      <AppDashboardGrid columns={12} density="default">
        {statsCards.map((stat, index) => (
          <AppGridItem key={index} colSpan={4} tabletSpan={2}>
          <NumericStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            accentColor={stat.color}
            size="sm"
          />
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} density="default">
        <AppGridItem colSpan={6} tabletSpan={6}>
        {/* Recent Activity */}
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 h-full">
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
            النشاط الأخير
          </span>
          <div className="space-y-2 mt-4">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
                <div className="flex-1">
                  <p className="text-[12px] font-arabic text-[rgba(11,15,18,0.70)]">{a.msg}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.30)] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
            الإنجازات الحديثة
          </span>
          <div className="space-y-2 mt-4">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-[14px]" style={{ backgroundColor: `${a.color}15` }}>
                <span className="w-1.5 h-full min-h-[20px] rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <div className="flex-1">
                  <p className="text-[12px] font-arabic font-medium text-[rgba(11,15,18,0.70)]">{a.msg}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)]">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
