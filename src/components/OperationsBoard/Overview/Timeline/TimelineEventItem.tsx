
import React from 'react';
import { TimelineEvent } from '@/types';

interface TimelineEventItemProps {
  event: TimelineEvent;
  onEventClick: (event: TimelineEvent) => void;
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = React.memo(({
  event,
  onEventClick
}) => {
  return (
    <div className="relative flex flex-col items-center min-w-fit group px-0">
      {/* التاريخ في الأعلى */}
      <div className="text-sm font-bold text-gray-800 mb-4 whitespace-nowrap bg-white/90 rounded-lg backdrop-blur-sm border border-white/60 shadow-sm transition-all duration-200 group-hover:bg-white group-hover:shadow-md py-2 px-3">
        {new Date(event.date).toLocaleDateString('ar-EG', {
          month: 'short',
          day: 'numeric'
        })}
      </div>

      {/* الدائرة السوداء البسيطة - تتوسط الخط */}
      <button 
        className="
          w-6 h-6 rounded-full bg-gray-800 border-2 border-white 
          shadow-md hover:shadow-lg
          transition-all duration-200 
          hover:scale-110 active:scale-95
          relative z-20 
          focus:outline-none focus:ring-2 focus:ring-gray-400
        " 
        onClick={() => onEventClick(event)} 
        onPointerDown={e => e.stopPropagation()} 
        aria-label={`فتح تفاصيل الحدث: ${event.title}`}
      />

      {/* تفاصيل الحدث تحت الخط */}
      <div className="text-center mt-4 max-w-36 transition-all duration-200 group-hover:scale-105 my-[5px]">
        <div className="text-sm font-bold text-gray-900 mb-2 bg-white/90 rounded-lg backdrop-blur-sm border border-white/60 shadow-sm transition-all duration-200 group-hover:bg-white group-hover:shadow-md leading-tight py-2 px-3">
          {event.title}
        </div>
        <div className="text-xs font-medium text-gray-700 bg-white/80 rounded-md backdrop-blur-sm border border-white/50 transition-all duration-200 group-hover:bg-white/95 py-1 px-2">
          {event.department}
        </div>
      </div>
    </div>
  );
});

TimelineEventItem.displayName = 'TimelineEventItem';
