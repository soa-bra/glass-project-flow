import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
export const AlertsCard: React.FC = () => {
  return <BaseCard variant="glass" size="md" className="h-[180px]" style={{
    backgroundColor: '#f2ffff'
  }} header={<h3 className="text-lg font-bold text-gray-800 font-arabic">التنبيهات</h3>}>
      
    </BaseCard>;
};