
import React from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export const NotificationsBox: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      icon: AlertCircle,
      title: 'مهمة متأخرة',
      description: 'تصميم الواجهة متأخر بيومين',
      time: 'منذ ساعتين',
      color: '#ef4444'
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      title: 'اقتراب موعد التسليم',
      description: 'كتابة الكود تنتهي غداً',
      time: 'منذ 4 ساعات',
      color: '#f59e0b'
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle,
      title: 'مهمة مكتملة',
      description: 'تم الانتهاء من قواعد البيانات',
      time: 'منذ يوم',
      color: '#10b981'
    }
  ];

  return (
    <div 
      className="h-full p-6 rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0]"
      style={{
        fontFamily: 'IBM Plex Sans Arabic'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-semibold text-gray-800">التنبيهات</h3>
        <span className="text-sm text-gray-500 font-arabic">3 جديدة</span>
      </div>
      
      <div className="space-y-3 max-h-32 overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
              <Icon 
                size={16} 
                style={{ color: notification.color }}
                className="mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 font-arabic">
                  {notification.title}
                </div>
                <div className="text-xs text-gray-600 font-arabic truncate">
                  {notification.description}
                </div>
                <div className="text-xs text-gray-400 font-arabic mt-1">
                  {notification.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
