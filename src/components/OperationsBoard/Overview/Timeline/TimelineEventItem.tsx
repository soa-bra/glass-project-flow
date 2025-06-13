
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
  const getDotColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="relative flex flex-col items-center min-w-fit group px-8">
      {/* نقطة ملونة كبيرة */}
      <button
        className={`
          w-5 h-5 rounded-full border-2 border-white
          ${getDotColor(event.color)}
          shadow-lg hover:shadow-xl
          transition-all duration-200 
          hover:scale-110 active:scale-95
          relative z-20 
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
          cursor-pointer
        `}
        onClick={() => onEventClick(event)}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* معلومات الحدث أسفل النقطة */}
      <div className="text-center mt-4 max-w-40 transition-all duration-200">
        {/* عنوان المشروع */}
        <div className="text-sm font-bold text-gray-900 mb-1 leading-tight line-clamp-2">
          {event.title}
        </div>
        
        {/* وصف المهمة */}
        <div className="text-xs font-medium text-gray-600 mb-2 leading-tight line-clamp-1">
          {event.department}
        </div>
        
        {/* التاريخ */}
        <div className="text-xs font-medium text-gray-500 leading-tight">
          {new Date(event.date).toLocaleDateString('ar-SA', { 
            day: 'numeric',
            month: 'short'
          })}
        </div>
        
        {/* الرقم التسلسلي */}
        <div className="text-xs font-bold text-gray-800 mt-1">
          15K
        </div>
      </div>
    </div>
  );
};
