
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
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Sample events with different colors
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'تطوير الموقع الإلكتروني',
      startDate: new Date(2024, 11, 5),
      endDate: new Date(2024, 11, 5),
      color: '#0099FF',
      type: 'single'
    },
    {
      id: '2',
      title: 'حملة التعريف بسوءها',
      startDate: new Date(2024, 11, 8),
      endDate: new Date(2024, 11, 10),
      color: '#34D399',
      type: 'multi-start'
    },
    {
      id: '3',
      title: 'المؤتمرات الثقافية',
      startDate: new Date(2024, 11, 15),
      endDate: new Date(2024, 11, 17),
      color: '#EF4444',
      type: 'multi-start'
    },
    {
      id: '4',
      title: 'ورشة التصميم',
      startDate: new Date(2024, 11, 22),
      endDate: new Date(2024, 11, 22),
      color: '#A855F7',
      type: 'single'
    }
  ];

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Adjust for week start (Sunday = 0)
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
    <div className="h-full flex flex-col bg-transparent">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateMonth('next')} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-soabra-text-primary" />
          </button>
          
          <h2 className="text-lg font-medium text-soabra-text-primary mx-4">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button 
            onClick={() => navigateMonth('prev')} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-soabra-text-primary" />
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
          {['شهر', 'أسبوع', 'يوم'].map((mode, index) => {
            const modeKey = ['month', 'week', 'day'][index] as 'month' | 'week' | 'day';
            return (
              <button
                key={mode}
                onClick={() => setViewMode(modeKey)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewMode === modeKey
                    ? 'bg-white text-soabra-text-primary'
                    : 'text-soabra-text-primary hover:bg-white/20'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4 overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-soabra-text-primary py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 h-5/6">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(day);

            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border border-white/20 rounded transition-all duration-200 relative
                  ${isCurrentMonth ? 'bg-white/30 hover:bg-white/40' : 'bg-white/10'}
                  ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/30' : ''}
                  cursor-pointer
                `}
              >
                {/* Day Number */}
                <div className={`
                  text-xs font-medium mb-1
                  ${isCurrentMonth ? 'text-soabra-text-primary' : 'text-soabra-text-secondary'}
                  ${isToday ? 'text-blue-600 font-bold' : ''}
                `}>
                  {day.getDate()}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-xs px-2 py-1 rounded text-white truncate font-medium"
                      style={{ backgroundColor: event.color }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-soabra-text-secondary font-medium">
                      +{dayEvents.length - 2} أخرى
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainCalendar;
