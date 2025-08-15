
import React from 'react';
import { OverviewLayout } from './Overview/OverviewLayout';
import { mockOverviewData, OverviewData } from './Overview/OverviewData';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

/**
 * تبويب النظرة العامة - يعرض الإحصائيات الأساسية للمشاريع
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  // استخدام البيانات التجريبية إذا لم تكن البيانات متوفرة
  const finalData = data || mockOverviewData;

  // تحويل البيانات إلى تنسيق KPI
  const kpiStats = finalData?.stats ? [{
    title: 'الإيرادات المتوقعة',
    value: String(finalData.stats.expectedRevenue || 0),
    unit: 'ألف ر.س',
    description: 'عن الربع الأول'
  }, {
    title: 'الشكاوى',
    value: String(finalData.stats.complaints || 0).padStart(2, '0'),
    unit: 'شكاوى',
    description: 'تحتاج إلى معالجة'
  }, {
    title: 'المشاريع المتأخرة',
    value: String(finalData.stats.delayedProjects || 0).padStart(2, '0'),
    unit: 'مشاريع',
    description: 'تحتاج إلى تدخل'
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="overview"
      kpiStats={kpiStats}
      loading={loading}
    >
      <OverviewLayout data={finalData} />
    </BaseOperationsTabLayout>
  );
};
