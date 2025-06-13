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
  className = ''
}) => {
  const variantClass = variant === 'glass' ? 'advanced-glass-card hover-glow-enhanced' : variant === 'gradient' ? `grad-${color}` : `flat-${color}`;
  const sizeClass = `card-${size}`;
  const neonClass = neonRing ? `neon-ring-${neonRing}` : '';
  return <div className={`${variantClass} ${sizeClass} ${neonClass} rounded-[24px] p-6 flex flex-col gap-3 font-arabic transition-all duration-500 ease-out ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {header && <div className="flex items-center justify-between text-right px-0 mx-0 py-[0px] my-0">
          {header}
        </div>}
      <div className="flex-1 text-right py-0 my-0 px-0 mx-0">
        {children}
      </div>
      {footer && <div className="pt-3 border-t border-white/20 text-right">
          {footer}
        </div>}
    </div>;
};