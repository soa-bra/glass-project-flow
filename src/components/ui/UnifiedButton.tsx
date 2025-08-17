import React from 'react';
import { cn } from '@/lib/utils';
import { useButtonClasses } from '@/hooks/useDesignTokens';

export interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}) => {
  const buttonClasses = useButtonClasses(variant, size, disabled || loading);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>جاري التحميل...</span>
        </div>
      );
    }

    if (icon) {
      return (
        <div className="flex items-center justify-center gap-2">
          {iconPosition === 'right' && <span>{children}</span>}
          <div className="w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
          {iconPosition === 'left' && <span>{children}</span>}
        </div>
      );
    }

    return children;
  };

  return (
    <button
      className={cn(
        buttonClasses,
        fullWidth && 'w-full',
        'inline-flex items-center justify-center',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default UnifiedButton;