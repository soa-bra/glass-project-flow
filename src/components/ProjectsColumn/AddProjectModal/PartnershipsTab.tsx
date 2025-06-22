
import React from 'react';
import { Button } from '@/components/ui/button';

export const PartnershipsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button className="bg-black text-white hover:bg-gray-800 font-arabic">
            إضافة شريك +
          </Button>
          <h3 className="text-lg font-bold font-arabic">الشراكات</h3>
        </div>
        
        <div className="text-center py-8 text-gray-500 font-arabic">
          لا توجد شراكات مضافة بعد
        </div>
      </div>
    </div>
  );
};
