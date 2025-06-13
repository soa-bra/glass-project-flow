
import React from 'react';
import { TimelineEvent } from './types';

interface TimelineEventItemProps {
  event: TimelineEvent;
  onEventClick: (event: TimelineEvent) => void;
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  onEventClick
}) => {
  return (
    <div className="relative flex flex-col items-center min-w-fit group">
      {/* التاريخ */}
      <div className="text-xs text-gray-700 mb-3 whitespace-nowrap font-medium bg-white/70 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/40 transition-all duration-200 group-hover:bg-white/80">
        {new Date(event.date).toLocaleDateString('ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>

      {/* النقطة التفاعلية */}
      <button
        className="
          w-6 h-6 rounded-full border-3 border-white 
          shadow-md hover:shadow-lg
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
      <div className="text-center mt-3 max-w-32 transition-all duration-200 group-hover:scale-105">
        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap mb-1.5 bg-white/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/40 transition-all duration-200 group-hover:bg-white/80">
          {event.title}
        </div>
        <div className="text-xs text-gray-600 whitespace-nowrap bg-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-200 group-hover:bg-white/60">
          {event.department}
        </div>
      </div>
    </div>
  );
};
