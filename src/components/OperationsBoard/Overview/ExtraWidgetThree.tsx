
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetThree: React.FC = () => {
  return (
    <BaseCard 
      size="sm"
      neonRing="info"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية 3
        </h3>
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-purple-600">124</div>
        <div className="text-xs text-gray-600">إجمالي المهام</div>
      </div>
    </BaseCard>
  );
};
