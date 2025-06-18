
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const NotificationsCard: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'اقتراب موعد تسليم المرحلة الثانية',
      time: 'منذ ساعة'
    },
    {
      id: 2,
      type: 'info',
      message: 'تم رفع مرفق جديد من العميل',
      time: 'منذ 3 ساعات'
    }
  ];

  return (
    <BaseCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-semibold">التنبيهات</h3>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-arabic text-gray-800">{notification.message}</p>
              <p className="text-xs font-arabic text-gray-500 mt-1">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
