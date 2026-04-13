import React from 'react';
import { cn } from '@/lib/utils';

export type SurfaceDensity = 'compact' | 'standard' | 'spacious';
export type SurfaceInteractive = 'static' | 'hoverable' | 'selectable';
export type SurfaceRole = 'metric' | 'summary' | 'list' | 'table' | 'detail' | 'form' | 'default';
export type SurfaceOverflow = 'visible' | 'hidden' | 'clip-safe';

export interface AppCardSurfaceProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  density?: SurfaceDensity;
  interactive?: SurfaceInteractive;
  role?: SurfaceRole;
  overflow?: SurfaceOverflow;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const densityClasses: Record<SurfaceDensity, string> = {
  compact: 'p-4',
  standard: 'p-6',
  spacious: 'p-8',
};

const interactiveClasses: Record<SurfaceInteractive, string> = {
  static: '',
  hoverable: 'hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300',
  selectable: 'hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[hsl(var(--ink))]/30 transition-all duration-300 cursor-pointer',
};

const overflowClasses: Record<SurfaceOverflow, string> = {
  visible: 'overflow-visible',
  hidden: 'overflow-hidden',
  'clip-safe': 'overflow-clip',
};

/**
 * AppCardSurface — السطح القياسي الموحد لجميع البطاقات الثابتة
 * 
 * يطبق فلسفة السطح الثابت: خلفية بيضاء، حد رمادي، محتوى أسود.
 * بدون زجاجية، بدون شفافية، بدون blur.
 * 
 * @example
 * <AppCardSurface density="standard" interactive="hoverable">
 *   <p>محتوى البطاقة</p>
 * </AppCardSurface>
 */
export const AppCardSurface: React.FC<AppCardSurfaceProps> = ({
  children,
  className,
  style,
  density = 'standard',
  interactive = 'static',
  role: _role,
  overflow = 'hidden',
  header,
  footer,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#DADCE0] rounded-[24px]',
        'shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06)]',
        densityClasses[density],
        interactiveClasses[interactive],
        overflowClasses[overflow],
        className
      )}
      style={style}
    >
      {header && <div className="mb-4">{header}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-[#DADCE0]">{footer}</div>}
    </div>
  );
};
