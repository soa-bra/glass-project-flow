
import React from 'react';
import { TimelineEvent } from './types';
import { TimelineEventItem } from './TimelineEventItem';
import { useTimelineScroll } from './useTimelineScroll';

interface TimelineScrollContainerProps {
  timeline: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

export const TimelineScrollContainer: React.FC<TimelineScrollContainerProps> = ({
  timeline,
  onEventClick
}) => {
  const {
    scrollRef,
    isDragging,
    canScrollLeft,
    canScrollRight,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleTouchStart
  } = useTimelineScroll();

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* مؤشر التمرير الأيسر */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/60 to-transparent z-30 pointer-events-none" />
      )}
      
      {/* مؤشر التمرير الأيمن */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent z-30 pointer-events-none" />
      )}
      
      <div
        ref={scrollRef}
        className={`
          overflow-x-auto overflow-y-hidden scrollbar-hide
          cursor-grab active:cursor-grabbing select-none
          h-full flex items-center relative
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          touchAction: 'pan-x pinch-zoom', // السماح بالسحب الأفقي والتكبير فقط
          WebkitOverflowScrolling: 'touch' // تحسين الأداء على iOS
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onTouchStart={handleTouchStart}
      >
        {/* الخط الزمني المستمر */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-full transform -translate-y-1/2 z-0"></div>
        
        {/* الأحداث */}
        <div className="flex items-center gap-24 py-6 px-8 relative z-10">
          {timeline.map((event) => (
            <TimelineEventItem
              key={event.id}
              event={event}
              onEventClick={onEventClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
