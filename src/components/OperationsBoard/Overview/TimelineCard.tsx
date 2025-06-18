import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
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
  return <BaseCard variant="glass" size="md" className="col-span-3 h-[180px] overflow-x-auto" style={{
    backgroundColor: '#f2ffff'
  }} header={<h2 className="text-2xl font-medium text-black font-arabic mb-6">الأحداث القادمة</h2>}>
      <div className="relative flex justify-between items-start min-w-[800px] h-full">
        {/* الخط الأفقي */}
        <div className="absolute top-[60px] left-[40px] right-[40px] h-[1px] bg-black"></div>
        
        {/* العلامات والأحداث */}
        {timelineEvents.map((event, index) => {})}
      </div>
    </BaseCard>;
};