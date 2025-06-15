
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface ContractsData {
  signed: number;
  expired: number;
}

interface ContractsWidgetProps {
  contracts: ContractsData;
  className?: string;
}

export const ContractsWidget: React.FC<ContractsWidgetProps> = ({
  contracts,
  className = ''
}) => {
  const total = contracts.signed + contracts.expired;
  const signedPercentage = total > 0 ? (contracts.signed / total) * 100 : 0;

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="mb-4">
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          إدارة العقود
        </h3>
      </header>
      
      <div className="flex-1 space-y-4">
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">العقود السارية</p>
          <p className="text-3xl font-bold text-green-600">{contracts.signed}</p>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">العقود المنتهية</p>
          <p className="text-3xl font-bold text-red-600">{contracts.expired}</p>
        </div>
        
        {/* مؤشر النسبة */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>نسبة العقود السارية</span>
            <span className="font-bold">{signedPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all duration-1000"
              style={{ width: `${signedPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </GenericCard>
  );
};
