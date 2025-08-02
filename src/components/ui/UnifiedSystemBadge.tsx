import React from 'react';
import { cn } from '@/lib/utils';
import { buildBadgeClasses } from '@/components/shared/design-system/constants';

interface UnifiedSystemBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';
  className?: string;
  icon?: React.ReactNode;
}

export const UnifiedSystemBadge: React.FC<UnifiedSystemBadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  icon
}) => {
  return (
    <span
      className={cn(
        buildBadgeClasses(variant),
        'inline-flex items-center gap-1',
        className
      )}
    >
      {icon && icon}
      {children}
    </span>
  );
};