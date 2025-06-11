
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetOne: React.FC = () => {
  return (
    <BaseCard 
      variant="gradient" 
      color="pinkblue" 
      size="md"
      header={
        <h3 className="text-sm font-arabic font-bold text-white">
          إحصائية إضافية 1
        </h3>
      }
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold text-white mb-1">45</div>
        <div className="text-xs text-white/90 text-center">مؤشر الأداء</div>
      </div>
    </BaseCard>
  );
};
