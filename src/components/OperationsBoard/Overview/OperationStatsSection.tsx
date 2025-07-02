
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

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
 * يعرض الإيرادات المتوقعة، الشكاوى، والمشاريع المتأخرة
 */
export const OperationStatsSection: React.FC<OperationStatsSectionProps> = ({
  stats
}) => {
  // إضافة حماية ضد البيانات غير المعرّفة
  if (!stats) {
    console.log('OperationStatsSection: stats is undefined');
    return (
      <div className="grid grid-cols-3 gap-6 mb-6 my-0 px-[4px] mx-[10px]">
        <div className="text-center py-8 text-gray-500 font-arabic">
          جارٍ تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  console.log('OperationStatsSection received stats:', stats);

  // تحويل البيانات لتتوافق مع KPIStatsSection مع مؤشرات الاتجاه
  const kpiStats = [
    {
      title: 'الإيرادات المتوقعة',
      value: stats.expectedRevenue || 0,
      unit: 'الف',
      description: 'ريال سعودي عن الربع الأول',
      trend: 'up' as const,
      trendValue: '+12%'
    },
    {
      title: 'الشكاوى',
      value: stats.complaints || 0,
      unit: 'شكاوى',
      description: 'الشكاوى والملاحظات التي المكررة',
      trend: 'down' as const,
      trendValue: '-8%'
    },
    {
      title: 'المشاريع المتأخرة',
      value: stats.delayedProjects || 0,
      unit: 'مشاريع',
      description: 'تحتاج إلى تدخل ومعالجة',
      trend: 'neutral' as const,
      trendValue: '0%'
    }
  ];

  return <KPIStatsSection stats={kpiStats} className="grid-cols-3" />;
};
