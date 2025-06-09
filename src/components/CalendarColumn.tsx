
import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCcw, Plus, ArrowUpDown } from 'lucide-react';

interface CalendarColumnProps {
  isCompressed: boolean;
}

const CalendarColumn = ({ isCompressed }: CalendarColumnProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const currentMonth = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });

  // Sample events with more vibrant colors
  const events = [
    { date: 8, title: 'اجتماع المراجعة', type: 'meeting', color: '#FF6B6B' },
    { date: 12, title: 'تسليم المرحلة', type: 'deadline', color: '#4ECDC4' },
    { date: 15, title: 'ورشة التصميم', type: 'workshop', color: '#45B7D1' },
    { date: 20, title: 'مراجعة العميل', type: 'meeting', color: '#96CEB4' },
    { date: 25, title: 'إطلاق المشروع', type: 'milestone', color: '#FFEAA7' },
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
      className="h-full rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20 bg-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">التقويم</h2>
            <div className="flex items-center gap-3">
              <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
                <RefreshCcw className="w-5 h-5 text-gray-700 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
                <ArrowUpDown className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
                <Plus className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
          
          {/* View Mode Buttons */}
          <div className="flex gap-2 mb-4">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  viewMode === mode
                    ? 'bg-white/40 text-gray-800 border border-white/50 shadow-lg'
                    : 'text-gray-600 hover:bg-white/20 border border-white/20'
                }`}
              >
                {mode === 'month' ? 'شهر' : mode === 'week' ? 'أسبوع' : 'يوم'}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-4 hover:bg-white/30 rounded-2xl transition-all duration-300 border border-white/20"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-800">
              {currentMonth}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-4 hover:bg-white/30 rounded-2xl transition-all duration-300 border border-white/20"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white/20 rounded-3xl p-6 backdrop-blur-sm border border-white/30">
            <div className="grid grid-cols-7 gap-3">
              {/* Day Headers */}
              {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-700 p-3">
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
                      relative h-12 w-12 mx-auto flex items-center justify-center text-sm rounded-2xl transition-all duration-300 cursor-pointer
                      ${isTodayDate ? 'bg-blue-500 text-white font-bold shadow-lg scale-110' : ''}
                      ${isCurrentMonth ? 'text-gray-800 hover:bg-white/40 border border-white/20' : 'text-gray-400'}
                      ${event && !isTodayDate ? 'border-2' : ''}
                    `}
                    style={event && !isTodayDate ? { borderColor: event.color } : {}}
                  >
                    {date.getDate()}
                    {event && !isTodayDate && (
                      <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: event.color }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events Legend */}
          <div className="mt-6 bg-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/30">
            <h4 className="text-lg font-bold text-gray-800 mb-3">الأحداث القادمة</h4>
            <div className="space-y-2">
              {events.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-xl bg-white/20">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: event.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{event.title}</span>
                  <span className="text-xs text-gray-500 mr-auto">{event.date} من الشهر</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarColumn;
