
import React from 'react';
import { cn } from '@/lib/utils';

interface GenericCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GenericCard: React.FC<GenericCardProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={cn(
      "bg-[var(--sb-surface-00)] ring-1 ring-[var(--sb-border)] rounded-t-[24px] rounded-b-[6px] p-4",
      "shadow-[var(--sb-shadow-soft)] hover:shadow-[var(--sb-shadow-strong)] transition-shadow duration-300",
      className
    )}>
      {children}
    </div>
  );
};
