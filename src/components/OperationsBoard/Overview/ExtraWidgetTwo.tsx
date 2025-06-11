
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const ExtraWidgetTwo: React.FC = () => {
  return (
    <BaseCard 
      variant="gradient" 
      color="success" 
      size="md"
      header={
        <h3 className="text-sm font-arabic font-bold text-white">
          إحصائية إضافية 2
        </h3>
      }
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold text-white mb-1">78%</div>
        <div className="text-xs text-white/90 text-center">معدل الإنجاز</div>
      </div>
    </BaseCard>
  );
};
