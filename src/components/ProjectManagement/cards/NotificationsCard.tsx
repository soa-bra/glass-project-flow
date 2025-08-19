
import React from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export const NotificationsCard: React.FC = () => {
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
      className="h-full rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] flex flex-col"
      style={{
        fontFamily: 'IBM Plex Sans Arabic',
        padding: 'clamp(12px, 2vw, 24px)'
      }}
    >
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 
          className="font-arabic font-semibold text-gray-800"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
        >
          التنبيهات
        </h3>
        <span 
          className="text-gray-500 font-arabic"
          style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}
        >
          3 جديدة
        </span>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div 
              key={notification.id} 
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <Icon 
                style={{ 
                  color: notification.color,
                  width: 'clamp(12px, 1.5vw, 16px)',
                  height: 'clamp(12px, 1.5vw, 16px)'
                }}
                className="mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div 
                  className="font-medium text-gray-800 font-arabic leading-tight"
                  style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)' }}
                >
                  {notification.title}
                </div>
                <div 
                  className="text-gray-600 font-arabic truncate leading-tight"
                  style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
                >
                  {notification.description}
                </div>
                <div 
                  className="text-gray-400 font-arabic mt-1 leading-tight"
                  style={{ fontSize: 'clamp(0.6rem, 1vw, 0.7rem)' }}
                >
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
