
import React, { useRef } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface TimelineEvent {
  day: string;
  month: string;
  title: string;
  location: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    day: "20",
    month: "May",
    title: "تسليم النماذج الأولية",
    location: "الخليج للتدريب"
  },
  {
    day: "25",
    month: "May",
    title: "إجتماع لمناقشة الشراكة القروية",
    location: "جامعة الملك سعود"
  },
  {
    day: "02",
    month: "Jun",
    title: "المقابلات التوظيفية",
    location: "داخلي"
  },
  {
    day: "07",
    month: "Jun",
    title: "حفل الترحيب بالموظفين الجدد",
    location: "داخلي"
  }
];

export const TimelineCard: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <BaseCard 
      variant="glass" 
      size="sm" 
      className="col-span-3 h-[320px] overflow-hidden" 
      style={{ backgroundColor: '#EAF1F4' }}
    >
      <div className="relative bg-[#EAF1F4] rounded-lg w-full h-[220px]">
        <h2 className="text-[28px] font-bold text-right text-[#000000] absolute top-5 right-10">
          الأحداث القادمة
        </h2>

        {/* خط التايم لاين */}
        <div className="absolute top-[180px] left-0 w-full h-[1px] bg-black"></div>

        <div 
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="flex justify-between items-start w-full absolute top-0 left-0 px-12 overflow-x-auto scrollbar-hide" 
          style={{ top: '60px' }}
        >
          {timelineEvents.map((event, idx) => (
            <div key={idx} className="flex flex-row items-center text-right min-w-[200px] relative">
              {/* البيانات النصية */}
              <div className="flex flex-col items-end space-y-[1px] mr-[2px]">
                <div className="text-[10px] text-black">{event.month}</div>
                <div className="text-[24px] text-black font-bold">{event.day}</div>
                <div className="text-[12px] text-black whitespace-nowrap">{event.title}</div>
                <div className="text-[14px] text-black font-bold">{event.location}</div>
              </div>

              {/* الخط العمودي والدائرة */}
              <div className="flex flex-col items-center relative" style={{ top: '55px' }}>
                <div className="w-[1px] h-[60px] bg-black"></div>
                <div className="w-[40px] h-[40px] bg-[#EAF1F4] border border-black rounded-full -mt-[20px]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};
