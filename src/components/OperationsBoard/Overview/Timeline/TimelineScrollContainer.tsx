
import React from 'react';
import { TimelineEvent } from './types';
import { TimelineEventItem } from './TimelineEventItem';
import { useTimelineScroll } from './useTimelineScroll';

interface TimelineScrollContainerProps {
  timeline: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

export const TimelineScrollContainer: React.FC<TimelineScrollContainerProps> = React.memo(({
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

  const scrollContainerStyle = React.useMemo(() => ({
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const
  }), []);

  const timelineStyle = React.useMemo(() => ({
    top: 'calc(50% - 1px)'
  }), []);

  return (
    <div className="h-full relative overflow-hidden rounded-2xl px-0 my-0 py-0">
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 via-white/60 to-transparent z-20 pointer-events-none" />
      )}
      
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
        style={scrollContainerStyle}
        onPointerDown={handlePointerDown} 
        onPointerMove={handlePointerMove} 
        onPointerUp={handlePointerUp} 
        onPointerCancel={handlePointerCancel}
      >
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gray-400 z-10" 
          style={timelineStyle} 
        />
        
        <div className="flex items-center gap-20 min-w-max relative z-20 py-0 px-[25px]">
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
});

TimelineScrollContainer.displayName = 'TimelineScrollContainer';
