import React from 'react';
import { cn } from '@/lib/utils';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { COLORS, LAYOUT, TYPOGRAPHY, SPACING } from './design-system/constants';

interface UnifiedListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  };
  className?: string;
}

export const BaseListItem: React.FC<UnifiedListItemProps> = ({
  children,
  icon,
  badge,
  className = '',
}) => {
  return (
    <div className={cn(`p-4 ${LAYOUT.CARD_ROUNDED} ${COLORS.TRANSPARENT_BACKGROUND} ${COLORS.BORDER_COLOR}`, className)}>
      <div className={LAYOUT.FLEX_GAP}>
        {icon && (
          <div className={LAYOUT.ICON_CONTAINER}>
            {icon}
          </div>
        )}
        <span className={`${TYPOGRAPHY.BODY} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} flex-1`}>
          {children}
        </span>
        {badge && (
          <BaseBadge variant={badge.variant} size="sm">
            {badge.text}
          </BaseBadge>
        )}
      </div>
    </div>
  );
};