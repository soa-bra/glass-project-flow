
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const FinancialOverviewCard: React.FC = () => {
  return (
    <div 
      className="h-full p-6 rounded-3xl border border-white/20"
      style={{
        background: '#f7ffff',
      }}
    >
      <h3 className="text-lg font-arabic font-semibold text-gray-800 mb-6">النظرة المالية</h3>
      
      <div className="text-center text-gray-500">
        <p className="text-sm font-arabic">البيانات المالية</p>
      </div>
    </div>
  );
};
