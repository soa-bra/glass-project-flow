
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
      timeline-card
      ${className}
      flex flex-col
      font-arabic
      overflow-hidden
      min-h-[280px]
    `}>
      
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          الأحداث القادمة
        </h3>
        
        <div className="flex gap-2">
          <button 
            className="text-white px-3 py-1 rounded-full text-xs font-arabic"
            style={{ backgroundColor: 'var(--status-colors-on-plan)' }}
          >
            وفق الخطة
          </button>
          <button 
            className="text-black px-3 py-1 rounded-full text-xs font-arabic"
            style={{ backgroundColor: 'var(--status-colors-in-preparation)' }}
          >
            1 أسابيع
          </button>
        </div>
      </header>

      {/* محتوى الخط الزمني */}
      <div className="flex-1 relative min-h-0 py-4">
        <TimelineScrollContainer timeline={timeline} onEventClick={openEvent} />
      </div>
    </div>
  );
};
