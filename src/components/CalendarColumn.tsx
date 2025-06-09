
import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCcw, Plus, ArrowUpDown, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarColumnProps {
  isCompressed: boolean;
}

const CalendarColumn = ({ isCompressed }: CalendarColumnProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const currentMonth = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });

  // Sample events
  const events = [
    { date: 8, title: 'Long Event', type: 'long', color: '#F23D3D' },
    { date: 9, title: 'Long Event', type: 'long', color: '#5DDC82' },
    { date: 10, title: 'Long Event', type: 'extended', color: '#FBBF24' },
    { date: 15, title: 'Long Event', type: 'long', color: '#0099FF' },
    { date: 20, title: 'Long Event', type: 'extended', color: '#F23D3D' },
    { date: 25, title: 'Long Event', type: 'long', color: '#A855F7' }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonthNumber = currentDate.getMonth();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getEventForDate = (date: Date) => {
    return events.find(event => 
      event.date === date.getDate() && 
      date.getMonth() === currentMonthNumber
    );
  };

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  return (
    <div 
      className="h-full rounded-t-2xl shadow-lg border border-gray-100 overflow-hidden z-calendar"
      style={{
        background: 'linear-gradient(135deg, #E8F2FE 0%, #F9DBF8 50%, #DAD4FC 100%)',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0'
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-soabra-text-primary">التقويم</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                  <RefreshCcw className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                  <ArrowUpDown className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                  <Plus className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
            </div>
          </div>
          
          {/* View Mode Buttons */}
          <div className="flex gap-2 mb-4">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  viewMode === mode
                    ? 'bg-white/40 text-soabra-text-primary border border-white/50'
                    : 'text-soabra-text-secondary hover:bg-white/20'
                }`}
              >
                {mode === 'month' ? 'شهر' : mode === 'week' ? 'أسبوع' : 'يوم'}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 p-4">
          {/* Glass Inner Card */}
          <div 
            className="h-full rounded-lg p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.40)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-soabra-text-primary" />
              </button>
              
              <h3 className="text-xl font-medium text-soabra-text-primary">
                {currentMonth}
              </h3>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-soabra-text-primary" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-soabra-text-secondary p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {calendarDays.map((date, index) => {
                const event = getEventForDate(date);
                const isCurrentMonth = date.getMonth() === currentMonthNumber;
                const isTodayDate = isToday(date);
                
                return (
                  <div
                    key={index}
                    className={`
                      relative h-[30px] w-[30px] mx-auto flex items-center justify-center text-sm rounded-md transition-colors cursor-pointer
                      ${isTodayDate ? 'bg-soabra-primary-blue text-white font-semibold' : ''}
                      ${isCurrentMonth ? 'text-soabra-text-primary hover:bg-white/20' : 'text-soabra-text-secondary/50'}
                    `}
                  >
                    {date.getDate()}
                    {event && !isTodayDate && (
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: event.type === 'extended' ? '#008080' : '#DAA520' }}
                      />
                    )}
                    {event && event.type === 'extended' && (
                      <div
                        className="absolute inset-x-0 bottom-1 h-0.5 rounded"
                        style={{ backgroundColor: '#FFB6C1' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarColumn;
