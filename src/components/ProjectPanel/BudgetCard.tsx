
import React, { useMemo } from 'react';
import { ChevronLeft, Expand } from 'lucide-react';

interface BudgetCardProps {
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  onViewDetails: () => void;
  onExpand: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onViewDetails,
  onExpand
}) => {
  const segments = useMemo(() => {
    // عدد الشرائح يعتمد على عرض البطاقة - responsive
    const baseSegments = 60;
    const spentRatio = budget.spent / budget.total;
    const filledSegments = Math.floor(baseSegments * spentRatio);
    
    return Array.from({ length: baseSegments }, (_, index) => ({
      filled: index < filledSegments,
      angle: (index / baseSegments) * 2 * Math.PI
    }));
  }, [budget]);

  const radius = 60;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const spentPercentage = (budget.spent / budget.total) * 100;

  return (
    <div className="h-full bg-white/30 backdrop-blur-[15px] rounded-[20px] p-4 border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onExpand}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Expand size={16} className="text-gray-600" />
        </button>
        
        <h3 className="text-lg font-bold text-gray-800 font-arabic">الميزانية</h3>
      </div>
      
      {/* الإطار البيضاوي */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            {/* الخلفية */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* التقدم */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#budgetGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * spentPercentage) / 100}
              className="transition-all duration-700 ease-out"
              strokeLinecap="round"
            />
            
            <defs>
              <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00C853" />
                <stop offset="70%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#81C784" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* الرقم المركزي */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 font-arabic">
              {budget.remaining.toLocaleString()}
            </span>
            <span className="text-xs text-gray-600 font-arabic">ريال متبقي</span>
          </div>
        </div>
      </div>
      
      {/* إحصائيات سريعة */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">المجموع</span>
          <span className="font-semibold text-gray-800">
            {budget.total.toLocaleString()} ريال
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">المُنفق</span>
          <span className="font-semibold text-red-600">
            {budget.spent.toLocaleString()} ريال
          </span>
        </div>
      </div>
      
      {/* رابط التفاصيل */}
      <button 
        onClick={onViewDetails}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mt-4 text-sm"
      >
        <ChevronLeft size={14} />
        <span>التفاصيل</span>
      </button>
    </div>
  );
};
