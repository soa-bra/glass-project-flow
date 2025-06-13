
import React from 'react';
import { TimelineSection } from './Overview/TimelineSection';
import { BudgetWidget } from './Overview/BudgetWidget';
import { ContractsWidget } from './Overview/ContractsWidget';
import { HRWidget } from './Overview/HRWidget';
import { SatisfactionWidget } from './Overview/SatisfactionWidget';

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
      {/* التخطيط الجديد للبطاقات */}
      <div className="grid grid-cols-3 gap-4 h-full p-4">
        {/* البطاقة الأولى - الأحداث القادمة - عرض كامل في الصف الأول */}
        <div className="col-span-3">
          <TimelineSection timeline={data.timeline} />
        </div>

        {/* الصف الثاني */}
        <div className="grid grid-cols-2 gap-4">
          {/* بطاقة فرعية صغيرة */}
          <ContractsWidget contracts={data.widgets.contracts} />
          
          {/* بطاقة فرعية صغيرة */}
          <HRWidget hr={data.widgets.hr} />
        </div>

        {/* البطاقة الثانية - المالية - لون مختلف */}
        <div className="col-span-2">
          <BudgetWidget budget={data.widgets.budget} />
        </div>

        {/* الصف الثالث */}
        <div className="grid grid-cols-2 gap-4">
          {/* بطاقة فرعية */}
          <SatisfactionWidget satisfaction={data.widgets.satisfaction} />
          
          {/* بطاقة فرعية إضافية */}
          <div className="glass-enhanced rounded-[40px] p-4 flex items-center justify-center">
            <div className="text-center text-gray-500 font-arabic">
              <p className="text-sm">بطاقة إضافية</p>
              <p className="text-xs mt-1">محتوى قابل للتخصيص</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-4">
          {/* بطاقة إضافية */}
          <div className="glass-enhanced rounded-[40px] p-4 flex items-center justify-center">
            <div className="text-center text-gray-500 font-arabic">
              <p className="text-sm">مؤشرات الأداء</p>
              <p className="text-xs mt-1">KPIs</p>
            </div>
          </div>
          
          {/* بطاقة إضافية */}
          <div className="glass-enhanced rounded-[40px] p-4 flex items-center justify-center">
            <div className="text-center text-gray-500 font-arabic">
              <p className="text-sm">التقارير السريعة</p>
              <p className="text-xs mt-1">Quick Reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
