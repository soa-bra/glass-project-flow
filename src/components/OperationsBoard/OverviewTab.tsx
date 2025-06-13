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
      {/* شبكة اللوحة الجديدة */}
      <section className="
        grid grid-cols-12 gap-4 
        h-full w-full p-6
        auto-rows-min
      ">
        
        {/* 1. بطاقة الأحداث القادمة - عرض كامل في الأعلى */}
        <TimelineWidget 
          timeline={data.timeline} 
          className="col-span-12 h-[200px]" 
        />

        {/* الصف الثاني - بطاقة العقود على اليسار */}
        <ContractsWidget 
          contracts={data.widgets.contracts} 
          className="col-span-3 h-[250px]" 
        />

        {/* بطاقة الميزانية في الوسط */}
        <BudgetWidget 
          budget={data.widgets.budget} 
          className="col-span-6 h-[250px]" 
        />

        {/* بطاقة الموارد البشرية على اليمين */}
        <HRWidget 
          hr={data.widgets.hr} 
          className="col-span-3 h-[250px]" 
        />

        {/* الصف الثالث - بطاقات إضافية */}
        <SatisfactionWidget 
          satisfaction={data.widgets.satisfaction} 
          className="col-span-4 h-[200px]" 
        />

        <AISuggestedWidget 
          type="kpi"
          title="مؤشرات الأداء"
          className="col-span-4 h-[200px]" 
        />

        <AISuggestedWidget 
          type="reports"
          title="التقارير السريعة"
          className="col-span-4 h-[200px]" 
        />

      </section>
    </div>
  );
};
