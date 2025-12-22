
import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export const ExtraWidgetOne: React.FC = () => {
  return (
    <BaseBox 
      variant="glass" 
      size="md"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية إضافية 1
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-purple-600 mb-1">45</div>
        <div className="text-xs text-gray-600 text-center">مؤشر الأداء</div>
      </div>
    </BaseBox>
  );
};
