import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { OverviewGrid } from './OverviewGrid';
import { TimelineCard } from './TimelineCard';
import { OverviewData } from './OverviewData';
import { Reveal } from '@/components/shared/motion';
interface OverviewLayoutProps {
  data: OverviewData;
}

/**
 * تخطيط النظرة العامة - يعرض الإحصائيات الرئيسية والشبكة التفاعلية
 */
export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  // تحويل البيانات إلى تنسيق KPIStatsSection
  const statsData = data?.stats ? [{
    title: 'الإيرادات المتوقعة',
    value: String(data.stats.expectedRevenue || 0),
    unit: 'الف',
    description: 'ريال سعودي عن الربع الأول'
  }, {
    title: 'الشكاوى',
    value: String(data.stats.complaints || 0).padStart(2, '0'),
    unit: 'شكاوى',
    description: 'الشكاوى والملاحظات التي المكررة'
  }, {
    title: 'المشاريع المتأخرة',
    value: String(data.stats.delayedProjects || 0).padStart(2, '0'),
    unit: 'مشاريع',
    description: 'تحتاج إلى تدخل ومعالجة'
  }] : [];
  return (
    <div className="font-arabic px-[15px] py-0">
      {/* قسم الإحصائيات الرئيسية */}
      <div className="mb-6 py-0 px-0 my-0">
        <KPIStatsSection stats={statsData} />
      </div>

      {/* بطاقة الأحداث القادمة */}
      <Reveal delay={0.2}>
        <div className="mb-6">
          <TimelineCard />
        </div>
      </Reveal>

      {/* الشبكة التفاعلية 3x3 */}
      <div className="py-0">
        <OverviewGrid />
      </div>
    </div>
  );
};