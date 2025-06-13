
import React from 'react';
import GlassWidget from '@/components/ui/GlassWidget';

interface SatisfactionWidgetProps {
  satisfaction: number;
  className?: string;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ 
  satisfaction, 
  className = '' 
}) => {
  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return { color: 'text-green-400', bg: 'bg-green-500' };
    if (score >= 60) return { color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { color: 'text-red-400', bg: 'bg-red-500' };
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  const colors = getSatisfactionColor(satisfaction);

  return (
    <GlassWidget className={className}>
      <h3 className="text-base font-arabic font-semibold mb-4 text-white/90">
        رضا العملاء
      </h3>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        {/* دائرة التقدم */}
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${satisfaction * 2.51} 251`}
              className={colors.color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{satisfaction}%</span>
          </div>
        </div>
        
        <div className={`text-base font-medium mb-2 ${colors.color}`}>
          {getSatisfactionText(satisfaction)}
        </div>

        <div className="text-sm text-white/60">
          معدل الرضا العام
        </div>
      </div>
    </GlassWidget>
  );
};
