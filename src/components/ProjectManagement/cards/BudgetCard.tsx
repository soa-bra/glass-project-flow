
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Project } from '@/types/project';

interface BudgetCardProps {
  project: Project;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ project }) => {
  const totalBudget = parseInt(project.value.replace(/[^\d]/g, ''));
  const spentAmount = Math.floor(totalBudget * 0.75); // 75% مصروف
  const remainingAmount = totalBudget - spentAmount;
  const spentPercentage = (spentAmount / totalBudget) * 100;

  // إنشاء الأشرطة للتمثيل البصري
  const totalBars = 100;
  const filledBars = Math.round((spentPercentage / 100) * totalBars);

  const getBarColor = (index: number) => {
    if (index < filledBars) {
      if (spentPercentage <= 50) return 'bg-purple-300';
      if (spentPercentage <= 80) return 'bg-orange-400';
      return 'bg-red-400';
    }
    return 'bg-gray-200';
  };

  return (
    <BaseCard className="h-full flex flex-col items-center justify-center relative">
      {/* أيقونة التوسيع */}
      <button className="absolute top-4 left-4 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors">
        ↗
      </button>

      <h3 className="text-lg font-arabic font-semibold mb-6 text-center">الميزانية</h3>
      
      {/* الدائرة مع الأشرطة */}
      <div className="relative w-32 h-32 mb-4">
        {/* الأشرطة الدائرية */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="grid grid-cols-10 gap-0.5 w-24 h-24 rounded-full overflow-hidden">
            {Array.from({ length: totalBars }).map((_, index) => (
              <div
                key={index}
                className={`w-0.5 h-2 ${getBarColor(index)} transition-colors duration-300`}
                style={{ animationDelay: `${index * 20}ms` }}
              />
            ))}
          </div>
        </div>
        
        {/* الرقم المركزي */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(remainingAmount / 1000)}
            </div>
            <div className="text-sm text-gray-600 font-arabic">ألف ر.س</div>
          </div>
        </div>
      </div>

      {/* التفاصيل */}
      <div className="text-center space-y-1">
        <div className="text-sm text-gray-600 font-arabic">
          المصروف: {spentAmount.toLocaleString()} ر.س
        </div>
        <div className="text-sm text-gray-600 font-arabic">
          المتبقي: {remainingAmount.toLocaleString()} ر.س
        </div>
        <div className="text-xs text-gray-500 font-arabic">
          {Math.round(spentPercentage)}% من الميزانية
        </div>
      </div>
    </BaseCard>
  );
};
