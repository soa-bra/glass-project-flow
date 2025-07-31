
import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { AlertsCard } from './AlertsCard';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Layers, Cpu } from 'lucide-react';

export const OverviewGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-[10px] py-0 my-0 h-[calc(50vh)] min-h-0 overflow-hidden">
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

      <StatisticsCard 
        title="بيانات" 
        value="03" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="line" 
      />

      {/* الصف الثاني */}
      <StatisticsCard 
        title="نسبة" 
        value="75" 
        unit="مئوية" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      <AlertsCard />

      <StatisticsCard 
        title="معدل" 
        value="85" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      <StatisticsCard 
        title="تقييم" 
        value="92" 
        unit="نقطة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      {/* الصف الثالث */}
      <div className="col-span-2 h-full min-h-0">
        <ProjectSummaryCard />
      </div>

      <StatisticsCard 
        title="أداء" 
        value="78" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      <StatisticsCard 
        title="جودة" 
        value="96" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

    </div>
  );
};
