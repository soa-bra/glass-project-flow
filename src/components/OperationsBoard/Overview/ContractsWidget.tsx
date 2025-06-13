
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';

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
  const hasExpiredContracts = contracts.expired > 0;

  return (
    <BaseCard 
      size="md"
      variant="glass"
      neonRing={hasExpiredContracts ? 'warning' : 'success'}
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          حالة العقود
        </h3>
      }
    >
      <div className="flex justify-center items-center mb-2">
        <div className="text-center ml-6">
          <div className="text-lg font-bold text-blue-500 mb-1">{contracts.signed}</div>
          <div className="text-xs text-gray-600">موقّعة</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-500 mb-1">{contracts.expired}</div>
          <div className="text-xs text-gray-600">منتهية</div>
        </div>
      </div>

      <Progress 
        value={signedPercentage} 
        className="h-1 bg-orange-200"
        indicatorClassName="bg-blue-500"
      />
    </BaseCard>
  );
};
