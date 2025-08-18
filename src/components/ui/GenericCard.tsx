
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
      "bg-[#FFFFFF] border border-[#DADCE0] rounded-[41px] p-4",
      "shadow-[var(--sb-shadow-soft)] hover:shadow-[var(--sb-shadow-strong)] transition-shadow duration-600",
      className
    )}>
      {children}
    </div>
  );
};
