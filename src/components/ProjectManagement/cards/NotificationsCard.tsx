
import React from 'react';

export const NotificationsCard: React.FC = () => {
  return (
    <div className="h-full bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 border border-white/30 flex flex-col">
      <h3 className="text-lg font-arabic font-semibold mb-4">التنبيهات</h3>
      
      <div className="flex-1 bg-gray-50/30 rounded-xl p-4 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            🔔
          </div>
          <p className="text-sm font-arabic">لا توجد تنبيهات جديدة</p>
        </div>
      </div>
    </div>
  );
};
