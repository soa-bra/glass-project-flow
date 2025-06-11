
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ExtraWidgetTwo: React.FC = () => {
  return (
    <GenericCard className="h-full">
      <h3 className="text-lg font-arabic font-bold mb-4 text-right text-gray-800">إحصائية إضافية 2</h3>
      
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
        <div className="text-sm text-gray-600 text-center">معدل الإنجاز</div>
      </div>
    </GenericCard>
  );
};
