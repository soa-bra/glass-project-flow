import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SoaIconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const SoaIcon: React.FC<SoaIconProps> = ({
  icon: Icon,
  size = 'sm',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-[24px] h-[24px]', // 24px
    md: 'w-[28px] h-[28px]', // 28px
    lg: 'w-[32px] h-[32px]'  // 32px
  };

  const containerClasses = cn(
    'rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
    'min-w-[40px] min-h-[40px]', // Hit area
    sizeClasses[size],
    onClick && 'cursor-pointer hover:bg-black/5 transition-colors',
    className
  );

  const iconClasses = 'stroke-[2px] stroke-black fill-none';

  return (
    <div className={containerClasses} onClick={onClick}>
      <Icon className={iconClasses} />
    </div>
  );
};