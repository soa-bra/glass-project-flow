import React from 'react';
import { Progress } from '@/components/ui/progress';
import GlassWidget from '@/components/ui/GlassWidget';
import { cn } from '@/lib/utils';

interface BudgetData {
  total: number;
  spent: number;
}

interface BudgetWidgetProps {
  budget: BudgetData;
  className?: string;
}

type FinanceStatus = 'ok' | 'warning' | 'danger';

export const BudgetWidget: React.FC<BudgetWidgetProps> = ({
  budget,
  className = ''
}) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const remaining = budget.total - budget.spent;
  const ratio = budget.spent / budget.total;
  const percentage = Math.round(ratio * 100);
  
  const status: FinanceStatus = ratio > 1 ? 'danger' : ratio > 0.7 ? 'warning' : 'ok';

  return (
    <GlassWidget 
      accent={status === 'danger'} 
      glowing={status === 'danger'}
      className={className}
    >
      {/* رأس البطاقة */}
      <h3 className="font-medium text-lg mb-4 font-arabic text-white/90">
        الميزانية والمصروفات
      </h3>

      {/* الميزانية الإجمالية */}
      <div className="mt-4">
        <p className="text-4xl font-bold tracking-wide mb-6 text-white">
          {formatCurrency(budget.total)} ريال
        </p>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/70 text-base">المصروفات:</span>
          <span className="font-semibold text-white text-lg">
            {formatCurrency(budget.spent)} ريال ({percentage}%)
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70 text-base">المتبقي:</span>
          <span className="font-semibold text-white text-lg">
            {formatCurrency(remaining)} ريال
          </span>
        </div>

        {/* شريط التقدم المحسن */}
        <div className="mt-6">
          <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              style={{ width: `${Math.min(ratio, 1) * 100}%` }}
              className={cn(
                "h-full transition-[width] duration-700 ease-out",
                status === 'ok' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              )}
            />
          </div>
          <div className="flex justify-between text-xs mt-2 text-white/60">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* تحذير محسن */}
      {status !== 'ok' && (
        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
          <p className="text-sm font-medium text-white">
            {status === 'danger' ? '⚠️ تحذير: تم تجاوز الميزانية المخططة' : '⚠️ تنبيه: اقتراب من حد الميزانية'}
          </p>
        </div>
      )}
    </GlassWidget>
  );
};
