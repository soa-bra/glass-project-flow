
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetFive: React.FC = () => {
  return (
    <BaseCard 
      variant="flat" 
      color="crimson" 
      size="sm"
      header={
        <h3 className="text-sm font-arabic font-bold text-white">
          تحذير
        </h3>
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-white">12</div>
        <div className="text-xs text-white/90">المهام المتأخرة</div>
      </div>
    </BaseCard>
  );
};
