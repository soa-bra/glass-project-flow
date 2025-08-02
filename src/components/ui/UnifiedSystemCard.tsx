import React from 'react';
import { cn } from '@/lib/utils';
import { buildCardClasses, buildTitleClasses, buildIconClasses } from '@/components/shared/design-system/constants';

interface UnifiedSystemCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const UnifiedSystemCard: React.FC<UnifiedSystemCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  headerActions,
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-9'
  };

  return (
    <div className={cn(buildCardClasses(), sizeClasses[size], className)}>
      {(title || headerActions) && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={buildIconClasses('md', true)}>
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className={buildTitleClasses()}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-black/70 font-arabic mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};