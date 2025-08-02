import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildTitleClasses, LAYOUT, SPACING, COLORS } from './design-system/constants';

interface UnifiedPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export const UnifiedPageHeader: React.FC<UnifiedPageHeaderProps> = ({
  title,
  subtitle,
  icon: IconComponent,
  actions,
  className = '',
}) => {
  return (
    <div className={cn(`${SPACING.HEADER_PADDING} ${COLORS.TRANSPARENT_BACKGROUND}`, className)}>
      <div className={LAYOUT.FLEX_BETWEEN}>
        <div>
          <h1 className={buildTitleClasses()}>
            {IconComponent && (
              <div className={LAYOUT.ICON_CONTAINER}>
                <IconComponent className={LAYOUT.ICON_SIZE} />
              </div>
            )}
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-2 font-arabic">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className={LAYOUT.FLEX_GAP}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};