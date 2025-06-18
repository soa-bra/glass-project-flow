
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
      {/* مؤشر التمرير الأيسر */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f2ffff] via-[#f2ffff]/60 to-transparent z-20 pointer-events-none" />
      )}
      
      {/* مؤشر التمرير الأيمن */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f2ffff] via-[#f2ffff]/60 to-transparent z-20 pointer-events-none" />
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
        {/* الخط الزمني الأفقي */}
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gray-400 z-10" 
          style={{ top: 'calc(50% - 1px)' }} 
        />
        
        {/* الأحداث */}
        <div className="flex items-center gap-16 min-w-max relative z-20 px-8 h-full">
          {timeline.map(event => (
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
