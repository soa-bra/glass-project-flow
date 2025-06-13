
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
      rounded-3xl p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl
      ${isHealthy ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 via-rose-500 to-red-600'}
      backdrop-blur-xl border border-white/20
    `}>
      
      {/* رأس البطاقة */}
      <h3 className="text-lg font-arabic font-bold mb-5">
        الميزانية والمصروفات
      </h3>

      {/* الميزانية الإجمالية */}
      <div className="mb-6">
        <p className="text-3xl font-bold tracking-wide mb-1">
          {formatCurrency(budget.total)}
        </p>
        <p className="text-sm opacity-90">
          ريال - الميزانية الإجمالية
        </p>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">المصروفات:</span>
          <span className="font-semibold">
            {formatCurrency(budget.spent)} ريال
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">المتبقي:</span>
          <span className="font-semibold">
            {formatCurrency(remaining)} ريال
          </span>
        </div>

        {/* شريط التقدم */}
        <div className="mt-5">
          <div className="flex justify-between text-sm mb-2 opacity-90">
            <span>{percentage}%</span>
            <span>مستخدم من الميزانية</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-2.5 bg-white/20 rounded-full" 
            indicatorClassName="bg-white/90 rounded-full"
          />
        </div>
      </div>

      {/* تحذير إذا تجاوز الميزانية */}
      {!isHealthy && (
        <div className="mt-5 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-sm font-medium">
            ⚠️ تحذير: تم تجاوز الميزانية المخططة
          </p>
        </div>
      )}
    </div>
  );
};
