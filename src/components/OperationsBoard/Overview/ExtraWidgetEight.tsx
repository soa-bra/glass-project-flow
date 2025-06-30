
import React from 'React';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetEight: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="sm"
      neonRing="success"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية 8
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-emerald-600">234</div>
        <div className="text-xs text-gray-600">المعاملات الناجحة</div>  
      </div>
    </BaseCard>
  );
};
