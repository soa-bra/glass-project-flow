
import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { AlertsCard } from './AlertsCard';

export const OverviewGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 py-0 my-0">
      {/* الصف الأول */}
      <FinancialOverviewCard />
      
      <StatisticsCard 
        title="بيانات" 
        value="46" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="bar" 
      />

      <StatisticsCard 
        title="بيانات" 
        value="17" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="line" 
      />

      {/* الصف الثاني */}
      <StatisticsCard 
        title="بيانات" 
        value="03" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="area" 
      />

      <StatisticsCard 
        title="نسبة" 
        value="75" 
        unit="مئوية" 
        description="هذا النص مثال للشكل البياني" 
        chartType="pie"
      />

      {/* الصف الثالث */}
      <AlertsCard />
      
      <ProjectSummaryCard />
    </div>
  );
};
