import React from 'react';
import { cn } from '@/lib/utils';

export interface AppCardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const titleSizeClasses = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-lg font-bold',
};

/**
 * AppCardHeader — رأس موحد للبطاقات
 */
export const AppCardHeader: React.FC<AppCardHeaderProps> = ({
  title,
  icon,
  actions,
  size = 'md',
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-full border border-[#DADCE0] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <h3 className={cn('text-[hsl(var(--ink))] font-arabic', titleSizeClasses[size])}>
          {title}
        </h3>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
