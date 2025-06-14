
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
    <div className="h-full relative overflow-hidden rounded-2xl px-0 my-0 py-0 glass-enhanced">
      {/* Scroll indicators */}
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
          flex items-center
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
        {/* Timeline line */}
        <div 
          className="absolute left-0 right-0 h-1 bg-gradient-to-l from-soabra-primary-blue/20 via-gray-300/65 to-soabra-primary-blue/20 rounded-full z-10 transition-all duration-200"
          style={{top: 'calc(50% - 0.5rem)'}} 
        />
        {/* Events */}
        <div className="flex items-center gap-16 min-w-max relative z-20 py-0 px-[40px]">
          {timeline.map(event => (
            <TimelineEventItem key={event.id} event={event} onEventClick={onEventClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
