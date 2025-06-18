
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
      size="md" 
      className="col-span-3 h-[180px] overflow-hidden" 
      style={{
        backgroundColor: '#f2ffff'
      }} 
      header={<h2 className="text-2xl font-medium text-black font-arabic mb-6">الأحداث القادمة</h2>}
    >
      <div className="relative h-full">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {timelineEvents.map((event, index) => (
              <CarouselItem key={index} className="basis-1/3 h-full">
                <div className="relative h-full flex flex-col items-center justify-center px-4">
                  {/* الدائرة والخط */}
                  <div className="relative flex flex-col items-center">
                    {/* الدائرة */}
                    <div className="w-4 h-4 bg-black rounded-full z-10 mb-2"></div>
                    
                    {/* التاريخ */}
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-black">{event.date.day}</div>
                      <div className="text-sm text-gray-600">{event.date.month}</div>
                    </div>
                    
                    {/* العنوان */}
                    <div className="text-center mb-2">
                      <p className="text-sm font-medium text-black leading-tight">{event.title}</p>
                    </div>
                    
                    {/* الموقع */}
                    <div className="text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        event.location.type === 'internal' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.location.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* الخط الأفقي - يظهر فقط بين العناصر */}
                  {index < timelineEvents.length - 1 && (
                    <div className="absolute top-[20px] right-0 w-full h-[1px] bg-black opacity-30 z-0"></div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </BaseCard>
  );
};
