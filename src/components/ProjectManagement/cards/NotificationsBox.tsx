import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export const NotificationsBox: React.FC = () => {
  const notifications = [
    { id: 1, icon: AlertCircle, title: 'مهمة متأخرة', description: 'تصميم الواجهة متأخر بيومين', time: 'منذ ساعتين', accentColor: '#E5564D' },
    { id: 2, icon: Clock, title: 'اقتراب موعد التسليم', description: 'كتابة الكود تنتهي غداً', time: 'منذ 4 ساعات', accentColor: '#F6C445' },
    { id: 3, icon: CheckCircle, title: 'مهمة مكتملة', description: 'تم الانتهاء من قواعد البيانات', time: 'منذ يوم', accentColor: '#3DBE8B' },
  ];

  return (
    <div className="h-full p-6 rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">التنبيهات</h3>
        <div className="bg-[#f1b5b9] px-2.5 py-1 rounded-full">
          <span className="text-[10px] font-medium text-[#0B0F12]">3 جديدة</span>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="flex items-start gap-3 p-3 rounded-[14px] ring-1 ring-[rgba(11,15,18,0.06)] relative overflow-hidden">
              <div className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full" style={{ backgroundColor: n.accentColor }} />
              <Icon size={16} style={{ color: n.accentColor }} className="mt-0.5 flex-shrink-0 mr-2" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#0B0F12]">{n.title}</div>
                <div className="text-[11px] text-[rgba(11,15,18,0.5)] truncate">{n.description}</div>
                <div className="text-[10px] text-[rgba(11,15,18,0.35)] mt-1">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
