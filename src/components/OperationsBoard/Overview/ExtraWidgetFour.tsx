
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ExtraWidgetFour: React.FC = () => {
  return (
    <GenericCard className="h-12">
      <h3 className="text-sm font-arabic font-bold mb-1 text-right text-gray-800">إحصائية 4</h3>
      
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-orange-600">67</div>
        <div className="text-xs text-gray-600">المهام المكتملة</div>
      </div>
    </GenericCard>
  );
};
