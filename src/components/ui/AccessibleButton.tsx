
import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'جارٍ التحميل...',
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-arabic font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    touch-target
  `;

  const variantClasses = {
    primary: `
      theme-primary-btn
      focus-visible:ring-blue-500
      hover:shadow-md active:scale-[0.98]
    `,
    secondary: `
      bg-gray-200 text-gray-900 border border-gray-300
      hover:bg-gray-300 focus-visible:ring-gray-500
      hover:shadow-sm active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-gray-700 border border-transparent
      hover:bg-gray-100 focus-visible:ring-gray-500
      hover:shadow-sm active:scale-[0.98]
    `,
    danger: `
      bg-red-600 text-white border border-red-600
      hover:bg-red-700 focus-visible:ring-red-500
      hover:shadow-md active:scale-[0.98]
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent ml-2" />
          <span className="sr-only">{loadingText}</span>
        </>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};
