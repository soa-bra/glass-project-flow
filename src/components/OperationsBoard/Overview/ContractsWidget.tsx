
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
      <h3 className="text-base font-arabic font-semibold mb-4 text-white/90">
        العقود
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <FileText size={16} className="text-green-400" />
            </div>
            <span className="text-sm text-white/80">موقعة</span>
          </div>
          <span className="text-xl font-bold text-green-400">
            {contracts.signed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Clock size={16} className="text-orange-400" />
            </div>
            <span className="text-sm text-white/80">منتهية</span>
          </div>
          <span className="text-xl font-bold text-orange-400">
            {contracts.expired}
          </span>
        </div>
      </div>

      {hasExpired && (
        <div className="mt-4 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
          <p className="text-xs text-orange-300 font-medium">
            يوجد عقود تحتاج تجديد
          </p>
        </div>
      )}
    </GlassWidget>
  );
};
