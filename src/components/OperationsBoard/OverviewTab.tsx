
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
      {/* الشبكة الجديدة للوحة */}
      <section className="
        grid grid-cols-12 gap-6 
        h-full w-full p-6
        auto-rows-min
      ">
        
        {/* 1. خط الزمن - عرض كامل في الأعلى */}
        <TimelineWidget 
          timeline={data.timeline} 
          className="col-span-12 h-[220px]" 
        />

        {/* الصف الثاني - بطاقة العقود على اليسار */}
        <ContractsWidget 
          contracts={data.widgets.contracts} 
          className="col-span-3 h-[280px]" 
        />

        {/* بطاقة الميزانية في المركز - المساحة الأكبر */}
        <BudgetWidget 
          budget={data.widgets.budget} 
          className="col-span-6 h-[280px]" 
        />

        {/* بطاقة الموارد البشرية على اليمين */}
        <HRWidget 
          hr={data.widgets.hr} 
          className="col-span-3 h-[280px]" 
        />

        {/* الصف الثالث - البطاقات الإضافية */}
        <SatisfactionWidget 
          satisfaction={data.widgets.satisfaction} 
          className="col-span-4 h-[220px]" 
        />

        <AISuggestedWidget 
          type="kpi"
          title="مؤشرات الأداء الرئيسية"
          className="col-span-4 h-[220px]" 
        />

        <AISuggestedWidget 
          type="reports"
          title="التقارير التنفيذية"
          className="col-span-4 h-[220px]" 
        />

      </section>
    </div>
  );
};
