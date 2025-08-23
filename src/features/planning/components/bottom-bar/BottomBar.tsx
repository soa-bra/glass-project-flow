import React from 'react';
import { cn } from '@/lib/utils';
import { COLORS } from '@/components/shared/design-system/constants';

export const BottomBar: React.FC = () => {
  return (
    <div className={cn("h-12 px-4 flex items-center", COLORS.BOX_BACKGROUND, "border-t border-sb-border")}>
      شريط سفلي
    </div>
  );
};