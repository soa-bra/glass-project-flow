import React from 'react';
import { cn } from '@/lib/utils';
import { COLORS } from '@/components/shared/design-system/constants';

export const Toolbox: React.FC = () => {
  return (
    <div className={cn("w-16 h-full", COLORS.BOX_BACKGROUND, "border-l border-sb-border")}>
      <div className="p-2">صندوق الأدوات</div>
    </div>
  );
};