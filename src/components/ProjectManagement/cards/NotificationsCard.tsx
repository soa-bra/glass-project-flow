
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const NotificationsCard: React.FC = () => {
  return (
    <div 
      className="h-full p-6 rounded-3xl border border-white/20"
      style={{
        background: 'var(--backgrounds-cards-admin-ops)',
      }}
    >
      <h3 className="text-lg font-arabic font-semibold text-gray-800 mb-6">التنبيهات</h3>
      
      <div className="text-center text-gray-500">
        <p className="text-sm font-arabic">لا توجد تنبيهات جديدة</p>
      </div>
    </div>
  );
};
