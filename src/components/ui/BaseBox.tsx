import React from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/shared/motion';
import { buildTitleClasses, LAYOUT } from '@/components/shared/design-system/constants';

type Size = 'none' | 'sm' | 'md' | 'lg';
type Variant = 'standard' | 'glass' | 'flat' | 'operations' | 'unified' | 'legal' | 'exception';
type Color = 'info' | 'success' | 'warning' | 'error' | 'crimson';
type NeonRing = 'info' | 'success' | 'warning' | 'error';
type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type Overflow = 'hidden' | 'visible' | 'auto';

/**
 * BaseBox - المكون الموحد للصناديق والبطاقات
 * 
 * @description مكون حاوي موحد يجمع جميع خصائص المكونات السابقة (BaseCard/BaseBox)
 * 
 * @example
 * // صندوق بسيط مع عنوان
 * <BaseBox title="العنوان" icon={<Icon />}>المحتوى</BaseBox>
 * 
 * @example
 * // بطاقة متقدمة مع تأثيرات
 * <BaseBox variant="glass" size="md" neonRing="success" animate>المحتوى</BaseBox>
 * 
 * @example
 * // صندوق استثنائي (شفاف)
 * <BaseBox variant="exception">المحتوى</BaseBox>
 */
export interface BaseBoxProps {
  /** المحتوى الداخلي */
  children: React.ReactNode;
  /** classes إضافية */
  className?: string;
  /** أنماط CSS مخصصة */
  style?: React.CSSProperties;
  
  // === خصائص العنوان ===
  /** عنوان الصندوق */
  title?: string;
  /** أيقونة بجانب العنوان */
  icon?: React.ReactNode;
  /** رأس مخصص (بديل للعنوان والأيقونة) */
  header?: React.ReactNode;
  
  // === خصائص الحجم ===
  /** حجم الـ padding - 'none' | 'sm' | 'md' | 'lg' */
  size?: Size;
  
  // === خصائص المظهر ===
  /** نوع المظهر */
  variant?: Variant;
  /** لون الخلفية */
  color?: Color;
  /** تأثير توهج النيون */
  neonRing?: NeonRing;
  
  // === خصائص الحركة ===
  /** تفعيل حركة الظهور */
  animate?: boolean;
  /** تأخير الحركة بالثواني */
  animationDelay?: number;
  
  // === خصائص التخطيط ===
  /** حجم الحواف المستديرة */
  rounded?: Rounded;
  /** نوع overflow */
  overflow?: Overflow;
}

const sizeClasses: Record<Size, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-9'
};

const variantClasses: Record<Variant, string> = {
  standard: 'ds-surface-card',
  exception: 'bg-transparent border-transparent shadow-none',
  glass: 'ds-glass-modal',
  flat: 'bg-opacity-100',
  operations: 'bg-[hsl(var(--ds-color-card-main))] border border-[hsl(var(--ds-color-border))] shadow-[var(--ds-elevation-card)]',
  unified: 'bg-[hsl(var(--ds-color-card-main))] border border-[hsl(var(--ds-color-border))] shadow-[var(--ds-elevation-card)] hover:shadow-[var(--ds-elevation-glass)] transition-shadow duration-300',
  legal: 'bg-[hsl(var(--ds-color-card-main))] border border-[hsl(var(--ds-color-border))] shadow-[var(--ds-elevation-card)] hover:shadow-[var(--ds-elevation-glass)] transition-shadow duration-300'
};

const roundedClasses: Record<Rounded, string> = {
  sm: 'rounded-[12px]',
  md: 'rounded-[18px]',
  lg: 'rounded-[24px]',
  xl: 'rounded-[40px]',
  full: 'rounded-full'
};

const colorClasses: Record<Color, string> = {
  info: 'bg-[hsl(var(--ds-color-accent-blue))]',
  success: 'bg-[hsl(var(--ds-color-accent-green))]',
  warning: 'bg-[hsl(var(--ds-color-accent-yellow))]',
  error: 'bg-[hsl(var(--ds-color-accent-red))]',
  crimson: 'bg-[hsl(var(--ds-color-accent-red))]'
};

const neonRingClasses: Record<NeonRing, string> = {
  info: 'ring-2 ring-[hsl(var(--ds-color-accent-blue))]/30 ring-offset-2',
  success: 'ring-2 ring-[hsl(var(--ds-color-accent-green))]/30 ring-offset-2',
  warning: 'ring-2 ring-[hsl(var(--ds-color-accent-yellow))]/30 ring-offset-2',
  error: 'ring-2 ring-[hsl(var(--ds-color-accent-red))]/30 ring-offset-2'
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
  // Title props
  title,
  icon,
  header,
  // Size
  size = 'lg',
  // Appearance
  variant = 'unified',
  color,
  neonRing,
  // Animation
  animate = false,
  animationDelay = 0,
  // Layout
  rounded = 'xl',
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
      {/* Header section */}
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
      
      {/* Content */}
      <div className="overflow-y-hidden">
        {children}
      </div>
    </div>
  );

  // Wrap with Reveal if animate is true
  if (animate) {
    return (
      <Reveal delay={animationDelay}>
        {boxContent}
      </Reveal>
    );
  }

  return boxContent;
};
