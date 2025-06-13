
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
import { BaseCard } from '@/components/ui/BaseCard';

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
    <div className="h-full overflow-y-auto px-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        
        {/* الصف الأول - البطاقة الزمنية تأخذ العرض الكامل */}
        <div className="lg:col-span-3">
          <TimelineSection timeline={data.timeline} />
        </div>

        {/* الصف الثاني - 3 بطاقات متوسطة */}
        <div className="lg:col-span-1">
          <BudgetWidget budget={data.widgets.budget} />
        </div>
        <div className="lg:col-span-1">
          <ContractsWidget contracts={data.widgets.contracts} />
        </div>
        <div className="lg:col-span-1">
          <HRWidget hr={data.widgets.hr} />
        </div>

        {/* الصف الثالث - بطاقة الرضا تأخذ العرض الكامل */}
        <div className="lg:col-span-3">
          <SatisfactionWidget satisfaction={data.widgets.satisfaction} />
        </div>

        {/* الصف الرابع - 3 بطاقات إضافية */}
        <div className="lg:col-span-1">
          <ExtraWidgetOne />
        </div>
        <div className="lg:col-span-1">
          <ExtraWidgetTwo />
        </div>
        <div className="lg:col-span-1">
          <ExtraWidgetThree />
        </div>

        {/* الصف الخامس - بطاقتان */}
        <div className="lg:col-span-1">
          <ExtraWidgetFour />
        </div>
        <div className="lg:col-span-2">
          <ExtraWidgetFive />
        </div>

        {/* الصف السادس - بطاقة إضافية */}
        <div className="lg:col-span-3">
          <BaseCard 
            size="sm"
            variant="glass"
            header={
              <h3 className="text-lg font-arabic font-bold text-gray-800 text-center">
                إحصائيات إضافية
              </h3>
            }
            className="h-[180px] flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-gray-600 text-sm">المزيد من البيانات والتحليلات قريباً</p>
            </div>
          </BaseCard>
        </div>

      </div>
    </div>
  );
};
