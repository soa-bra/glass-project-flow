import React from 'react';
import { Bell } from 'lucide-react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

type Notification = {
  id: string | number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  title: string;
  description: string;
  time: string;
  accentColor: string;
};

export const NotificationsBox: React.FC = () => {
  // التنبيهات تأتي من الباك إند — تبدأ فارغة
  const notifications: Notification[] = [];

  return (
    <AppCardSurface density="compact" className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">التنبيهات</h3>
        <div className="bg-[rgba(11,15,18,0.06)] px-2.5 py-1 rounded-full">
          <span className="text-[10px] font-medium text-[#0B0F12]">{notifications.length} جديدة</span>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Bell size={24} className="text-[rgba(11,15,18,0.25)] mb-2" />
          <div className="text-sm text-[rgba(11,15,18,0.5)]">لا توجد تنبيهات حالياً</div>
        </div>
      ) : (
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
      )}
    </AppCardSurface>
  );
};
