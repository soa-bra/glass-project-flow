import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
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
  return (
    <BaseCard className={`h-full flex flex-col relative ${cardBgColor} border-0 overflow-hidden`}>
      {/* أيقونة التوسيع */}
      <button className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95 font-extrabold text-xs z-10">
        ↖
      </button>

      {/* أيقونة النقاط */}
      <button className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95 text-xs font-extrabold z-10">
        ･･･
      </button>

      {/* العنوان */}
      <div className="text-center pt-8 pb-2">
        <h3 className="text-sm sm:text-base lg:text-lg font-arabic font-bold text-black">النظرة المالية</h3>
      </div>
      
      {/* المحتوى المرن */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 p-2">
        {/* الحلقة الدائرية */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: 'min(70%, 200px)',
            height: 'min(70%, 200px)',
            aspectRatio: '1/1'
          }}
        >
          {/* الشرائط الدائرية */}
          <div className="absolute inset-0">
            {Array.from({ length: totalBars }).map((_, index) => {
              const angle = (index / totalBars) * 360;
              const isVisible = index < filledBars || index >= filledBars;
              const radius = 'calc(50% - 10px)';
              
              return (
                <div 
                  key={index} 
                  className={`absolute ${getBarColor(index)} transition-all duration-500`} 
                  style={{
                    width: 'clamp(1px, 0.5vw, 2px)',
                    height: 'clamp(8px, 2vw, 16px)',
                    transformOrigin: `50% ${radius}`,
                    transform: `rotate(${angle}deg)`,
                    left: '50%',
                    top: '10px',
                    marginLeft: 'calc(-0.25vw)',
                    opacity: isVisible ? 1 : 0.3,
                    animationDelay: `${index * 50}ms`
                  }} 
                />
              );
            })}
          </div>
          
          {/* المحتوى المركزي */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-bold text-black mb-1" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                {Math.round(spentPercentage)}
              </div>
              <div className="text-black font-arabic" style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)' }}>
                إجمالي الأرباح والخسائر
              </div>
            </div>
          </div>
        </div>

        {/* الإحصائيات الجانبية */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
          <div className="text-center mb-2">
            <div className="font-bold text-black" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>02</div>
            <div className="text-black font-arabic">مثال</div>
          </div>
          <div className="text-center mb-2">
            <div className="font-bold text-black" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>14</div>
            <div className="text-black font-arabic">مثال</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-black" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
              {Math.round(remainingAmount / 1000)}
            </div>
            <div className="text-black font-arabic">مثال</div>
          </div>
        </div>
      </div>

      {/* النص السفلي */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-black font-arabic mb-1" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
          هذا النص مثال للشكل النهائي
        </div>
        <div className="text-black font-arabic" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
          هذا النص مثال
        </div>
      </div>

      {/* النص السفلي الأيمن */}
      <div className="absolute bottom-2 right-2 text-center">
        <div className="text-black font-arabic mb-1" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
          هذا النص مثال
        </div>
        <div className="text-black font-arabic" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
          هذا النص مثال للشكل النهائي
        </div>
      </div>
    </BaseCard>
  );
};