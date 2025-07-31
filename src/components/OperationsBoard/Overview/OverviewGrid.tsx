
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
    <div className="grid grid-cols-4 grid-rows-4 gap-[10px] py-0 my-0 h-[calc(60vh)] min-h-0 overflow-hidden">
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

      {/* الصف الرابع - الكاردات الذكية */}
      <BaseCard variant="glass" size="sm" className="p-4 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold">ذكاء اصطناعي</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">94%</div>
          <div className="text-xs text-muted-foreground">دقة التنبؤات</div>
        </div>
      </BaseCard>

      <BaseCard variant="glass" size="sm" className="p-4 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-6 w-6 text-secondary" />
          <span className="text-sm font-semibold">تحليل ذكي</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">87%</div>
          <div className="text-xs text-muted-foreground">كفاءة العمليات</div>
        </div>
      </BaseCard>

      <BaseCard variant="glass" size="sm" className="p-4 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-6 w-6 text-accent" />
          <span className="text-sm font-semibold">أتمتة ذكية</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">91%</div>
          <div className="text-xs text-muted-foreground">توفير الوقت</div>
        </div>
      </BaseCard>

      <BaseCard variant="glass" size="sm" className="p-4 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold">معالجة ذكية</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">98%</div>
          <div className="text-xs text-muted-foreground">سرعة المعالجة</div>
        </div>
      </BaseCard>

    </div>
  );
};
