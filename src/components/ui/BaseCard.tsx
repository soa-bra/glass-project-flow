import React from 'react';
import { cn } from '@/lib/utils';
type Size = 'sm' | 'md' | 'lg';
type Variant = 'glass' | 'flat' | 'operations' | 'unified';
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
  size = 'md',
  variant = 'operations',
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
    operations: 'bg-[#f2ffff] border border-black/10 shadow-sm',
    unified: 'bg-[#f2ffff] border border-black/10 hover:shadow-md transition-shadow'
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
  return <div className={cn('rounded-3xl transition-all duration-300 overflow-hidden', variant !== 'operations' && sizeClasses[size], variantClasses[variant], color && colorClasses[color], neonRing && neonRingClasses[neonRing], variant === 'operations' && sizeClasses[size], className)} style={style}>
      {header && <div className="mb-6">
          {header}
        </div>}
      <div className="h-full overflow-hidden my-4">
        {children}
      </div>
    </div>;
};