
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Download, Brain, FileText } from 'lucide-react';

export const RecentActivityCard: React.FC = () => {
  const activities = [
    {
      icon: Download,
      iconColor: 'text-blue-600',
      text: 'تم تحميل "مقاييس سوبرا للهوية الثقافية" 15 مرة اليوم',
      time: 'منذ ساعتين'
    },
    {
      icon: Brain,
      iconColor: 'text-purple-600',
      text: 'تم اكتشاف فجوة معرفية جديدة في "التسويق الرقمي الثقافي"',
      time: 'منذ 4 ساعات'
    },
    {
      icon: FileText,
      iconColor: 'text-green-600',
      text: 'تم نشر وثيقة جديدة: "دليل قياس الأثر الثقافي"',
      time: 'أمس'
    }
  ];

  return (
    <BaseCard variant="operations" className="p-6">
      <h3 className="text-lg font-semibold text-black font-arabic mb-4">النشاط الأخير</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
            <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            <span className="text-sm text-black font-arabic">{activity.text}</span>
            <span className="text-xs text-black mr-auto font-arabic">{activity.time}</span>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
