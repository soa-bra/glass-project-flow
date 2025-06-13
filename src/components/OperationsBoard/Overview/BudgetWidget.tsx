
import React from 'react';
import { Progress } from '@/components/ui/progress';
import GlassWidget from '@/components/ui/GlassWidget';

interface BudgetData {
  total: number;
  spent: number;
}

interface BudgetWidgetProps {
  budget: BudgetData;
  className?: string;
}

type FinanceStatus = 'ok' | 'warning' | 'danger';

const palette: Record<FinanceStatus, string> = {
  ok: 'before:!bg-emerald-600/90',
  warning: 'before:!bg-amber-500/90',
  danger: 'before:!bg-rose-600/90',
};

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
    <GlassWidget className={`${palette[status]} ${className}`}>
      {/* رأس البطاقة */}
      <h3 className="font-medium text-base mb-1 font-arabic">
        الميزانية والمصروفات
      </h3>

      {/* الميزانية الإجمالية */}
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-wide mb-4">
          {formatCurrency(budget.total)} ريال
        </p>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">المصروفات:</span>
          <span className="font-semibold">
            {formatCurrency(budget.spent)} ريال ({percentage}%)
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">المتبقي:</span>
          <span className="font-semibold">
            {formatCurrency(remaining)} ريال
          </span>
        </div>

        {/* شريط التقدم */}
        <div className="mt-4">
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(ratio, 1) * 100}%` }}
              className="h-full bg-white/80 transition-[width] duration-500"
            />
          </div>
          <div className="flex justify-between text-xs mt-1 opacity-75">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* تحذير إذا تجاوز الميزانية */}
      {status !== 'ok' && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm font-medium">
            {status === 'danger' ? '⚠️ تحذير: تم تجاوز الميزانية المخططة' : '⚠️ تنبيه: اقتراب من حد الميزانية'}
          </p>
        </div>
      )}
    </GlassWidget>
  );
};
