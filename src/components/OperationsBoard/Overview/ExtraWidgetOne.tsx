
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetOne: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="md"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية إضافية 1
        </h3>
      }
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold text-purple-600 mb-1">45</div>
        <div className="text-xs text-gray-600 text-center">مؤشر الأداء</div>
      </div>
    </BaseCard>
  );
};
