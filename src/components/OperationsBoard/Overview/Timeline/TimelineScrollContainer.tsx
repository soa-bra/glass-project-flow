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
  return <div className="h-full relative overflow-hidden rounded-2xl px-0 my-0 py-[5px]">
      {/* مؤشر التمرير الأيسر */}
      {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 via-white/60 to-transparent z-20 pointer-events-none" />}
      
      {/* مؤشر التمرير الأيمن */}
      {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 via-white/60 to-transparent z-20 pointer-events-none" />}
      
      
    </div>;
};