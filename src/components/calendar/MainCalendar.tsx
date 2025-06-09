
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Filter } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  type: 'single' | 'multi-start' | 'multi-continue' | 'multi-end';
}

const MainCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events with multi-day support
  const events: CalendarEvent[] = [{
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    startDate: new Date(2024, 11, 5),
    endDate: new Date(2024, 11, 8),
    color: '#8B5CF6',
    type: 'multi-start'
  }, {
    id: '2',
    title: 'حملة التعريف بسوبرا',
    startDate: new Date(2024, 11, 10),
    endDate: new Date(2024, 11, 15),
    color: '#EC4899',
    type: 'multi-start'
  }, {
    id: '3',
    title: 'المؤتمرات الثقافية',
    startDate: new Date(2024, 11, 18),
    endDate: new Date(2024, 11, 22),
    color: '#06B6D4',
    type: 'multi-start'
  }, {
    id: '4',
    title: 'ورشة التصميم',
    startDate: new Date(2024, 11, 25),
    endDate: new Date(2024, 11, 25),
    color: '#F59E0B',
    type: 'single'
  }];

  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventForDate = (date: Date) => {
    return events.find(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  const getEventPosition = (event: CalendarEvent, date: Date) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const checkDate = new Date(date);
    
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === eventStart.getTime()) {
      return 'start';
    } else if (checkDate.getTime() === eventEnd.getTime()) {
      return 'end';
    } else if (checkDate > eventStart && checkDate < eventEnd) {
      return 'middle';
    }
    return null;
  };

  const today = new Date();

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm rounded-xl m-6 shadow-xl border border-white/60">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/60 rounded-lg transition-colors group">
            <Filter className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>
          <button 
            onClick={() => navigateMonth('prev')} 
            className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>
          <button 
            onClick={() => navigateMonth('next')} 
            className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const dayEvent = getEventForDate(day);
            const eventPosition = dayEvent ? getEventPosition(dayEvent, day) : null;

            return (
              <div 
                key={index} 
                className={`
                  min-h-[100px] p-3 border border-gray-200/40 rounded-xl transition-all duration-200 relative group
                  ${isCurrentMonth ? 'bg-white/90 hover:bg-white/95' : 'bg-gray-50/60'}
                  ${isToday ? 'ring-2 ring-purple-400 ring-opacity-50 bg-purple-50/80' : ''}
                  cursor-pointer hover:shadow-md hover:border-purple-300/50
                `}
              >
                {/* Day Number */}
                <div className={`
                  text-sm font-bold mb-2 flex items-center justify-between
                  ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${isToday ? 'text-purple-600' : ''}
                `}>
                  <span>{day.getDate()}</span>
                  {dayEvent && (
                    <Clock className="w-3 h-3 text-gray-500" />
                  )}
                </div>

                {/* Extended Event Bar */}
                {dayEvent && eventPosition && (
                  <div className="absolute bottom-2 left-1 right-1 h-6 flex items-center">
                    <div 
                      className={`
                        h-4 text-white text-xs font-medium flex items-center px-2 text-center
                        ${eventPosition === 'start' ? 'rounded-r-md rounded-l-full' : ''}
                        ${eventPosition === 'end' ? 'rounded-l-md rounded-r-full' : ''}
                        ${eventPosition === 'middle' ? 'rounded-none' : ''}
                        ${eventPosition === 'start' || eventPosition === 'end' ? 'w-full' : 'w-full'}
                      `}
                      style={{ backgroundColor: dayEvent.color }}
                    >
                      {eventPosition === 'start' && (
                        <span className="truncate text-xs">{dayEvent.title}</span>
                      )}
                      {eventPosition === 'middle' && (
                        <div className="w-full h-full opacity-80" />
                      )}
                      {eventPosition === 'end' && (
                        <span className="truncate text-xs">انتهاء</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-b-xl">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Calendar className="w-3 h-3 text-white" />
          </div>
          المشاريع النشطة
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {events.map(event => (
            <div key={event.id} className="flex items-center gap-3 group">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm" 
                style={{ backgroundColor: event.color }} 
              />
              <span className="text-xs text-gray-600 truncate group-hover:text-gray-800 transition-colors">
                {event.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCalendar;
