
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
    <div className="relative flex flex-col items-center min-w-fit group px-6">
      {/* التاريخ في الأعلى */}
      <div className="text-center mb-4 whitespace-nowrap">
        <div className="text-lg font-bold text-gray-800 font-arabic">
          {new Date(event.date).toLocaleDateString('ar-EG', {
            month: 'short'
          })}
        </div>
        <div className="text-2xl font-bold text-gray-900 font-arabic">
          {new Date(event.date).getDate().toString().padStart(2, '0')}
        </div>
      </div>

      {/* الدائرة البيضاء - تتوسط الخط */}
      <button 
        className="
          w-6 h-6 rounded-full bg-white border-2 border-gray-300 
          shadow-md hover:shadow-lg
          transition-all duration-200 
          hover:scale-110 active:scale-95
          relative z-20 
          focus:outline-none focus:ring-2 focus:ring-gray-400
        " 
        onClick={() => onEventClick(event)} 
        onPointerDown={e => e.stopPropagation()} 
      />

      {/* تفاصيل الحدث تحت الخط */}
      <div className="text-center mt-4 max-w-40 transition-all duration-200 group-hover:scale-105">
        <div className="text-sm font-bold text-gray-900 mb-2 leading-tight font-arabic">
          {event.title}
        </div>
        <div className="text-xs font-medium text-gray-600 font-arabic">
          {event.department}
        </div>
      </div>
    </div>
  );
};
