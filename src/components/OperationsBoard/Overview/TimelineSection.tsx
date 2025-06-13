
import React, { useRef } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <BaseCard 
      size="md"
      variant="glass"
      header={
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={scrollLeft}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          <h3 className="text-lg font-arabic font-bold text-gray-800">
            المواعيد والأحداث القادمة
          </h3>
        </div>
      }
      className="w-full h-[200px]"
    >
      <div className="relative flex-1 overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex items-center gap-8 overflow-x-auto scrollbar-hide pb-2 h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {timeline.map((event, index) => (
            <div key={event.id} className="flex flex-col items-center min-w-fit relative">
              <div className="text-xs text-gray-500 mb-3 whitespace-nowrap font-medium">
                {new Date(event.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
              </div>
              
              {/* خط الزمن الأفقي */}
              <div className="relative flex items-center">
                {index > 0 && (
                  <div className="absolute right-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 w-8"></div>
                )}
                
                <div className={`w-4 h-4 rounded-full ${event.color} relative z-10 bg-white border-2 shadow-sm`}></div>
                
                {index < timeline.length - 1 && (
                  <div className="absolute left-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 w-8"></div>
                )}
              </div>
              
              <div className="text-center mt-3">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap mb-1">
                  {event.title}
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">
                  {event.department}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};
