
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
    <div className="relative flex flex-col items-center min-w-fit group px-8">
      {/* التاريخ في الأعلى - محسن */}
      <div className="text-sm font-bold text-gray-800 mb-6 whitespace-nowrap bg-white/95 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/70 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-md group-hover:scale-105">
        {new Date(event.date).toLocaleDateString('ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>

      {/* الدائرة المحسنة - تتوسط الخط */}
      <button
        className="
          w-8 h-8 rounded-full bg-gray-800 border-3 border-white 
          shadow-lg hover:shadow-xl
          transition-all duration-300 
          hover:scale-125 active:scale-95
          relative z-20 
          focus:outline-none focus:ring-3 focus:ring-gray-400/50
          group-hover:bg-gray-700
        "
        onClick={() => onEventClick(event)}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* تفاصيل الحدث تحت الخط - محسنة */}
      <div className="text-center mt-6 max-w-40 transition-all duration-300 group-hover:scale-105">
        {/* عنوان الحدث */}
        <div className="text-sm font-bold text-gray-900 mb-3 bg-white/95 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/70 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-md leading-relaxed">
          {event.title}
        </div>
        
        {/* القسم */}
        <div className="text-xs font-medium text-gray-700 bg-white/85 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/60 transition-all duration-300 group-hover:bg-white/95 font-arabic">
          {event.department}
        </div>
      </div>
    </div>
  );
};
