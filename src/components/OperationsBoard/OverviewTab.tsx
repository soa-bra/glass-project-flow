
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
import { NewsFeedWidget } from './Overview/NewsFeedWidget';
import { QuickActionsWidget } from './Overview/QuickActionsWidget';
import { ProjectProgressWidget } from './Overview/ProjectProgressWidget';
import { KPIWidget } from './Overview/KPIWidget';
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

  return (
    <div className="h-full overflow-auto px-1">
      <section className="
        grid grid-cols-12 gap-4 
        h-full w-full pt-2.5 pb-7
        auto-rows-min
        max-h-full
      ">
        {/* الصف الأول - الإحصائيات السريعة */}
        <StatCard
          title="إجمالي المشاريع" 
          value="24"
          icon={Users}
          color="#3B82F6"
          className="col-span-3 h-[120px]"
        />
        <StatCard
          title="المشاريع النشطة" 
          value="18"
          icon={Clock}
          color="#10B981"
          className="col-span-3 h-[120px]"
        />
        <StatCard
          title="المشاريع المكتملة" 
          value="6"
          icon={Star}
          color="#F59E0B"
          className="col-span-3 h-[120px]"
        />
        <StatCard
          title="الميزانية المتاحة" 
          value="2.4M ر.س"
          icon={TrendingUp}
          color="#8B5CF6"
          className="col-span-3 h-[120px]"
        />

        {/* الصف الثاني - المؤشرات الأساسية والأخبار */}
        <KPIWidget className="col-span-4 h-[240px]" />
        <NewsFeedWidget className="col-span-5 h-[240px]" />
        <QuickActionsWidget className="col-span-3 h-[240px]" />

        {/* الصف الثالث - الخط الزمني */}
        <TimelineWidget
          timeline={data.timeline}
          className="col-span-12 h-[180px]"
        />

        {/* الصف الرابع - تقدم المشاريع والمؤشرات */}
        <ProjectProgressWidget className="col-span-6 h-[220px]" />
        <CircularProgressWidget
          title="معدل الإنجاز"
          percentage={78}
          color="#10B981"
          className="col-span-3 h-[220px]"
        />
        <CircularProgressWidget
          title="رضا العملاء"
          percentage={data.widgets.satisfaction}
          color="#3B82F6"
          className="col-span-3 h-[220px]"
        />

        {/* الصف الخامس - البيانات التفصيلية */}
        <BudgetWidget
          budget={data.widgets.budget}
          className="col-span-4 h-[200px]"
        />
        <HRWidget
          hr={data.widgets.hr}
          className="col-span-4 h-[200px]"
        />
        <ContractsWidget
          contracts={data.widgets.contracts}
          className="col-span-4 h-[200px]"
        />
      </section>
    </div>
  );
};
