import React from 'react';
import { NumericStatCard } from '@/components/shared/visual-data';

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
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center py-8 text-[rgba(11,15,18,0.40)] font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <NumericStatCard
        title="ميزانية المشروع"
        value={stats.expectedRevenue || 0}
        unit="الف"
        description="ريال سعودي عن الربع الأول"
      />
      <NumericStatCard
        title="عدد الأيام المتبقية"
        value={String(stats.complaints || 0).padStart(2, '0')}
        unit="يوم"
        description="حتى انتهاء المشروع الحالي"
      />
      <NumericStatCard
        title="المشاريع المتأخرة"
        value={String(stats.delayedProjects || 0).padStart(2, '0')}
        unit="مشاريع"
        description="تحتاج إلى تدخل ومعالجة"
        accentColor="var(--visual-data-secondary-2)"
      />
    </div>
  );
};
