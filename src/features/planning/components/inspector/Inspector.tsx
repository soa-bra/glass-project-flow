import React from 'react';
import { cn } from '@/lib/utils';
import { COLORS } from '@/components/shared/design-system/constants';

export const Inspector: React.FC = () => {
  return (
    <div className={cn("w-64 h-full", COLORS.BOX_BACKGROUND, "border-r border-sb-border")}>
      <div className="p-4">لوحة الخصائص</div>
    </div>
  );
};