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
export const BaseBox: React.FC<BaseCardProps> = ({
  children,
  className = '',
  size = 'lg',
  variant = 'unified',
  color = '#ffffff border-[#DADCE0]',
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
    operations: 'bg-[var(--sb-surface-00)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)]',
    unified: 'bg-[var(--sb-surface-00)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] hover:shadow-[var(--sb-shadow-strong)] transition-shadow duration-300',
    legal: 'bg-[var(--sb-surface-00)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] hover:shadow-[var(--sb-shadow-strong)] transition-shadow duration-300'
  };
  const colorClasses = {
    info: 'bg-[var(--visual-data-secondary-4)]',
    success: 'bg-[var(--visual-data-secondary-1)]',
    warning: 'bg-[var(--visual-data-secondary-5)]',
    error: 'bg-[var(--visual-data-secondary-2)]',
    crimson: 'bg-[var(--visual-data-secondary-2)]'
  };
  const neonRingClasses = {
    info: 'ring-2 ring-[var(--visual-data-secondary-4)]/30 ring-offset-2',
    success: 'ring-2 ring-[var(--visual-data-secondary-1)]/30 ring-offset-2',
    warning: 'ring-2 ring-[var(--visual-data-secondary-5)]/30 ring-offset-2',
    error: 'ring-2 ring-[var(--visual-data-secondary-2)]/30 ring-offset-2'
  };
  return <div className={cn('rounded-[40px] transition-all duration-300 overflow-hidden', sizeClasses[size], variantClasses[variant], color && colorClasses[color], neonRing && neonRingClasses[neonRing], className)} style={style}>
      {header && <div className="mb-6">
          {header}
        </div>}
      <div className="overflow-y-hidden ">
        {children}
      </div>
    </div>;
};