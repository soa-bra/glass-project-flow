
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const BudgetCard: React.FC = () => {
  const totalBudget = 150000;
  const spentBudget = 89500;
  const remainingBudget = totalBudget - spentBudget;
  const spentPercentage = (spentBudget / totalBudget) * 100;

  return (
    <div className="h-full p-4 flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">الميزانية</h3>
      
      {/* الرسم البياني الدائري */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* الخلفية */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* التقدم */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#ef4444"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${spentPercentage * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-gray-800 font-arabic">
              {Math.round(spentPercentage)}%
            </div>
            <div className="text-xs text-gray-600 font-arabic">مستخدم</div>
          </div>
        </div>
      </div>

      {/* التفاصيل */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 font-arabic">المبلغ المستخدم</div>
          <div className="font-bold text-red-600 font-arabic">
            {spentBudget.toLocaleString('ar-SA')} ر.س
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 font-arabic">المبلغ المتبقي</div>
          <div className="font-bold text-green-600 font-arabic">
            {remainingBudget.toLocaleString('ar-SA')} ر.س
          </div>
        </div>

        {/* مؤشر الاتجاه */}
        <div className="flex items-center justify-center gap-2 mt-4 p-2 bg-white/10 rounded-lg">
          {spentPercentage > 70 ? (
            <>
              <TrendingUp size={16} className="text-red-500" />
              <span className="text-sm text-red-600 font-arabic">يحتاج مراجعة</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-green-500" />
              <span className="text-sm text-green-600 font-arabic">ضمن الحدود</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
