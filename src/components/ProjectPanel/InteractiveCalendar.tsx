
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'task';
  attendees?: number;
}

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events,
  onEventClick,
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const isToday = (date: number) => {
    return today.getDate() === date && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const isSelected = (date: number) => {
    return selectedDate?.getDate() === date && 
           selectedDate?.getMonth() === month && 
           selectedDate?.getFullYear() === year;
  };

  const handleDateClick = (date: number) => {
    const clickedDate = new Date(year, month, date);
    setSelectedDate(clickedDate);
    onDateClick?.(clickedDate);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'deadline': return 'bg-red-500';
      case 'task': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
      {/* رأس التقويم */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 font-arabic">تقويم المشروع</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
          <span className="px-4 py-2 bg-white/20 rounded-lg font-semibold text-gray-800 min-w-[120px] text-center">
            {currentDate.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center p-2 text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* أيام الشهر */}
      <div className="grid grid-cols-7 gap-2">
        {/* أيام فارغة في بداية الشهر */}
        {Array.from({ length: startingDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {/* أيام الشهر */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = i + 1;
          const dayEvents = getEventsForDate(date);
          
          return (
            <div
              key={date}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square flex flex-col items-center justify-center p-1 text-sm rounded-lg cursor-pointer transition-all
                ${isToday(date) ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/20'}
                ${isSelected(date) ? 'ring-2 ring-sky-500 bg-sky-100' : ''}
              `}
            >
              <span className={isToday(date) ? 'text-white' : 'text-gray-800'}>
                {date}
              </span>
              
              {/* مؤشرات الأحداث */}
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                      title={event.title}
                    ></div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title={`+${dayEvents.length - 3} المزيد`}></div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* قائمة الأحداث للتاريخ المحدد */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30">
          <h4 className="font-semibold text-gray-800 mb-3">
            أحداث يوم {selectedDate.toLocaleDateString('ar-SA')}
          </h4>
          
          {getEventsForDate(selectedDate.getDate()).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDate(selectedDate.getDate()).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="flex items-center gap-3 p-2 bg-white/20 rounded-lg hover:bg-white/30 cursor-pointer transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{event.title}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{event.time}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{event.attendees}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p>لا توجد أحداث في هذا اليوم</p>
              <button className="mt-2 flex items-center gap-2 mx-auto px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                <Plus size={14} />
                <span>إضافة حدث</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
