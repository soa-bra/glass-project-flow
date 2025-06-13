import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';
interface BudgetData {
  total: number;
  spent: number;
}
interface BudgetWidgetProps {
  budget: BudgetData;
}
export const BudgetWidget: React.FC<BudgetWidgetProps> = ({
  budget
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };
  const percentage = Math.round(budget.spent / budget.total * 100);
  const isOverBudget = percentage > 80;
  return <BaseCard size="md" variant="glass" neonRing={isOverBudget ? 'warning' : 'info'} header={<h3 className="text-sm font-arabic font-bold text-gray-800">
          الميزانية والمصروفات
        </h3>} className="h-px text-base py-0 my-0">
      <div className="space-y-2 flex-1 flex flex-col justify-center px-0 py-0 my-0">
        <div className="text-right my-0 py-0">
          <div className="mb-1 my-[7px]">
            <span className="text-xs text-gray-600 my-0 py-0">الميزانية الإجمالية</span>
          </div>
          <div className="text-sm font-bold text-gray-900 mb-1">
            {formatNumber(budget.total)} ريال
          </div>
          <Progress value={100} className="h-1 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>

        <div className="text-right my-0">
          <div className="mb-1 py-0">
            <span className="text-xs text-gray-600">المصروفات</span>
          </div>
          <div className="text-sm font-bold text-gray-900 mb-1">
            {formatNumber(budget.spent)} ريال ({percentage}%)
          </div>
          <Progress value={percentage} className="h-1 bg-green-100" indicatorClassName={`${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} />
        </div>
      </div>
    </BaseCard>;
};