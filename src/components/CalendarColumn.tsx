
interface CalendarColumnProps {
  isCompressed: boolean;
}

const CalendarColumn = ({ isCompressed }: CalendarColumnProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
  
  // Generate calendar days for current month
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
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  
  // Sample events
  const events = [
    { date: 5, type: 'single' },
    { date: 12, type: 'single' },
    { date: 18, type: 'multi-start' },
    { date: 19, type: 'multi-continue' },
    { date: 20, type: 'multi-end' },
    { date: 25, type: 'single' },
  ];

  return (
    <div className={`
      ${isCompressed ? 'w-[15%]' : 'w-1/5'} 
      calendar-gradient border-l border-gray-200 z-calendar transition-all duration-300
    `}>
      <div className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-heading-sub">{currentMonth}</h2>
          <button className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-soabra-text-secondary p-1">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayNumber = day.getDate();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === currentDate.toDateString();
            const hasEvent = events.some(event => event.date === dayNumber && isCurrentMonth);
            
            return (
              <div
                key={index}
                className={`
                  relative w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors
                  ${isCurrentMonth ? 'text-soabra-text-primary' : 'text-soabra-text-secondary/50'}
                  ${isToday ? 'bg-soabra-primary-blue text-white font-semibold' : 'hover:bg-white/20'}
                  cursor-pointer
                `}
              >
                {dayNumber}
                {hasEvent && !isToday && (
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-soabra-warning rounded-full" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Events List */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-soabra-text-primary mb-3">أحداث اليوم</h3>
          <div className="space-y-2">
            <div className="text-xs text-soabra-text-secondary p-2 bg-white/20 rounded-md">
              اجتماع فريق التطوير - 10:00 ص
            </div>
            <div className="text-xs text-soabra-text-secondary p-2 bg-white/20 rounded-md">
              مراجعة المشروع - 2:00 م
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import icons that we're using
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default CalendarColumn;
