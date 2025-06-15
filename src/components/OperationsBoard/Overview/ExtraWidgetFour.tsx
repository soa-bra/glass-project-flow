
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetFour: React.FC = () => {
  return (
    <BaseCard 
      size="sm"
      variant="glass"
      adminBoardStyle
      header={
        <h3 className="text-sm font-arabic font-bold text-[#23272f] w-full text-right leading-tight mt-1">
          إحصائية 4
        </h3>
      }
      className="h-[180px] px-6 py-6 flex flex-col justify-between"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-orange-600">67</div>
        <div className="text-xs text-gray-600">المهام المكتملة</div>
      </div>
    </BaseCard>
  );
};
