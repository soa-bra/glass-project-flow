
import React from 'react';
import { TimelineWidget } from './Overview/TimelineWidget';
import { BudgetWidget } from './Overview/BudgetWidget';
import { HRWidget } from './Overview/HRWidget';
import { SatisfactionWidget } from './Overview/SatisfactionWidget';
import { ContractsWidget } from './Overview/ContractsWidget';
import { AISuggestedWidget } from './Overview/AISuggestedWidget';

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
    <div className="h-full overflow-auto">
      {/* الشبكة الجديدة للوحة مع صفوف متعددة */}
      <section className="
        grid grid-cols-12 gap-2.5 
        h-full w-full p-2.5
        auto-rows-min
        max-h-full
      ">
        
        {/* الصف الأول - خط الزمن عرض كامل */}
        <TimelineWidget 
          timeline={data.timeline} 
          className="col-span-12 h-[180px]" 
        />

        {/* الصف الثاني - العقود والميزانية والموارد البشرية */}
        <ContractsWidget 
          contracts={data.widgets.contracts} 
          className="col-span-3 h-[220px]" 
        />

        <BudgetWidget 
          budget={data.widgets.budget} 
          className="col-span-6 h-[220px]" 
        />

        <HRWidget 
          hr={data.widgets.hr} 
          className="col-span-3 h-[220px]" 
        />

        {/* الصف الثالث - البطاقات الذكية */}
        <SatisfactionWidget 
          satisfaction={data.widgets.satisfaction} 
          className="col-span-4 h-[180px]" 
        />

        <AISuggestedWidget 
          type="kpi"
          title="مؤشرات الأداء الرئيسية"
          className="col-span-4 h-[180px]" 
        />

        <AISuggestedWidget 
          type="reports"
          title="التقارير التنفيذية"
          className="col-span-4 h-[180px]" 
        />

        {/* الصف الرابع الجديد - بطاقات إضافية */}
        <AISuggestedWidget 
          type="alerts"
          title="التنبيهات والإشعارات"
          className="col-span-3 h-[160px]" 
        />

        <AISuggestedWidget 
          type="analytics"
          title="التحليلات المتقدمة"
          className="col-span-3 h-[160px]" 
        />

        <AISuggestedWidget 
          type="team"
          title="إدارة الفريق"
          className="col-span-3 h-[160px]" 
        />

        <AISuggestedWidget 
          type="goals"
          title="الأهداف والإنجازات"
          className="col-span-3 h-[160px]" 
        />

      </section>
    </div>
  );
};
