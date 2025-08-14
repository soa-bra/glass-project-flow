import React from 'react';
import { cn } from '@/lib/utils';

interface SoaCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'main' | 'sub';
}

export const SoaCard: React.FC<SoaCardProps> = ({
  children,
  className = '',
  variant = 'main'
}) => {
  const baseClasses = variant === 'main' 
    ? 'bg-soabra-surface rounded-t-card-top rounded-b-card-bottom ring-1 ring-soabra-border shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)] p-6'
    : 'bg-transparent';

  return (
    <div className={cn(baseClasses, className)}>
      {children}
    </div>
  );
};