import React from 'react';
import { cn } from '@/lib/utils';

export interface AppCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AppCardFooter — شريط الإجراءات في أسفل البطاقة
 */
export const AppCardFooter: React.FC<AppCardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 pt-4 border-t border-[#DADCE0]',
      className
    )}>
      {children}
    </div>
  );
};
