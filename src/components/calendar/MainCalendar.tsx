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

  // Sample events with different colors
  const events: CalendarEvent[] = [{
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    startDate: new Date(2024, 11, 5),
    endDate: new Date(2024, 11, 5),
    color: '#0099FF',
    type: 'single'
  }, {
    id: '2',
    title: 'حملة التعريف بسوءها',
    startDate: new Date(2024, 11, 8),
    endDate: new Date(2024, 11, 10),
    color: '#34D399',
    type: 'multi-start'
  }, {
    id: '3',
    title: 'المؤتمرات الثقافية',
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2024, 11, 17),
    color: '#EF4444',
    type: 'multi-start'
  }, {
    id: '4',
    title: 'ورشة التصميم',
    startDate: new Date(2024, 11, 22),
    endDate: new Date(2024, 11, 22),
    color: '#A855F7',
    type: 'single'
  }, {
    id: '5',
    title: 'اجتماع المراجعة',
    startDate: new Date(2024, 11, 28),
    endDate: new Date(2024, 11, 30),
    color: '#F59E0B',
    type: 'multi-start'
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
  return <div className="h-full flex flex-col bg-white my-[196px] py-[240px]">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-soabra-text-primary" />
        </button>
        
        <h2 className="text-2xl font-bold text-soabra-text-primary">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-soabra-text-primary" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6 py-0">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => <div key={day} className="text-center text-sm font-semibold text-soabra-text-secondary py-2">
              {day}
            </div>)}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === today.toDateString();
          const dayEvents = getEventsForDate(day);
          return <div key={index} className={`
                  min-h-[100px] p-3 border border-gray-100 rounded-xl transition-all duration-200 relative
                  ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                  ${isToday ? 'ring-2 ring-soabra-primary-blue ring-opacity-50 bg-blue-50' : ''}
                  cursor-pointer hover:shadow-md
                `}>
                {/* Day Number */}
                <div className={`
                  text-sm font-bold mb-2
                  ${isCurrentMonth ? 'text-soabra-text-primary' : 'text-soabra-text-secondary'}
                  ${isToday ? 'text-soabra-primary-blue' : ''}
                `}>
                  {day.getDate()}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => <div key={eventIndex} className="text-xs px-2 py-1 rounded-lg text-white truncate font-medium" style={{
                backgroundColor: event.color
              }} title={event.title}>
                      {event.title}
                    </div>)}
                  {dayEvents.length > 2 && <div className="text-xs text-soabra-text-secondary font-medium">
                      +{dayEvents.length - 2} أخرى
                    </div>}
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-6 border-t border-gray-100 bg-gray-50 py-0">
        <h3 className="text-sm font-bold text-soabra-text-primary mb-3">المشاريع النشطة</h3>
        <div className="grid grid-cols-2 gap-2">
          {events.slice(0, 4).map(event => <div key={event.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
            backgroundColor: event.color
          }} />
              <span className="text-xs text-soabra-text-secondary truncate">
                {event.title}
              </span>
            </div>)}
        </div>
      </div>
    </div>;
};
export default MainCalendar;