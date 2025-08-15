import React from 'react';
import { cn } from '@/lib/utils';
import { DESIGN_TOKENS, TYPOGRAPHY } from '@/components/shared/design-system/constants';

interface BaseBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BaseBadge: React.FC<BaseBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    success: 'bg-[#bdeed3] text-[#000000]',
    warning: 'bg-[#fbe2aa] text-[#000000]',
    error: 'bg-[#f1b5b9] text-[#000000]',
    info: 'bg-[#a4e2f6] text-[#000000]',
    default: 'bg-[#d9d2fd] text-[#000000]',
    secondary: `bg-[${DESIGN_TOKENS.COLORS.INK_30}] text-[${DESIGN_TOKENS.COLORS.INK}]`,
    outline: `bg-transparent border border-[${DESIGN_TOKENS.COLORS.BORDER}] text-[${DESIGN_TOKENS.COLORS.INK}]`
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        TYPOGRAPHY.ARABIC_FONT,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

// Backward compatibility exports
export { BaseBadge as UnifiedBadge };
export { BaseBadge as Badge };