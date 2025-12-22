import React from 'react';
import { OverviewGrid } from './OverviewGrid';
import { TimelineBox } from './TimelineBox';
import { OverviewData } from './OverviewData';
import { Reveal } from '@/components/shared/motion';
interface OverviewLayoutProps {
  data: OverviewData;
}

/**
 * تخطيط النظرة العامة - يعرض الإحصائيات الرئيسية والشبكة التفاعلية
 */
export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  return (
    <div className="space-y-6">
      {/* بطاقة الأحداث القادمة */}
      <Reveal delay={0}>
        <TimelineBox />
      </Reveal>

      {/* الشبكة التفاعلية 3x3 */}
      <Reveal delay={0.2}>
        <OverviewGrid />
      </Reveal>
    </div>
  );
};