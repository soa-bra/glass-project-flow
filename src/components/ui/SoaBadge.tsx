import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface SoaBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
}

const badgeVariants = {
  default: 'bg-soabra-ink text-soabra-white',
  success: 'bg-soabra-accent-green text-soabra-white',
  warning: 'bg-soabra-accent-yellow text-soabra-ink',
  error: 'bg-soabra-accent-red text-soabra-white',
  info: 'bg-soabra-accent-blue text-soabra-white',
  outline: 'bg-transparent text-soabra-ink border border-soabra-border'
};

const badgeSizes = {
  sm: 'px-2 py-1 text-label',
  md: 'px-3 py-1.5 text-body',
  lg: 'px-4 py-2 text-subtitle'
};

export const SoaBadge: React.FC<SoaBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
  onClick
}) => {
  const isClickable = !!onClick;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-chip font-medium transition-all duration-200',
        badgeVariants[variant],
        badgeSizes[size],
        isClickable && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />}
      {children}
    </span>
  );
};