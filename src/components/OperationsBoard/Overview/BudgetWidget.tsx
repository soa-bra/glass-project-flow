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
        </h3>} className="h-[250px]">
      <div className="space-y-4 flex-1 flex flex-col justify-center px-0 py-0 my-0">
        <div className="text-right my-0 py-0">
          <div className="mb-2">
            <span className="text-xs text-gray-600">الميزانية الإجمالية</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-2">
            {formatNumber(budget.total)} ريال
          </div>
          <Progress value={100} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>

        <div className="text-right">
          <div className="mb-2">
            <span className="text-xs text-gray-600">المصروفات</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-2">
            {formatNumber(budget.spent)} ريال ({percentage}%)
          </div>
          <Progress value={percentage} className="h-2 bg-green-100" indicatorClassName={`${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} />
        </div>

        {/* إضافة معلومات إضافية للاستفادة من المساحة الإضافية */}
        <div className="text-right border-t border-gray-200/50 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">المتبقي</span>
            <span className="text-sm font-medium text-blue-600">
              {formatNumber(budget.total - budget.spent)} ريال
            </span>
          </div>
        </div>
      </div>
    </BaseCard>;
};
