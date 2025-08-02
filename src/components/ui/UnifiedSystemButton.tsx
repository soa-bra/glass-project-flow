import React from 'react';
import { cn } from '@/lib/utils';
import { buildButtonClasses } from '@/components/shared/design-system/constants';

interface UnifiedSystemButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const UnifiedSystemButton: React.FC<UnifiedSystemButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        buildButtonClasses(variant, size),
        'flex items-center gap-2',
        className
      )}
    >
      {icon && icon}
      {children}
    </button>
  );
};