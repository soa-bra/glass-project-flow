import React from 'react';
import { cn } from '@/lib/utils';

interface SoaTooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export const SoaTooltip: React.FC<SoaTooltipProps> = ({
  children,
  content,
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          'absolute z-50 px-3 py-2',
          'bg-soabra-ink text-soabra-white',
          'rounded-tooltip shadow-[0_8px_24px_rgba(0,0,0,0.24)]',
          'text-label font-arabic',
          'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
          'whitespace-nowrap',
          className
        )}>
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-soabra-ink"></div>
          </div>
        </div>
      )}
    </div>
  );
};