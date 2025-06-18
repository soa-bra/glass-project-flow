
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { TimelineScrollContainer } from './TimelineScrollContainer';
import { TimelineEvent } from './types';

const mockTimelineData: TimelineEvent[] = [
  {
    id: 1,
    date: '2024-06-12',
    title: 'الاجتماع الشهري مع فريق التطوير الرقمي',
    department: 'داخلي',
    color: '#000000'
  },
  {
    id: 2,
    date: '2024-05-16',
    title: 'متابعة المشاريع مع شركة النهضة',
    department: 'مسك الخيرية',
    color: '#000000'
  },
  {
    id: 3,
    date: '2024-05-20',
    title: 'تسليم التدريب التقني',
    department: 'المحيط للتدريب',
    color: '#000000'
  },
  {
    id: 4,
    date: '2024-05-25',
    title: 'تجربة قاعدة البيانات المترية',
    department: 'جامعة الملك سعود',
    color: '#000000'
  },
  {
    id: 5,
    date: '2024-06-02',
    title: 'القراءات الجديدة للبحث',
    department: 'داخلي',
    color: '#000000'
  },
  {
    id: 6,
    date: '2024-06-07',
    title: 'جلسة مراجعة النموذج المدخل',
    department: 'داخلي',
    color: '#000000'
  }
];

export const TimelineCard: React.FC = () => {
  const handleEventClick = (event: TimelineEvent) => {
    console.log('تم النقر على الحدث:', event);
  };

  return (
    <BaseCard 
      variant="glass" 
      size="md"
      className="h-[200px] col-span-3"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">الأحداث القادمة</h3>
          <div className="flex gap-2">
            <button 
              className="text-white px-3 py-1 rounded-full text-xs font-arabic"
              style={{ backgroundColor: '#bdeed3' }}
            >
              وفق الخطة
            </button>
            <button 
              className="text-black px-3 py-1 rounded-full text-xs font-arabic"
              style={{ backgroundColor: '#a4e2f6' }}
            >
              1 أسابيع
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 mt-4">
        <TimelineScrollContainer 
          timeline={mockTimelineData} 
          onEventClick={handleEventClick}
        />
      </div>
    </BaseCard>
  );
};
