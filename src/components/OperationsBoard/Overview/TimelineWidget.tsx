

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
  };

  return (
    <div className={`
      ${className}
      rounded-3xl p-6 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
    `}>
      
      {/* خلفية متدرجة مستوحاة من التصاميم */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-purple-300/20 to-pink-400/20 rounded-3xl"></div>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => scroll(200)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
            <button 
              onClick={() => scroll(-200)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-[#2A3437] font-arabic">
            الأحداث القادمة
          </h3>
        </header>

        {/* خط الزمن */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none h-full flex items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <ul className="flex items-center gap-12 py-6 px-4">
              {timeline.map((event, index) => (
                <li key={event.id} className="relative flex flex-col items-center min-w-fit">
                  
                  {/* التاريخ */}
                  <div className="mb-4 p-2 rounded-xl bg-white/50 backdrop-blur-sm">
                    <span className="text-xs text-gray-700 whitespace-nowrap font-medium font-arabic">
                      {new Date(event.date).toLocaleDateString('ar-SA', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  {/* النقطة التفاعلية */}
                  <div className="relative flex items-center">
                    {/* خط للنقطة السابقة */}
                    {index > 0 && (
                      <div className="absolute right-full h-1 bg-gradient-to-r from-indigo-300 to-purple-300 w-12 rounded-full"></div>
                    )}
                    
                    <button
                      className="relative w-6 h-6 rounded-full border-3 border-white shadow-xl transition-all duration-200 hover:scale-125 z-10 hover:shadow-2xl"
                      style={{ backgroundColor: event.color }}
                      onClick={() => openEvent(event)}
                    >
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: event.color }}></div>
                    </button>
                    
                    {/* خط للنقطة التالية */}
                    {index < timeline.length - 1 && (
                      <div className="absolute left-full h-1 bg-gradient-to-r from-purple-300 to-pink-300 w-12 rounded-full"></div>
                    )}
                  </div>

                  {/* تفاصيل الحدث */}
                  <div className="text-center mt-4 max-w-28">
                    <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm mb-2">
                      <div className="text-sm font-bold text-[#2A3437] whitespace-nowrap mb-1 font-arabic">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap font-arabic">
                        {event.department}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

