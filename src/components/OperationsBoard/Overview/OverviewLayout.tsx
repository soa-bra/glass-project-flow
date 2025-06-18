
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
  return (
    <div className="h-full flex flex-col font-arabic overflow-hidden py-0 px-[32px]">
      {/* قسم الإحصائيات الرئيسية */}
      <div className="mb-8 py-0 px-0">
        <OperationStatsSection stats={data.stats} />
      </div>

      {/* بطاقة الأحداث القادمة */}
      <div className="mb-8">
        <TimelineCard />
      </div>

      {/* شبكة البطاقات التفاعلية */}
      <div className="flex-1 min-h-0">
        <OverviewGrid />
      </div>
    </div>
  );
};
