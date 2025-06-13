
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
    handlePointerCancel
  } = useTimelineScroll();

  return (
    <div className="h-full relative overflow-hidden rounded-2xl">
      {/* مؤشر التمرير الأيسر - محسن */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/95 via-white/70 to-transparent z-20 pointer-events-none" />
      )}
      
      {/* مؤشر التمرير الأيمن - محسن */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/95 via-white/70 to-transparent z-20 pointer-events-none" />
      )}
      
      <div
        ref={scrollRef}
        className={`
          h-full w-full
          overflow-x-auto overflow-y-hidden
          scrollbar-hide
          ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          transition-all duration-200
          touch-pan-x
        `}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* الخط الزمني المحسن - خط أكثر وضوحاً */}
        <div 
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 z-10 rounded-full shadow-sm" 
          style={{ top: 'calc(50% - 2px)' }} 
        />
        
        {/* الأحداث مع تباعد محسن */}
        <div className="flex items-center gap-24 py-10 px-12 min-w-max relative z-20">
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
