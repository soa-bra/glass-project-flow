
import React from 'react';
import { OverviewLayout } from './Overview/OverviewLayout';
import { mockOverviewData, OverviewData } from './Overview/OverviewData';

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

/**
 * تبويب النظرة العامة - يعرض الإحصائيات الأساسية للمشاريع
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  console.log('OverviewTab received:', { data, loading });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        جارٍ التحميل...
      </div>
    );
  }

  // استخدام البيانات التجريبية إذا لم تكن البيانات متوفرة
  const finalData = data || mockOverviewData;
  
  console.log('OverviewTab using finalData:', finalData);

  return <OverviewLayout data={finalData} />;
};
