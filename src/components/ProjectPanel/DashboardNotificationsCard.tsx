
import React from 'react';
import { Bell, AlertTriangle, Info } from 'lucide-react';

export const DashboardNotificationsCard: React.FC = () => {
  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          الإشعارات
        </h3>
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-start gap-3 p-2">
          <AlertTriangle size={16} className="text-orange-500 mt-0.5" />
          <div>
            <div className="text-xs font-arabic text-gray-800">موعد تسليم قريب</div>
            <div className="text-xs text-gray-600 font-arabic">باقي يومان</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2">
          <Info size={16} className="text-blue-500 mt-0.5" />
          <div>
            <div className="text-xs font-arabic text-gray-800">تحديث جديد</div>
            <div className="text-xs text-gray-600 font-arabic">تم إنجاز مهمة</div>
          </div>
        </div>
      </div>
    </div>
  );
};
