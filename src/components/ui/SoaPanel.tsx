import React from 'react';
import { cn } from '@/lib/utils';

interface SoaPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const SoaPanel: React.FC<SoaPanelProps> = ({
  children,
  className = ''
}) => {
  const baseClasses = 'bg-soabra-panel rounded-panel ring-1 ring-soabra-border shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)] p-6';

  return (
    <div className={cn(baseClasses, className)}>
      {children}
    </div>
  );
};