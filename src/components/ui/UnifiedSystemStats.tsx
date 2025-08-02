import React from 'react';
import { cn } from '@/lib/utils';
import { UnifiedSystemCard } from './UnifiedSystemCard';
import { buildIconClasses } from '@/components/shared/design-system/constants';

interface UnifiedSystemStatsProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const UnifiedSystemStats: React.FC<UnifiedSystemStatsProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = ''
}) => {
  return (
    <UnifiedSystemCard size="md" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className={cn(buildIconClasses('lg', true), 'text-black')}>
                {icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-black font-arabic">
              {title}
            </h3>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-black font-arabic">
              {value}
            </div>
            
            {subtitle && (
              <p className="text-sm text-black/70 font-arabic">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className={cn(
                'text-xs font-medium font-arabic flex items-center gap-1',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </UnifiedSystemCard>
  );
};