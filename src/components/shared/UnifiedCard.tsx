import React from 'react';
import { cn } from '@/lib/utils';
import { buildCardClasses, buildTitleClasses, LAYOUT } from './design-system/constants';
interface UnifiedCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}
export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  children,
  title,
  icon,
  className = ''
}) => {
  return <div className={cn(buildCardClasses(), className)}>
      {title && <div className="mb-6">
          
        </div>}
      <div>
        {children}
      </div>
    </div>;
};