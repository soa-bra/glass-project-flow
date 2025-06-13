
import React from 'react';

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

  return (
    <div className={`
      ${className}
      rounded-2xl p-4 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-sm transition-all duration-300
    `}>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 8a2 2 0 012 2v1a2 2 0 01-2 2V8zM8 9a1 1 0 000 2h1a1 1 0 100-2H8z"/>
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-800 font-arabic">
            الميزانية
          </h3>
        </div>

        {/* الرقم الرئيسي */}
        <div className="mb-4">
          <div className="text-lg font-bold text-gray-900 mb-1">
            {formatCurrency(budget.total)}
          </div>
          <div className="text-xs text-gray-600 font-arabic">
            ريال - الميزانية الإجمالية
          </div>
        </div>

        {/* شريط التقدم مع النسبة */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 font-arabic">{percentage}% مستخدم</span>
            <span className="text-xs text-gray-500">|</span>
          </div>
          <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{width: `${percentage}%`}}
            ></div>
          </div>
        </div>

        {/* تفاصيل الميزانية */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 rounded-lg bg-white/30">
            <div className="text-xs font-medium text-green-600">
              {formatCurrency(budget.spent)}
            </div>
            <div className="text-xs text-gray-600 font-arabic">المصروفات</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/30">
            <div className="text-xs font-medium text-blue-600">
              {formatCurrency(remaining)}
            </div>
            <div className="text-xs text-gray-600 font-arabic">المتبقي</div>
          </div>
        </div>
      </div>
    </div>
  );
};
