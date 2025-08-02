import React from 'react';
import { cn } from '@/lib/utils';

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
    <div className="text-right p-0 py-0 my-0 mx-0 px-6">
      <div className="mb-2">
        <span className="text-base text-black font-arabic font-medium">{title}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
        <div className="text-5xl font-bold text-black font-arabic">
          {typeof value === 'number' ? String(value).padStart(2, '0') : value}
        </div>
        {subtitle && <div className="text-sm text-black font-arabic font-bold">{subtitle}</div>}
      </div>
      
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
  );
};