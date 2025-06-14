
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
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto font-arabic">
      {/* Responsive grid, improved for all devices */}
      <section className="
        grid grid-cols-12 gap-3
        h-full w-full px-[6px] py-2.5 pb-[25px]
        auto-rows-min
        max-h-full
      ">
        {/* الصف الأول */}
        <TimelineWidget
          timeline={data.timeline}
          className="col-span-12 h-[235px] mb-1"
        />

        {/* الصف الثاني - العقود والميزانية فقط */}
        <ContractsWidget
          contracts={data.widgets.contracts}
          className="col-span-12 md:col-span-4 h-[225px]"
        />
        <BudgetWidget
          budget={data.widgets.budget}
          className="col-span-12 md:col-span-8 h-[225px]"
        />

        {/* الصف الثالث */}
        <HRWidget
          hr={data.widgets.hr}
          className="col-span-12 sm:col-span-6 md:col-span-4 h-[210px]"
        />
        <SatisfactionWidget
          satisfaction={data.widgets.satisfaction}
          className="col-span-12 sm:col-span-6 md:col-span-4 h-[210px]"
        />
        <AISuggestedWidget
          type="kpi"
          title="مؤشرات الأداء الرئيسية"
          className="col-span-12 md:col-span-4 h-[210px]"
        />

        {/* الصف الرابع */}
        <AISuggestedWidget
          type="reports"
          title="التقارير التنفيذية"
          className="col-span-12 sm:col-span-6 md:col-span-4 h-[210px]"
        />
        <AISuggestedWidget
          type="goals"
          title="الأهداف والإنجازات"
          className="col-span-12 sm:col-span-6 md:col-span-4 h-[210px]"
        />
        <AISuggestedWidget
          type="team"
          title="إدارة الفريق"
          className="col-span-12 md:col-span-4 h-[210px]"
        />
      </section>
    </div>
  );
};
