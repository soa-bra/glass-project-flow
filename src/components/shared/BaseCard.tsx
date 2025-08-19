import React from 'react';
import { cn } from '@/lib/utils';
import { buildCardClasses, buildTitleClasses, buildExceptionBoxClasses, LAYOUT } from './design-system/constants';
import { Reveal } from './motion';

interface UnifiedCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'exception'; // 'exception' للنظرة المالية وقائمة المهام
}

export const BaseCard: React.FC<UnifiedCardProps> = ({
  children,
  title,
  icon,
  className = '',
  variant = 'standard',
}) => {
  const cardClasses = variant === 'exception' 
    ? buildExceptionBoxClasses(className)
    : `sb-surface-box p-6 ${className}`;

  return (
    <Reveal>
      <div className={cn(cardClasses)}>
        {title && (
          <div className="mb-6">
            <h3 className={buildTitleClasses()}>
              {icon && (
                <div className={LAYOUT.ICON_CONTAINER}>
                  {icon}
                </div>
              )}
              {title}
            </h3>
          </div>
        )}
        <div>
          {children}
        </div>
      </div>
    </Reveal>
  );
};