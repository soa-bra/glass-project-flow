
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetFour: React.FC = () => {
  return (
    <BaseCard 
      size="sm"
      neonRing="success"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية 4
        </h3>
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-orange-600">67</div>
        <div className="text-xs text-gray-600">المهام المكتملة</div>
      </div>
    </BaseCard>
  );
};
