
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ExtraWidgetOne: React.FC = () => {
  return (
    <GenericCard className="h-32">
      <h3 className="text-sm font-arabic font-bold mb-2 text-right text-gray-800">إحصائية إضافية 1</h3>
      
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold text-blue-600 mb-1">45</div>
        <div className="text-xs text-gray-600 text-center">مؤشر الأداء</div>
      </div>
    </GenericCard>
  );
};
