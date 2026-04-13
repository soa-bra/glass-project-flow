import React from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/shared/motion';
import { buildTitleClasses, LAYOUT } from '@/components/shared/design-system/constants';

type Size = 'none' | 'sm' | 'md' | 'lg';
type Variant = 'standard' | 'glass' | 'flat' | 'exception';
type Color = 'info' | 'success' | 'warning' | 'error' | 'crimson';
type NeonRing = 'info' | 'success' | 'warning' | 'error';
type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type Overflow = 'hidden' | 'visible' | 'auto';

/**
 * BaseBox - المكون الموحد للصناديق والبطاقات
 * 
 * @description مكون حاوي موحد. المتغيرات `operations`, `unified`, `legal` تم دمجها في `standard`.
 * 
 * ⚠️ تحذير: لا تستخدم `variant="glass"` على الأسطح الثابتة (البطاقات، الصناديق، الألواح).
 * الزجاجية مسموحة فقط على الأسطح المنبثقة (modals, popovers, drawers).
 * استخدم `variant="standard"` أو `AppCardSurface` بدلاً منها.
 * 
 * @example
 * <BaseBox title="العنوان" icon={<Icon />}>المحتوى</BaseBox>
 * 
 * @example
 * <BaseBox variant="standard" size="md">المحتوى</BaseBox>
 */
export interface BaseBoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  icon?: React.ReactNode;
  header?: React.ReactNode;
  size?: Size;
  /** 
   * نوع المظهر. 
   * - `standard` — السطح الثابت القياسي (أبيض + حد رمادي)
   * - `glass` — ⚠️ للأسطح المنبثقة فقط (modals/overlays). لا تستخدمه على بطاقات ثابتة.
   * - `flat` — سطح مسطح بدون حدود أو ظل
   * - `exception` — شفاف بالكامل
   * 
   * @deprecated تم دمج `operations`, `unified`, `legal` في `standard`. استخدم `standard`.
   */
  variant?: Variant;
  color?: Color;
  neonRing?: NeonRing;
  animate?: boolean;
  animationDelay?: number;
  rounded?: Rounded;
  overflow?: Overflow;
}

const sizeClasses: Record<Size, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-9'
};

const variantClasses: Record<Variant, string> = {
  standard: 'bg-white border border-[#DADCE0] shadow-[0_1px_1px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300',
  exception: 'bg-transparent border-transparent shadow-none',
  /** ⚠️ glass — للأسطح المنبثقة فقط */
  glass: 'bg-white/40 backdrop-blur-[20px] border border-white/20',
  flat: 'bg-opacity-100',
};

const roundedClasses: Record<Rounded, string> = {
  sm: 'rounded-[12px]',
  md: 'rounded-[18px]',
  lg: 'rounded-[24px]',
  xl: 'rounded-[24px]',
  full: 'rounded-full'
};

const colorClasses: Record<Color, string> = {
  info: 'bg-[var(--visual-data-secondary-4)]',
  success: 'bg-[var(--visual-data-secondary-1)]',
  warning: 'bg-[var(--visual-data-secondary-5)]',
  error: 'bg-[var(--visual-data-secondary-2)]',
  crimson: 'bg-[var(--visual-data-secondary-2)]'
};

const neonRingClasses: Record<NeonRing, string> = {
  info: 'ring-2 ring-[var(--visual-data-secondary-4)]/30 ring-offset-2',
  success: 'ring-2 ring-[var(--visual-data-secondary-1)]/30 ring-offset-2',
  warning: 'ring-2 ring-[var(--visual-data-secondary-5)]/30 ring-offset-2',
  error: 'ring-2 ring-[var(--visual-data-secondary-2)]/30 ring-offset-2'
};

const overflowClasses: Record<Overflow, string> = {
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
  auto: 'overflow-auto'
};

export const BaseBox: React.FC<BaseBoxProps> = ({
  children,
  className = '',
  style,
  title,
  icon,
  header,
  size = 'lg',
  variant = 'standard',
  color,
  neonRing,
  animate = false,
  animationDelay = 0,
  rounded = 'lg',
  overflow = 'hidden',
}) => {
  const boxContent = (
    <div
      className={cn(
        'transition-all duration-300',
        roundedClasses[rounded],
        sizeClasses[size],
        variantClasses[variant],
        color && colorClasses[color],
        neonRing && neonRingClasses[neonRing],
        overflowClasses[overflow],
        className
      )}
      style={style}
    >
      {(title || header) && (
        <div className="mb-6">
          {title ? (
            <h3 className={buildTitleClasses()}>
              {icon && (
                <div className={LAYOUT.ICON_CONTAINER}>
                  {icon}
                </div>
              )}
              {title}
            </h3>
          ) : header}
        </div>
      )}
      
      <div className="overflow-y-hidden">
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <Reveal delay={animationDelay}>
        {boxContent}
      </Reveal>
    );
  }

  return boxContent;
};
