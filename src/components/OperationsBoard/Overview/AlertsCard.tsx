
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const AlertsCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="md"
      className="h-[200px] col-span-2"
      style={{ backgroundColor: '#f2ffff' }}
      header={
        <h3 className="text-lg font-bold text-gray-800 font-arabic">التنبيهات</h3>
      }
    >
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600 font-arabic mb-1">5</div>
            <div className="text-sm text-gray-600 font-arabic">تنبيهات عاجلة</div>
          </div>
          <div className="text-xs text-gray-500 font-arabic">
            يتطلب اتخاذ إجراء فوري
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
