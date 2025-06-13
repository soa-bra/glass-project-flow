
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
      rounded-2xl p-4 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-sm transition-all duration-300
    `}>
      
      {/* المحتوى */}
      <div className="relative z-10 h-full">
        {/* رأس البطاقة */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => scroll(200)}
              className="w-8 h-8 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 transition-all duration-200 flex items-center justify-center"
            >
              <ChevronRight size={14} className="text-indigo-600" />
            </button>
            <button 
              onClick={() => scroll(-200)}
              className="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 flex items-center justify-center"
            >
              <ChevronLeft size={14} className="text-purple-600" />
            </button>
          </div>
          <h3 className="text-sm font-medium text-gray-800 font-arabic">
            الأحداث القادمة
          </h3>
        </header>

        {/* خط الزمن */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide h-full flex items-center pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <ul className="flex items-center gap-8 py-4 px-2">
              {timeline.map((event, index) => (
                <li key={event.id} className="relative flex flex-col items-center min-w-fit">
                  
                  {/* التاريخ */}
                  <div className="mb-3 p-2 rounded-lg bg-white/40">
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
                      <div className="absolute right-full h-0.5 bg-gray-300 w-8 rounded-full"></div>
                    )}
                    
                    <button
                      className="relative w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all duration-200 hover:scale-125 z-10"
                      style={{ backgroundColor: event.color }}
                      onClick={() => openEvent(event)}
                    >
                    </button>
                    
                    {/* خط للنقطة التالية */}
                    {index < timeline.length - 1 && (
                      <div className="absolute left-full h-0.5 bg-gray-300 w-8 rounded-full"></div>
                    )}
                  </div>

                  {/* تفاصيل الحدث */}
                  <div className="text-center mt-3 max-w-24">
                    <div className="p-2 rounded-lg bg-white/40 mb-1">
                      <div className="text-xs font-medium text-gray-900 whitespace-nowrap mb-1 font-arabic">
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
