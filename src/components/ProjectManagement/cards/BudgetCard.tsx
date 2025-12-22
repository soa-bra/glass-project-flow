import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { Project } from '@/types/project';
interface BudgetCardProps {
  project: Project;
}
export const BudgetCard: React.FC<BudgetCardProps> = ({
  project
}) => {
  const totalBudget = parseInt(project.value.replace(/[^\d]/g, ''));
  const spentAmount = Math.floor(totalBudget * 0.75); // 75% مصروف
  const remainingAmount = totalBudget - spentAmount;
  const spentPercentage = spentAmount / totalBudget * 100;
  const isOverBudget = spentAmount > totalBudget;

  // إنشاء الأشرطة للتمثيل البصري - حلقة دائرية
  const totalBars = 60; // عدد الشرائط في الحلقة
  const filledBars = Math.round(spentPercentage / 100 * totalBars);

  // تحديد ألوان الشرائط بناءً على النسبة
  const getBarColor = (index: number) => {
    if (index >= filledBars) return 'bg-gray-200'; // الشرائط الفارغة

    const fillRatio = (index + 1) / totalBars;
    if (fillRatio <= 0.3) return 'bg-[#96d8d0]'; // أخضر فاتح
    if (fillRatio <= 0.6) return 'bg-[#7bc5bd]'; // أخضر متوسط
    if (fillRatio <= 0.8) return 'bg-[#f4c2a1]'; // برتقالي
    return 'bg-[#f1b5b9]'; // أحمر
  };

  // تحديد لون خلفية الكارد
  const cardBgColor = isOverBudget ? 'bg-[#f1b5b9]' : 'bg-[#96d8d0]';
  return <BaseBox className={`h-full flex flex-col items-center justify-center relative ${cardBgColor} border-0`}>
      {/* أيقونة التوسيع */}
      <button className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95 font-extrabold text-xs">↖</button>

      {/* أيقونة النقاط */}
      <button className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95 text-xs my-0 font-extrabold">･･･</button>

      <h3 className="text-xl font-arabic font-bold mb-8 text-center text-black">النظرة المالية</h3>
      
      {/* الحلقة الدائرية الكبيرة */}
      <div className="relative w-80 h-80 mb-8 flex items-center justify-center">
        {/* الشرائط الدائرية */}
        <div className="absolute inset-0">
          {Array.from({
          length: totalBars
        }).map((_, index) => {
          const angle = index / totalBars * 360;
          const isVisible = index < filledBars || index >= filledBars;
          return <div key={index} className={`absolute w-1 h-12 ${getBarColor(index)} transition-all duration-500`} style={{
            transformOrigin: '50% 160px',
            transform: `rotate(${angle}deg)`,
            left: '50%',
            top: '20px',
            marginLeft: '-2px',
            opacity: isVisible ? 1 : 0.3,
            animationDelay: `${index * 50}ms`
          }} />;
        })}
        </div>
        
        {/* المحتوى المركزي */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-black mb-2">
              {Math.round(spentPercentage)}
            </div>
            <div className="text-lg text-black font-arabic">إجمالي الأرباح والخسائر</div>
          </div>
        </div>
      </div>

      {/* الإحصائيات الجانبية */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-black">02</div>
          <div className="text-sm text-black font-arabic">مثال</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-black">14</div>
          <div className="text-sm text-black font-arabic">مثال</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-black">{Math.round(remainingAmount / 1000)}</div>
          <div className="text-sm text-black font-arabic">مثال</div>
        </div>
      </div>

      {/* النص السفلي */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm text-black font-arabic mb-1">
          هذا النص مثال للشكل النهائي
        </div>
        <div className="text-sm text-black font-arabic">
          هذا النص مثال
        </div>
      </div>

      {/* النص السفلي الأيمن */}
      <div className="absolute bottom-6 right-6 text-center">
        <div className="text-sm text-black font-arabic mb-1">
          هذا النص مثال
        </div>
        <div className="text-sm text-black font-arabic">
          هذا النص مثال للشكل النهائي
        </div>
      </div>
    </BaseBox>;
};