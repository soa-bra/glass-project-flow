
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

  return (
    <GenericCard>
      <h3 className="text-lg font-arabic font-medium mb-4 text-right">الميزانية والمصروفات</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">الميزانية الإجمالية</span>
            <span className="font-medium text-right">{formatNumber(budget.total)} ريال</span>
          </div>
          <Progress value={100} className="h-2 bg-gray-200" indicatorClassName="bg-blue-400" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">المصروفات</span>
            <span className="font-medium text-right">
              {formatNumber(budget.spent)} ريال 
              ({Math.round((budget.spent / budget.total) * 100)}%)
            </span>
          </div>
          <Progress 
            value={(budget.spent / budget.total) * 100} 
            className="h-2 bg-gray-200"
            indicatorClassName="bg-green-400"
          />
        </div>
      </div>
    </GenericCard>
  );
};
