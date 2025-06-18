
import React from 'react';
import { ProjectStatsSection } from './ProjectStatsSection';
import { OverviewData } from './OverviewData';

interface OverviewLayoutProps {
  data: OverviewData;
}

/**
 * تخطيط النظرة العامة - يعرض الإحصائيات الرئيسية فقط
 */
export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  return (
    <div className="h-full flex flex-col font-arabic overflow-hidden py-0 px-[24px]">
      {/* قسم الإحصائيات الرئيسية */}
      <div className="mb-6 py-0 px-0">
        <ProjectStatsSection stats={data.stats} />
      </div>
    </div>
  );
};
