
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { GenericCard } from '@/components/ui/GenericCard';

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

  // لون موحد (أخضر للفائض - أحمر للعجز)
  const visualColor = isHealthy ? 'success' : 'crimson';

  return (
    <GenericCard
      adminBoardStyle
      padding="md"
      color={visualColor}
      className={`h-full w-full ${className} min-h-[180px] flex flex-col justify-between`}
    >
      <div className="w-full flex flex-col h-full justify-between items-end text-right">
        <h3 className="text-lg font-arabic font-bold mb-1 text-[#222a29] w-full leading-tight mt-1">
          الميزانية والمصروفات
        </h3>
        <div className="mb-2 w-full">
          <span className="text-2xl font-bold text-[#29936c]">{formatCurrency(budget.total)}</span>
          <span className="text-base text-gray-600 mr-2">ريال - الميزانية الإجمالية</span>
        </div>
        <div className="flex flex-col gap-1 my-2 w-full">
          <div className="flex justify-between items-center w-full">
            <span className="text-base text-gray-700">المصروفات:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(budget.spent)} ريال
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
            <span className="text-base text-gray-700">المتبقي:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(remaining)} ريال
            </span>
          </div>
        </div>
        <div className="mt-3 w-full">
          <div className="flex justify-between text-base mb-1 text-gray-500">
            <span>{percentage}%</span>
            <span>مستخدم من الميزانية</span>
          </div>
          <Progress
            value={percentage}
            className="h-3 bg-white/40 rounded-full"
            indicatorClassName="bg-[#29936c] rounded-full"
          />
        </div>
        {!isHealthy && (
          <div className="mt-4 p-3 bg-[#fcd8ce]/70 rounded-xl font-arabic text-xs text-red-700 text-center border border-red-300/50 shadow w-full">
            ⚠️ تحذير: تم تجاوز الميزانية المخططة
          </div>
        )}
      </div>
    </GenericCard>
  );
};
