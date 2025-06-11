
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { GenericCard } from '@/components/ui/GenericCard';

interface ContractsData {
  signed: number;
  expired: number;
}

interface ContractsWidgetProps {
  contracts: ContractsData;
}

export const ContractsWidget: React.FC<ContractsWidgetProps> = ({ contracts }) => {
  const total = contracts.signed + contracts.expired;
  const signedPercentage = (contracts.signed / total) * 100;

  return (
    <GenericCard className="h-full">
      <h3 className="text-lg font-arabic font-bold mb-4 text-right text-gray-800">حالة العقود</h3>
      
      <div className="flex justify-center items-center mb-5">
        <div className="text-center ml-6">
          <div className="text-2xl font-bold text-blue-500 mb-1">{contracts.signed}</div>
          <div className="text-xs text-gray-600">موقّعة</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500 mb-1">{contracts.expired}</div>
          <div className="text-xs text-gray-600">منتهية</div>
        </div>
      </div>

      <Progress 
        value={signedPercentage} 
        className="h-2 bg-orange-200"
        indicatorClassName="bg-blue-500"
      />
    </GenericCard>
  );
};
