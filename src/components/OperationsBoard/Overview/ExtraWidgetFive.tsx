
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ExtraWidgetFive: React.FC = () => {
  return (
    <GenericCard className="h-24">
      <h3 className="text-md font-arabic font-bold mb-2 text-right text-gray-800">إحصائية 5</h3>
      
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-red-600">12</div>
        <div className="text-xs text-gray-600">المهام المتأخرة</div>
      </div>
    </GenericCard>
  );
};
