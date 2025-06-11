
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-[#3e494c]/60 font-arabic">{percentage}%</span>
        </div>
        <h3 className="text-sm font-arabic font-bold text-[#2A3437]">الميزانية</h3>
      </div>
      
      <div className="space-y-4">
        {/* الميزانية الإجمالية */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-[#2A3437] font-arabic">
              {formatNumber(budget.total)}
            </span>
            <span className="text-xs text-[#3e494c]/60 font-arabic">الإجمالي</span>
          </div>
          <div className="h-2 rounded-full bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg" style={{width: '100%'}}></div>
          </div>
        </div>

        {/* المصروفات */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-green-600 font-arabic">
              {formatNumber(budget.spent)}
            </span>
            <span className="text-xs text-[#3e494c]/60 font-arabic">المصروف</span>
          </div>
          <div className="h-2 rounded-full bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg transition-all duration-500" 
              style={{width: `${percentage}%`}}
            ></div>
          </div>
        </div>
      </div>
    </GenericCard>
  );
};
