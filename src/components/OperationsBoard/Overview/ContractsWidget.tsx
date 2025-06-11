
import React from 'react';
import { Progress } from '@/components/ui/progress';
import GenericCard from '@/components/ui/GenericCard';

interface ContractsData {
  signed: number;
  expired: number;
}

interface ContractsWidgetProps {
  contracts: ContractsData;
}

export const ContractsWidget: React.FC<ContractsWidgetProps> = ({ contracts }) => {
  return (
    <GenericCard
      header={
        <h3 className="text-lg font-arabic font-medium text-right">حالة العقود</h3>
      }
    >
      <div className="flex flex-col items-center mt-6">
        <div className="flex w-full justify-between mb-4">
          <div className="text-center">
            <span className="text-3xl font-bold block">{contracts.signed}</span>
            <span className="text-sm text-gray-600">موقّعة</span>
          </div>

          <div className="text-center text-orange-500">
            <span className="text-3xl font-bold block">{contracts.expired}</span>
            <span className="text-sm">منتهية</span>
          </div>
        </div>

        <Progress 
          value={
            (contracts.signed / (contracts.signed + contracts.expired)) * 100
          } 
          className="h-3 w-full bg-orange-200"
          indicatorClassName="bg-blue-500"
        />
      </div>
    </GenericCard>
  );
};
