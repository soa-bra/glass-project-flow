
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
    // يمكن إضافة modal أو popover هنا
  };

  return (
    <div className={`
      ${className}
      rounded-3xl p-6
      bg-white/45 backdrop-blur-[20px] border border-white/40
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
      font-arabic
      overflow-hidden
      min-h-[224px]
    `}>
      
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-5 px-0 py-0 my-0">
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
      <div className="flex-1 relative min-h-0 my-0">
        <TimelineScrollContainer
          timeline={timeline}
          onEventClick={openEvent}
        />
      </div>
    </div>
  );
};
