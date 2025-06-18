
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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--priority-colors-urgent-important)';
      case 'medium': return 'var(--priority-colors-not-urgent-important)';
      case 'low': return 'var(--priority-colors-urgent-not-important)';
      default: return 'var(--priority-colors-not-urgent-not-important)';
    }
  };

  return (
    <div className="relative flex flex-col items-center min-w-fit group px-4">
      {/* التاريخ في الأعلى */}
      <div className="text-center mb-4">
        <div className="text-lg font-bold text-gray-800 font-arabic mb-1">
          {new Date(event.date).toLocaleDateString('ar-EG', {
            day: 'numeric'
          })}
        </div>
        <div className="text-xs text-gray-600 font-arabic">
          {new Date(event.date).toLocaleDateString('ar-EG', {
            month: 'short'
          })}
        </div>
      </div>

      {/* الدائرة - تتوسط الخط */}
      <button 
        className="
          w-4 h-4 rounded-full border-2 border-white 
          shadow-md hover:shadow-lg
          transition-all duration-200 
          hover:scale-125 active:scale-95
          relative z-20 
          focus:outline-none focus:ring-2 focus:ring-gray-400
        " 
        style={{ backgroundColor: getPriorityColor(event.priority) }}
        onClick={() => onEventClick(event)} 
        onPointerDown={e => e.stopPropagation()} 
      />

      {/* تفاصيل الحدث تحت الخط */}
      <div className="text-center mt-4 max-w-32">
        <div className="text-xs font-bold text-gray-900 mb-2 font-arabic leading-tight">
          {event.title}
        </div>
        <div className="text-xs font-medium text-gray-700 font-arabic">
          {event.department}
        </div>
      </div>
    </div>
  );
};
