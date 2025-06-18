
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
  const eventDate = new Date(event.date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="relative flex flex-col items-center min-w-fit group px-4">
      {/* التاريخ في الأعلى */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-gray-800 mb-1 font-arabic">
          {day}
        </div>
        <div className="text-sm text-gray-600 font-arabic">
          {month}
        </div>
      </div>

      {/* وصف الحدث */}
      <div className="text-center mb-4 max-w-40">
        <div className="text-xs text-gray-700 mb-2 font-arabic leading-tight">
          {event.title}
        </div>
        <div className="text-xs font-bold text-gray-900 font-arabic">
          {event.department}
        </div>
      </div>

      {/* الدائرة السوداء البسيطة - تتوسط الخط */}
      <button 
        className="
          w-8 h-8 rounded-full bg-white border-2 border-gray-400 
          shadow-md hover:shadow-lg
          transition-all duration-200 
          hover:scale-110 active:scale-95
          relative z-20 
          focus:outline-none focus:ring-2 focus:ring-gray-400
        " 
        onClick={() => onEventClick(event)} 
        onPointerDown={e => e.stopPropagation()} 
      />
    </div>
  );
};
