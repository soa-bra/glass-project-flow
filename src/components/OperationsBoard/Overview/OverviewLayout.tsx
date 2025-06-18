
import React from 'react';
import { ProjectStatsSection } from './ProjectStatsSection';
import { OverviewGridSection } from './OverviewGridSection';
import { OverviewData } from './OverviewData';

interface OverviewLayoutProps {
  data: OverviewData;
}

export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  return (
    <div className="h-full flex flex-col font-arabic overflow-hidden py-0 px-[24px]">
      <div className="mb-6 py-0 px-0">
        <ProjectStatsSection stats={data.stats} />
      </div>

      <OverviewGridSection data={data} />
    </div>
  );
};
