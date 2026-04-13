import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export const ExtraBoxTwo: React.FC = () => {
  return (
    <BaseBox 
      variant="standard" 
      size="md"
      header={
        <h3 className="text-sm font-arabic font-bold text-[hsl(var(--ink))]">إحصائية إضافية 2</h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-[hsl(var(--ink))] mb-1">78%</div>
        <div className="text-xs text-[hsl(var(--ink-60))] text-center">معدل الإنجاز</div>
      </div>
    </BaseBox>
  );
};
