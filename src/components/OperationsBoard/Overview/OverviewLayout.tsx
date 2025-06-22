
import React from 'react';
import { OperationStatsSection } from './OperationStatsSection';
import { OverviewGrid } from './OverviewGrid';
import { TimelineCard } from './TimelineCard';
import { OverviewData } from './OverviewData';

interface OverviewLayoutProps {
  data: OverviewData;
}

/**
 * تخطيط النظرة العامة - يعرض الإحصائيات الرئيسية والشبكة التفاعلية
 */
export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  console.log('OverviewLayout received data:', data);
  
  return (
    <div className="font-arabic px-[15px] py-0">
      {/* قسم الإحصائيات الرئيسية */}
      <div className="mb-6 py-0 px-0 my-0">
        <OperationStatsSection stats={data?.stats} />
      </div>

      {/* بطاقة الأحداث القادمة */}
      <div className="mb-6">
        <TimelineCard />
      </div>

      {/* الشبكة التفاعلية 3x3 */}
      <div className="py-0">
        <OverviewGrid />
      </div>
    </div>
  );
};
