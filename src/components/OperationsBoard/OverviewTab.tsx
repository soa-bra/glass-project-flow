
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
      {/* شبكة اللوحة الرئيسية */}
      <section className="
        management-grid
        grid grid-cols-12 grid-rows-12 gap-4 
        h-full w-full p-6
        lg:grid-cols-8 lg:grid-rows-18
        sm:flex sm:flex-col sm:gap-4
      ">
        
        {/* 1. بطاقة الأحداث القادمة - عرض كامل في الأعلى */}
        <TimelineWidget 
          timeline={data.timeline} 
          className="col-span-12 row-span-3 lg:col-span-8 lg:row-span-4" 
        />

        {/* 2. بطاقة المالية - لون صلب */}
        <BudgetWidget 
          budget={data.widgets.budget} 
          className="col-span-6 row-span-4 lg:col-span-4 lg:row-span-5" 
        />

        {/* 3. بطاقات ذكية مقترحة */}
        <ContractsWidget 
          contracts={data.widgets.contracts} 
          className="col-span-3 row-span-2 lg:col-span-2 lg:row-span-3" 
        />

        <HRWidget 
          hr={data.widgets.hr} 
          className="col-span-3 row-span-2 lg:col-span-2 lg:row-span-3" 
        />

        <SatisfactionWidget 
          satisfaction={data.widgets.satisfaction} 
          className="col-span-3 row-span-3 lg:col-span-2 lg:row-span-4" 
        />

        <AISuggestedWidget 
          type="kpi"
          title="مؤشرات الأداء"
          className="col-span-3 row-span-2 lg:col-span-2 lg:row-span-2" 
        />

        {/* بطاقات إضافية مقترحة */}
        <AISuggestedWidget 
          type="reports"
          title="التقارير السريعة"
          className="col-span-6 row-span-2 lg:col-span-4 lg:row-span-2" 
        />

      </section>
    </div>
  );
};
