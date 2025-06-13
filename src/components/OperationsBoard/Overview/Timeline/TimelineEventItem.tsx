
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
    <div className="relative flex flex-col items-center min-w-fit">
      {/* التاريخ */}
      <span className="text-xs text-gray-600 mb-4 whitespace-nowrap font-medium bg-white/60 px-2 py-1 rounded-full backdrop-blur-sm">
        {new Date(event.date).toLocaleDateString('ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </span>

      {/* النقطة التفاعلية */}
      <button
        className="w-6 h-6 rounded-full border-3 border-white shadow-lg transition-all duration-200 hover:scale-125 relative z-20 hover:shadow-xl ring-2 ring-white/50"
        style={{ backgroundColor: event.color }}
        onClick={() => onEventClick(event)}
        onPointerDown={(e) => e.stopPropagation()} // منع تداخل السحب مع النقر
      />

      {/* تفاصيل الحدث */}
      <div className="text-center mt-4 max-w-32">
        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap mb-1 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm">
          {event.title}
        </div>
        <div className="text-xs text-gray-600 whitespace-nowrap opacity-75 bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {event.department}
        </div>
      </div>
    </div>
  );
};
