
import React from 'react';
import { FileText, Clock } from 'lucide-react';

export interface ContractsData {
  signed: number;
  expired: number;
}

export interface ContractsBoxProps {
  contracts: ContractsData;
  className?: string;
}

export const ContractsBox: React.FC<ContractsBoxProps> = ({ 
  contracts, 
  className = '' 
}) => {
  const hasExpired = contracts.expired > 0;

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
      ${hasExpired ? 'border-orange-200/50' : 'border-green-200/50'}
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-gray-800 mb-4">
        العقود
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">موقعة</span>
          </div>
          <span className="text-xl font-bold text-green-500">
            {contracts.signed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-orange-500" />
            <span className="text-sm text-gray-600">منتهية</span>
          </div>
          <span className="text-xl font-bold text-orange-500">
            {contracts.expired}
          </span>
        </div>
      </div>

      {hasExpired && (
        <div className="mt-4 p-3 bg-orange-50/80 rounded-xl backdrop-blur-sm">
          <p className="text-xs text-orange-700 font-medium">
            يوجد عقود تحتاج تجديد
          </p>
        </div>
      )}
    </div>
  );
};
