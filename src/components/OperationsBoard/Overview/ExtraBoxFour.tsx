import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export const ExtraBoxFour: React.FC = () => {
  return (
    <BaseBox 
      size="sm"
      variant="standard"
      header={
        <h3 className="text-sm font-arabic font-bold text-[hsl(var(--ink))]">إحصائية 4</h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="text-lg font-bold text-[hsl(var(--ink))]">67</div>
        <div className="text-xs text-[hsl(var(--ink-60))]">المهام المكتملة</div>
      </div>
    </BaseBox>
  );
};
