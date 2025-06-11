import React from 'react';
import { TimelineSection } from './Overview/TimelineSection';
import { BudgetWidget } from './Overview/BudgetWidget';
import { ContractsWidget } from './Overview/ContractsWidget';
import { HRWidget } from './Overview/HRWidget';
import { SatisfactionWidget } from './Overview/SatisfactionWidget';
import { ExtraWidgetOne } from './Overview/ExtraWidgetOne';
import { ExtraWidgetTwo } from './Overview/ExtraWidgetTwo';
import { ExtraWidgetThree } from './Overview/ExtraWidgetThree';
import { ExtraWidgetFour } from './Overview/ExtraWidgetFour';
import { ExtraWidgetFive } from './Overview/ExtraWidgetFive';
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
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }
  return <div className="flex flex-col h-full gap-2">
      {/* الخط الزمني الأفقي في الأعلى - كامل العرض */}
      <div className="w-full">
        <TimelineSection timeline={data.timeline} />
      </div>

      {/* التخطيط الجديد للبطاقات */}
      <div className="flex-1 flex gap-2 my-[155px] py-[179px]">
        {/* البطاقات الأربع الأساسية في الوسط */}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 px-0 mx-0 py-0 my-[66px]">
          <BudgetWidget budget={data.widgets.budget} />
          <ContractsWidget contracts={data.widgets.contracts} />
          <HRWidget hr={data.widgets.hr} />
          <SatisfactionWidget satisfaction={data.widgets.satisfaction} />
        </div>

        {/* العمود الجديد - بطاقتان بالطول */}
        <div className="w-64 flex flex-col gap-2 my-[65px]">
          <ExtraWidgetOne />
          <ExtraWidgetTwo />
        </div>
      </div>

      {/* الصف الجديد - ثلاث بطاقات بالعرض */}
      <div className="w-full grid grid-cols-3 gap-2">
        <ExtraWidgetThree />
        <ExtraWidgetFour />
        <ExtraWidgetFive />
      </div>
    </div>;
};