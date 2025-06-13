
import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  selected?: boolean;
  className?: string;
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  onClick?: () => void;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  interactive = false,
  selected = false,
  className,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  tabIndex,
  onClick
}) => {
  const baseClasses = `
    rounded-2xl transition-all duration-300
    font-arabic
  `;

  const variantClasses = {
    glass: `
      theme-glass-light
      hover:shadow-lg hover:scale-[1.02]
      border border-white/20
    `,
    solid: `
      bg-white shadow-md
      hover:shadow-lg hover:scale-[1.01]
      border border-gray-200
    `,
    outline: `
      bg-transparent border-2 border-gray-300
      hover:border-gray-400 hover:shadow-sm
    `
  };

  const sizeClasses = {
    sm: 'p-4 min-h-[120px]',
    md: 'p-6 min-h-[160px]',
    lg: 'p-8 min-h-[200px]'
  };

  const interactiveClasses = interactive ? `
    cursor-pointer
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    hover:shadow-xl
  ` : '';

  const selectedClasses = selected ? `
    ring-2 ring-blue-500 ring-offset-2
    transform scale-[1.02]
  ` : '';

  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        interactiveClasses,
        selectedClasses,
        className
      )}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-selected={selected}
      tabIndex={interactive ? (tabIndex ?? 0) : undefined}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
