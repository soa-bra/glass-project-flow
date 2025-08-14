
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SoaBraBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SoaBraBadge: React.FC<SoaBraBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-[#d9d2fd] text-soabra-ink',
    secondary: 'bg-soabra-panel text-soabra-ink',
    success: 'bg-[#bdeed3] text-soabra-ink',
    warning: 'bg-[#fbe2aa] text-soabra-ink',
    error: 'bg-[#f1b5b9] text-soabra-ink'
  };

  const sizeClasses = {
    sm: 'text-label px-2 py-1',      // 12px
    md: 'text-body px-2.5 py-1',     // 14px
    lg: 'text-subtitle px-3 py-1.5'  // 16px
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-chip font-arabic font-medium',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
};
