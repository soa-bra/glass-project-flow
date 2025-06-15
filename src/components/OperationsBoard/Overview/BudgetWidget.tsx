
import React from 'react';
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
  const percentage = (budget.spent / budget.total) * 100;
  const remaining = budget.total - budget.spent;

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="mb-6">
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          الميزانية والمصروفات
        </h3>
      </header>
      
      <div className="flex-1 space-y-6">
        {/* الإجمالي والمصروف */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-gray-600 mb-1">الميزانية الإجمالية</p>
            <p className="text-2xl font-bold text-blue-600">
              {budget.total.toLocaleString()} ر.س
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <p className="text-sm text-gray-600 mb-1">المبلغ المتبقي</p>
            <p className="text-2xl font-bold text-green-600">
              {remaining.toLocaleString()} ر.س
            </p>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">المبلغ المصروف</span>
            <span className="text-sm font-bold text-[#23272f]">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            {budget.spent.toLocaleString()} ر.س من أصل {budget.total.toLocaleString()} ر.س
          </p>
        </div>
      </div>
    </GenericCard>
  );
};
