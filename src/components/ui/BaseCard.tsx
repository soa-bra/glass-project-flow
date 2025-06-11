
import React from 'react';

interface BaseCardProps {
  variant?: 'glass' | 'gradient' | 'flat';
  color?: 'pinkblue' | 'orange' | 'crimson' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  neonRing?: 'success' | 'warning' | 'error' | 'info' | null;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  variant = 'glass',
  color = 'pinkblue',
  size = 'md',
  neonRing = null,
  onClick,
  header,
  footer,
  children,
  className = '',
}) => {
  const variantClass = 
    variant === 'glass' 
      ? 'glass-card hover-glow'
      : variant === 'gradient'
      ? `grad-${color}`
      : `flat-${color}`;

  const sizeClass = `card-${size}`;
  const neonClass = neonRing ? `neon-ring-${neonRing}` : '';

  return (
    <div
      className={`${variantClass} ${sizeClass} ${neonClass} p-4 flex flex-col gap-2 font-arabic transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {header && (
        <div className="flex items-center justify-between text-right">
          {header}
        </div>
      )}
      <div className="flex-1 text-right">
        {children}
      </div>
      {footer && (
        <div className="pt-2 border-t border-white/10 text-right">
          {footer}
        </div>
      )}
    </div>
  );
};
