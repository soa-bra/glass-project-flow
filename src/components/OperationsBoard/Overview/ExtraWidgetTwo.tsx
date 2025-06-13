
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetTwo: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="md"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية إضافية 2
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-green-600 mb-1">78%</div>
        <div className="text-xs text-gray-600 text-center">معدل الإنجاز</div>
      </div>
    </BaseCard>
  );
};
