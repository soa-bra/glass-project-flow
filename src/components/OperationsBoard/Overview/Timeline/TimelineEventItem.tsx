
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
    <div className="flex flex-col items-center min-w-[100px] group px-0 relative">
      {/* Date */}
      <div className="font-arabic text-[13px] font-medium text-gray-600 mb-3 bg-white/40 rounded-md px-2 py-1 shadow-sm border border-white/30 pointer-events-none select-none">
        {new Date(event.date).toLocaleDateString('ar-EG', {
          month: 'short',
          day: 'numeric'
        })}
      </div>

      {/* Event dot button */}
      <button
        className={`
          w-[30px] h-[30px] relative z-20 mb-2
          rounded-full border-4 border-white
          bg-gradient-to-br ${event.color || 'from-soabra-primary-blue to-slate-400'}
          shadow-md group-hover:scale-110 transition-transform duration-200
          focus:outline-none focus:ring-2 focus:ring-soabra-primary-blue
        `}
        style={{
          background: event.color ? undefined : 'linear-gradient(135deg, #70c1f1 0%, #bfd0f1 100%)'
        }}
        onClick={() => onEventClick(event)}
        onPointerDown={e => e.stopPropagation()}
      />

      {/* Event Details */}
      <div className="flex flex-col items-center mt-1 w-full max-w-[120px]">
        <div className="font-arabic text-sm font-bold text-gray-900 mb-1 px-2 py-1 rounded-lg bg-white/90 border border-white/60 shadow-sm select-none whitespace-nowrap">
          {event.title}
        </div>
        <div className="font-arabic text-xs font-semibold px-2 mt-1 rounded-[16px] border border-white/60 shadow-md"
          style={{
            background: 'linear-gradient(90deg, #f4ffe0, #e6f2fe 70%)',
            color: '#47a0d8',
          }}
        >
          {event.department}
        </div>
      </div>
    </div>
  );
};
