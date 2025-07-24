
import React, { useRef, useEffect } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface TimelineEvent {
  day: number;
  month: string;
  title: string;
  location: string;
}

const events: TimelineEvent[] = [
  {
    day: 12,
    month: "May",
    title: "الاجتماع النصف سنوي للمراجعة المالية",
    location: "داخلي"
  },
  {
    day: 16,
    month: "May",
    title: "محاضرة العلامة من منظور الجماعة",
    location: "مسك الخيرية"
  },
  {
    day: 20,
    month: "May",
    title: "تسليم النماذج الأولية",
    location: "الخليج للتدريب"
  },
  {
    day: 25,
    month: "May",
    title: "اجتماع لمناقشة الشراكة العرفية",
    location: "جامعة الملك سعود"
  },
  {
    day: 2,
    month: "Jun",
    title: "القابلية الوظيفية",
    location: "داخلي"
  },
  {
    day: 7,
    month: "Jun",
    title: "حفل الترحيب بالموظفين الجدد",
    location: "داخلي"
  }
];

export const TimelineCard: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 2;
      timelineElement.scrollLeft += scrollAmount;
    };

    timelineElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      timelineElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <BaseCard 
      variant="glass" 
      size="sm" 
      className="col-span-3 h-[320px] overflow-hidden" 
      style={{ backgroundColor: '#f2ffff' }} 
      header={
        <h2 className="text-xl font-medium text-black font-arabic mb-6">الأحداث القادمة</h2>
      }
    >
      <div 
        ref={timelineRef}
        className="relative overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
        <div className="relative min-w-[1200px] h-[240px]">
          {/* خط التايم لاين */}
          <div className="absolute top-[180px] left-0 w-full h-[1px] bg-black"></div>

          <div className="flex items-start w-full absolute top-0 left-0 px-12 space-x-40" style={{ top: '60px' }}>
            {events.map((event, idx) => (
              <div key={idx} className="flex flex-row items-center text-right relative">
                {/* البيانات النصية */}
                <div className="flex flex-col items-end space-y-[1px] mr-[2px]">
                  <div className="flex items-baseline space-x-1 font-arabic">
                    <div className="text-[24px] text-black font-bold">{event.day}</div>
                    <div className="text-[10px] text-black">{event.month}</div>
                  </div>
                  <div className="text-[12px] text-black whitespace-nowrap font-arabic">{event.title}</div>
                  <div className="text-[14px] text-black font-bold font-arabic">{event.location}</div>
                </div>

                {/* الخط العمودي والدائرة */}
                <div className="flex flex-col items-center relative" style={{ top: '55px' }}>
                  <div className="w-[1px] h-[60px] bg-black"></div>
                  <div className="w-[40px] h-[40px] bg-[#f3ffff] border border-black rounded-full -mt-[20px]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
