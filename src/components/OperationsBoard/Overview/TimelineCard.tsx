import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
const timelineEvents: TimelineEvent[] = [{
  date: {
    day: 12,
    month: "May",
    position: 1
  },
  title: "الاجتماع النصف سنوي للمراجعة المالية",
  location: {
    type: "internal",
    label: "داخلي"
  }
}, {
  date: {
    day: 16,
    month: "May",
    position: 2
  },
  title: "محاضرة العلامة من منظور الجماعة",
  location: {
    type: "external",
    label: "مسك الخيرية"
  }
}, {
  date: {
    day: 20,
    month: "May",
    position: 3
  },
  title: "تسليم النماذج الأولية",
  location: {
    type: "external",
    label: "الخليج للتدريب"
  }
}, {
  date: {
    day: 25,
    month: "May",
    position: 4
  },
  title: "اجتماع لمناقشة الشراكة العرفية",
  location: {
    type: "external",
    label: "جامعة الملك سعود"
  }
}, {
  date: {
    day: 2,
    month: "Jun",
    position: 5
  },
  title: "القابلية الوظيفية",
  location: {
    type: "internal",
    label: "داخلي"
  }
}, {
  date: {
    day: 7,
    month: "Jun",
    position: 6
  },
  title: "حفل الترحيب بالموظفين الجدد",
  location: {
    type: "internal",
    label: "داخلي"
  }
}];
export const TimelineCard: React.FC = () => {
  return <BaseCard variant="glass" size="sm" className="col-span-3 h-[320px] overflow-hidden" style={{
    backgroundColor: '#f2ffff'
  }} header={<h2 className="text-xl font-medium text-black font-arabic mb-6">الأحداث القادمة</h2>}>
      <div className="relative bg-[#f3ffff]">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {timelineEvents.map((event, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* التاريخ */}
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-black font-arabic">
                      {event.date.day}
                    </div>
                    <div className="text-sm text-gray-600 font-arabic">
                      {event.date.month}
                    </div>
                  </div>
                  
                  {/* خط الربط */}
                  <div className="w-px h-8 bg-gray-300"></div>
                  
                  {/* العنوان */}
                  <div className="text-sm font-arabic text-black leading-tight max-w-[120px]">
                    {event.title}
                  </div>
                  
                  {/* الموقع */}
                  <div className={`text-xs px-2 py-1 rounded-full font-arabic ${event.location.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {event.location.label}
                  </div>
                </div>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="absolute right-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute left-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </BaseCard>;
};