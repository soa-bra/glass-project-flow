import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}
const alerts: Alert[] = [{
  id: '1',
  type: 'critical',
  message: 'تأخير في المشروع الرئيسي',
  time: 'منذ 5 دقائق'
}, {
  id: '2',
  type: 'warning',
  message: 'نقص في الميزانية',
  time: 'منذ 15 دقيقة'
}, {
  id: '3',
  type: 'info',
  message: 'اجتماع غدًا في 10 صباحًا',
  time: 'منذ ساعة'
}, {
  id: '4',
  type: 'critical',
  message: 'خطأ في النظام',
  time: 'منذ ساعتين'
}, {
  id: '5',
  type: 'warning',
  message: 'انتهاء صلاحية العقد',
  time: 'منذ 3 ساعات'
}];
const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'critical':
      return '#f1b5b9';
    case 'warning':
      return '#fbe2aa';
    case 'info':
      return '#d0e1e9';
    default:
      return '#f3ffff';
  }
};
export const AlertsCard: React.FC = () => {
  return <BaseCard variant="glass" size="md" className="h-full min-h-0" style={{
    backgroundColor: '#f3ffff'
  }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-semibold text-gray-800">التنبيهات</h3>
        <span className="text-sm text-gray-500 font-arabic">3 جديدة</span>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-[120px]">
        {alerts.slice(0, 3).map(alert => <div key={alert.id} className="flex items-center justify-between py-2 ">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 font-arabic truncate">
                {alert.message}
              </p>
              <p className="text-xs text-gray-500 font-arabic mt-1">
                {alert.time}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ml-3 flex-shrink-0 ${alert.type === 'critical' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
          </div>)}
        <div className="text-center pt-2">
          <button className="text-xs text-gray-500 font-arabic hover:text-gray-700 transition-colors">
            عرض جميع التنبيهات ({alerts.length})
          </button>
        </div>
      </div>
    </BaseCard>;
};