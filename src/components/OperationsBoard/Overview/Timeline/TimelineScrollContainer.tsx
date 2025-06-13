
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
    <div className="h-full relative overflow-hidden rounded-2xl px-0 my-0 py-[5px]">
      {/* مؤشر التمرير الأيسر */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 via-white/60 to-transparent z-20 pointer-events-none" />
      )}
      
      {/* مؤشر التمرير الأيمن */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 via-white/60 to-transparent z-20 pointer-events-none" />
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
        {/* الخط الزمني البسيط - خط رمادي مستقيم يمر بمنتصف الدوائر */}
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gray-400 z-10" 
          style={{
            top: 'calc(50% + 12px)'
          }} 
        />
        
        {/* الأحداث */}
        <div className="flex items-center gap-20 min-w-max relative z-20 py-0 px-[41px]">
          {timeline.map(event => (
            <TimelineEventItem key={event.id} event={event} onEventClick={onEventClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
