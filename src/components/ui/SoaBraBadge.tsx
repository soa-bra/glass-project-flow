
import React, { ReactNode } from 'react';

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
    primary: 'bg-soabra-primary-blue text-white',
    secondary: 'bg-soabra-secondary text-white',
    success: 'bg-soabra-success text-white',
    warning: 'bg-soabra-warning text-black',
    error: 'bg-soabra-error text-white'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
