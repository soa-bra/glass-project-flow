
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

interface TimelineEvent {
  date: {
    day: number;
    month: string;
    position: number;
  };
  title: string;
  location: {
    type: 'internal' | 'external';
    label: string;
  };
}

const timelineEvents: TimelineEvent[] = [
  {
    date: { day: 12, month: "May", position: 1 },
    title: "الاجتماع النصف سنوي للمراجعة المالية",
    location: { type: "internal", label: "داخلي" }
  },
  {
    date: { day: 16, month: "May", position: 2 },
    title: "محاضرة العلامة من منظور الجماعة", 
    location: { type: "external", label: "مسك الخيرية" }
  },
  {
    date: { day: 20, month: "May", position: 3 },
    title: "تسليم النماذج الأولية",
    location: { type: "external", label: "الخليج للتدريب" }
  },
  {
    date: { day: 25, month: "May", position: 4 },
    title: "اجتماع لمناقشة الشراكة العرفية",
    location: { type: "external", label: "جامعة الملك سعود" }
  },
  {
    date: { day: 2, month: "Jun", position: 5 },
    title: "القابلية الوظيفية",
    location: { type: "internal", label: "داخلي" }
  },
  {
    date: { day: 7, month: "Jun", position: 6 },
    title: "حفل الترحيب بالموظفين الجدد",
    location: { type: "internal", label: "داخلي" }
  }
];

export const TimelineCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="md"
      className="col-span-3 h-[180px]"
      style={{ backgroundColor: '#f2ffff' }}
      header={
        <h2 className="text-2xl font-medium text-black font-arabic mb-2">الأحداث القادمة</h2>
      }
    >
      <div className="relative h-full flex flex-col justify-end pb-4">
        <Carousel className="w-full" opts={{ direction: 'rtl', align: 'start' }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {timelineEvents.map((event, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 lg:basis-1/4">
                <div className="flex flex-col items-center relative h-full">
                  {/* تفاصيل الحدث - في الأعلى */}
                  <div className="text-right mb-4 max-w-[120px] flex-1">
                    {/* نص الحدث */}
                    <div className="text-xs text-black font-arabic mb-2 leading-tight font-normal">
                      {event.title}
                    </div>
                    
                    {/* الموقع */}
                    <div className="text-base font-medium text-black font-arabic">
                      {event.location.label}
                    </div>
                  </div>
                  
                  {/* العلامة الدائرية والخط */}
                  <div className="relative flex items-center">
                    {/* الخط الأفقي - يظهر فقط إذا لم يكن العنصر الأخير */}
                    {index < timelineEvents.length - 1 && (
                      <div className="absolute left-[10px] w-[120px] h-[1px] bg-black"></div>
                    )}
                    <div className="w-5 h-5 bg-black rounded-full relative z-10"></div>
                  </div>
                  
                  {/* التاريخ - في الأسفل */}
                  <div className="text-center mt-2">
                    <div className="text-xl font-normal text-black font-arabic">
                      {event.date.day.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs font-bold text-black font-arabic">
                      {event.date.month}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </BaseCard>
  );
};
