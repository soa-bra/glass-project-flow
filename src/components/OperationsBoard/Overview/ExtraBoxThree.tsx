
import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export const ExtraBoxThree: React.FC = () => {
  return (
    <BaseBox 
      size="sm"
      variant="glass"
      neonRing="info"
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          إحصائية 3
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-purple-600">124</div>
        <div className="text-xs text-gray-600">إجمالي المهام</div>
      </div>
    </BaseBox>
  );
};
