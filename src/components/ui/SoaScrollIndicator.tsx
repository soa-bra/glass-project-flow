import React from 'react';
import { cn } from '@/lib/utils';

interface SoaScrollIndicatorProps {
  isActive?: boolean;
  className?: string;
}

export const SoaScrollIndicator: React.FC<SoaScrollIndicatorProps> = ({
  isActive = false,
  className = ''
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center gap-[8px]',
      className
    )}>
      {/* Capsule */}
      <div className={cn(
        'w-[6px] h-[20px] rounded-[3px] bg-soabra-ink transition-opacity',
        isActive ? 'opacity-100' : 'opacity-40'
      )} />
      
      {/* Dots */}
      <div className="flex flex-col gap-[8px]">
        <div className="w-[6px] h-[6px] rounded-full bg-soabra-ink-30" />
        <div className="w-[6px] h-[6px] rounded-full bg-soabra-ink-30" />
      </div>
    </div>
  );
};