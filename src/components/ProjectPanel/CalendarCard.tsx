
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
}

interface CalendarCardProps {
  events: CalendarEvent[];
  onViewCalendar: () => void;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  events,
  onViewCalendar
}) => {
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="h-full bg-white/30 backdrop-blur-[15px] rounded-[20px] p-4 border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onViewCalendar}
          className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
        >
          عرض الكل ←
        </button>
        
        <h3 className="text-lg font-bold text-gray-800 font-arabic">التقويم</h3>
      </div>
      
      {upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white/20 backdrop-blur-[10px] rounded-[12px] p-3 border border-white/30"
            >
              <h4 className="font-semibold text-gray-800 text-sm mb-1 font-arabic">
                {event.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={12} />
                <span>{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                {event.time && (
                  <>
                    <Clock size={12} />
                    <span>{event.time}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <Calendar size={32} className="mb-2 opacity-50" />
          <p className="text-sm font-arabic">لا توجد أحداث قادمة</p>
        </div>
      )}
    </div>
  );
};
