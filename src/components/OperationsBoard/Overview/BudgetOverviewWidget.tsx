
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

// This will come from props later based on finance.isProfit
const isProfit = true; 

export const BudgetOverviewWidget = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <GenericCard
        adminBoardStyle
        className="h-full"
        color={isProfit ? 'success' : 'crimson'}
      >
        <h3 className="text-xl font-bold">النظرة المالية</h3>
        <p className="mt-4 text-sm">سيتم إضافة المحتوى لاحقاً...</p>
      </GenericCard>
    </div>
  );
};
