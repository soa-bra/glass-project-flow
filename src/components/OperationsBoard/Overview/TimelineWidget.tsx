
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlassWidget from '@/components/ui/GlassWidget';

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
    <GlassWidget className={className}>
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-arabic font-bold text-white">
          الأحداث القادمة
        </h3>
        
        {/* أزرار التنقل */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(200)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={18} className="text-white/80" />
          </button>
          <button 
            onClick={() => scroll(-200)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={18} className="text-white/80" />
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
            py-4
          "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <ul className="flex items-center gap-16 px-4">
            {timeline.map((event, index) => (
              <li key={event.id} className="relative flex flex-col items-center min-w-fit">
                
                {/* التاريخ */}
                <span className="text-sm text-white/70 mb-4 whitespace-nowrap font-medium">
                  {new Date(event.date).toLocaleDateString('ar-SA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>

                {/* النقطة التفاعلية */}
                <div className="relative flex items-center">
                  {/* خط للنقطة السابقة */}
                  {index > 0 && (
                    <div className="absolute right-full h-0.5 bg-gradient-to-r from-white/20 to-white/40 w-16"></div>
                  )}
                  
                  <button
                    className="w-5 h-5 rounded-full border-2 border-white/80 shadow-lg transition-all hover:scale-125 hover:shadow-xl relative z-10 backdrop-blur-sm"
                    style={{ 
                      backgroundColor: event.color,
                      boxShadow: `0 0 20px ${event.color}30`
                    }}
                    onClick={() => openEvent(event)}
                  />
                  
                  {/* خط للنقطة التالية */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-full h-0.5 bg-gradient-to-r from-white/40 to-white/20 w-16"></div>
                  )}
                </div>

                {/* تفاصيل الحدث */}
                <div className="text-center mt-4">
                  <div className="text-base font-semibold whitespace-nowrap mb-2 text-white">
                    {event.title}
                  </div>
                  <div className="text-sm text-white/60 whitespace-nowrap">
                    {event.department}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassWidget>
  );
};
