
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface TimelineWidgetProps {
  timeline: TimelineEvent[];
  className?: string;
}

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({ 
  timeline, 
  className = '' 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ 
        left: direction, 
        behavior: 'smooth' 
      });
    }
  };

  const openEvent = (event: TimelineEvent) => {
    console.log('فتح الحدث:', event);
    // يمكن إضافة modal أو popover هنا
  };

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
    `}>
      
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          الأحداث القادمة
        </h3>
        
        {/* أزرار التنقل */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(200)}
            className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => scroll(-200)}
            className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </header>

      {/* خط الزمن القابل للتمرير */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={scrollRef}
          className="
            overflow-x-auto scrollbar-hide
            cursor-grab active:cursor-grabbing select-none
            h-full flex items-center
          "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <ul className="flex items-center gap-12 py-6 px-4">
            {timeline.map((event, index) => (
              <li key={event.id} className="relative flex flex-col items-center min-w-fit">
                
                {/* التاريخ */}
                <span className="text-xs text-gray-600 mb-3 whitespace-nowrap font-medium">
                  {new Date(event.date).toLocaleDateString('ar-SA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>

                {/* النقطة التفاعلية مع الخط */}
                <div className="relative flex items-center">
                  {/* خط للنقطة السابقة */}
                  {index > 0 && (
                    <div className="absolute right-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 w-12 rounded-full"></div>
                  )}
                  
                  <button
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md transition-all duration-200 hover:scale-110 relative z-10 hover:shadow-lg"
                    style={{ backgroundColor: event.color }}
                    onClick={() => openEvent(event)}
                  />
                  
                  {/* خط للنقطة التالية */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 w-12 rounded-full"></div>
                  )}
                </div>

                {/* تفاصيل الحدث */}
                <div className="text-center mt-3 max-w-28">
                  <div className="text-xs font-semibold text-gray-900 whitespace-nowrap mb-1">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-600 whitespace-nowrap opacity-75">
                    {event.department}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
