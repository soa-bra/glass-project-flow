
import React from 'react';

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
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-gray-500 font-arabic">
        <p className="text-lg">تم حذف جميع البطاقات</p>
        <p className="text-sm mt-2">التبويب فارغ الآن</p>
      </div>
    </div>
  );
};
