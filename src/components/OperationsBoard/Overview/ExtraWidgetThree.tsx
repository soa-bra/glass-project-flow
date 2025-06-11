
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ExtraWidgetThree: React.FC = () => {
  return (
    <GenericCard className="h-12">
      <h3 className="text-sm font-arabic font-bold mb-1 text-right text-gray-800">إحصائية 3</h3>
      
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-purple-600">124</div>
        <div className="text-xs text-gray-600">إجمالي المهام</div>
      </div>
    </GenericCard>
  );
};
