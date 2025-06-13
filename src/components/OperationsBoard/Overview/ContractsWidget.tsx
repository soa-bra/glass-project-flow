
import React from 'react';
import { FileText, Clock } from 'lucide-react';

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
    <div className={`
      ${className}
      glass-enhanced rounded-[20px] p-4
      ${hasExpired ? 'neon-ring-warning' : 'neon-ring-success'}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-sm font-arabic font-bold text-gray-800 mb-3">
        العقود
      </h3>

      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-green-500" />
            <span className="text-xs text-gray-600">موقعة</span>
          </div>
          <span className="text-lg font-bold text-green-500">
            {contracts.signed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-orange-500" />
            <span className="text-xs text-gray-600">منتهية</span>
          </div>
          <span className="text-lg font-bold text-orange-500">
            {contracts.expired}
          </span>
        </div>
      </div>

      {hasExpired && (
        <div className="mt-3 p-2 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-700">
            يوجد عقود تحتاج تجديد
          </p>
        </div>
      )}
    </div>
  );
};
