
import React from 'react';
import { FileText, Clock } from 'lucide-react';
import GlassWidget from '@/components/ui/GlassWidget';

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
    <GlassWidget className={className}>
      <h3 className="text-sm font-arabic font-bold mb-3">
        العقود
      </h3>

      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-green-400" />
            <span className="text-xs text-white/70">موقعة</span>
          </div>
          <span className="text-lg font-bold text-green-400">
            {contracts.signed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-orange-400" />
            <span className="text-xs text-white/70">منتهية</span>
          </div>
          <span className="text-lg font-bold text-orange-400">
            {contracts.expired}
          </span>
        </div>
      </div>

      {hasExpired && (
        <div className="mt-3 p-2 bg-white/10 rounded-lg">
          <p className="text-xs text-orange-300">
            يوجد عقود تحتاج تجديد
          </p>
        </div>
      )}
    </GlassWidget>
  );
};
