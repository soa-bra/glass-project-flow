
import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { AlertsCard } from './AlertsCard';
import { ExtraWidgetOne } from './ExtraWidgetOne';
import { ExtraWidgetTwo } from './ExtraWidgetTwo';
import { ExtraWidgetThree } from './ExtraWidgetThree';
import { ExtraWidgetFour } from './ExtraWidgetFour';
import { ExtraWidgetFive } from './ExtraWidgetFive';
import { ExtraWidgetSix } from './ExtraWidgetSix';
import { ExtraWidgetSeven } from './ExtraWidgetSeven';
import { ExtraWidgetEight } from './ExtraWidgetEight';

export const OverviewGrid: React.FC = () => {
  return (
    <div className="space-y-4 py-0 my-0">
      {/* الشبكة الأصلية 3x3 */}
      <div className="grid grid-cols-3 gap-4">
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
          chartType="line" 
        />

        <StatisticsCard 
          title="نسبة" 
          value="75" 
          unit="مئوية" 
          description="هذا النص مثال للشكل البياني" 
          chartType="simple"
        />

        <AlertsCard />

        {/* الصف الثالث */}
        <div className="col-span-2">
          <ProjectSummaryCard />
        </div>
        <ExtraWidgetOne />
      </div>

      {/* الصفوف الإضافية */}
      <div className="grid grid-cols-2 gap-4">
        <ExtraWidgetTwo />
        <ExtraWidgetThree />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ExtraWidgetFour />
        <ExtraWidgetFive />
        <ExtraWidgetSix />
      </div>

      {/* الصف الرابع الجديد */}
      <div className="grid grid-cols-2 gap-4">
        <ExtraWidgetSeven />
        <ExtraWidgetEight />
      </div>
    </div>
  );
};
