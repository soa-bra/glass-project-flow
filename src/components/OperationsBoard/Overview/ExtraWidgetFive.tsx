
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetFive: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      neonRing="error"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          تحذير
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-red-600">12</div>
        <div className="text-xs text-gray-600">المهام المتأخرة</div>
      </div>
    </BaseCard>
  );
};
