import React from 'react';
import { Button } from '@/components/ui/button';
export const PartnershipsTab: React.FC = () => {
  return <div className="space-y-6 rounded-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button className="text-white font-arabic rounded-ful\u0645 bg-zinc-950 hover:bg-zinc-800">
            إضافة شريك +
          </Button>
          <h3 className="text-lg font-bold font-arabic">الشراكات</h3>
        </div>
        
        <div className="text-center py-8 text-gray-500 font-arabic">
          لا توجد شراكات مضافة بعد
        </div>
      </div>
    </div>;
};