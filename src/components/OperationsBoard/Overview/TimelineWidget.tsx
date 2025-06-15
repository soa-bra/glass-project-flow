
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
  };

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col rounded-3xl font-arabic`}
    >
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          الجدول الزمني للأحداث
        </h3>
        <TimelineNavigation
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll(-200)}
          onScrollRight={() => scroll(200)}
        />
      </header>
      
      {/* محتوى الخط الزمني المبسط */}
      <div className="flex-1 relative min-h-0 py-2">
        <TimelineScrollContainer timeline={timeline} onEventClick={openEvent} />
      </div>
    </GenericCard>
  );
};
