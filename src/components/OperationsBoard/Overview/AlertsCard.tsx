
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const AlertsCard: React.FC = () => {
  return (
    <BaseCard 
      variant="glass" 
      size="md" 
      className="h-[180px]" 
      style={{
        backgroundColor: '#f2ffff'
      }} 
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black font-arabic">التنبيهات</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10">
              <span className="text-sm text-black">🔄</span>
            </button>
            <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10">
              <span className="text-sm text-black">🎨</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="py-0 my-0 space-y-3">
        {/* تنبيه 1 */}
        <div className="flex items-center justify-between p-2 bg-[#f1b5b9] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⚠</span>
            </div>
            <div>
              <div className="text-sm font-bold text-black font-arabic">تأخير في المشروع أ</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">منذ 2 ساعات</div>
            </div>
          </div>
        </div>
        
        {/* تنبيه 2 */}
        <div className="flex items-center justify-between p-2 bg-[#fbe2aa] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💰</span>
            </div>
            <div>
              <div className="text-sm font-bold text-black font-arabic">تجاوز الميزانية</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">منذ ساعة</div>
            </div>
          </div>
        </div>
        
        {/* تنبيه 3 */}
        <div className="flex items-center justify-between p-2 bg-[#d0e1e9] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📊</span>
            </div>
            <div>
              <div className="text-sm font-bold text-black font-arabic">تقرير جاهز</div>
              <div className="text-xs font-normal text-gray-400 font-arabic">منذ 30 دقيقة</div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
