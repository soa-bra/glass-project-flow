
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetOne: React.FC = () => {
  return (
    <BaseCard 
      variant="glass"
      size="sm"
      adminBoardStyle
      header={
        <h3 className="text-sm font-arabic font-bold text-[#23272f] w-full text-right leading-tight mt-1">
          إحصائية إضافية 1
        </h3>
      }
      className="h-[180px] px-6 py-6 flex flex-col justify-between"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-purple-600">45</div>
        <div className="text-xs text-gray-600">مؤشر الأداء</div>
      </div>
    </BaseCard>
  );
};
