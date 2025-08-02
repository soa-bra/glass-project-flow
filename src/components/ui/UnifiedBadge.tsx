import React from 'react';
import { cn } from '@/lib/utils';

interface UnifiedBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UnifiedBadge: React.FC<UnifiedBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    success: 'bg-[#bdeed3] text-black',
    warning: 'bg-[#fbe2aa] text-black',
    error: 'bg-[#f1b5b9] text-black',
    info: 'bg-[#a4e2f6] text-black',
    default: 'bg-[#d9d2fd] text-black'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium font-arabic',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};