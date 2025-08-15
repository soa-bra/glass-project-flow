import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { DESIGN_TOKENS, TYPOGRAPHY, COLORS, TRANSITIONS } from './design-system/constants';

interface BaseActionButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'view' | 'edit' | 'delete' | 'download' | 'share';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode | LucideIcon;
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
    ghost: `bg-transparent ${COLORS.PRIMARY_TEXT} hover:bg-[${DESIGN_TOKENS.COLORS.SURFACE_MUTED}]`,
    view: 'bg-transparent border border-black text-black hover:bg-white/20',
    edit: 'bg-transparent border border-black text-black hover:bg-white/20',
    delete: 'bg-transparent border border-red-600 text-red-600 hover:bg-red-50',
    download: 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50',
    share: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizeClasses = {
    sm: children ? 'px-3 py-1.5 text-sm' : 'w-8 h-8',
    md: children ? 'px-6 py-2 text-sm font-medium' : 'w-10 h-10',
    lg: children ? 'px-8 py-3 text-base' : 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Render icon if it's a component
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className={iconSizes[size]} />;
    }
    
    return <span className={`flex-shrink-0 ${iconSizes[size]}`}>{icon}</span>;
  };

  const isIconOnly = !children && icon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        children ? 'rounded-full' : 'rounded-full',
        'font-medium',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isIconOnly ? 'flex items-center justify-center' : 'flex items-center gap-2 whitespace-nowrap',
        TYPOGRAPHY.ARABIC_FONT,
        TRANSITIONS.DEFAULT,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {renderIcon()}
      {children}
    </button>
  );
};

// Backward compatibility exports
export { BaseActionButton as UnifiedActionButton };
export { BaseActionButton as UnifiedButton };