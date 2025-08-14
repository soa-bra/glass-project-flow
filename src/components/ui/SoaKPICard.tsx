import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { SoaIcon } from './SoaIcon';

interface SoaKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

const cardVariants = {
  default: 'bg-soabra-surface',
  success: 'bg-gradient-to-br from-soabra-accent-green/10 to-soabra-accent-green/5',
  warning: 'bg-gradient-to-br from-soabra-accent-yellow/10 to-soabra-accent-yellow/5',
  error: 'bg-gradient-to-br from-soabra-accent-red/10 to-soabra-accent-red/5'
};

const iconColors = {
  default: 'text-soabra-ink',
  success: 'text-soabra-accent-green',
  warning: 'text-soabra-accent-yellow',
  error: 'text-soabra-accent-red'
};

export const SoaKPICard: React.FC<SoaKPICardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  variant = 'default',
  change,
  className = ''
}) => {
  return (
    <div className={cn(
      'rounded-card-top border border-soabra-border p-4 transition-all duration-200',
      'shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)]',
      cardVariants[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-label text-soabra-ink-60 font-medium">{title}</h3>
        <SoaIcon 
          icon={Icon} 
          size="lg"
          className={cn('p-2 rounded-full border border-soabra-border bg-soabra-white', iconColors[variant])}
        />
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-[44px] font-bold leading-none text-soabra-ink">{value}</span>
        {unit && <span className="text-body text-soabra-ink-60">{unit}</span>}
      </div>
      
      {change && (
        <div className={cn(
          'inline-flex items-center gap-1 text-label',
          change.type === 'increase' ? 'text-soabra-accent-green' : 'text-soabra-accent-red'
        )}>
          <span>{change.type === 'increase' ? '↗' : '↘'}</span>
          <span>{Math.abs(change.value)}%</span>
        </div>
      )}
    </div>
  );
};