import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export const ExtraBoxThree: React.FC = () => {
  return (
    <BaseBox 
      size="sm"
      variant="standard"
      header={
        <h3 className="text-sm font-arabic font-bold text-[hsl(var(--ink))]">إحصائية 3</h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-[hsl(var(--ink))]">124</div>
        <div className="text-xs text-[hsl(var(--ink-60))]">إجمالي المهام</div>
      </div>
    </BaseBox>
  );
};
