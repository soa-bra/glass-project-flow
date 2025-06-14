
import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

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
  const hasExpired = contracts.expired > 0;

  return (
    <BaseCard
      variant="glass"
      color={hasExpired ? 'warning' : 'success'}
      adminBoardStyle
      size="md"
      className={`h-full w-full ${className}`}
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800 mb-1">
          العقود
        </h3>
      }
    >
      <div className="space-y-5 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-green-500" />
            <span className="text-base text-gray-700">موقعة</span>
          </div>
          <span className="text-2xl font-bold text-green-500">
            {contracts.signed}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-orange-500" />
            <span className="text-base text-gray-700">منتهية</span>
          </div>
          <span className="text-2xl font-bold text-orange-500">
            {contracts.expired}
          </span>
        </div>
        {hasExpired && (
          <div className="mt-4 p-3 bg-[#f9e2a9]/60 rounded-xl font-arabic text-xs text-orange-800 text-center shadow border border-yellow-200/60">
            يوجد عقود بحاجة تجديد
          </div>
        )}
      </div>
    </BaseCard>
  );
};
