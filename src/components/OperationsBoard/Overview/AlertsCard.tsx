
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

const alerts: Alert[] = [
  { id: '1', type: 'critical', message: 'تأخير في المشروع الرئيسي', time: 'منذ 5 دقائق' },
  { id: '2', type: 'warning', message: 'نقص في الميزانية', time: 'منذ 15 دقيقة' },
  { id: '3', type: 'info', message: 'اجتماع غدًا في 10 صباحًا', time: 'منذ ساعة' },
  { id: '4', type: 'critical', message: 'خطأ في النظام', time: 'منذ ساعتين' },
  { id: '5', type: 'warning', message: 'انتهاء صلاحية العقد', time: 'منذ 3 ساعات' }
];

const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'critical': return '#f1b5b9';
    case 'warning': return '#fbe2aa';
    case 'info': return '#d0e1e9';
    default: return '#f3ffff';
  }
};

export const AlertsCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="md" 
      className="h-[180px]" 
      style={{
        backgroundColor: '#f3ffff'
      }} 
      header={
        <h3 className="text-lg font-semibold text-black font-arabic">التنبيهات</h3>
      }
    >
      <div className="space-y-2 overflow-y-auto max-h-[120px]">
        {alerts.slice(0, 3).map((alert) => (
          <div 
            key={alert.id}
            className="flex items-center justify-between p-2 rounded-lg"
            style={{ backgroundColor: getAlertColor(alert.type) }}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-black font-arabic truncate">
                {alert.message}
              </p>
              <p className="text-xs font-normal text-gray-400 font-arabic">
                {alert.time}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-black ml-2 flex-shrink-0"></div>
          </div>
        ))}
        <div className="text-center pt-2">
          <button className="text-xs font-normal text-black font-arabic hover:underline">
            عرض جميع التنبيهات ({alerts.length})
          </button>
        </div>
      </div>
    </BaseCard>
  );
};
