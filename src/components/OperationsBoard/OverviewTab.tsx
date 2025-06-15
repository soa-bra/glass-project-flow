
import React from 'react';
import { TimelineWidget } from './Overview/TimelineWidget';
import { BudgetWidget } from './Overview/BudgetWidget';
import { HRWidget } from './Overview/HRWidget';
import { SatisfactionWidget } from './Overview/SatisfactionWidget';
import { ContractsWidget } from './Overview/ContractsWidget';
import { LeadScoreWidget } from './Overview/LeadScoreWidget';
import { CircularProgressWidget } from './Overview/CircularProgressWidget';
import { StatCard } from './Overview/StatCard';
import { SimpleChartWidget } from './Overview/SimpleChartWidget';
import { Users, Clock, Star, TrendingUp } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface WidgetsData {
  budget: {
    total: number;
    spent: number;
  };
  contracts: {
    signed: number;
    expired: number;
  };
  hr: {
    members: number;
    vacancies: number;
    onLeave: number;
  };
  satisfaction: number;
}

interface OverviewData {
  timeline: TimelineEvent[];
  widgets: WidgetsData;
}

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  // بيانات وهمية للمخططات الجديدة
  const chartData = [
    { label: 'المبيعات', value: 85, color: '#3B82F6' },
    { label: 'التسويق', value: 72, color: '#10B981' },
    { label: 'الدعم', value: 68, color: '#F59E0B' },
    { label: 'التطوير', value: 91, color: '#8B5CF6' }
  ];

  return (
    <div className="h-full overflow-auto px-1">
      <section className="
        grid grid-cols-12 gap-4 
        h-full w-full pt-2.5 pb-7
        auto-rows-min
        max-h-full
      ">
        {/* الصف الأول - إحصائيات سريعة */}
        <StatCard
          title="العملاء النشطون" 
          value={data.widgets.hr.members}
          icon={Users}
          color="#3B82F6"
          className="col-span-3 h-[140px]"
        />
        <StatCard
          title="المهام المكتملة" 
          value="124"
          icon={Clock}
          color="#10B981"
          className="col-span-3 h-[140px]"
        />
        <StatCard
          title="التقييم العام" 
          value={`${data.widgets.satisfaction}%`}
          icon={Star}
          color="#F59E0B"
          className="col-span-3 h-[140px]"
        />
        <StatCard
          title="النمو الشهري" 
          value="+12%"
          icon={TrendingUp}
          color="#EF4444"
          className="col-span-3 h-[140px]"
        />

        {/* الصف الثاني - الخط الزمني */}
        <TimelineWidget
          timeline={data.timeline}
          className="col-span-12 h-[220px]"
        />

        {/* الصف الثالث - البيانات الرئيسية */}
        <LeadScoreWidget className="col-span-4 h-[280px]" />
        
        <SimpleChartWidget
          title="أداء الأقسام"
          data={chartData}
          className="col-span-4 h-[280px]"
        />
        
        <BudgetWidget
          budget={data.widgets.budget}
          className="col-span-4 h-[280px]"
        />

        {/* الصف الرابع - مؤشرات دائرية وإحصائيات */}
        <CircularProgressWidget
          title="إنجاز المشاريع"
          percentage={75}
          color="#3B82F6"
          className="col-span-3 h-[200px]"
        />
        
        <CircularProgressWidget
          title="رضا العملاء"
          percentage={data.widgets.satisfaction}
          color="#10B981"
          className="col-span-3 h-[200px]"
        />
        
        <HRWidget
          hr={data.widgets.hr}
          className="col-span-3 h-[200px]"
        />
        
        <ContractsWidget
          contracts={data.widgets.contracts}
          className="col-span-3 h-[200px]"
        />
      </section>
    </div>
  );
};
