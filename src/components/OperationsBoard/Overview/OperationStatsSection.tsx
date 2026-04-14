import React from 'react';
import { NumericStatCard } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface ProjectStats {
  expectedRevenue: number;
  complaints: number;
  delayedProjects: number;
}

interface OperationStatsSectionProps {
  stats: ProjectStats;
}

/**
 * مكون عرض الإحصائيات الرئيسية للعمليات
 */
export const OperationStatsSection: React.FC<OperationStatsSectionProps> = ({ stats }) => {
  if (!stats) {
    return (
      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={12}>
          <div className="text-center py-8 text-[rgba(11,15,18,0.40)] font-arabic">
            جارٍ تحميل الإحصائيات...
          </div>
        </AppGridItem>
      </AppDashboardGrid>
    );
  }

  return (
    <AppDashboardGrid columns={12} density="default" className="mb-6">
      <AppGridItem colSpan={4}>
        <NumericStatCard
          title="ميزانية المشروع"
          value={stats.expectedRevenue || 0}
          unit="الف"
          description="ريال سعودي عن الربع الأول"
        />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard
          title="عدد الأيام المتبقية"
          value={String(stats.complaints || 0).padStart(2, '0')}
          unit="يوم"
          description="حتى انتهاء المشروع الحالي"
        />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard
          title="المشاريع المتأخرة"
          value={String(stats.delayedProjects || 0).padStart(2, '0')}
          unit="مشاريع"
          description="تحتاج إلى تدخل ومعالجة"
          accentColor="var(--visual-data-secondary-2)"
        />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
