import React from 'react';
import { cn } from '@/lib/utils';

export interface AppGridSectionProps {
  children?: React.ReactNode;
  className?: string;
  /** Section title (spans full width) */
  title?: string;
  /** Optional actions in the section header */
  actions?: React.ReactNode;
}

/**
 * AppGridSection — صف عنوان كامل العرض داخل الشبكة
 * 
 * يُستخدم لتقسيم لوحة المعلومات إلى أقسام مسمّاة.
 * يشغل 12 عموداً تلقائياً.
 * 
 * ```tsx
 * <AppDashboardGrid>
 *   <AppGridSection title="النظرة العامة" />
 *   <AppGridItem colSpan={3}>...</AppGridItem>
 * </AppDashboardGrid>
 * ```
 */
export const AppGridSection: React.FC<AppGridSectionProps> = ({
  children,
  className,
  title,
  actions,
}) => {
  return (
    <div
      className={cn(
        'col-span-1 md:col-span-6 lg:col-span-12',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between py-2">
          <h2 className="text-lg font-bold text-[hsl(var(--ink))] font-arabic">
            {title}
          </h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
