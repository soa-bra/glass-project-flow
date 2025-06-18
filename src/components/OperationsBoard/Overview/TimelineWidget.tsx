
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
    <div 
      className={`
        ${className}
        h-full rounded-3xl p-6
        shadow-lg border border-white/40
        flex flex-col
        font-arabic
        overflow-hidden
      `}
      style={{ background: '#f2ffff' }}
    >
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-arabic font-bold text-gray-800">
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
      <div className="flex-1 relative min-h-0">
        <TimelineScrollContainer 
          timeline={timeline} 
          onEventClick={openEvent} 
        />
      </div>
    </div>
  );
};
