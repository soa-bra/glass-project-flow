import React from 'react';
import { cn } from '@/lib/utils';

interface FinancialGlanceProps {
  mode: 'project_budget' | 'ops_income_vs_expense';
  totalTicks?: number;
  
  // For project budget mode
  spentPercentage?: number;
  
  // For ops income vs expense mode
  incomePercentage?: number;
  expensePercentage?: number;
  
  className?: string;
}

export const SoaFinancialGlance: React.FC<FinancialGlanceProps> = ({
  mode,
  totalTicks = 72,
  spentPercentage = 0,
  incomePercentage = 0,
  expensePercentage = 0,
  className = ''
}) => {
  const getBackgroundColor = () => {
    if (mode === 'project_budget') {
      if (spentPercentage >= 1.0) return 'bg-red-100'; // Red if spent = 100%
      if (spentPercentage >= 0.70) return 'bg-yellow-100'; // Yellow if spent >= 70%
      return 'bg-green-100'; // Green if spent < 70%
    } else {
      const isProfit = incomePercentage > expensePercentage;
      return isProfit ? 'bg-green-100' : 'bg-red-100';
    }
  };
  
  const renderProjectBudgetTicks = () => {
    const spentTicks = Math.floor(totalTicks * spentPercentage);
    
    return Array.from({ length: totalTicks }).map((_, index) => {
      const isSpent = index < spentTicks;
      return (
        <div
          key={index}
          className={cn(
            'h-1.5 w-1.5 rounded-sm transition-colors duration-200',
            isSpent 
              ? 'bg-soabra-ink/55' 
              : 'bg-soabra-ink/8'
          )}
        />
      );
    });
  };
  
  const renderIncomeExpenseTicks = () => {
    const incomeTicks = Math.floor(totalTicks * (incomePercentage / 100));
    const expenseTicks = Math.floor(totalTicks * (expensePercentage / 100));
    const maxTicks = Math.max(incomeTicks, expenseTicks);
    
    return Array.from({ length: totalTicks }).map((_, index) => {
      const isIncome = index < incomeTicks;
      const isExpense = index < expenseTicks;
      
      let tickColor = 'bg-soabra-ink/8'; // Default
      
      if (isIncome && !isExpense) {
        tickColor = 'bg-soabra-accent-green';
      } else if (isExpense && !isIncome) {
        tickColor = 'bg-soabra-accent-red';
      } else if (isIncome && isExpense) {
        // Overlap area - show mixed color
        tickColor = 'bg-gradient-to-r from-soabra-accent-green to-soabra-accent-red';
      }
      
      return (
        <div
          key={index}
          className={cn(
            'h-1.5 w-1.5 rounded-sm transition-colors duration-200',
            tickColor
          )}
        />
      );
    });
  };
  
  return (
    <div className={cn(
      'rounded-card-top border border-soabra-border p-4 transition-all duration-200',
      getBackgroundColor(),
      className
    )}>
      <div className="flex gap-1.5">
        {mode === 'project_budget' ? renderProjectBudgetTicks() : renderIncomeExpenseTicks()}
      </div>
      
      {/* Legend */}
      <div className="mt-3 flex gap-4 text-label">
        {mode === 'project_budget' ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-soabra-ink/55"></div>
            <span className="text-soabra-ink-60">مُنفق: {Math.round(spentPercentage * 100)}%</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-soabra-accent-green"></div>
              <span className="text-soabra-ink-60">الإيرادات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-soabra-accent-red"></div>
              <span className="text-soabra-ink-60">المصروفات</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};