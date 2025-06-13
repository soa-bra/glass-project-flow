
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
    <div className="relative flex flex-col items-center min-w-fit group px-3">
      {/* التاريخ */}
      <div className="text-sm text-gray-800 mb-6 whitespace-nowrap font-bold bg-white/85 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50 shadow-sm transition-all duration-300 group-hover:bg-white/95 group-hover:scale-105 group-hover:shadow-md">
        {new Date(event.date).toLocaleDateString('ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>

      {/* النقطة التفاعلية - تم رفعها لتتوسط الخط */}
      <button
        className="
          w-8 h-8 rounded-full border-4 border-white 
          shadow-lg hover:shadow-xl
          transition-all duration-300 
          hover:scale-125 active:scale-110
          relative z-30 
          ring-2 ring-white/70 hover:ring-white/90
          focus:outline-none focus:ring-4 focus:ring-white/60
          group-hover:ring-4
        "
        style={{ backgroundColor: event.color }}
        onClick={() => onEventClick(event)}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* تفاصيل الحدث */}
      <div className="text-center mt-6 max-w-40 transition-all duration-300 group-hover:scale-105">
        <div className="text-sm font-bold text-gray-900 whitespace-nowrap mb-3 bg-white/85 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm transition-all duration-300 group-hover:bg-white/95 group-hover:shadow-md">
          {event.title}
        </div>
        <div className="text-xs font-medium text-gray-700 whitespace-nowrap bg-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/40 transition-all duration-300 group-hover:bg-white/85">
          {event.department}
        </div>
      </div>
    </div>
  );
};
