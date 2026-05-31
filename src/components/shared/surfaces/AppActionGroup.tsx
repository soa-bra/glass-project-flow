import React from 'react';
import { cn } from '@/lib/utils';

export interface AppActionGroupProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * AppActionGroup — مجموعة إجراءات موحدة داخل البطاقات
 */
export const AppActionGroup: React.FC<AppActionGroupProps> = ({
  children,
  className,
  align = 'end',
}) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  return (
    <div className={cn('flex items-center gap-3', alignClasses[align], className)}>
      {children}
    </div>
  );
};
