
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
  return <div className="h-full overflow-auto px-0 py-0 my-0">
      {/* الشبكة الجديدة للوحة مع صفوف متعددة - ارتفاعات متساوية */}
      <section className="grid grid-cols-12 gap-2.5 h-full w-full pb-[25px] auto-rows-min max-h-full px-[9px] py-[9px]">
        
        {/* الصف الأول - خط الزمن عرض كامل */}
        <TimelineWidget timeline={data.timeline} className="col-span-12 h-[220px]" />

        {/* الصف الثاني - العقود والميزانية فقط */}
        <ContractsWidget contracts={data.widgets.contracts} className="col-span-4 h-[260px]" />

        <BudgetWidget budget={data.widgets.budget} className="col-span-8 h-[260px]" />

        {/* الصف الثالث - الموارد البشرية والرضا ومؤشرات الأداء (ممتدة لصفين) */}
        <HRWidget hr={data.widgets.hr} className="col-span-4 h-[220px]" />

        <SatisfactionWidget satisfaction={data.widgets.satisfaction} className="col-span-4 h-[220px]" />

        <AISuggestedWidget type="kpi" title="مؤشرات الأداء الرئيسية" className="col-span-4 row-span-2 h-[462px]" />

        {/* الصف الرابع - التقارير وأداء الفريق */}
        <AISuggestedWidget type="reports" title="التقارير التنفيذية" className="col-span-4 h-[220px]" />

        <AISuggestedWidget type="team" title="أداء الفريق" className="col-span-4 h-[220px]" />

      </section>
    </div>;
};
