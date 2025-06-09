
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Sample personal events with specific colors
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'اجتماع شخصي',
      startDate: new Date(2024, 11, 5),
      endDate: new Date(2024, 11, 5),
      color: '#FBBF24', // Mustard for single day events
      type: 'single'
    },
    {
      id: '2',
      title: 'مهمة شخصية',
      startDate: new Date(2024, 11, 8),
      endDate: new Date(2024, 11, 10),
      color: '#14B8A6', // Teal for multi-day events
      type: 'multi-start'
    },
    {
      id: '3',
      title: 'إجازة',
      startDate: new Date(2024, 11, 15),
      endDate: new Date(2024, 11, 17),
      color: '#14B8A6',
      type: 'multi-start'
    },
    {
      id: '4',
      title: 'موعد طبي',
      startDate: new Date(2024, 11, 22),
      endDate: new Date(2024, 11, 22),
      color: '#FBBF24',
      type: 'single'
    }
  ];

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

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const today = new Date();

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth('next')} 
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-soabra-text-primary" />
        </button>
        
        <h3 className="text-xl font-bold text-soabra-text-primary">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button 
          onClick={() => navigateMonth('prev')} 
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-soabra-text-primary" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-soabra-text-secondary py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === today.toDateString();
          const dayEvents = getEventsForDate(day);

          return (
            <div 
              key={index} 
              className={`
                relative h-8 w-8 flex items-center justify-center text-xs rounded border transition-all duration-200
                ${isCurrentMonth ? 'text-soabra-text-primary bg-white/30' : 'text-soabra-text-secondary bg-white/10'}
                ${isToday ? 'ring-2 ring-soabra-primary-blue bg-blue-100' : ''}
                hover:bg-white/40 cursor-pointer
              `}
            >
              {/* Day Number */}
              <span className={isToday ? 'text-soabra-primary-blue font-bold' : ''}>
                {day.getDate()}
              </span>

              {/* Single Day Events - Dots */}
              {dayEvents.filter(e => e.type === 'single').length > 0 && (
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              )}

              {/* Multi-Day Events - Lines */}
              {dayEvents.filter(e => e.type === 'multi-start').length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-soabra-text-secondary">أحداث شخصية</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-teal-500"></div>
            <span className="text-soabra-text-secondary">أحداث متعددة الأيام</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCalendar;
