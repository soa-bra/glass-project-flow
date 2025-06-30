
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetSix: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      neonRing="warning"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية 6
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-yellow-600">89</div>
        <div className="text-xs text-gray-600">المهام الجديدة</div>
      </div>
    </BaseCard>
  );
};
