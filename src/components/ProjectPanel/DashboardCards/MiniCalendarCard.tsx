
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarCardProps {
  className?: string;
  events?: Array<{
    date: number;
    type: 'deadline' | 'meeting' | 'task';
  }>;
}

export const MiniCalendarCard: React.FC<MiniCalendarCardProps> = ({
  className = '',
  events = []
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const weekDays = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const getEventForDate = (date: number) => {
    return events.find(event => event.date === date);
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // أيام فارغة في بداية الشهر
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDate(day);
      const isToday = day === today && 
                     currentMonth === currentDate.getMonth() && 
                     currentYear === currentDate.getFullYear();
      
      days.push(
        <div
          key={day}
          className={`
            w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg
            transition-all duration-200 cursor-pointer relative
            ${isToday 
              ? 'bg-sky-500 text-white' 
              : 'text-gray-700 hover:bg-white/30'
            }
            ${event ? 'ring-2 ring-offset-1' : ''}
            ${event?.type === 'deadline' ? 'ring-red-400' : ''}
            ${event?.type === 'meeting' ? 'ring-blue-400' : ''}
            ${event?.type === 'task' ? 'ring-green-400' : ''}
          `}
        >
          {day}
          {event && (
            <div className={`
              absolute -bottom-1 -right-1 w-2 h-2 rounded-full
              ${event.type === 'deadline' ? 'bg-red-500' : ''}
              ${event.type === 'meeting' ? 'bg-blue-500' : ''}
              ${event.type === 'task' ? 'bg-green-500' : ''}
            `}></div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className={`
      bg-white/40 backdrop-blur-[20px] rounded-[20px] p-5 border border-white/40
      hover:bg-white/50 transition-all duration-300 ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">
          التقويم
        </h3>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <CalendarIcon size={16} className="text-blue-600" />
        </div>
      </div>

      {/* تنقل الشهر */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors"
        >
          <ChevronRight size={14} className="text-gray-600" />
        </button>
        
        <span className="text-sm font-semibold text-gray-800 font-arabic">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={14} className="text-gray-600" />
        </button>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* أيام الشهر */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* مفاتيح الألوان */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-600">موعد نهائي</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">اجتماع</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">مهمة</span>
        </div>
      </div>
    </div>
  );
};
