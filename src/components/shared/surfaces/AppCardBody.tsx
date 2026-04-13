import React from 'react';
import { cn } from '@/lib/utils';

export interface AppCardBodyProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

/**
 * AppCardBody — حاوية محتوى البطاقة مع تحكم بالتمرير
 */
export const AppCardBody: React.FC<AppCardBodyProps> = ({
  children,
  className,
  scrollable = false,
}) => {
  return (
    <div className={cn(
      'flex-1',
      scrollable && 'overflow-y-auto',
      className
    )}>
      {children}
    </div>
  );
};
