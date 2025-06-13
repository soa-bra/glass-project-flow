
import React from 'react';
import { TimelineEvent } from './types';

interface TimelineEventItemProps {
  event: TimelineEvent;
  onEventClick: (event: TimelineEvent);
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  onEventClick
}) => {
  return (
    <div className="relative flex flex-col items-center min-w-fit group px-2">
      {/* التاريخ */}
      <div className="text-sm text-gray-700 mb-4 whitespace-nowrap font-semibold bg-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/40 transition-all duration-200 group-hover:bg-white/90 group-hover:scale-105">
        {new Date(event.date).toLocaleDateString('ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>

      {/* النقطة التفاعلية */}
      <button
        className="
          w-7 h-7 rounded-full border-3 border-white 
          shadow-lg hover:shadow-xl
          transition-all duration-300 
          hover:scale-125 active:scale-110
          relative z-20 
          ring-2 ring-white/60 hover:ring-white/80
          focus:outline-none focus:ring-4 focus:ring-white/50
        "
        style={{ backgroundColor: event.color }}
        onClick={() => onEventClick(event)}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* تفاصيل الحدث */}
      <div className="text-center mt-4 max-w-36 transition-all duration-200 group-hover:scale-105">
        <div className="text-sm font-bold text-gray-900 whitespace-nowrap mb-2 bg-white/80 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/40 transition-all duration-200 group-hover:bg-white/90">
          {event.title}
        </div>
        <div className="text-xs text-gray-600 whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-200 group-hover:bg-white/70">
          {event.department}
        </div>
      </div>
    </div>
  );
};
