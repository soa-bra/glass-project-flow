
import React from 'react';

interface ContractCount {
  signed: number;
  pending: number;
  expired: number;
}

interface ContractsStatusProps {
  contracts: ContractCount;
}

export const ContractsStatus: React.FC<ContractsStatusProps> = ({ contracts }) => {
  const total = contracts.signed + contracts.pending + contracts.expired;
  const signedPercentage = Math.round((contracts.signed / total) * 100);
  const pendingPercentage = Math.round((contracts.pending / total) * 100);
  const expiredPercentage = Math.round((contracts.expired / total) * 100);

  return (
    <div className="glass-enhanced rounded-[40px] p-6 transition-all duration-200 ease-in-out hover:bg-white/50">
      <h3 className="text-xl font-arabic font-medium text-right mb-4">حالة العقود</h3>
      
      <div className="flex justify-between items-center my-4">
        <div className="text-center">
          <span className="block text-2xl font-bold text-blue-600">{contracts.signed}</span>
          <span className="text-sm text-gray-600">موقّعة</span>
        </div>
        
        <div className="text-center">
          <span className="block text-2xl font-bold text-amber-500">{contracts.pending}</span>
          <span className="text-sm text-gray-600">قيد المعالجة</span>
        </div>
        
        <div className="text-center">
          <span className="block text-2xl font-bold text-red-500">{contracts.expired}</span>
          <span className="text-sm text-gray-600">منتهية</span>
        </div>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-blue-600 left-0" 
          style={{ width: `${signedPercentage}%` }}
        ></div>
        <div 
          className="absolute h-full bg-amber-500" 
          style={{ width: `${pendingPercentage}%`, left: `${signedPercentage}%` }}
        ></div>
        <div 
          className="absolute h-full bg-red-500" 
          style={{ width: `${expiredPercentage}%`, left: `${signedPercentage + pendingPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs mt-2">
        <span className="text-blue-600">موقّعة</span>
        <span className="text-amber-500">قيد المعالجة</span>
        <span className="text-red-500">منتهية</span>
      </div>
    </div>
  );
};
