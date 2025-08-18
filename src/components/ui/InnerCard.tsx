import React from 'react';
import { cn } from '@/lib/utils';

interface InnerCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const InnerCard: React.FC<InnerCardProps> = ({
  children,
  className = '',
  title,
  icon
}) => {
  return (
    <div className={cn(
      'p-4 rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0]',
      'shadow-[0_1px_1px_rgba(15,23,42,0.02),_0_4px_12px_rgba(15,23,42,0.06)]',
      className
    )}>
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-3 h-3 rounded-full bg-transparent ring-1 ring-[var(--sb-ink)] flex items-center justify-center">
              {icon}
            </div>
          )}
          <h4 className="font-medium text-[var(--sb-ink)] font-arabic">{title}</h4>
        </div>
      )}
      {children}
    </div>
  );
};