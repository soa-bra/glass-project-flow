

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
  const isHealthy = remaining >= 0 && percentage <= 80;

  return (
    <div className={`
      ${className}
      rounded-3xl p-6 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-xl hover:shadow-2xl transition-all duration-300
    `}>
      
      {/* خلفية متدرجة مستوحاة من التصاميم */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-blue-400/20 rounded-3xl"></div>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 8a2 2 0 012 2v1a2 2 0 01-2 2V8zM8 9a1 1 0 000 2h1a1 1 0 100-2H8z"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#2A3437] font-arabic">
            الميزانية
          </h3>
        </div>

        {/* الرقم الرئيسي بأسلوب كبير */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#2A3437] mb-2">
            {formatCurrency(budget.total)}
          </div>
          <div className="text-sm text-gray-600 font-arabic">
            ريال - الميزانية الإجمالية
          </div>
        </div>

        {/* دائرة التقدم بأسلوب حديث */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* الخلفية */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* التقدم */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2.51 * percentage} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2A3437]">{percentage}%</div>
              <div className="text-xs text-gray-600 font-arabic">مستخدم</div>
            </div>
          </div>
        </div>

        {/* التفاصيل السفلية */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(budget.spent)}
            </div>
            <div className="text-xs text-gray-600 font-arabic">المصروفات</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(remaining)}
            </div>
            <div className="text-xs text-gray-600 font-arabic">المتبقي</div>
          </div>
        </div>

        {/* تحذير إذا لزم الأمر */}
        {!isHealthy && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-2xl backdrop-blur-sm">
            <p className="text-sm font-medium text-red-700 text-center font-arabic">
              ⚠️ تحذير: تم تجاوز الميزانية المخططة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

