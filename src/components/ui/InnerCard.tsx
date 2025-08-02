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
      'p-4 rounded-3xl bg-transparent border border-black/10',
      className
    )}>
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
              {icon}
            </div>
          )}
          <h4 className="font-medium text-black font-arabic">{title}</h4>
        </div>
      )}
      {children}
    </div>
  );
};