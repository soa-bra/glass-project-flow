
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { GenericCard } from '@/components/ui/GenericCard';

interface BudgetData {
  total: number;
  spent: number;
}

interface BudgetWidgetProps {
  budget: BudgetData;
}

export const BudgetWidget: React.FC<BudgetWidgetProps> = ({ budget }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const percentage = Math.round((budget.spent / budget.total) * 100);

  return (
    <GenericCard className="h-full">
      <h3 className="text-xl font-arabic font-bold mb-6 text-right text-gray-800">الميزانية والمصروفات</h3>
      
      <div className="space-y-6">
        <div className="text-right">
          <div className="mb-2">
            <span className="text-sm text-gray-600">الميزانية الإجمالية</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-3">
            {formatNumber(budget.total)}.... ريال
          </div>
          <Progress value={100} className="h-3 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>

        <div className="text-right">
          <div className="mb-2">
            <span className="text-sm text-gray-600">المصروفات</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-3">
            {formatNumber(budget.spent)}.... ريال ({percentage}%)
          </div>
          <Progress 
            value={percentage} 
            className="h-3 bg-green-100"
            indicatorClassName="bg-green-500"
          />
        </div>
      </div>
    </GenericCard>
  );
};
