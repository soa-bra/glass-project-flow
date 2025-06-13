
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

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* الصف الأول - الخط الزمني */}
      <div className="h-[120px]">
        <TimelineSection timeline={data.timeline} />
      </div>

      {/* الصف الثاني - بطاقات الميزانية والعقود */}
      <div className="h-[120px] grid grid-cols-2 gap-4">
        <BudgetWidget budget={data.widgets.budget} />
        <ContractsWidget contracts={data.widgets.contracts} />
      </div>

      {/* الصف الثالث - بطاقات الموارد البشرية ورضا العملاء */}
      <div className="h-[120px] grid grid-cols-2 gap-4">
        <HRWidget hr={data.widgets.hr} />
        <SatisfactionWidget satisfaction={data.widgets.satisfaction} />
      </div>

      {/* الصف الرابع - البطاقات الإضافية 1 و 2 */}
      <div className="h-[120px] grid grid-cols-2 gap-4">
        <ExtraWidgetOne />
        <ExtraWidgetTwo />
      </div>

      {/* الصف الخامس - البطاقة الإضافية 3 */}
      <div className="h-[120px]">
        <ExtraWidgetThree />
      </div>

      {/* الصف السادس - البطاقات الإضافية 4 و 5 */}
      <div className="h-[120px] grid grid-cols-2 gap-4">
        <ExtraWidgetFour />
        <ExtraWidgetFive />
      </div>
    </div>
  );
};
