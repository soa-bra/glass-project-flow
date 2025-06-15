
import React from 'react';
import { TimelineWidgetProps, TimelineEvent } from './Timeline/types';
import { TimelineNavigation } from './Timeline/TimelineNavigation';
import { TimelineScrollContainer } from './Timeline/TimelineScrollContainer';
import { useTimelineScroll } from './Timeline/useTimelineScroll';
import { GenericCard } from '@/components/ui/GenericCard';

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({
  timeline,
  className = ''
}) => {
  const {
    canScrollLeft,
    canScrollRight,
    scroll
  } = useTimelineScroll();
  const openEvent = (event: TimelineEvent) => {
    console.log('فتح الحدث:', event);
    // مستقبلاً يمكن إضافة modal أو popover هنا
  };
  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`
        ${className}
        flex flex-col rounded-3xl font-arabic min-h-[220px] mb-0
        bg-white/40
        `}
    >
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-5" style={{fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif', direction: 'rtl'}}>
        <h3 className="text-xl font-arabic font-bold text-[#23272f]">
          الأحداث القادمة
        </h3>
        <TimelineNavigation
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll(-200)}
          onScrollRight={() => scroll(200)}
        />
      </header>
      {/* محتوى الخط الزمني */}
      <div className="flex-1 relative min-h-0 py-[35px]" style={{fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif', direction: 'rtl'}}>
        <TimelineScrollContainer timeline={timeline} onEventClick={openEvent} />
      </div>
    </GenericCard>
  );
};
