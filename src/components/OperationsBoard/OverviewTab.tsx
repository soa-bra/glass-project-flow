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
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }
  return <div className="flex flex-col h-full gap-4">
      {/* الخط الزمني في الأعلى */}
      <div className="w-full">
        <TimelineSection timeline={data.timeline} />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex gap-4 min-h-0 my-[28px] py-[239px]">
        {/* البطاقات الأربع الأساسية */}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 min-h-0">
          <BudgetWidget budget={data.widgets.budget} />
          <ContractsWidget contracts={data.widgets.contracts} />
          <HRWidget hr={data.widgets.hr} />
          <SatisfactionWidget satisfaction={data.widgets.satisfaction} />
        </div>

        {/* العمود الجانبي */}
        <div className="w-64 flex flex-col gap-4 min-h-0">
          <div className="flex-1">
            <ExtraWidgetOne />
          </div>
          <div className="flex-1">
            <ExtraWidgetTwo />
          </div>
        </div>
      </div>

      {/* الصف السفلي */}
      <div className="w-full grid grid-cols-3 gap-4">
        <ExtraWidgetThree />
        <ExtraWidgetFour />
        <ExtraWidgetFive />
      </div>
    </div>;
};