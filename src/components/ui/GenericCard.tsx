
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
      "bg-white/40 backdrop-blur-[20px] rounded-3xl p-6 border border-white/20",
      "shadow-lg transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};
