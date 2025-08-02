
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
      "bg-[#f2ffff] border border-black/10 rounded-3xl p-6",
      "shadow-sm hover:shadow-md transition-shadow duration-300",
      className
    )}>
      {children}
    </div>
  );
};
