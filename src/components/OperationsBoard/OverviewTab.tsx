
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
      {/* شبكة اللوحة الرئيسية وفقاً للتخطيط في الصورة */}
      <section className="
        grid grid-cols-12 grid-rows-12 gap-4 
        h-full w-full p-6
      ">
        
        {/* البطاقة الأولى - خط الزمن - عرض كامل في الأعلى (المنطقة رقم 1) */}
        <TimelineWidget 
          timeline={data.timeline} 
          className="col-span-12 row-span-3" 
        />

        {/* الصف الثاني - البطاقات الصغيرة على اليسار والبطاقة الكبيرة على اليمين */}
        {/* البطاقتان الصغيرتان في العمود الأيسر */}
        <ContractsWidget 
          contracts={data.widgets.contracts} 
          className="col-span-3 row-span-2" 
        />

        <HRWidget 
          hr={data.widgets.hr} 
          className="col-span-3 row-span-2" 
        />

        {/* البطاقة الكبيرة على اليمين (المنطقة رقم 2) */}
        <BudgetWidget 
          budget={data.widgets.budget} 
          className="col-span-6 row-span-4" 
        />

        {/* الصف الثالث - بطاقة أطول في العمود الأيسر */}
        <SatisfactionWidget 
          satisfaction={data.widgets.satisfaction} 
          className="col-span-3 row-span-3" 
        />

        {/* الصف الرابع - أربع بطاقات في الأسفل */}
        <AISuggestedWidget 
          type="kpi"
          title="مؤشرات الأداء"
          className="col-span-3 row-span-2" 
        />

        <AISuggestedWidget 
          type="reports"
          title="التقارير السريعة"
          className="col-span-6 row-span-2" 
        />

        <AISuggestedWidget 
          type="alerts"
          title="التنبيهات"
          className="col-span-3 row-span-2" 
        />

      </section>
    </div>
  );
};
