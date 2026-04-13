import React from 'react';
import { cn } from '@/lib/utils';
import type { SurfaceDensity } from './AppCardSurface';

export interface AppSectionSurfaceProps {
  children: React.ReactNode;
  className?: string;
  density?: SurfaceDensity;
  title?: string;
}

const densityClasses: Record<SurfaceDensity, string> = {
  compact: 'p-3',
  standard: 'p-4',
  spacious: 'p-6',
};

/**
 * AppSectionSurface — سطح مسطح لتجميع مجموعة بطاقات أو محتوى
 * 
 * أقل حضوراً بصرياً من AppCardSurface، بدون ظل.
 */
export const AppSectionSurface: React.FC<AppSectionSurfaceProps> = ({
  children,
  className,
  density = 'standard',
  title,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#DADCE0] rounded-[18px]',
        densityClasses[density],
        className
      )}
    >
      {title && (
        <h3 className="text-sm font-semibold text-[hsl(var(--ink))] font-arabic mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
