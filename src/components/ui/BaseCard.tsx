import React from 'react';
import { cn } from '@/lib/utils';
import { buildCardClasses } from '@/components/shared/design-system/constants';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'glass' | 'flat' | 'operations' | 'unified' | 'legal';
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
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = '',
  size = 'lg',
  variant = 'unified',
  color,
  neonRing,
  header,
  style
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-9'
  };
  
  const variantClasses = {
    glass: 'bg-white/40 backdrop-blur-[20px] border border-white/20',
    flat: 'bg-opacity-100',
    operations: 'bg-[#FFFFFF] ring-1 ring-[#DADCE0] shadow-sm',
    unified: 'bg-[#FFFFFF] ring-1 ring-[#DADCE0] shadow-sm hover:shadow-md transition-shadow duration-300',
    legal: 'bg-[#FFFFFF] ring-1 ring-[#DADCE0] shadow-sm hover:shadow-md transition-shadow duration-300'
  };
  
  const colorClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    crimson: 'bg-red-600'
  };
  
  const neonRingClasses = {
    info: 'ring-2 ring-blue-400/30 ring-offset-2',
    success: 'ring-2 ring-green-400/30 ring-offset-2',
    warning: 'ring-2 ring-yellow-400/30 ring-offset-2',
    error: 'ring-2 ring-red-400/30 ring-offset-2'
  };
  
  return (
    <div 
      className={cn(
        'rounded-[40px] transition-all duration-300 overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        color && colorClasses[color],
        neonRing && neonRingClasses[neonRing],
        className
      )} 
      style={style}
    >
      {header && (
        <div className="mb-6">
          {header}
        </div>
      )}
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};