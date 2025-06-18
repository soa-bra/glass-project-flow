
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
  return (
    <BaseCard 
      variant="glass" 
      size="sm" 
      className="col-span-3 h-[320px] overflow-hidden" 
      style={{
        backgroundColor: '#f2ffff'
      }} 
      header={<h2 className="text-xl font-medium text-black font-arabic mb-6">الأحداث القادمة</h2>}
    >
      <div className="relative h-full">
        <Carousel className="w-full">
          <CarouselContent className="-ml-6">
            {timelineEvents.map((event, index) => (
              <CarouselItem key={index} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="relative flex flex-col items-center text-center">
                  {/* تاريخ الحدث */}
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-black font-arabic">{event.date.day}</div>
                    <div className="text-sm text-gray-600 font-arabic">{event.date.month}</div>
                  </div>
                  
                  {/* عنوان الحدث */}
                  <div className="mb-4 px-2">
                    <p className="text-sm font-medium text-black leading-tight font-arabic">{event.title}</p>
                  </div>
                  
                  {/* موقع الحدث */}
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-md text-sm font-arabic ${
                      event.location.type === 'internal' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.location.label}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
        </Carousel>
        
        {/* الخط الزمني الأفقي مع الدوائر */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="relative">
            {/* الخط الأفقي */}
            <div className="absolute h-[1px] bg-black w-full top-1/2 -translate-y-1/2"></div>
            
            {/* الدوائر */}
            <div className="flex justify-between relative">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
