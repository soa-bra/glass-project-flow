
import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { AlertsCard } from './AlertsCard';

export const OverviewGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 h-[calc(100vh-280px)] overflow-hidden">
      {/* الصف الأول */}
      <StatisticsCard
        title="بيانات"
        value="46"
        unit="مليار"
        description="هذا النص مثال للشكل البياني"
        chartType="line"
      />
      
      <StatisticsCard
        title="بيانات"
        value="17"
        unit="مليار"
        description="هذا النص مثال للشكل البياني"
        chartType="bar"
      />

      {/* النظرة المالية - تمتد على صفين */}
      <FinancialOverviewCard />

      {/* الصف الثاني */}
      <StatisticsCard
        title="بيانات"
        value="03"
        unit="مليار"
        description="هذا النص مثال للشكل البياني"
        chartType="line"
      />

      <StatisticsCard
        title="نسبة"
        value="75"
        unit="مئوية"
        description="هذا النص مثال للشكل البياني"
      />

      {/* الصف الثالث */}
      <ProjectSummaryCard />
      
      {/* التنبيهات - تمتد على عمودين */}
      <AlertsCard />
    </div>
  );
};
