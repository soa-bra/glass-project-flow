import React from 'react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { Reveal } from '@/components/shared/motion';
import { SPACING, TYPOGRAPHY, COLORS, buildTitleClasses, LAYOUT } from '@/components/shared/design-system/constants';

interface KPIStat {
  title: string;
  value: string;
  unit: string;
  description: string;
}

interface BaseProjectTabLayoutProps {
  value: string;
  title?: string;
  icon?: React.ReactNode;
  kpiStats?: KPIStat[];
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
}

export const BaseProjectTabLayout: React.FC<BaseProjectTabLayoutProps> = ({
  value,
  title,
  icon,
  kpiStats,
  children,
  loading = false,
  error
}) => {
  if (loading) {
    return (
      <BaseTabContent value={value}>
        <div className="h-64 flex items-center justify-center">
          <div className={`${COLORS.SECONDARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} text-center`}>
            <div className="animate-pulse mb-2">⏳</div>
            <p>جارٍ التحميل...</p>
          </div>
        </div>
      </BaseTabContent>
    );
  }

  if (error) {
    return (
      <BaseTabContent value={value}>
        <div className="h-64 flex items-center justify-center">
          <div className={`${COLORS.SECONDARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} text-center`}>
            <div className="mb-2 text-red-500">⚠️</div>
            <p>حدث خطأ في تحميل البيانات</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </BaseTabContent>
    );
  }

  return (
    <BaseTabContent value={value}>
      <div className={`${TYPOGRAPHY.ARABIC_FONT} ${SPACING.CONTENT_PADDING}`}>
        {/* Header Section */}
        {title && (
          <Reveal delay={0}>
            <div className={SPACING.SECTION_MARGIN}>
              <h2 className={buildTitleClasses()}>
                {icon && (
                  <div className={LAYOUT.ICON_CONTAINER}>
                    {icon}
                  </div>
                )}
                {title}
              </h2>
            </div>
          </Reveal>
        )}

        {/* KPI Stats Section */}
        {kpiStats && kpiStats.length > 0 && (
          <Reveal delay={0.1}>
            <div className={SPACING.SECTION_MARGIN}>
              <KPIStatsSection stats={kpiStats} />
            </div>
          </Reveal>
        )}

        {/* Main Content */}
        <Reveal delay={kpiStats || title ? 0.2 : 0}>
          <div className="space-y-6">
            {children}
          </div>
        </Reveal>
      </div>
    </BaseTabContent>
  );
};