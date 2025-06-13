
import React from 'react';
import { TimelineWidgetProps, TimelineEvent } from './Timeline/types';
import { TimelineNavigation } from './Timeline/TimelineNavigation';
import { TimelineScrollContainer } from './Timeline/TimelineScrollContainer';
import { useTimelineScroll } from './Timeline/useTimelineScroll';

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({ 
  timeline, 
  className = '' 
}) => {
  const { canScrollLeft, canScrollRight, scroll } = useTimelineScroll();

  const openEvent = (event: TimelineEvent) => {
    console.log('فتح الحدث:', event);
    // يمكن إضافة modal أو popover هنا
  };

  return (
    <div className={`
      ${className}
      rounded-3xl p-8
      bg-white/45 backdrop-blur-[20px] border border-white/40
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
      font-arabic
      overflow-hidden
      min-h-[320px]
    `}>
      
      {/* رأس البطاقة المحسن */}
      <header className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-arabic font-bold text-gray-800">
          الأحداث القادمة
        </h3>
        
        <TimelineNavigation
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll(-250)}
          onScrollRight={() => scroll(250)}
        />
      </header>

      {/* محتوى الخط الزمني المحسن */}
      <div className="flex-1 relative min-h-0 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
        <TimelineScrollContainer
          timeline={timeline}
          onEventClick={openEvent}
        />
      </div>
    </div>
  );
};
