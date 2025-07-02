
import React from 'react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'glass' | 'flat' | 'operations';
type Color = 'info' | 'success' | 'warning' | 'error' | 'crimson';
type NeonRing = 'info' | 'success' | 'warning' | 'error';

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  size?: Size;
  variant?: Variant;
  color?: Color;
  neonRing?: NeonRing;
  header?: React.ReactNode;
  style?: React.CSSProperties;
  actionButton?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = '',
  size = 'md',
  variant = 'operations',
  color,
  neonRing,
  header,
  style,
  actionButton
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div 
      className={cn(
        'bg-[#f2ffff] rounded-3xl transition-all duration-300 overflow-hidden relative',
        sizeClasses[size],
        className
      )}
      style={style}
    >
      {(header || actionButton) && (
        <div className="mb-6 flex items-center justify-between">
          {header && (
            <div className="text-lg font-semibold text-black font-arabic">
              {header}
            </div>
          )}
          {actionButton && (
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
              {actionButton}
            </div>
          )}
        </div>
      )}
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};
