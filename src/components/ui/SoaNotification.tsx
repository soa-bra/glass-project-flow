import React from 'react';
import { cn } from '@/lib/utils';

interface SoaNotificationProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  meta?: string;
  className?: string;
}

export const SoaNotification: React.FC<SoaNotificationProps> = ({
  type = 'info',
  title,
  message,
  meta,
  className = ''
}) => {
  const typeClasses = {
    success: 'border-l-[3px] border-l-soabra-accent-green',
    warning: 'border-l-[3px] border-l-soabra-accent-yellow',
    error: 'border-l-[3px] border-l-soabra-accent-red',
    info: 'border-l-[3px] border-l-soabra-accent-blue'
  };

  return (
    <div className={cn(
      'bg-soabra-surface rounded-[18px] ring-1 ring-soabra-border',
      'shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)]',
      'p-4 flex flex-col gap-3',
      typeClasses[type],
      className
    )}>
      <h4 className="text-[14px] font-semibold text-soabra-ink font-arabic">
        {title}
      </h4>
      {message && (
        <p className="text-[13px] font-normal text-soabra-ink-80 font-arabic">
          {message}
        </p>
      )}
      {meta && (
        <span className="text-[12px] font-normal text-soabra-ink-60 font-arabic">
          {meta}
        </span>
      )}
    </div>
  );
};