
import React from 'react';
import { TimelineWidgetProps, TimelineEvent } from './Timeline/types';
import { TimelineNavigation } from './Timeline/TimelineNavigation';
import { TimelineScrollContainer } from './Timeline/TimelineScrollContainer';
import { useTimelineScroll } from './Timeline/useTimelineScroll';

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
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-arabic">الجدول الزمني</h3>
        <TimelineNavigation 
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll(-200)}
          onScrollRight={() => scroll(200)}
        />
      </div>
      
      <div className="flex-1">
        <TimelineScrollContainer 
          timeline={timeline}
          onEventClick={openEvent}
        />
      </div>
    </div>
  );
};
