
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetSeven: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      neonRing="info"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية 7
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-indigo-600">156</div>
        <div className="text-xs text-gray-600">العمليات المكتملة</div>
      </div>
    </BaseCard>
  );
};
