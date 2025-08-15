import React from 'react';
import { cn } from '@/lib/utils';
import { DESIGN_TOKENS, TYPOGRAPHY, COLORS, TRANSITIONS } from './design-system/constants';

interface BaseActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const BaseActionButton: React.FC<BaseActionButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon
}) => {
  const variantClasses = {
    primary: `bg-[${DESIGN_TOKENS.COLORS.INK}] text-white hover:bg-[${DESIGN_TOKENS.COLORS.INK}]/90`,
    secondary: `bg-[${DESIGN_TOKENS.COLORS.SURFACE}] ${COLORS.BORDER_COLOR} ${COLORS.PRIMARY_TEXT} hover:bg-[${DESIGN_TOKENS.COLORS.SURFACE_MUTED}]`,
    outline: `bg-transparent ${COLORS.BORDER_COLOR} ${COLORS.PRIMARY_TEXT} hover:bg-[${DESIGN_TOKENS.COLORS.INK}] hover:text-white`,
    ghost: `bg-transparent ${COLORS.PRIMARY_TEXT} hover:bg-[${DESIGN_TOKENS.COLORS.SURFACE_MUTED}]`
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2 text-sm font-medium',
    lg: 'px-8 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full font-medium',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center gap-2 whitespace-nowrap',
        TYPOGRAPHY.ARABIC_FONT,
        TRANSITIONS.DEFAULT,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};