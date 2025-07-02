
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Zap, Palette, MessageSquare, Calendar, Award } from 'lucide-react';

export const RecentActivitiesCard: React.FC = () => {
  const activities = [
    {
      icon: Palette,
      title: 'تم تحديث دليل الهوية البصرية',
      time: 'منذ ساعتين',
      status: 'جديد'
    },
    {
      icon: MessageSquare,
      title: 'مراجعة محتوى حملة "التراث الثقافي"',
      time: 'منذ 4 ساعات',
      status: 'قيد المراجعة'
    },
    {
      icon: Calendar,
      title: 'تم جدولة فعالية "ندوة علم اجتماع العلامة"',
      time: 'أمس',
      status: 'مجدولة'
    },
    {
      icon: Award,
      title: 'نشر بحث "الهوية الثقافية للعلامات السعودية"',
      time: 'منذ يومين',
      status: 'منشور'
    }
  ];

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">النشاطات الأخيرة</h3>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
            <activity.icon className="h-4 w-4 text-black" />
            <div className="flex-1">
              <span className="text-sm font-medium text-black font-arabic">{activity.title}</span>
              <div className="text-xs text-black font-arabic">{activity.time}</div>
            </div>
            <Badge variant="secondary" className="text-black">{activity.status}</Badge>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
