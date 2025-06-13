
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BudgetData {
  total: number;
  spent: number;
}

interface BudgetWidgetProps {
  budget: BudgetData;
  className?: string;
}

export const BudgetWidget: React.FC<BudgetWidgetProps> = ({
  budget,
  className = ''
}) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const remaining = budget.total - budget.spent;
  const percentage = Math.round((budget.spent / budget.total) * 100);
  const isHealthy = remaining >= 0 && percentage <= 80;

  return (
    <div className={`
      ${className}
      rounded-2xl p-6 text-white shadow-lg transition-all duration-300
      ${isHealthy ? 'bg-emerald-500/95 hover:bg-emerald-600/95' : 'bg-rose-500/95 hover:bg-rose-600/95'}
    `}>
      
      {/* رأس البطاقة */}
      <h3 className="text-lg font-arabic font-semibold mb-2">
        الميزانية والمصروفات
      </h3>

      {/* الميزانية الإجمالية */}
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-wide">
          {formatCurrency(budget.total)} ريال
        </p>
        <p className="text-sm opacity-90 mt-1">
          الميزانية الإجمالية
        </p>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">المصروفات:</span>
          <span className="font-semibold">
            {formatCurrency(budget.spent)} ريال ({percentage}%)
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">المتبقي:</span>
          <span className="font-semibold">
            {formatCurrency(remaining)} ريال
          </span>
        </div>

        {/* شريط التقدم */}
        <div className="mt-4">
          <Progress 
            value={percentage} 
            className="h-3 bg-white/20" 
            indicatorClassName="bg-white/90"
          />
          <div className="flex justify-between text-xs mt-1 opacity-75">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* تحذير إذا تجاوز الميزانية */}
      {!isHealthy && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm font-medium">
            ⚠️ تحذير: تم تجاوز الميزانية المخططة
          </p>
        </div>
      )}
    </div>
  );
};
