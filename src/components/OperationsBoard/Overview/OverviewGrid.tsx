
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
    <div className="grid grid-cols-3 gap-4 py-0 my-0 h-[calc(100vh-280px)] items-end">
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
      <div className="col-span-2 h-[180px]">
        <ProjectSummaryCard />
      </div>

      <StatisticsCard 
        title="معدل" 
        value="85" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      {/* الصف الرابع */}
      <StatisticsCard 
        title="تحليلات" 
        value="124" 
        unit="تقرير" 
        description="هذا النص مثال للشكل البياني" 
        chartType="bar"
      />

      <StatisticsCard 
        title="عمليات" 
        value="67" 
        unit="مهمة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="line"
      />

      <StatisticsCard 
        title="إنتاجية" 
        value="91" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />
    </div>
  );
};
