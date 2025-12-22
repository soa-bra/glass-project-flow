import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';

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
    <BaseBox 
      title="العقود"
      variant="glass"
      size="sm"
      rounded="lg"
      neonRing={hasExpired ? 'warning' : 'success'}
      className={`flex flex-col justify-between ${className}`}
    >
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText size={16} className="text-[var(--visual-data-secondary-1)]" />
            <span className="text-sm text-[hsl(var(--ink-60))]">موقعة</span>
          </div>
          <span className="text-xl font-bold text-[var(--visual-data-secondary-1)]">
            {contracts.signed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-[var(--visual-data-secondary-5)]" />
            <span className="text-sm text-[hsl(var(--ink-60))]">منتهية</span>
          </div>
          <span className="text-xl font-bold text-[var(--visual-data-secondary-5)]">
            {contracts.expired}
          </span>
        </div>
      </div>

      {hasExpired && (
        <div className="mt-4 p-3 bg-[var(--visual-data-secondary-5)]/10 rounded-xl">
          <p className="text-xs text-[var(--visual-data-secondary-5)] font-medium">
            يوجد عقود تحتاج تجديد
          </p>
        </div>
      )}
    </BaseBox>
  );
};
